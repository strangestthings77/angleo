-- Live "new word" toast on /panel: the student's browser listens for inserts into words.
-- Realtime applies the words select policy, so a student only receives their own (and shared) rows.
alter publication supabase_realtime add table public.words;
