'use client';

import { useActionState, useState, useTransition } from 'react';
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/auth/fields';
import { addWord, suggestTranslations, type Suggestion } from '@/lib/admin-actions';
import { DICTIONARY_CREDIT, DICTIONARY_CREDIT_URL } from '@/lib/dictionary-terms';

/** Admin form: add a word for one student. Clears itself after each save. */
export function AddWordForm({ studentId }: { studentId: string }) {
  const [state, action] = useActionState(addWord, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="studentId" value={studentId} />
      {/* Re-keying on success resets the fields for the next word. */}
      <WordFields key={state?.ok ?? 'new'} />
      <FormMessage error={state?.error} notice={state?.ok ? 'Dodano słówko.' : undefined} />
      <div className="sm:w-56">
        <SubmitButton pending="Dodawanie…">Dodaj słówko</SubmitButton>
      </div>
    </form>
  );
}

const split = (value: string) =>
  value
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);

function WordFields() {
  const [term, setTerm] = useState('');
  const [translation, setTranslation] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [looking, startLookup] = useTransition();
  const chosen = new Set(split(translation));

  function suggest() {
    if (!term.trim()) return;
    startLookup(async () => setSuggestions(await suggestTranslations(term)));
  }

  function toggle(option: string) {
    const parts = split(translation);
    const next = chosen.has(option) ? parts.filter((p) => p !== option) : [...parts, option];
    setTranslation(next.join(' / '));
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <Field label="Słówko / fraza (EN)">
          <span className="flex gap-2">
            <input
              name="term"
              required
              maxLength={120}
              autoComplete="off"
              value={term}
              onChange={(e) => {
                setTerm(e.target.value);
                setSuggestions(null);
              }}
              onKeyDown={(e) => {
                // Enter here looks the word up instead of submitting a half-filled form.
                if (e.key === 'Enter') {
                  e.preventDefault();
                  suggest();
                }
              }}
              className={`${inputClass} min-w-0 flex-1`}
            />
            <button
              type="button"
              onClick={suggest}
              disabled={!term.trim() || looking}
              className="inline-flex h-12 shrink-0 items-center rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-[border-color,opacity,scale] duration-150 ease-out hover:border-foreground/50 active:scale-97 disabled:opacity-40"
            >
              {looking ? 'Szukam…' : 'Podpowiedz'}
            </button>
          </span>
        </Field>
        <div className="flex flex-col gap-2">
          <Field label="Tłumaczenie (PL)">
            <input
              name="translation"
              required
              maxLength={200}
              autoComplete="off"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className={inputClass}
            />
          </Field>
          <p className="text-xs text-foreground-muted">
            Kilka odpowiedzi oddziel „/”, słowo opcjonalne w nawiasie: całować (się)
          </p>
        </div>
      </div>

      {suggestions && (
        <div className="flex animate-fade flex-col gap-4 rounded-2xl bg-surface-muted p-5">
          {suggestions.length === 0 ? (
            <p className="text-sm text-foreground-muted">
              Brak w słowniku — wpisz tłumaczenie ręcznie.
            </p>
          ) : (
            <>
              <p className="text-sm text-foreground">
                Kliknij znaczenia z lekcji — trafią do tłumaczenia i będą akceptowane w teście.
              </p>
              <ul className="flex flex-col gap-3">
                {suggestions.map((sense, i) => (
                  <li key={i} className="flex flex-col gap-2">
                    {sense.pos && (
                      <span className="text-xs tracking-eyebrow text-foreground-muted uppercase">
                        {sense.pos}
                      </span>
                    )}
                    <span className="flex flex-wrap gap-2">
                      {sense.options.map((option) => {
                        const on = chosen.has(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(option)}
                            className={`inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition-[background-color,border-color,color] duration-150 ${
                              on
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border bg-background text-foreground hover:border-foreground/40'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <a
            href={DICTIONARY_CREDIT_URL}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-foreground-muted hover:text-foreground"
          >
            {DICTIONARY_CREDIT}
          </a>
        </div>
      )}

      <Field label="Przykład użycia" hint="opcjonalnie">
        <input name="example" maxLength={300} autoComplete="off" className={inputClass} />
      </Field>
    </>
  );
}
