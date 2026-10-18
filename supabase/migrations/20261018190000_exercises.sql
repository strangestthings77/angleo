-- Gap-fill exercises with live progress for the admin.
-- The correct answers live in exercises.answers, which students can never select (column
-- privileges); grading and revealing answers happen in security-definer functions.

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  instructions text check (char_length(instructions) <= 500),
  -- Text with {{0}}, {{1}}… placeholders (lib/exercise.ts → parseExercise).
  template text not null check (char_length(template) <= 10000),
  -- Per gap: { pattern, length } — the letter hints the student sees.
  hints jsonb not null,
  -- Per gap: array of accepted answers. Never selectable by students.
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create index exercises_student_id_idx on public.exercises (student_id, created_at desc);

alter table public.exercises enable row level security;

create policy "exercises: students read their own"
  on public.exercises for select to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()));

create policy "exercises: admins insert"
  on public.exercises for insert to authenticated
  with check ((select public.is_admin()));

create policy "exercises: admins delete"
  on public.exercises for delete to authenticated
  using ((select public.is_admin()));

revoke all on public.exercises from anon, authenticated;
grant select (id, student_id, title, instructions, template, hints, created_at)
  on public.exercises to authenticated;
grant insert (student_id, title, instructions, template, hints, answers)
  on public.exercises to authenticated;
grant delete on public.exercises to authenticated;

-- One attempt per exercise; answers autosave while the student types.
create table public.exercise_attempts (
  exercise_id uuid primary key references public.exercises (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  -- { "0": "enquiry", "1": "work…" } — what the student has typed so far.
  answers jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  score integer,
  total integer,
  updated_at timestamptz not null default now()
);

alter table public.exercise_attempts enable row level security;

create policy "attempts: students read their own, admins all"
  on public.exercise_attempts for select to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()));

create policy "attempts: students start their own"
  on public.exercise_attempts for insert to authenticated
  with check (
    student_id = (select auth.uid())
    and exists (
      select 1 from public.exercises e
      where e.id = exercise_id and e.student_id = (select auth.uid())
    )
  );

create policy "attempts: students type until submitted"
  on public.exercise_attempts for update to authenticated
  using (student_id = (select auth.uid()) and submitted_at is null)
  with check (student_id = (select auth.uid()) and submitted_at is null);

revoke all on public.exercise_attempts from anon, authenticated;
grant select on public.exercise_attempts to authenticated;
grant insert (exercise_id, student_id, answers, updated_at) on public.exercise_attempts to authenticated;
grant update (answers, updated_at) on public.exercise_attempts to authenticated;

-- Must match lib/exercise.ts → normaliseGap().
create function public.normalise_gap(value text)
returns text
language sql
immutable
set search_path = ''
as $$
  select regexp_replace(
    regexp_replace(translate(lower(coalesce(value, '')), '’`', ''''''), '\s+', ' ', 'g'),
    '^[\s.,;:!?"''„”]+|[\s.,;:!?"''„”]+$', '', 'g'
  );
$$;

-- Grades the caller's own attempt, stores the score and locks it. Returns per-gap results.
create function public.submit_exercise(p_exercise uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ex public.exercises;
  typed jsonb;
  results jsonb := '[]'::jsonb;
  correct integer := 0;
  i integer;
  ok boolean;
begin
  select * into ex from public.exercises
  where id = p_exercise and student_id = (select auth.uid());
  if ex.id is null then
    raise exception 'exercise not found' using errcode = 'P0002';
  end if;

  select a.answers into typed from public.exercise_attempts a
  where a.exercise_id = p_exercise and a.submitted_at is null;
  typed := coalesce(typed, '{}'::jsonb);

  for i in 0 .. jsonb_array_length(ex.answers) - 1 loop
    select exists (
      select 1 from jsonb_array_elements_text(ex.answers -> i) as acc(v)
      where public.normalise_gap(acc.v) = public.normalise_gap(typed ->> i::text)
        and public.normalise_gap(typed ->> i::text) <> ''
    ) into ok;
    results := results || to_jsonb(ok);
    if ok then correct := correct + 1; end if;
  end loop;

  insert into public.exercise_attempts as a
    (exercise_id, student_id, answers, submitted_at, score, total, updated_at)
  values (p_exercise, ex.student_id, typed, now(), correct, jsonb_array_length(ex.answers), now())
  on conflict (exercise_id) do update
    set submitted_at = now(), score = excluded.score, total = excluded.total, updated_at = now()
    where a.submitted_at is null;

  return jsonb_build_object(
    'score', correct, 'total', jsonb_array_length(ex.answers), 'results', results,
    'answers', ex.answers
  );
end;
$$;

-- Correct answers: admins always; students only after submitting.
create function public.exercise_answers(p_exercise uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select e.answers from public.exercises e
  where e.id = p_exercise
    and (
      public.is_admin()
      or (
        e.student_id = (select auth.uid())
        and exists (
          select 1 from public.exercise_attempts a
          where a.exercise_id = e.id and a.submitted_at is not null
        )
      )
    );
$$;

-- Admin can let a student try again.
create function public.reopen_exercise(p_exercise uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'only admins can reopen' using errcode = '42501';
  end if;
  update public.exercise_attempts
  set submitted_at = null, score = null, total = null, updated_at = now()
  where exercise_id = p_exercise;
end;
$$;

revoke execute on function public.submit_exercise(uuid) from public, anon;
revoke execute on function public.exercise_answers(uuid) from public, anon;
revoke execute on function public.reopen_exercise(uuid) from public, anon;
grant execute on function public.submit_exercise(uuid) to authenticated;
grant execute on function public.exercise_answers(uuid) to authenticated;
grant execute on function public.reopen_exercise(uuid) to authenticated;

-- Live view: the admin's browser receives attempt changes as the student types (RLS applies).
alter publication supabase_realtime add table public.exercise_attempts;
