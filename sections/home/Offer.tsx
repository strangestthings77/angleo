import Link from 'next/link';
import { InkPanel } from '@/components/marketing/InkPanel';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Container } from '@/components/ui/Container';
import { ArrowRightIcon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';

/** Bento: one ink lead card + the four learning areas. */
export function Offer() {
  const { offer, booking } = site;

  return (
    <Section>
      <Container className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
        <InkPanel className="flex reveal flex-col justify-between gap-12 rounded-3xl p-8 sm:p-10 lg:row-span-2">
          <div className="flex flex-col gap-6">
            <Eyebrow inverse>{offer.eyebrow}</Eyebrow>
            <Heading size="md" inverse>
              <Accent text={offer.heading} />
            </Heading>
            <Text inverse>{offer.intro}</Text>
          </div>
          <Link
            href={booking.href}
            className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent-light"
          >
            Zarezerwuj pierwszą lekcję
            <ArrowRightIcon className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        </InkPanel>
        <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:row-span-2">
          {offer.items.map((item, i) => (
            <li
              key={item.title}
              className="flex reveal flex-col justify-between gap-10 rounded-3xl border border-border bg-surface p-8 transition-[translate,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card motion-reduce:transition-none"
            >
              <span className="font-serif text-display-sm text-accent italic tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                <p className="text-sm/6 text-foreground-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
