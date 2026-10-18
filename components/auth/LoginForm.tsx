'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { Field, FormMessage, SubmitButton, inputClass } from '@/components/auth/fields';
import { signIn } from '@/lib/auth-actions';

export function LoginForm() {
  const params = useSearchParams();
  const [state, action] = useActionState(signIn, undefined);
  const linkError =
    params.get('blad') === 'link' ? 'Link wygasł lub jest nieprawidłowy. Zaloguj się.' : undefined;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={params.get('next') ?? ''} />
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
      <Field label="Hasło">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>
      <FormMessage error={state?.error ?? linkError} />
      <SubmitButton pending="Logowanie…">Zaloguj się</SubmitButton>
    </form>
  );
}
