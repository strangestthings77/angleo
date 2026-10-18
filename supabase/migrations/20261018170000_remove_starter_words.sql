-- Remove the shared starter words seeded in 20261018120000. Students now only see words the
-- admin adds for them. Personal words (student_id set) are untouched.
delete from public.words where student_id is null;
