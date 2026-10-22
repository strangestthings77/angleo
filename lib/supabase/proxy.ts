import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { STUDENT_AREA_ENABLED } from '@/lib/student-area';

/** Paths that need a signed-in user. Role checks happen in the pages themselves. */
const PROTECTED = ['/panel', '/admin'];

/**
 * Refreshes the Supabase session cookie and guards protected paths.
 * Only ever redirects *to* the login page, never away from it — the pages make the final call,
 * so a disagreement between this check and a page's check can't bounce the browser in a loop.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Don't run code between createServerClient and getClaims — it validates and refreshes.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  const isStudentAreaPath =
    pathname === '/panel' || pathname.startsWith('/panel/') || pathname === '/rejestracja';
  if (!STUDENT_AREA_ENABLED && isStudentAreaPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/logowanie';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (!signedIn && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = request.nextUrl.clone();
    url.pathname = '/logowanie';
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return response;
}
