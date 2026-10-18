import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { parseArgs } from 'node:util';
import { auditPages, checkImages, type PageInput } from '../lib/meta-audit/index.ts';

const { values } = parseArgs({
  options: {
    dir: { type: 'string' },
    url: { type: 'string' },
    'check-images': { type: 'boolean', default: false },
  },
});

/** Built HTML on disk → routes. */
async function fromDir(dir: string): Promise<PageInput[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith('.html'))
    .map((e) => join(e.parentPath, e.name));

  return Promise.all(
    files.map(async (file) => ({
      route:
        '/' +
        relative(dir, file)
          .split(sep)
          .join('/')
          .replace(/index\.html$/, '')
          .replace(/\.html$/, ''),
      html: await readFile(file, 'utf8'),
    })),
  );
}

/** Running server → routes, discovered via its own sitemap. */
async function fromUrl(base: string): Promise<PageInput[]> {
  const sitemap = await fetch(new URL('/sitemap.xml', base)).then((r) => r.text());
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (locs.length === 0) {
    throw new Error(`No <loc> entries in ${base}/sitemap.xml — is the sitemap generated?`);
  }

  // `next-sitemap` emits a sitemap *index* whose <loc>s are sibling .xml files,
  // not routes. Without this hop the audit fetches XML, parses it as HTML, and
  // reports one meta-less "page" instead of the real routes.
  const nested = locs.filter((loc) => loc.endsWith('.xml'));
  const routes = locs.filter((loc) => !loc.endsWith('.xml'));

  for (const loc of nested) {
    const local = new URL(new URL(loc).pathname, base);
    const child = await fetch(local).then((r) => r.text());
    routes.push(...[...child.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }

  return Promise.all(
    routes.map(async (loc) => {
      const url = new URL(loc);
      // Rewrite the production host to the local server we just built.
      const local = new URL(url.pathname + url.search, base);
      return { route: url.pathname, html: await fetch(local).then((r) => r.text()) };
    }),
  );
}

const pages = values.dir
  ? await fromDir(values.dir)
  : values.url
    ? await fromUrl(values.url)
    : (() => {
        throw new Error('Pass --dir <built-dir> or --url <base-url>');
      })();

const report = auditPages(pages);

if (values['check-images']) {
  const imageIssues = await checkImages(report);
  report.errorCount += imageIssues.length;
  for (const issue of imageIssues) console.error(`  ✗ ${issue.message}`);
}

for (const page of report.pages) {
  if (page.issues.length === 0) continue;
  console.log(`\n${page.route}`);
  for (const issue of page.issues) {
    console.log(`  ${issue.severity === 'error' ? '✗' : '⚠'} ${issue.rule}: ${issue.message}`);
  }
}

const summary = `\n${pages.length} pages · ${report.errorCount} errors · ${report.warnCount} warnings`;
console.log(summary);

if (report.errorCount > 0) process.exit(1);
