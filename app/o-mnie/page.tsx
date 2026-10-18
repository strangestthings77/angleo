import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import About from '@/content/about.mdx';
import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { ContactDetails } from '@/sections/about/ContactDetails';

export const metadata = buildMetadata({
  title: 'O mnie – Nicole Kurek | Angleo',
  description:
    'Poznaj Nicole Kurek – absolwentkę Filologii Angielskiej (Angielski w Biznesie, Media i Translacja) i trenerkę angielskiego dla profesjonalistów.',
  path: '/o-mnie',
});

export default function AboutPage() {
  return (
    <MainLayout>
      <h1 className="sr-only">O mnie</h1>
      <Section>
        <Container className="flex flex-col gap-10">
          <Image
            src={site.portrait.src}
            alt={site.portrait.alt}
            width={site.portrait.width}
            height={site.portrait.height}
            priority
            sizes="(min-width: 1175px) 1127px, 100vw"
            draggable={false}
            className="w-full"
          />
          <ContactDetails />
          <div className="[&>h2]:mt-0">
            <About />
          </div>
          <div>
            <Button href={site.contact.calendarUrl}>Otwórz kalendarz</Button>
          </div>
        </Container>
      </Section>
    </MainLayout>
  );
}
