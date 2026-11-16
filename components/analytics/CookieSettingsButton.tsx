'use client';

import { openConsentSettings } from '@/lib/analytics';

/** Footer link-style button that reopens the cookie banner. */
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      Ustawienia cookies
    </button>
  );
}
