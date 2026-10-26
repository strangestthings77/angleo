'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { PublicExercise } from '@/lib/public-exercises';

export function PublicExercisePlayer({ exercise }: { exercise: PublicExercise }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const question = exercise.questions[step];
  const complete = step >= exercise.questions.length;

  function choose(index: number) {
    if (selected === null) setSelected(index);
  }
  function next() {
    setStep((value) => value + 1);
    setSelected(null);
  }
  function restart() {
    setStep(0);
    setSelected(null);
  }

  if (complete) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-surface p-8 text-center shadow-card sm:p-12">
        <p className="text-sm font-medium tracking-eyebrow text-accent uppercase">Gotowe</p>
        <h2 className="font-serif text-display-sm tracking-display text-foreground">
          Dobra robota!
        </h2>
        <p className="max-w-md text-foreground-muted">
          Chcesz poćwiczyć taki angielski w rozmowie?
        </p>
        <p className="max-w-md text-sm/6 text-foreground-muted">
          Na indywidualnych lekcjach pracujemy na sytuacjach, które naprawdę spotykasz w swojej
          pracy.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/umow-lekcje"
            className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/85"
          >
            Umów lekcję →
          </Link>
          <button
            type="button"
            onClick={restart}
            className="h-12 px-5 text-sm text-foreground-muted underline underline-offset-4 hover:text-foreground"
          >
            Spróbuj jeszcze raz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-10">
      <div className="flex items-center justify-between text-sm text-foreground-muted">
        <span>{exercise.title}</span>
        <span className="tabular-nums">
          {step + 1} / {exercise.questions.length}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${((step + 1) / exercise.questions.length) * 100}%` }}
        />
      </div>
      <h2 className="font-serif text-title tracking-display text-foreground">{question.prompt}</h2>
      <div className="flex flex-col gap-3" role="group" aria-label="Odpowiedzi">
        {question.options.map((option, index) => {
          const answered = selected !== null;
          const correct = index === question.answer;
          const chosen = index === selected;
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(index)}
              aria-pressed={chosen}
              className={`rounded-2xl border px-4 py-4 text-left text-sm transition-colors ${!answered ? 'border-border hover:border-foreground' : correct ? 'border-success bg-success/10 text-foreground' : chosen ? 'border-accent bg-accent/10' : 'border-border opacity-60'}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div
          className="rounded-2xl bg-surface-muted p-4 text-sm/6 text-foreground-muted"
          aria-live="polite"
        >
          <strong className="text-foreground">
            {selected === question.answer ? 'Dobrze!' : 'Spróbuj zapamiętać:'}
          </strong>{' '}
          {question.explanation}
        </div>
      )}
      {selected !== null && (
        <button
          type="button"
          onClick={next}
          className="inline-flex h-12 items-center justify-center self-start rounded-full bg-foreground px-6 text-sm font-medium text-background hover:bg-foreground/85"
        >
          {step + 1 === exercise.questions.length ? 'Zakończ' : 'Dalej →'}
        </button>
      )}
    </div>
  );
}
