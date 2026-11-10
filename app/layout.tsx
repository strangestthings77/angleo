import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site-url';
import { Geist, Instrument_Serif } from 'next/font/google';
import './globals.css';
import { JsonLd } from '@/components/seo/JsonLd';
import { siteGraph } from '@/lib/structured-data';

const geist = Geist({ variable: '--font-geist', subsets: ['latin', 'latin-ext'] });
const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pl" className={`${geist.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="bg-background font-sans text-base/7 text-foreground">
        <JsonLd data={siteGraph()} />
        {children}
      </body>
    </html>
  );
}
