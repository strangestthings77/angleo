/** Public switch for the student area (sign-in, /panel). Keep the implementation intact while disabled. */
export const STUDENT_AREA_ENABLED = true;

/**
 * Self sign-up on /rejestracja. Off: Nicole adds student accounts herself (Supabase → Authentication
 * → Users → Add user). The real lock is Supabase's "Allow new users to sign up" setting — the
 * publishable key is public, so this flag alone only hides the form.
 */
export const SIGN_UP_ENABLED = false;
