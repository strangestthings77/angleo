import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/** Data Access Layer for the student area: every read re-checks the session server-side. */

export type Role = 'admin' | 'student';
export type CurrentUser = { id: string; email: string; name: string | null; role: Role };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? '',
    name: profile?.full_name ?? null,
    role: (profile?.role as Role | undefined) ?? 'student',
  };
}

export async function requireUser(next = '/panel'): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/logowanie?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser('/admin');
  if (user.role !== 'admin') redirect('/panel');
  return user;
}

export type Word = { id: number; term: string; translation: string; example: string | null };

export async function getMyWords(): Promise<Word[]> {
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from('words')
    .select('id, term, translation, example')
    .order('id', { ascending: true });
  return data ?? [];
}

export type StudentRow = { id: string; email: string; name: string | null; createdAt: string };

export async function getStudents(): Promise<StudentRow[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: false });
  return (data ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    name: p.full_name,
    createdAt: p.created_at,
  }));
}
