-- Accounts for the student area: every auth user gets a profile with a role.
-- Admins are promoted manually (see AGENTS.md → Auth); new sign-ups are students.

create type public.app_role as enum ('admin', 'student');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per auth user. role decides admin vs student access.';

alter table public.profiles enable row level security;

-- Security definer so policies can check the caller's role without recursing into RLS.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create policy "profiles: users read their own"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "profiles: admins read all"
  on public.profiles for select to authenticated
  using ((select public.is_admin()));

-- No insert/update/delete policies: rows come from the trigger below, and roles change only
-- through SQL (service role / dashboard), so a student can never promote themselves.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Vocabulary shown in the student panel. student_id null = shared with every student.
create table public.words (
  id bigint generated always as identity primary key,
  term text not null,
  translation text not null,
  example text,
  student_id uuid references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index words_student_id_idx on public.words (student_id);

alter table public.words enable row level security;

create policy "words: students read shared and their own"
  on public.words for select to authenticated
  using (student_id is null or student_id = (select auth.uid()) or (select public.is_admin()));

create policy "words: admins manage"
  on public.words for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Starter set, taken from the blog posts.
insert into public.words (term, translation, example) values
  ('to loop someone in', 'włączyć kogoś (do rozmowy, wątku)', 'I’ll loop you in on the email thread.'),
  ('to take something offline', 'omówić coś osobno', 'This is a bigger conversation — let’s take it offline.'),
  ('to circle back', 'wrócić do tematu później', 'Let’s circle back to the budget next week.'),
  ('to align on something', 'uzgodnić coś', 'Can we align on the timeline before Friday?'),
  ('factory', 'fabryka (nie: fabric = tkanina)', 'The factory produces automotive parts.'),
  ('current', 'aktualny (nie: actual = rzeczywisty)', 'The current situation is difficult.'),
  ('to break something down', 'rozłożyć coś na części', 'Let’s break this down into smaller tasks.'),
  ('to get back to someone', 'odezwać się do kogoś (z odpowiedzią)', 'Let me get back to you on that.');
