'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { buttonClass } from '@/components/ui/Button';
import {
  GA_ID,
  isAnalyticsHost,
  onOpenConsentSettings,
  readConsent,
  saveConsent,
  subscribeConsent,
} from '@/lib/analytics';

/** Server render and hydration: "not decided yet, don't show anything". */
const UNKNOWN = 'unknown';

/**
 * Cookie banner + Google Analytics. GA (gtag.js) loads only after the visitor accepts, and only on
 * the live site — nothing reaches Google before consent. Reject is as easy as accept (GDPR);
 * the footer's "Ustawienia cookies" reopens the banner.
 */
export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => UNKNOWN);
  const [reopened, setReopened] = useState(false);

  useEffect(() => onOpenConsentSettings(() => setReopened(true)), []);

  const choose = (choice: 'granted' | 'denied') => {
    saveConsent(choice);
    setReopened(false);
  };

  const loadGa =
    consent === 'granted' && typeof window !== 'undefined' && isAnalyticsHost(location.hostname);

  return (
    <>
      {loadGa && (
        <>
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
        </>
      )}

      {(consent === null || reopened) && (
        <section
          aria-label="Zgoda na pliki cookie"
          className="fixed inset-x-4 bottom-4 z-50 flex animate-fade flex-col gap-5 rounded-3xl border border-border bg-surface p-6 shadow-card sm:right-6 sm:bottom-6 sm:left-auto sm:max-w-md"
        >
          <div className="flex flex-col gap-2">
            <p className="font-serif text-title tracking-display text-foreground">Pliki cookie</p>
            <p className="text-sm/6 text-foreground-muted">
              Za Twoją zgodą używam Google Analytics, żeby sprawdzać, które strony i artykuły są
              najbardziej przydatne. Bez zgody statystyki się nie włączą. Zdanie możesz zmienić w
              każdej chwili w stopce strony.{' '}
              <Link
                href="/polityka-prywatnosci"
                className="text-foreground underline underline-offset-4 transition-colors duration-200 hover:text-accent"
              >
                Polityka prywatności
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => choose('denied')}
              className={buttonClass('secondary')}
            >
              Odrzucam
            </button>
            <button type="button" onClick={() => choose('granted')} className={buttonClass()}>
              Akceptuję
            </button>
          </div>
        </section>
      )}
    </>
  );
}
