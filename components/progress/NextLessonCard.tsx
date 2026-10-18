import Link from 'next/link';
import { formatDay, formatTime } from '@/components/booking/dates';
import { InkPanel } from '@/components/marketing/InkPanel';
import { Eyebrow } from '@/components/text/Eyebrow';
import { CalendarIcon } from '@/components/ui/Icon';
import { dateKeyIn } from '@/lib/booking';
import { getUpcomingLessons, type UpcomingLesson } from '@/lib/cal';
import { site } from '@/content/site';

/** Lessons are held in Polish time; show it explicitly. */
const TZ = 'Europe/Warsaw';

/**
 * "Next lesson" card on /panel — rendered only when the student has at least one upcoming
 * booking. Reads Cal.com live, so reschedules and cancellations from Cal emails show up.
 */
export async function NextLessonCard({ email }: { email: string }) {
  const lessons = await getUpcomingLessons(email).catch((error) => {
    console.error('[panel/next-lesson]', error);
    return [];
  });
  return <NextLessonView lessons={lessons} />;
}

/** Presentational part — `null` when there's nothing booked. */
export function NextLessonView({ lessons }: { lessons: UpcomingLesson[] }) {
  const [next, ...later] = lessons;
  if (!next) return null;

  const meetUrl = next.location?.startsWith('http') ? next.location : null;

  return (
    <InkPanel className="flex animate-pop flex-col gap-8 rounded-3xl p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-4">
        <Eyebrow inverse>Następna lekcja</Eyebrow>
        <p className="font-serif text-display-sm tracking-display text-background sm:text-display-md">
          {formatDay(dateKeyIn(TZ, new Date(next.start)), true)}
        </p>
        <p className="flex items-center gap-2 text-lead text-inverse-muted tabular-nums">
          <CalendarIcon className="text-accent-light" />
          {formatTime(next.start, TZ)}–{formatTime(next.end, TZ)} · czas polski
        </p>
        {later.length > 0 && (
          <ul className="mt-2 flex flex-col gap-1 text-sm text-inverse-muted">
            {later.map((lesson) => (
              <li key={lesson.uid} className="tabular-nums">
                Potem: {formatDay(dateKeyIn(TZ, new Date(lesson.start)))},{' '}
                {formatTime(lesson.start, TZ)}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {meetUrl && (
          <a
            href={meetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center rounded-full bg-background px-6 text-sm font-medium text-foreground transition-[background-color,scale] duration-200 ease-out hover:bg-surface active:scale-97"
          >
            Dołącz do lekcji
          </a>
        )}
        <Link
          href={site.booking.href}
          className="inline-flex h-12 items-center rounded-full border border-background/25 px-6 text-sm font-medium text-background transition-[border-color,scale] duration-200 ease-out hover:border-background/70 active:scale-97"
        >
          Umów kolejną
        </Link>
      </div>
    </InkPanel>
  );
}
