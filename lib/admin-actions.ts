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
  return { lessons: data };
}
