import { createBrowserClient } from '@supabase/ssr';

/** Supabase client for Client Components (autosave, Realtime). RLS applies to every call. */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
