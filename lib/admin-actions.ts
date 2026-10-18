'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { MAX_LESSONS } from '@/lib/progress';
import { createClient } from '@/lib/supabase/server';

const lessonsSchema = z.object({
  studentId: z.uuid(),
  lessons: z.number().int().min(0).max(MAX_LESSONS),
});

export type LessonsResult = { lessons: number } | { error: string };

/** Admin sets a student's completed lessons. Authorised here and again in the DB function. */
export async function setStudentLessons(
  studentId: string,
  lessons: number,
): Promise<LessonsResult> {
  await requireAdmin();
  const parsed = lessonsSchema.safeParse({ studentId, lessons });
  if (!parsed.success) return { error: `Podaj liczbę od 0 do ${MAX_LESSONS}.` };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('set_student_lessons', {
    p_student: parsed.data.studentId,
    p_lessons: parsed.data.lessons,
  });
  if (error || typeof data !== 'number')
    return { error: 'Nie udało się zapisać. Spróbuj ponownie.' };

  revalidatePath('/admin');
  revalidatePath(`/admin/uczniowie/${parsed.data.studentId}`);
  return { lessons: data };
}

const wordSchema = z.object({
  studentId: z.uuid(),
  term: z.string().trim().min(1, 'Wpisz słówko').max(120),
  translation: z.string().trim().min(1, 'Wpisz tłumaczenie').max(200),
  example: z.string().trim().max(300).optional(),
});

export type WordFormState = { error?: string; ok?: number } | undefined;

/** Admin adds a word for one student. RLS ("words: admins manage") re-checks the role. */
export async function addWord(_: WordFormState, formData: FormData): Promise<WordFormState> {
  await requireAdmin();
  const parsed = wordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { studentId, term, translation, example } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from('words')
    .insert({ student_id: studentId, term, translation, example: example || null });
  if (error) return { error: 'Nie udało się dodać słówka. Spróbuj ponownie.' };

  revalidatePath(`/admin/uczniowie/${studentId}`);
  return { ok: Date.now() };
}

export async function deleteWord(wordId: number, studentId: string): Promise<void> {
  await requireAdmin();
  if (!z.uuid().safeParse(studentId).success || !Number.isInteger(wordId)) return;
  const supabase = await createClient();
  await supabase.from('words').delete().eq('id', wordId).eq('student_id', studentId);
  revalidatePath(`/admin/uczniowie/${studentId}`);
}
