'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { MAX_LESSONS } from '@/lib/progress';
import { lookupTerm, posLabel } from '@/lib/dictionary';
import { parseExercise } from '@/lib/exercise';
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

export type Suggestion = { pos: string | null; options: string[] };

/** Dictionary meanings for the admin's "Podpowiedz" button. */
export async function suggestTranslations(term: string): Promise<Suggestion[]> {
  await requireAdmin();
  const clean = String(term ?? '').slice(0, 120);
  const senses = await lookupTerm(clean);
  return senses
    .filter((s) => s.options.length > 0)
    .map((s) => ({ pos: posLabel(s.pos), options: s.options }));
}

const exerciseSchema = z.object({
  studentId: z.uuid(),
  title: z.string().trim().min(1, 'Podaj tytuł').max(160),
  instructions: z.string().trim().max(500).optional(),
  content: z.string().trim().min(1, 'Wpisz treść ćwiczenia').max(10000),
});

export type ExerciseFormState = { error?: string; ok?: number } | undefined;

/** Admin creates a gap-fill exercise for one student. */
export async function createExercise(
  _: ExerciseFormState,
  formData: FormData,
): Promise<ExerciseFormState> {
  await requireAdmin();
  const parsed = exerciseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { studentId, title, instructions, content } = parsed.data;
  const { template, hints, answers } = parseExercise(content);
  if (answers.length === 0) {
    return { error: 'Dodaj co najmniej jedną lukę w nawiasach: [[odpowiedź]].' };
  }
  if (answers.some((a) => a.length === 0)) return { error: 'Jedna z luk jest pusta.' };

  const supabase = await createClient();
  const { error } = await supabase.from('exercises').insert({
    student_id: studentId,
    title,
    instructions: instructions || null,
    template,
    hints,
    answers,
  });
  if (error) return { error: 'Nie udało się zapisać ćwiczenia. Spróbuj ponownie.' };

  revalidatePath(`/admin/uczniowie/${studentId}`);
  return { ok: Date.now() };
}

/** Admin edits an exercise; a submitted attempt is re-graded in the DB (update_exercise). */
export async function updateExercise(
  _: ExerciseFormState,
  formData: FormData,
): Promise<ExerciseFormState> {
  await requireAdmin();
  const parsed = exerciseSchema
    .extend({ exerciseId: z.uuid() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { exerciseId, studentId, title, instructions, content } = parsed.data;
  const { template, hints, answers } = parseExercise(content);
  if (answers.length === 0) {
    return { error: 'Dodaj co najmniej jedną lukę w nawiasach: [[odpowiedź]].' };
  }
  if (answers.some((a) => a.length === 0)) return { error: 'Jedna z luk jest pusta.' };

  const supabase = await createClient();
  const { error } = await supabase.rpc('update_exercise', {
    p_exercise: exerciseId,
    p_title: title,
    p_instructions: instructions || null,
    p_template: template,
    p_hints: hints,
    p_answers: answers,
  });
  if (error) return { error: 'Nie udało się zapisać zmian. Spróbuj ponownie.' };

  revalidatePath(`/admin/uczniowie/${studentId}`);
  revalidatePath(`/admin/uczniowie/${studentId}/cwiczenia/${exerciseId}`);
  redirect(`/admin/uczniowie/${studentId}`);
}

export async function deleteExercise(exerciseId: string, studentId: string): Promise<void> {
  await requireAdmin();
  if (!z.uuid().safeParse(exerciseId).success) return;
  const supabase = await createClient();
  await supabase.from('exercises').delete().eq('id', exerciseId);
  revalidatePath(`/admin/uczniowie/${studentId}`);
}

export async function reopenExercise(exerciseId: string, studentId: string): Promise<void> {
  await requireAdmin();
  if (!z.uuid().safeParse(exerciseId).success) return;
  const supabase = await createClient();
  await supabase.rpc('reopen_exercise', { p_exercise: exerciseId });
  revalidatePath(`/admin/uczniowie/${studentId}`);
  revalidatePath(`/admin/uczniowie/${studentId}/cwiczenia/${exerciseId}`);
}
