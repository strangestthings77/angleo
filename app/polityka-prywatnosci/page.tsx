import { PageHero } from '@/components/marketing/PageHero';
import { Container } from '@/components/ui/Container';
import Policy from '@/content/legal/polityka-prywatnosci.mdx';
import { MainLayout } from '@/layouts/MainLayout';
import { formatDate } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';

/*
 * Policy text: content/legal/polityka-prywatnosci.mdx — drafted from what the site actually does
 * (Cal.com booking, Supabase accounts, GA4 with consent, Vercel hosting). Not legal advice; Nicole
 * to review. When the site starts collecting something new (newsletter, payments, a new tool),
 * update the text and bump UPDATED.
 */
const UPDATED = '2026-11-16';

export const metadata = buildMetadata({
  title: 'Polityka prywatności | Angleo',
  description:
    'Jak Angleo przetwarza dane osobowe: rezerwacja lekcji, konto ucznia, kontakt, pliki cookie i Google Analytics. Twoje prawa i dane kontaktowe administratora.',
  path: '/polityka-prywatnosci',
});

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
      <PageHero
        eyebrow={`Aktualizacja: ${formatDate(UPDATED)}`}
        heading="Polityka *prywatności*"
        lead="Jakie dane zbieram, po co, komu je przekazuję i jakie masz prawa — krótko i konkretnie."
        compact
      />
      <Container className="py-section">
        <div className="mx-auto max-w-reading">
          <Policy />
        </div>
      </Container>
    </MainLayout>
  );
}
