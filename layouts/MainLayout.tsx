import { Footer } from '@/layouts/Footer';
import { Header } from '@/layouts/Header';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
