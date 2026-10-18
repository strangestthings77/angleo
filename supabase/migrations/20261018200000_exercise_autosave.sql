-- Autosave through one function. The client-side "insert, then update" pair failed silently:
-- when the insert didn't land, every update matched 0 rows, so nothing reached the admin's
-- live view. This upserts in one step and raises when it can't save.

create function public.save_exercise_answers(p_exercise uuid, p_answers jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  saved_at timestamptz;
begin
  if jsonb_typeof(p_answers) <> 'object' or pg_column_size(p_answers) > 20000 then
    raise exception 'invalid answers' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.exercises e
    where e.id = p_exercise and e.student_id = (select auth.uid())
  ) then
    raise exception 'exercise not found' using errcode = 'P0002';
  end if;

  insert into public.exercise_attempts as a (exercise_id, student_id, answers, updated_at)
  values (p_exercise, (select auth.uid()), p_answers, now())
  on conflict (exercise_id) do update
    set answers = excluded.answers, updated_at = now()
    where a.submitted_at is null
  returning a.updated_at into saved_at;

  if saved_at is null then
    raise exception 'already submitted' using errcode = '55000';
  end if;
  return saved_at;
end;
$$;

revoke execute on function public.save_exercise_answers(uuid, jsonb) from public, anon;
grant execute on function public.save_exercise_answers(uuid, jsonb) to authenticated;

-- Writes go through the functions only.
revoke insert, update on public.exercise_attempts from authenticated;

-- Full row in UPDATE events, so the live view always gets every column.
alter table public.exercise_attempts replica identity full;
