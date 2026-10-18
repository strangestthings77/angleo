'use client';

import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/auth/fields';
import { signUp } from '@/lib/auth-actions';

export function SignUpForm() {
  const [state, action] = useActionState(signUp, undefined);

  if (state?.notice) return <FormMessage notice={state.notice} />;

  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Imię i nazwisko">
        <input name="name" required minLength={2} autoComplete="name" className={inputClass} />
      </Field>
      <Field label="E-mail">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          className={inputClass}
        />
      </Field>
      <Field label="Hasło" hint="min. 8 znaków">
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>
      <FormMessage error={state?.error} />
      <SubmitButton pending="Tworzenie konta…">Załóż konto</SubmitButton>
    </form>
  );
}
