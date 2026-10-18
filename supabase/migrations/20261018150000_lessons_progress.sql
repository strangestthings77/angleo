-- Lesson progress: admins record completed lessons; every 10 lessons is a new level
-- (computed in the app — lib/progress.ts — so the rule lives in one place).

alter table public.profiles
  add column lessons_completed integer not null default 0
  constraint lessons_completed_range check (lessons_completed between 0 and 1000);

comment on column public.profiles.lessons_completed is
  'Completed lessons. Level = floor(lessons / 10) + 1. Changed only via set_student_lessons().';

-- Admin-only setter. A function (instead of an UPDATE policy) means admins can change this one
-- column and nothing else, and students can never touch it.
create function public.set_student_lessons(p_student uuid, p_lessons integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  result integer;
begin
  if not public.is_admin() then
    raise exception 'only admins can change lessons' using errcode = '42501';
  end if;

  update public.profiles
  set lessons_completed = greatest(0, least(1000, p_lessons))
  where id = p_student and role = 'student'
  returning lessons_completed into result;

  if result is null then
    raise exception 'student not found' using errcode = 'P0002';
  end if;

  return result;
end;
$$;

revoke execute on function public.set_student_lessons(uuid, integer) from public, anon;
grant execute on function public.set_student_lessons(uuid, integer) to authenticated;
