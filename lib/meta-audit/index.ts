import { parseHTML } from 'linkedom';

export type Severity = 'error' | 'warn';

export type PageMeta = {
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  h1Count: number;
  og: Record<string, string>;
  twitter: Record<string, string>;
};

export type Issue = { rule: string; severity: Severity; message: string };
export type PageInput = { route: string; html: string };
export type PageReport = { route: string; meta: PageMeta; issues: Issue[] };
export type Report = {
  pages: PageReport[];
  errorCount: number;
  warnCount: number;
  ok: boolean;
};

/** Pull every meta signal we care about out of a rendered page. */
export function extractMeta(html: string): PageMeta {
  const { document } = parseHTML(html);

  const attr = (selector: string, name: string) =>
    document.querySelector(selector)?.getAttribute(name)?.trim() || null;

  const collect = (prefix: string) => {
    const out: Record<string, string> = {};
    const nodes = document.querySelectorAll(`meta[property^="${prefix}"], meta[name^="${prefix}"]`);
    for (const el of nodes) {
      const key = el.getAttribute('property') ?? el.getAttribute('name');
      const value = el.getAttribute('content')?.trim();
      if (key && value) out[key] = value;
    }
    return out;
  };

  return {
    title: document.querySelector('title')?.textContent?.trim() || null,
    description: attr('meta[name="description"]', 'content'),
    canonical: attr('link[rel="canonical"]', 'href'),
    robots: attr('meta[name="robots"]', 'content'),
    h1Count: document.querySelectorAll('h1').length,
    og: collect('og:'),
    twitter: collect('twitter:'),
  };
}

const isAbsolute = (url: string) => /^https?:\/\//i.test(url);

type Rule = {
  id: string;
  severity: Severity;
  /** Return a message when the rule is violated, or null when it passes. */
  check: (m: PageMeta) => string | null;
};

/** The house standard. Adjust per project in `.altalogy/`, not per page. */
export const RULES: Rule[] = [
  {
    id: 'title',
    severity: 'error',
    check: (m) =>
      !m.title
        ? 'missing <title>'
        : m.title.length > 60
          ? `title is ${m.title.length} chars (max 60)`
          : m.title.length < 10
            ? `title is only ${m.title.length} chars`
            : null,
  },
  {
    id: 'description',
    severity: 'error',
    check: (m) =>
      !m.description
        ? 'missing meta description'
        : m.description.length > 160
          ? `description is ${m.description.length} chars (max 160)`
          : m.description.length < 50
            ? `description is only ${m.description.length} chars`
            : null,
  },
  {
    id: 'canonical',
    severity: 'error',
    check: (m) =>
      !m.canonical
        ? 'missing <link rel="canonical">'
        : !isAbsolute(m.canonical)
          ? `canonical must be absolute (got "${m.canonical}")`
          : null,
  },
  {
    id: 'og:title',
    severity: 'error',
    check: (m) => (m.og['og:title'] ? null : 'missing og:title'),
  },
  {
    id: 'og:description',
    severity: 'error',
    check: (m) => (m.og['og:description'] ? null : 'missing og:description'),
  },
  {
    id: 'og:image',
    severity: 'error',
    check: (m) => {
      const image = m.og['og:image'];
      if (!image) return 'missing og:image';
      if (!isAbsolute(image)) return `og:image must be absolute (got "${image}")`;
      return null;
    },
  },
  {
    id: 'og:type',
    severity: 'warn',
    check: (m) => (m.og['og:type'] ? null : 'missing og:type'),
  },
  {
    id: 'twitter:card',
    severity: 'warn',
    check: (m) =>
      m.twitter['twitter:card'] ? null : 'missing twitter:card (social previews degrade)',
  },
  {
    id: 'h1',
    severity: 'warn',
    check: (m) =>
      m.h1Count === 1 ? null : m.h1Count === 0 ? 'no <h1>' : `${m.h1Count} <h1> elements`,
  },
  {
    id: 'noindex',
    severity: 'warn',
    check: (m) => (m.robots?.includes('noindex') ? 'page is noindex' : null),
  },
];

export function auditPage({ route, html }: PageInput): PageReport {
  const meta = extractMeta(html);
  const issues: Issue[] = [];

  for (const rule of RULES) {
    const message = rule.check(meta);
    if (message) issues.push({ rule: rule.id, severity: rule.severity, message });
  }

  return { route, meta, issues };
}

export function auditPages(inputs: PageInput[]): Report {
  const pages = inputs.map(auditPage).sort((a, b) => a.route.localeCompare(b.route));
  const all = pages.flatMap((p) => p.issues);
  const errorCount = all.filter((i) => i.severity === 'error').length;
  const warnCount = all.filter((i) => i.severity === 'warn').length;

  return { pages, errorCount, warnCount, ok: errorCount === 0 };
}

/**
 * Optional I/O step, kept out of the pure core: confirm each distinct og:image
 * actually resolves. Catches the classic "OG image 404s in production" bug.
 */
export async function checkImages(report: Report): Promise<Issue[]> {
  const urls = new Set(
    report.pages.map((p) => p.meta.og['og:image']).filter((u): u is string => Boolean(u)),
  );

  const results = await Promise.all(
    [...urls].map(async (url) => {
      try {
        let res = await fetch(url, { method: 'HEAD' });
        if (res.status === 405) res = await fetch(url, { method: 'GET' });
        return res.ok ? null : { url, status: res.status };
      } catch {
        return { url, status: 0 };
      }
    }),
  );

  return results
    .filter((r): r is { url: string; status: number } => r !== null)
    .map((r) => ({
      rule: 'og:image',
      severity: 'error' as const,
      message: `og:image unreachable (${r.status || 'network error'}): ${r.url}`,
    }));
}
