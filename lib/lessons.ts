import 'server-only';
import type { JSONContent } from '@tiptap/react';
import { requireAdmin, requireUser } from '@/lib/auth';
import { EMPTY_DOC, type Lesson } from '@/lib/lesson';
import { createClient } from '@/lib/supabase/server';

/** Lesson reads (RLS: a student sees their own lessons, the admin sees all). */

type LessonRow = {
  id: string;
  student_id: string;
  number: number;
  topic: string | null;
  content: JSONContent | null;
  updated_at: string;
  created_at: string;
};

const LESSON_COLUMNS = 'id, student_id, number, topic, content, updated_at, created_at';

const toLesson = (r: LessonRow): Lesson => ({
  id: r.id,
  studentId: r.student_id,
  number: r.number,
  topic: r.topic,
  content: r.content ?? EMPTY_DOC,
  updatedAt: r.updated_at,
  createdAt: r.created_at,
});

async function lessonsFor(studentId: string): Promise<Lesson[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('lessons')
    .select(LESSON_COLUMNS)
    .eq('student_id', studentId)
    .order('number', { ascending: false });
  if (error) throw new Error('Nie udało się wczytać lekcji.');
  return (data ?? []).map(toLesson);
}

async function lessonFor(studentId: string, lessonId: string): Promise<Lesson | null> {
  if (!/^[0-9a-f-]{36}$/i.test(lessonId)) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from('lessons')
    .select(LESSON_COLUMNS)
    .eq('id', lessonId)
    .eq('student_id', studentId)
    .maybeSingle<LessonRow>();
  return data ? toLesson(data) : null;
}

/** The signed-in student's lessons, newest first. */
export async function getMyLessons(): Promise<Lesson[]> {
  const user = await requireUser();
  return lessonsFor(user.id);
}

export async function getMyLesson(lessonId: string): Promise<Lesson | null> {
  const user = await requireUser();
  return lessonFor(user.id, lessonId);
}

/** Admin: one student's lessons, newest first. */
export async function getStudentLessons(studentId: string): Promise<Lesson[]> {
  await requireAdmin();
  return lessonsFor(studentId);
}

export async function getStudentLesson(studentId: string, lessonId: string) {
  await requireAdmin();
  return lessonFor(studentId, lessonId);
}
