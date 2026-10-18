import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only pages that read the session — marketing pages stay static. /umow-lekcje personalises
  // the booking form, so its session must be refreshed too.
  matcher: [
    '/panel/:path*',
    '/admin/:path*',
    '/logowanie',
    '/rejestracja',
    '/auth/:path*',
    '/umow-lekcje',
    '/api/booking',
  ],
};
