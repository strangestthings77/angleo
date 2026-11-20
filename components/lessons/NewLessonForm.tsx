'use client';

import { useActionState } from 'react';
import { FormMessage, SubmitButton, inputClass } from '@/components/auth/fields';
import { createLesson } from '@/lib/admin-actions';

/** Admin: next numbered lesson for this student, with an optional topic. Opens its notes. */
export function NewLessonForm({ studentId, next }: { studentId: string; next: number }) {
  const [state, action] = useActionState(createLesson, undefined);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="studentId" value={studentId} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Temat lekcji {next} (opcjonalnie)</span>
          <input
            name="topic"
            maxLength={120}
            placeholder={`Temat lekcji ${next} (opcjonalnie), np. Negotiations`}
            className={inputClass}
          />
        </label>
        <div className="sm:w-52">
          <SubmitButton pending="Tworzenie…">{`Nowa lekcja ${next}`}</SubmitButton>
        </div>
      </div>
      <FormMessage error={state?.error} />
    </form>
  );
}
