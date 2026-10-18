import { ContactList } from '@/components/marketing/ContactList';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';
import { PlusIcon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';
import { getLessonInfo } from '@/lib/cal';

/** Native <details> accordion — works without JS. */
export async function Faq() {
  const { faq } = site;
  const lesson = await getLessonInfo();
  const items = faq.items.map((item, i) =>
    // Keep the length in sync with the Cal.com event type.
    i === 0 && lesson
      ? {
          ...item,
          a: `Lekcje trwają ${lesson.lengthInMinutes} minut i odbywają się online przez Google Meet. Link do spotkania znajdziesz w e-mailu z potwierdzeniem rezerwacji.`,
        }
      : item,
  );

  return (
    <Section id="faq">
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20">
        <div className="flex flex-col gap-8">
          <SectionHeader eyebrow={faq.eyebrow} heading={faq.heading} lead={faq.lead} />
          <ContactList />
        </div>
        <div className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium text-foreground [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-transform duration-200 ease-out-soft group-open:rotate-45 motion-reduce:transition-none">
                  <PlusIcon />
                </span>
              </summary>
              <p className="max-w-2xl pb-6 text-base/7 text-foreground-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
