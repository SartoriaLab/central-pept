import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticles, type Article } from '@/lib/articles';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

// Tags em que o CTA usa a copy de tirzepatida (leads do fornecedor).
const TIRZE_TAGS = new Set(['tirzepatida', 'mounjaro']);

type Params = { tag: string };

function allTags(): string[] {
  const set = new Set<string>();
  for (const a of getArticles()) {
    for (const t of a.tags) set.add(slugify(t));
  }
  return Array.from(set);
}

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
}

function unSlugify(slug: string, tags: string[]): string | null {
  return tags.find((t) => slugify(t) === slug) || null;
}

function articlesForTagSlug(tagSlug: string): { tag: string | null; articles: Article[] } {
  const all = getArticles();
  const tags = Array.from(new Set(all.flatMap((a) => a.tags)));
  const tag = unSlugify(tagSlug, tags);
  if (!tag) return { tag: null, articles: [] };
  const articles = all.filter((a) => a.tags.includes(tag));
  return { tag, articles };
}

export async function generateStaticParams(): Promise<Params[]> {
  return allTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const { tag, articles } = articlesForTagSlug(tagSlug);
  if (!tag) return { title: 'Tag não encontrada', robots: { index: false, follow: true } };
  const description = TIRZE_TAGS.has(tagSlug)
    ? `Guias de tirzepatida (Mounjaro, Zepbound): preço por dose, onde comprar com procedência, reconstituição e como identificar produto falso. ${articles.length} artigos.`
    : `Artigos e guias da Central Peptídeos com a tag "${tag}".`;
  return {
    title: `${tag} — ${articles.length} artigo${articles.length > 1 ? 's' : ''}`,
    description,
    alternates: { canonical: `/blog/tag/${tagSlug}` },
  };
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag: tagSlug } = await params;
  const { tag, articles } = articlesForTagSlug(tagSlug);
  if (!tag) notFound();

  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <nav className="text-sm text-ink-3 mb-4 flex items-center gap-1.5">
            <Link href="/blog" className="hover:text-teal-700">Blog</Link>
            <span>/</span>
            <span className="text-ink-2">Tag</span>
          </nav>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Tag</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            #{tag}
          </h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            {articles.length} artigo{articles.length > 1 ? 's' : ''} relacionado{articles.length > 1 ? 's' : ''} a {tag}.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {TIRZE_TAGS.has(tagSlug) && (
          <div className="mb-8">
            <AffiliateBox
              productId="fornecedor_oficial"
              slot={`tag-${tagSlug}`}
              peptide="tirzepatida"
            />
          </div>
        )}

        {articles.length === 0 ? (
          <div className="card p-10 text-center text-ink-3">
            Nenhum artigo com esta tag ainda.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group card-hover block overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-br ${a.coverColor || 'from-teal-500/20 to-teal-500/0'} relative`}>
                  <div className="absolute inset-0 bg-dots opacity-30" aria-hidden />
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {a.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-bold text-lg leading-tight group-hover:text-teal-700 transition-colors line-clamp-2">
                    {a.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-2 line-clamp-2 leading-relaxed">
                    {a.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-ink-3">
                    <time dateTime={a.publishedAt}>
                      {new Date(a.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </time>
                    <span>·</span>
                    <span>{a.readMinutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Outras tags</h3>
          <AllTags currentTagSlug={tagSlug} />
        </div>
      </div>
    </>
  );
}

function AllTags({ currentTagSlug }: { currentTagSlug: string }) {
  const all = getArticles();
  const tagCounts: Record<string, { label: string; count: number }> = {};
  for (const a of all) {
    for (const t of a.tags) {
      const slug = slugify(t);
      if (!tagCounts[slug]) tagCounts[slug] = { label: t, count: 0 };
      tagCounts[slug].count += 1;
    }
  }
  const sorted = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .filter(([slug]) => slug !== currentTagSlug);

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map(([slug, { label, count }]) => (
        <Link
          key={slug}
          href={`/blog/tag/${slug}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 transition-colors"
        >
          #{label} <span className="text-ink-3 tabular-nums">({count})</span>
        </Link>
      ))}
    </div>
  );
}
