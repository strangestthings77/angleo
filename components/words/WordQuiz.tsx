'use client';

import { useRef, useState } from 'react';
import { checkAnswer, type Verdict } from '@/lib/answer-check';
import type { Word } from '@/lib/auth';

type Phase =
  | { name: 'start' }
  | { name: 'ask'; queue: Word[]; index: number }
  | { name: 'feedback'; queue: Word[]; index: number; typed: string; verdict: Verdict }
  | { name: 'done'; queue: Word[] };

type Score = Record<number, boolean>; // word id → counted as known

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const button =
  'inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition-[background-color,border-color,scale] duration-200 ease-out active:scale-97 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent';
const primary = `${button} bg-foreground text-background hover:bg-foreground/85`;
const secondary = `${button} border border-foreground/20 text-foreground hover:border-foreground/60`;

/** EN → PL typing test over the student's words, in random order. Results stay in the browser. */
export function WordQuiz({ words }: { words: Word[] }) {
  const [phase, setPhase] = useState<Phase>({ name: 'start' });
  const [score, setScore] = useState<Score>({});
  const input = useRef<HTMLInputElement>(null);

  if (words.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-border p-8 text-foreground-muted">
        Test pojawi się, gdy dostaniesz pierwsze słówka.
      </p>
    );
  }

  function start(pool: Word[]) {
    setScore({});
    setPhase({ name: 'ask', queue: shuffle(pool), index: 0 });
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase.name !== 'ask') return;
    const typed = String(new FormData(e.currentTarget).get('answer') ?? '');
    const word = phase.queue[phase.index];
    const verdict = checkAnswer(typed, word.translation);
    setScore((s) => ({ ...s, [word.id]: verdict.result !== 'wrong' }));
    setPhase({ ...phase, name: 'feedback', typed, verdict });
  }

  function next() {
    if (phase.name !== 'feedback') return;
    const index = phase.index + 1;
    if (index >= phase.queue.length) setPhase({ name: 'done', queue: phase.queue });
    else setPhase({ name: 'ask', queue: phase.queue, index });
    // Keep the keyboard flow: focus the input for the next word.
    requestAnimationFrame(() => input.current?.focus());
  }

  function overrule() {
    if (phase.name !== 'feedback') return;
    const word = phase.queue[phase.index];
    setScore((s) => ({ ...s, [word.id]: true }));
    next();
  }

  if (phase.name === 'start') {
    return (
      <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-surface p-8 sm:p-10">
        <div className="flex flex-col gap-2">
          <p className="font-serif text-title tracking-display text-foreground">
            Sprawdź, ile pamiętasz
          </p>
          <p className="max-w-lg text-sm/6 text-foreground-muted">
            Zobaczysz angielskie słówko — wpisz polskie tłumaczenie. Polskie znaki i drobne
            literówki nie są problemem.
          </p>
        </div>
        <button type="button" className={primary} onClick={() => start(words)}>
          Zacznij test · {words.length}
        </button>
      </div>
    );
  }

  if (phase.name === 'done') {
    const known = phase.queue.filter((w) => score[w.id]).length;
    const missed = phase.queue.filter((w) => !score[w.id]);
    return (
      <div className="flex animate-fade flex-col items-start gap-6 rounded-3xl border border-border bg-surface p-8 sm:p-10">
        <p className="text-xs font-medium tracking-eyebrow text-accent uppercase">Wynik</p>
        <p className="font-serif text-display-md leading-none tracking-display text-foreground tabular-nums">
          {known} / {phase.queue.length}
        </p>
        {missed.length > 0 && (
          <ul className="flex flex-col gap-1 text-sm text-foreground-muted">
            {missed.map((w) => (
              <li key={w.id}>
                <span className="text-foreground">{w.term}</span> — {w.translation}
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-3">
          {missed.length > 0 && (
            <button type="button" className={primary} onClick={() => start(missed)}>
              Powtórz błędne · {missed.length}
            </button>
          )}
          <button
            type="button"
            className={missed.length > 0 ? secondary : primary}
            onClick={() => start(words)}
          >
            Nowy test
          </button>
        </div>
      </div>
    );
  }

  const word = phase.queue[phase.index];
  const feedback = phase.name === 'feedback' ? phase : null;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-surface p-6 sm:p-10">
      <div className="flex items-center justify-between gap-4 text-xs text-foreground-muted tabular-nums">
        <span>
          {phase.index + 1} / {phase.queue.length}
        </span>
        <span className="h-1 flex-1 overflow-hidden rounded-full bg-surface-muted">
          <span
            className="block h-full origin-left rounded-full bg-accent transition-transform duration-300 ease-out-soft"
            style={{
              transform: `scaleX(${(phase.index + (feedback ? 1 : 0)) / phase.queue.length})`,
            }}
          />
        </span>
      </div>

      <div key={word.id} className="flex animate-fade flex-col gap-2">
        <p className="font-serif text-display-sm tracking-display text-foreground">{word.term}</p>
        {word.example && <p className="text-sm text-foreground-muted italic">{word.example}</p>}
      </div>

      {!feedback ? (
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="quiz-answer">
            Tłumaczenie po polsku
          </label>
          <input
            ref={input}
            id="quiz-answer"
            name="answer"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            placeholder="Wpisz po polsku…"
            className="h-12 flex-1 rounded-xl border border-border bg-background px-4 text-base text-foreground focus:border-foreground focus:outline-none"
          />
          <button type="submit" className={primary}>
            Sprawdź
          </button>
        </form>
      ) : (
        <div className="flex animate-fade flex-col gap-4">
          <p
            role="status"
            className={`rounded-xl px-4 py-3 text-sm ${
              feedback.verdict.result === 'wrong'
                ? 'border border-accent/30 bg-accent/5 text-foreground'
                : 'bg-surface-muted text-foreground'
            }`}
          >
            {feedback.verdict.result === 'correct' && <strong>Dobrze! </strong>}
            {feedback.verdict.result === 'almost' && <strong>Prawie dobrze — liczymy to. </strong>}
            {feedback.verdict.result === 'wrong' && (
              <strong>{feedback.typed.trim() ? 'Nie tym razem. ' : 'Bez odpowiedzi. '}</strong>
            )}
            Poprawnie: <span className="font-medium">{feedback.verdict.expected}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className={primary} onClick={next} autoFocus>
              {phase.index + 1 < phase.queue.length ? 'Dalej' : 'Zobacz wynik'}
            </button>
            {feedback.verdict.result === 'wrong' && feedback.typed.trim() && (
              <button type="button" className={secondary} onClick={overrule}>
                Miałem(-am) rację
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
