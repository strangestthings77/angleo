# BUILD

The plan for this project and the reasoning behind it — sitemap, components, design
decisions, and the trade-offs we accepted.

## Sitemap

URLs match the Webflow site so existing links and search results keep working.

- `/` — landing: hero, credentials, offer, topics, latest posts, quote, booking CTA
- `/blog` — new: featured post + all posts with category chips
- `/blog/<slug>` — 14 posts (some slugs are Webflow template leftovers; kept on purpose)
- `/blog-post-categories/<slug>` — 8 categories
- `/o-mnie` — about
- `/umow-lekcje` — contact + booking calendar

Not carried over: Webflow template pages (home-premium, sign-in/up, account, styleguide,
licenses, search).

## Decisions

- **Redesign (2026-10-18):** first copied 1:1 from angleo.pl (commit `6dbf2f3`), then
  restyled as a premium editorial brand — ivory / ink / brass, Instrument Serif + Geist.
  Removes any dependency on the Writeology template's look.
- **New copy for the redesign — client to review:** hero headline/lead, section headings
  (offer, topics, blog, booking), short footer blurb, author bio. Facts (education, contact,
  company) and the about text are unchanged from angleo.pl. No testimonials, prices or
  stats were invented.
- **"Ultra pro" pass (2026-10-18):** home became a
  full service page — specialties, audiences ("Dla kogo"), bento offer, 3-step process, about
  teaser, blog, FAQ. New copy to review: specialties list, audiences, process steps, FAQ. FAQ
  answers only state facts (Google Meet, length from Cal.com, 2-week window, reschedule link).
  "lekcja 1:1" assumes individual lessons — confirm with Nicole. Dark ink heroes were tried
  and rejected by the client; heroes stay light, ink is for the offer card and CTA band only.
- **Dates switched to Polish** ("27 lipca 2025").
- **Posts migrated to MDX** (`@next/mdx`, no frontmatter plugin): bodies in `.mdx`, metadata
  in a typed `posts.ts`. Converted from the Webflow rich text by a one-off script; Webflow
  empty paragraphs and the stray "Zapytaj ChatGPT" suffix on two excerpts were dropped.
- **Images self-hosted** in `public/images/blog/`, resized to 1600px — no dependency on the
  Webflow CDN after migration.
- **Meta:** two posts had no description; their first paragraph is used. Long titles and
  descriptions are trimmed for meta tags only (audit limits).
- **Booking rebuilt on Cal.com API v2 (custom UI, not the embed).** Replaces the Google Apps
  Script calendar. Hosted API v2 requires a paid Cal.com plan (Teams+); the free plan has no
  API access — confirmed against Cal.com docs 2026-10-18. Key stays server-side; spam
  protection = honeypot + timing trap + per-IP rate limit (no captcha yet).
