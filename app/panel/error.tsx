'use client';

import { PanelError } from '@/components/auth/PanelError';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <PanelError reset={reset} />;
}
