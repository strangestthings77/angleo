-- Lessons: numbered per student (Lekcja 1, 2, 3…), each with one shared rich-text note that the
-- student and the admin both edit live. Content is Tiptap/ProseMirror JSON, rendered through the
-- editor's schema (never as raw HTML).

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  number integer not null check (number > 0),
  topic text check (char_length(topic) <= 120),
  content jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (student_id, number)
);

alter table public.lessons enable row level security;

create policy "lessons: students read their own"
  on public.lessons for select to authenticated
  using (student_id = (select auth.uid()) or (select public.is_admin()));

create policy "lessons: admins delete"
  on public.lessons for delete to authenticated
  using ((select public.is_admin()));

-- Writes go through the functions below only.
revoke insert, update on public.lessons from authenticated;

-- Next number for the student. Locking the profile row serialises two clicks on "Nowa lekcja".
create function public.create_lesson(p_student uuid, p_topic text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_number integer;
  lesson_id uuid;
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  perform 1 from public.profiles where id = p_student for update;
  if not found then
    raise exception 'student not found' using errcode = 'P0002';
  end if;

  select coalesce(max(number), 0) + 1 into next_number
  from public.lessons where student_id = p_student;

  insert into public.lessons (student_id, number, topic, updated_by)
  values (p_student, next_number, nullif(left(trim(p_topic), 120), ''), (select auth.uid()))
  returning id into lesson_id;
  return lesson_id;
end;
$$;

-- Autosave from either side. Last write wins; the client skips remote updates while it has
-- unsaved typing, so whoever is typing keeps their text.
create function public.save_lesson_content(p_lesson uuid, p_content jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_at timestamptz;
begin
  if jsonb_typeof(p_content) <> 'object' or p_content ->> 'type' <> 'doc'
     or pg_column_size(p_content) > 200000 then
    raise exception 'invalid content' using errcode = '22023';
  end if;

  update public.lessons
  set content = p_content, updated_at = now(), updated_by = (select auth.uid())
  where id = p_lesson and (student_id = (select auth.uid()) or public.is_admin())
  returning updated_at into saved_at;

  if saved_at is null then
    raise exception 'lesson not found' using errcode = 'P0002';
  end if;
  return saved_at;
end;
$$;

revoke execute on function public.create_lesson(uuid, text) from public, anon;
grant execute on function public.create_lesson(uuid, text) to authenticated;
revoke execute on function public.save_lesson_content(uuid, jsonb) from public, anon;
grant execute on function public.save_lesson_content(uuid, jsonb) to authenticated;

-- Live sync: both sides listen for UPDATEs on the lesson row (RLS applies to each listener).
alter publication supabase_realtime add table public.lessons;
