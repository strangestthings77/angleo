'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export type AuthState = { error?: string; notice?: string } | undefined;

/** Only same-site relative paths — never redirect to user-supplied hosts. */
function safeNext(value: FormDataEntryValue | null, fallback: string): string {
  const next = typeof value === 'string' ? value : '';
  return next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}

async function siteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https');
  return host
    ? `${proto}://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
}

const signInSchema = z.object({
  email: z.email('Podaj poprawny adres e-mail'),
  password: z.string().min(1, 'Podaj hasło'),
});

export async function signIn(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return {
      error:
        error.code === 'email_not_confirmed'
          ? 'Potwierdź adres e-mail — link wysłaliśmy przy rejestracji.'
          : 'Nieprawidłowy e-mail lub hasło.',
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();
  redirect(safeNext(formData.get('next'), profile?.role === 'admin' ? '/admin' : '/panel'));
}

const signUpSchema = z.object({
  name: z.string().trim().min(2, 'Podaj imię i nazwisko').max(100),
  email: z.email('Podaj poprawny adres e-mail'),
  password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków').max(72),
});

export async function signUp(_: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
      emailRedirectTo: `${await siteOrigin()}/auth/callback?next=/panel`,
    },
  });
  if (error) {
    return {
      error:
        error.code === 'user_already_exists'
          ? 'Konto z tym adresem już istnieje — zaloguj się.'
          : 'Nie udało się utworzyć konta. Spróbuj ponownie.',
    };
  }

  // Email confirmation off → signed in straight away.
  if (data.session) redirect('/panel');
  return { notice: 'Sprawdź skrzynkę — wysłaliśmy link potwierdzający adres e-mail.' };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
