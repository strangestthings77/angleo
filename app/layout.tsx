import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const sans = Inter({ variable: '--font-inter', subsets: ['latin', 'latin-ext'] });
const display = Fraunces({ variable: '--font-fraunces', subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pl" className={`${sans.variable} ${display.variable} antialiased`}>
      <body className="bg-background text-foreground font-sans">{children}</body>
    </html>
  );
}
