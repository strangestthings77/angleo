import { Eyebrow } from '@/components/text/Eyebrow';
import { MailIcon, PhoneIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';
import { getLessonInfo } from '@/lib/cal';

const STEPS = [
  'Wybierz dzień i godzinę',
  'Podaj imię i e-mail',
  'Potwierdzenie i link do spotkania przyjdą e-mailem',
];

/** Left column next to the booking widget: what you're booking, how it works, contact. */
export async function LessonDetails() {
  const lesson = await getLessonInfo();
  const { company } = site;

  return (
    <aside className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <Eyebrow>Lekcja</Eyebrow>
        <p className="font-serif text-display-sm tracking-display text-foreground">
          {site.booking.lessonName}
        </p>
        <ul className="flex flex-wrap gap-2 text-sm text-foreground">
          {lesson && (
            <li className="rounded-full border border-border px-3 py-1.5">
              {lesson.lengthInMinutes} min
            </li>
          )}
          <li className="rounded-full border border-border px-3 py-1.5">
            {lesson?.online === false ? 'Spotkanie' : 'Online · Google Meet'}
          </li>
          <li className="rounded-full border border-border px-3 py-1.5">100 zł</li>
        </ul>
      </div>

      <ol className="flex flex-col gap-4">
        {STEPS.map((step, i) => (
          <li key={step} className="flex gap-4 text-sm/6 text-foreground-muted">
            <span className="font-serif text-title leading-none text-accent tabular-nums">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-3 border-t border-border pt-8">
        <p className="font-serif text-title tracking-display text-foreground">Ustalmy szczegóły</p>
        <p className="text-sm/6 text-foreground-muted">
          Masz pytania lub chcesz porozmawiać o terminach? Napisz lub zadzwoń — chętnie pomogę.
        </p>
        <ul className="flex flex-col text-base">
          <li>
            <a
              href={`mailto:${site.contact.email}?subject=${encodeURIComponent('Pytanie o lekcje angielskiego – Angleo')}`}
              className="inline-flex min-h-11 items-center gap-3 text-foreground transition-colors duration-200 hover:text-accent"
            >
              <MailIcon size={18} className="text-accent" />
              Napisz do mnie
            </a>
          </li>
          <li>
            <a
              href={site.contact.phoneHref}
              className="inline-flex min-h-11 items-center gap-3 text-foreground transition-colors duration-200 hover:text-accent"
            >
              <PhoneIcon size={18} className="text-accent" />
              Zadzwoń
            </a>
          </li>
        </ul>
      </div>

      <address className="flex flex-col text-xs/5 text-foreground-muted not-italic">
        <span className="font-medium text-foreground">
          {site.owner} – {site.role}
        </span>
        <span>
          {company.street}, {company.city}
        </span>
        <span>NIP: {company.nip}</span>
      </address>
    </aside>
  );
}
