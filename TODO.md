# TODO

Seeded from `.altalogy/BUILD.md`.

## Now

- [ ] Apply DB migration (`pnpm exec supabase login`, `pnpm db:link`, `pnpm db:push`)
- [ ] Supabase → Auth → URL config: site URL + `/auth/callback` redirect URLs (local + Vercel)
- [ ] Promote Nicole to admin after she signs up
- [ ] Custom SMTP in Supabase before real students sign up

- [ ] Connect Vercel, set env vars, point angleo.pl at it
- [ ] Client review: new design + new headline copy

## Next

- [ ] Switch `CAL_EVENT_TYPE_ID` / key to Nicole's Cal.com account; rotate the test key
- [ ] Durable rate limit (Vercel KV / Upstash) if booking spam appears
- [ ] Privacy policy naming Cal.com as processor of booking data

- [ ] Real portrait/OG photography for the premium look (current photo is a webcam still)
- [ ] Designed OG image
- [ ] Real Instagram / Facebook links

## Later

- [ ] Exercises for students (admin assigns, student completes)
- [ ] Admin: add/assign words per student
- [ ] Invite-only accounts instead of public sign-up

- [ ] Analytics + cookie stance
- [ ] Search, RSS feed (`/blog/rss.xml`)
- [ ] Pagination once the post list grows
