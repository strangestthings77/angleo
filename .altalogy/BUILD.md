# BUILD

The plan for this project and the reasoning behind it — sitemap, components, design
decisions, and the trade-offs we accepted.

## Sitemap

URLs match the Webflow site so existing links and search results keep working.

- `/` — featured post card + 3 headlines, category bar, all posts + sidebar
- `/blog/<slug>` — 14 posts (some slugs are Webflow template leftovers; kept on purpose)
- `/blog-post-categories/<slug>` — 8 categories
- `/o-mnie` — about
- `/umow-lekcje` — contact + booking calendar

Not carried over: Webflow template pages (home-premium, sign-in/up, account, styleguide,
licenses, search).

## Decisions

- **Design copied 1:1 from angleo.pl** (Writeology Webflow template): Manrope, colour values
  and type scale measured from the live CSS, same layouts. No redesign.
- **Posts migrated to MDX** (`@next/mdx`, no frontmatter plugin): bodies in `.mdx`, metadata
  in a typed `posts.ts`. Converted from the Webflow rich text by a one-off script; Webflow
  empty paragraphs and the stray "Zapytaj ChatGPT" suffix on two excerpts were dropped.
- **Images self-hosted** in `public/images/blog/`, resized to 1600px — no dependency on the
  Webflow CDN after migration.
- **Meta:** two posts had no description; their first paragraph is used. Long titles and
  descriptions are trimmed for meta tags only (audit limits).
- **Booking** stays on the existing Google Apps Script calendar.
