import 'server-only';
import { requireAdmin, requireUser } from '@/lib/auth';
import type { Answers, GapHint } from '@/lib/exercise';
import { createClient } from '@/lib/supabase/server';

/** Exercise reads. Students never receive `answers` (column privilege) until they submit. */

export type Attempt = {
  answers: Answers;
  submittedAt: string | null;
  score: number | null;
  total: number | null;
  updatedAt: string;
};

export type ExerciseSummary = {
  id: string;
  title: string;
  instructions: string | null;
  createdAt: string;
  gaps: number;
  attempt: Attempt | null;
};

export type Exercise = ExerciseSummary & { studentId: string; template: string; hints: GapHint[] };

type ExerciseRow = {
  id: string;
  student_id: string;
  title: string;
  instructions: string | null;
  template: string;
  hints: GapHint[];
  created_at: string;
};

type AttemptRow = {
  exercise_id: string;
  answers: Answers;
  submitted_at: string | null;
  score: number | null;
  total: number | null;
  updated_at: string;
};

const EXERCISE_COLUMNS = 'id, student_id, title, instructions, template, hints, created_at';
const ATTEMPT_COLUMNS = 'exercise_id, answers, submitted_at, score, total, updated_at';

export const toAttempt = (a: AttemptRow): Attempt => ({
  answers: a.answers ?? {},
  submittedAt: a.submitted_at,
  score: a.score,
  total: a.total,
  updatedAt: a.updated_at,
});

const toExercise = (e: ExerciseRow, attempt: AttemptRow | undefined): Exercise => ({
  id: e.id,
  studentId: e.student_id,
  title: e.title,
  instructions: e.instructions,
  template: e.template,
  hints: e.hints,
  createdAt: e.created_at,
  gaps: e.hints.length,
  attempt: attempt ? toAttempt(attempt) : null,
});

async function exercisesWhere(studentId: string): Promise<Exercise[]> {
  const supabase = await createClient();
  const [{ data: exercises }, { data: attempts }] = await Promise.all([
    supabase
      .from('exercises')
      .select(EXERCISE_COLUMNS)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false }),
    supabase.from('exercise_attempts').select(ATTEMPT_COLUMNS).eq('student_id', studentId),
  ]);
  const byExercise = new Map((attempts ?? []).map((a) => [a.exercise_id, a as AttemptRow]));
  return (exercises ?? []).map((e) => toExercise(e as ExerciseRow, byExercise.get(e.id)));
}

async function exerciseById(id: string): Promise<Exercise | null> {
  const supabase = await createClient();
  const [{ data: exercise }, { data: attempt }] = await Promise.all([
    supabase.from('exercises').select(EXERCISE_COLUMNS).eq('id', id).maybeSingle(),
    supabase.from('exercise_attempts').select(ATTEMPT_COLUMNS).eq('exercise_id', id).maybeSingle(),
  ]);
  return exercise
    ? toExercise(exercise as ExerciseRow, (attempt as AttemptRow) ?? undefined)
    : null;
}

/** Correct answers — admins always; students only after submitting (DB-enforced). */
export async function answersFor(id: string): Promise<string[][] | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('exercise_answers', { p_exercise: id });
  return (data as string[][] | null) ?? null;
}

export async function getMyExercises(): Promise<Exercise[]> {
  const user = await requireUser();
  return exercisesWhere(user.id);
}

export async function getMyExercise(id: string): Promise<Exercise | null> {
  const user = await requireUser(`/panel/cwiczenia/${id}`);
  const exercise = await exerciseById(id);
  return exercise && exercise.studentId === user.id ? exercise : null;
}

export async function getStudentExercises(studentId: string): Promise<Exercise[]> {
  await requireAdmin();
  return exercisesWhere(studentId);
}

export async function getExerciseForAdmin(id: string): Promise<Exercise | null> {
  await requireAdmin();
  return exerciseById(id);
}
