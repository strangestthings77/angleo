-- The teacher can edit an exercise after creating it. Grading moves into one helper so
-- submitting and re-grading after an edit always agree.

-- typed = { "0": "…", … }, accepted = [["enquiry","inquiry"], …] → { score, total, results }
create function public.grade_exercise(accepted jsonb, typed jsonb)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'score', count(*) filter (where ok),
    'total', count(*),
    'results', coalesce(jsonb_agg(ok order by i), '[]'::jsonb)
  )
  from (
    select g.i, exists (
      select 1 from jsonb_array_elements_text(g.acc) as a(v)
      where public.normalise_gap(a.v) = public.normalise_gap(typed ->> (g.i - 1)::text)
        and public.normalise_gap(typed ->> (g.i - 1)::text) <> ''
    ) as ok
    from jsonb_array_elements(accepted) with ordinality as g(acc, i)
  ) graded;
$$;

create or replace function public.submit_exercise(p_exercise uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  ex public.exercises;
  typed jsonb;
  graded jsonb;
begin
  select * into ex from public.exercises
  where id = p_exercise and student_id = (select auth.uid());
  if ex.id is null then
    raise exception 'exercise not found' using errcode = 'P0002';
  end if;

  select a.answers into typed from public.exercise_attempts a
  where a.exercise_id = p_exercise and a.submitted_at is null;
  typed := coalesce(typed, '{}'::jsonb);
  graded := public.grade_exercise(ex.answers, typed);

  insert into public.exercise_attempts as a
    (exercise_id, student_id, answers, submitted_at, score, total, updated_at)
  values (p_exercise, ex.student_id, typed, now(), (graded ->> 'score')::int,
          (graded ->> 'total')::int, now())
  on conflict (exercise_id) do update
    set submitted_at = now(), score = excluded.score, total = excluded.total, updated_at = now()
    where a.submitted_at is null;

  return graded || jsonb_build_object('answers', ex.answers);
end;
$$;

-- Admin edits title, instructions and gaps. The student's typed answers stay with gaps of the
-- same number (extra ones are dropped); a submitted attempt is re-graded against the new answers.
create function public.update_exercise(
  p_exercise uuid, p_title text, p_instructions text, p_template text, p_hints jsonb,
  p_answers jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  gaps integer := jsonb_array_length(p_answers);
begin
  if not public.is_admin() then
    raise exception 'only admins can edit exercises' using errcode = '42501';
  end if;
  if gaps = 0 or jsonb_array_length(p_hints) <> gaps then
    raise exception 'hints and answers must match' using errcode = '22023';
  end if;

  update public.exercises
  set title = p_title, instructions = p_instructions, template = p_template,
      hints = p_hints, answers = p_answers
  where id = p_exercise;
  if not found then
    raise exception 'exercise not found' using errcode = 'P0002';
  end if;

  update public.exercise_attempts a
  set answers = kept.answers, updated_at = now(),
      score = case when a.submitted_at is null then null
                   else (public.grade_exercise(p_answers, kept.answers) ->> 'score')::int end,
      total = case when a.submitted_at is null then null else gaps end
  from (
    select coalesce(jsonb_object_agg(e.key, e.value), '{}'::jsonb) as answers
    from public.exercise_attempts x, jsonb_each(x.answers) e
    where x.exercise_id = p_exercise and e.key ~ '^\d+$' and e.key::int < gaps
  ) kept
  where a.exercise_id = p_exercise;
end;
$$;

revoke execute on function public.update_exercise(uuid, text, text, text, jsonb, jsonb)
  from public, anon;
grant execute on function public.update_exercise(uuid, text, text, text, jsonb, jsonb)
  to authenticated;
