import { getArticles } from '@/lib/articles';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const articles = getArticles().filter((a) => !a.draft);
  const updated = articles[0]?.updatedAt || articles[0]?.publishedAt || new Date().toISOString();

  const items = articles.map((a) => {
    const url = `${SITE_URL}/blog/${a.slug}`;
    return `
    <item>
      <title>${escape(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(a.excerpt)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      ${a.tags.map((t) => `<category>${escape(t)}</category>`).join('\n      ')}
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Central Peptídeos — Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Artigos, guias e comparativos sobre peptídeos: reconstituição, dosagem, efeitos e regulação.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <ttl>60</ttl>${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
