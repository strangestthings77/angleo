/**
 * Imports the EN→PL dictionary into Supabase (table public.dictionary).
 *
 *   pnpm dict:import
 *
 * Streams Polish Wiktionary's wiktextract dump from kaikki.org (~130 MB gzip, nothing big is
 * written to disk), keeps English headwords and their Polish senses, drops grammar-only senses,
 * and inserts in batches through the Supabase CLI (`supabase db query --linked`, so it uses your
 * CLI login — run `pnpm exec supabase login` + `pnpm db:link` once). Re-running replaces the data.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import { createGunzip } from 'node:zlib';
import { normaliseTerm } from '../lib/dictionary-terms.ts';

const SOURCE = 'https://kaikki.org/dictionary/downloads/pl/pl-extract.jsonl.gz';
const BATCH = 2000;

/** Senses that describe grammar instead of meaning ("imiesłów czasownika to meet"). */
const GRAMMAR_ONLY =
  /^(imiesłów|forma |liczba mnoga|l\. mn\.|czas przeszły|3\.? os|trzecia osoba|stopień (wyższy|najwyższy)|zob\.|zobacz|skrót od|pisownia)/i;

type Row = { term: string; term_norm: string; pos: string | null; gloss: string };

const sql = (s: string | null) => (s === null ? 'null' : `'${s.replaceAll("'", "''")}'`);

function run(query: string, dir: string) {
  const file = join(dir, 'batch.sql');
  writeFileSync(file, query);
  const res = spawnSync('pnpm', ['exec', 'supabase', 'db', 'query', '--linked', '-f', file], {
    encoding: 'utf8',
  });
  if (res.status !== 0) throw new Error(res.stderr || res.stdout);
}

async function main() {
  const res = await fetch(SOURCE);
  if (!res.ok || !res.body) throw new Error(`Download failed: ${res.status}`);
  const lines = createInterface({
    input: Readable.fromWeb(res.body as never).pipe(createGunzip()),
    crlfDelay: Infinity,
  });

  const rows: Row[] = [];
  for await (const line of lines) {
    let entry: {
      lang_code?: string;
      word?: string;
      pos?: string;
      senses?: { glosses?: string[] }[];
    };
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (entry.lang_code !== 'en' || !entry.word) continue;
    for (const sense of entry.senses ?? []) {
      const gloss = (sense.glosses ?? []).join(' ').replace(/\s+/g, ' ').trim();
      if (!gloss || GRAMMAR_ONLY.test(gloss) || gloss.length > 300) continue;
      rows.push({
        term: entry.word,
        term_norm: normaliseTerm(entry.word),
        pos: entry.pos ?? null,
        gloss,
      });
    }
  }
  console.log(`Parsed ${rows.length} senses. Importing…`);

  const dir = mkdtempSync(join(tmpdir(), 'angleo-dict-'));
  try {
    run('truncate public.dictionary restart identity;', dir);
    for (let i = 0; i < rows.length; i += BATCH) {
      const values = rows
        .slice(i, i + BATCH)
        .map((r) => `(${sql(r.term)},${sql(r.term_norm)},${sql(r.pos)},${sql(r.gloss)})`)
        .join(',\n');
      run(`insert into public.dictionary (term, term_norm, pos, gloss) values\n${values};`, dir);
      process.stdout.write(`\r${Math.min(i + BATCH, rows.length)} / ${rows.length}`);
    }
    run('analyze public.dictionary;', dir);
    console.log('\nDone.');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

await main();
