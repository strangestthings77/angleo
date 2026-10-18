'use client';

import { useActionState, useState } from 'react';
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/auth/fields';
import { ExerciseText, gapClass, gapWidth } from '@/components/exercises/ExerciseText';
import { createExercise, updateExercise } from '@/lib/admin-actions';
import { parseExercise } from '@/lib/exercise';

const EXAMPLE =
  'Thank you for your [[enquiry|q]] concerning the [[workshop|h]]. Places are allocated on a first-come, first-[[served|v]] basis.';

export type EditableExercise = {
  id: string;
  title: string;
  instructions: string | null;
  /** The [[…]] text, rebuilt by toSource(). */
  source: string;
};

/**
 * Admin: write the text with [[gaps]], see the student's view live, save. With `exercise` it
 * edits that one (and returns to the student's page) instead of adding a new one.
 */
export function ExerciseForm({
  studentId,
  exercise,
}: {
  studentId: string;
  exercise?: EditableExercise;
}) {
  const [state, action] = useActionState(exercise ? updateExercise : createExercise, undefined);
  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="studentId" value={studentId} />
      {exercise && <input type="hidden" name="exerciseId" value={exercise.id} />}
      <ExerciseFields key={state?.ok ?? 'new'} exercise={exercise} />
      <FormMessage error={state?.error} notice={state?.ok ? 'Ćwiczenie dodane.' : undefined} />
      <div className="sm:w-64">
        <SubmitButton pending="Zapisuję…">
          {exercise ? 'Zapisz zmiany' : 'Dodaj ćwiczenie'}
        </SubmitButton>
      </div>
    </form>
  );
}

function ExerciseFields({ exercise }: { exercise?: EditableExercise }) {
  const [content, setContent] = useState(exercise?.source ?? '');
  const parsed = parseExercise(content);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tytuł">
          <input
            name="title"
            required
            defaultValue={exercise?.title}
            maxLength={160}
            placeholder="Zadanie 3"
            className={inputClass}
          />
        </Field>
        <Field label="Polecenie" hint="opcjonalnie">
          <input
            name="instructions"
            maxLength={500}
            defaultValue={exercise?.instructions ?? undefined}
            placeholder="Uzupełnij treść maila odpowiednimi wyrazami."
            className={inputClass}
          />
        </Field>
      </div>
      <div className="flex flex-col gap-2">
        <Field label="Treść z lukami">
          <textarea
            name="content"
            required
            rows={8}
            maxLength={10000}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={EXAMPLE}
            className={`${inputClass} h-auto resize-y py-3 font-mono text-sm leading-6`}
          />
        </Field>
        <p className="text-xs/5 text-foreground-muted">
          Luka: <code className="text-foreground">[[odpowiedź]]</code> · pokaż literę:{' '}
          <code className="text-foreground">[[enquiry|q]]</code> · pokaż 3. literę:{' '}
          <code className="text-foreground">[[attend|3]]</code> · kilka odpowiedzi:{' '}
          <code className="text-foreground">[[enquiry/inquiry]]</code>
        </p>
      </div>

      {parsed.answers.length > 0 && (
        <div className="flex animate-fade flex-col gap-3 rounded-2xl bg-surface-muted p-5">
          <p className="text-xs font-medium tracking-eyebrow text-foreground-muted uppercase">
            Podgląd ucznia · {parsed.answers.length} luk
          </p>
          <div className="[&_div]:text-base/9">
            <ExerciseText
              template={parsed.template}
              renderGap={(i) => (
                <span
                  style={{ '--gap-w': gapWidth(parsed.hints[i]) } as React.CSSProperties}
                  className={`${gapClass('idle')} text-foreground-muted/60`}
                >
                  {parsed.hints[i]?.pattern}
                </span>
              )}
            />
          </div>
        </div>
      )}
    </>
  );
}
