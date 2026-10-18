import 'server-only';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/** Data Access Layer for the student area: every read re-checks the session server-side. */

export type Role = 'admin' | 'student';
export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  lessons: number;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  // Same check as proxy.ts (verifies the JWT), so the two never disagree about "signed in".
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name, role, lessons_completed')
    .eq('id', claims.sub)
    .single();
  // A failed read is an error, not "signed out" — redirecting here could loop with the proxy.
  if (error || !profile) throw new Error('Nie udało się wczytać profilu.');

  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : '',
    name: profile.full_name ?? null,
    role: (profile.role as Role | undefined) ?? 'student',
    lessons: profile.lessons_completed ?? 0,
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

export type Word = {
  id: number;
  term: string;
  translation: string;
  example: string | null;
  /** true = added for this student, false = shared starter word. */
  personal: boolean;
};

const WORD_COLUMNS = 'id, term, translation, example, student_id';

type WordRow = {
  id: number;
  term: string;
  translation: string;
  example: string | null;
  student_id: string | null;
};

const toWord = (w: WordRow): Word => ({
  id: w.id,
  term: w.term,
  translation: w.translation,
  example: w.example,
  personal: w.student_id !== null,
});

/** The signed-in user's words: their own first (newest first), then shared starter words. */
export async function getMyWords(): Promise<Word[]> {
  const user = await requireUser();
  const supabase = await createClient();
  // Explicit filter: admins can read every row via RLS, but their panel shows only their own.
  const { data } = await supabase
    .from('words')
    .select(WORD_COLUMNS)
    .or(`student_id.is.null,student_id.eq.${user.id}`)
    .order('id', { ascending: false });
  const words = (data ?? []).map(toWord);
  return [...words.filter((w) => w.personal), ...words.filter((w) => !w.personal).reverse()];
}

export type StudentRow = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  lessons: number;
};

export async function getStudents(): Promise<StudentRow[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at, lessons_completed')
    .eq('role', 'student')
    .order('created_at', { ascending: false });
  return (data ?? []).map((p) => ({
    id: p.id,
    email: p.email,
    name: p.full_name,
    createdAt: p.created_at,
    lessons: p.lessons_completed ?? 0,
  }));
}

export type StudentDetail = StudentRow;

/** One student, for the admin detail page. `null` when the id isn't a student. */
export async function getStudent(id: string): Promise<StudentDetail | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at, lessons_completed')
    .eq('id', id)
    .eq('role', 'student')
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    email: data.email,
    name: data.full_name,
    createdAt: data.created_at,
    lessons: data.lessons_completed ?? 0,
  };
}

/** Words added for one student (admin view), newest first. */
export async function getStudentWords(studentId: string): Promise<Word[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from('words')
    .select(WORD_COLUMNS)
    .eq('student_id', studentId)
    .order('id', { ascending: false });
  return (data ?? []).map(toWord);
}
