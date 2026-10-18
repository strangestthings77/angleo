import { Suspense } from 'react';
import { PanelBar } from '@/components/auth/PanelBar';
import { PanelSkeleton } from '@/components/auth/PanelSkeleton';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/layouts/MainLayout';
import { getStudents, requireAdmin } from '@/lib/auth';
import { pluralForm } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Panel administratora | Angleo',
  description: 'Lista uczniów i zarządzanie strefą ucznia Angleo.',
  path: '/admin',
  noindex: true,
});

export default function AdminPage() {
  return (
    <MainLayout>
      <Suspense fallback={<PanelSkeleton />}>
        <AdminDashboard />
      </Suspense>
    </MainLayout>
  );
}

const dateFormat = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Warsaw',
});

async function AdminDashboard() {
  const user = await requireAdmin();
  const students = await getStudents();

  return (
    <>
      <PanelBar user={user} area="admin" />

      <Container className="flex flex-col gap-10 py-section">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-4">
            <Eyebrow>Uczniowie</Eyebrow>
            <Heading size="md">
              Wszyscy <em>uczniowie</em>
            </Heading>
          </div>
          <p className="font-serif text-display-sm tracking-display text-foreground tabular-nums">
            {students.length}
            <span className="ml-2 font-sans text-sm text-foreground-muted">
              {pluralForm(students.length, ['konto', 'konta', 'kont'])}
            </span>
          </p>
        </div>

        {students.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border p-8 text-foreground-muted">
            Nikt jeszcze nie założył konta. Uczniowie mogą zarejestrować się na stronie
            /rejestracja.
          </p>
        ) : (
          <div className="animate-fade overflow-x-auto rounded-3xl border border-border bg-surface">
            <table className="w-full min-w-xl text-left text-sm">
              <thead className="border-b border-border text-xs tracking-eyebrow text-foreground-muted uppercase">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Imię i nazwisko
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    E-mail
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Dołączył(a)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="transition-colors duration-150 hover:bg-background"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">{student.name ?? '—'}</td>
                    <td className="px-6 py-4 text-foreground-muted">
                      <a href={`mailto:${student.email}`} className="hover:text-foreground">
                        {student.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted tabular-nums">
                      {dateFormat.format(new Date(student.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </>
  );
}
