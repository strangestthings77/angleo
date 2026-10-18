'use client';

import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/auth/fields';
import { addWord } from '@/lib/admin-actions';

/** Admin form: add a word for one student. Clears itself after each save. */
export function AddWordForm({ studentId }: { studentId: string }) {
  const [state, action] = useActionState(addWord, undefined);

  return (
    // Re-keying on success resets the inputs for the next word.
    <form key={state?.ok ?? 'new'} action={action} className="flex flex-col gap-5">
      <input type="hidden" name="studentId" value={studentId} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Słówko / fraza (EN)">
          <input name="term" required maxLength={120} autoComplete="off" className={inputClass} />
        </Field>
        <Field label="Tłumaczenie (PL)" hint="kilka: „/”, opcjonalne: (…)">
          <input
            name="translation"
            required
            maxLength={200}
            autoComplete="off"
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Przykład użycia" hint="opcjonalnie">
        <input name="example" maxLength={300} autoComplete="off" className={inputClass} />
      </Field>
      <FormMessage error={state?.error} notice={state?.ok ? 'Dodano słówko.' : undefined} />
      <div className="sm:w-56">
        <SubmitButton pending="Dodawanie…">Dodaj słówko</SubmitButton>
      </div>
    </form>
  );
}
