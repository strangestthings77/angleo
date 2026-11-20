import Link from 'next/link';
import { ArrowRightIcon, BookIcon } from '@/components/ui/Icon';
import { lessonPreview, type Lesson } from '@/lib/lesson';

const dateFormat = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'long',
  timeZone: 'Europe/Warsaw',
});

/** Lesson cards, newest first — the student's panel and the admin's student page. */
export function LessonList({
  lessons,
  href,
  empty,
}: {
  lessons: Lesson[];
  href: (lesson: Lesson) => string;
  empty: { title: string; body: string };
}) {
  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-border p-8 sm:flex-row sm:items-center">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-muted text-accent">
          <BookIcon size={20} />
        </span>
        <div>
          <p className="font-medium text-foreground">{empty.title}</p>
          <p className="text-sm text-foreground-muted">{empty.body}</p>
        </div>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => {
        const preview = lessonPreview(lesson.content);
        return (
          <li key={lesson.id}>
            <Link
              href={href(lesson)}
              className="group flex h-full flex-col gap-3 rounded-3xl border border-border bg-surface p-6 transition-[translate,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card motion-reduce:transition-none"
            >
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-xs font-medium tracking-eyebrow text-accent uppercase">
                  Lekcja {lesson.number}
                </span>
                <span className="text-xs text-foreground-muted">
                  {dateFormat.format(new Date(lesson.createdAt))}
                </span>
              </span>
              <span className="font-serif text-title tracking-display text-foreground">
                {lesson.topic ?? `Lekcja ${lesson.number}`}
              </span>
              <span className="line-clamp-3 text-sm text-foreground-muted">
                {preview || 'Brak notatek — otwórz i zacznij pisać.'}
              </span>
              <span className="mt-auto inline-flex items-center gap-2 pt-1 text-sm font-medium text-accent">
                Otwórz notatki
                <ArrowRightIcon className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
