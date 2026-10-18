-- English → Polish dictionary from Polish Wiktionary (via kaikki.org / wiktextract).
-- Licence: CC BY-SA 4.0 — credited in the admin UI and the student word test.
-- Filled by `pnpm dict:import` (scripts/import-dictionary.mts), not by this migration.

create table public.dictionary (
  id bigint generated always as identity primary key,
  term text not null,
  term_norm text not null,
  pos text,
  gloss text not null
);

comment on table public.dictionary is
  'EN→PL senses from pl.wiktionary (CC BY-SA 4.0). One row per sense; gloss = Polish meanings.';

create index dictionary_term_norm_idx on public.dictionary (term_norm);

alter table public.dictionary enable row level security;

create policy "dictionary: signed-in users read"
  on public.dictionary for select to authenticated
  using (true);
