import { PRODUCTION_URL } from '@/lib/site-url';

/** GA4 property for www.angleo.pl. */
export const GA_ID = 'G-KMVJQJ71Y8';

/** Only the live site reports to GA — never localhost or Vercel previews. */
export const isAnalyticsHost = (hostname: string) => hostname === new URL(PRODUCTION_URL).hostname;

export type Consent = 'granted' | 'denied';

const KEY = 'angleo-cookie-consent';
const CHANGE = 'angleo:consent-change';
const OPEN = 'angleo:consent-open';

/** Stored choice; `null` until the visitor picks (or when storage is blocked). */
export function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function subscribeConsent(onChange: () => void) {
  window.addEventListener(CHANGE, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener('storage', onChange);
  };
}

type Gtag = (...args: unknown[]) => void;

export function saveConsent(consent: Consent) {
  try {
    localStorage.setItem(KEY, consent);
  } catch {
    // Storage blocked: the choice holds for this page view only.
  }
  // GA already loaded this visit (granted earlier) → tell it, and drop its cookies on a revoke.
  const gtag = (window as Window & { gtag?: Gtag }).gtag;
  gtag?.('consent', 'update', { analytics_storage: consent });
  if (consent === 'denied') clearGaCookies();
  window.dispatchEvent(new Event(CHANGE));
}

/** Reopens the banner (footer "Ustawienia cookies"). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN));
}

export function onOpenConsentSettings(open: () => void) {
  window.addEventListener(OPEN, open);
  return () => window.removeEventListener(OPEN, open);
}

/** GA sets `_ga` / `_ga_<id>` on the registrable domain (`.angleo.pl`). */
function clearGaCookies() {
  const domains = ['', `; domain=.${location.hostname.replace(/^www\./, '')}`];
  for (const name of document.cookie.split('; ').map((c) => c.split('=')[0])) {
    if (!name.startsWith('_ga')) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
}
