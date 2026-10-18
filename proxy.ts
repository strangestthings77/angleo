import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only the student area and auth pages need the session — marketing pages stay static.
  matcher: ['/panel/:path*', '/admin/:path*', '/logowanie', '/rejestracja', '/auth/:path*'],
};
