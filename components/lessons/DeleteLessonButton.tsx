'use client';

import { deleteLesson } from '@/lib/admin-actions';

/** Deleting a lesson removes its notes for both sides, so ask first. */
export function DeleteLessonButton({
  lessonId,
  studentId,
  title,
  className,
}: {
  lessonId: string;
  studentId: string;
  title: string;
  className: string;
}) {
  return (
    <form
      action={deleteLesson.bind(null, lessonId, studentId)}
      onSubmit={(e) => {
        if (!window.confirm(`Usunąć „${title}” razem z notatkami? Tego nie da się cofnąć.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className={className}>
        Usuń lekcję
      </button>
    </form>
  );
}
