import { ViewTransition } from 'react';
import { Footer } from '@/layouts/Footer';
import { Header } from '@/layouts/Header';

/** Each page renders this, so route changes swap the ViewTransition → soft crossfade (motion.css). */
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ViewTransition enter="page" exit="page" default="none">
        <main>{children}</main>
      </ViewTransition>
      <Footer />
    </>
  );
}
