import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleCard from '@/components/blog/ArticleCard';
import { notFound } from 'next/navigation';
import { getTagGroup, getTagGroups, MIN_TAG_ARTICLES } from '@/lib/articles';
import { socialImage } from '@/lib/og';

// Tags de tirzepatida: usam meta description própria.
const TIRZE_TAGS = new Set(['tirzepatida', 'mounjaro']);

type Params = { tag: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return getTagGroups().map((g) => ({ tag: g.slug }));
}

const plural = (n: number) => `${n} artigo${n > 1 ? 's' : ''}`;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag: slug } = await params;
  const group = getTagGroup(slug);
  if (!group) return { title: 'Tag não encontrada', robots: { index: false, follow: true } };
  const n = group.articles.length;
  const description = TIRZE_TAGS.has(slug)
    ? `Guias de tirzepatida (Mounjaro, Zepbound): preço por dose, onde comprar com procedência, reconstituição e como identificar produto falso. ${plural(n)}.`
    : `${plural(n)} da Central Peptídeos sobre ${group.label}: ${group.articles.slice(0, 3).map((a) => a.title).join('; ')}.`;
  return {
    title: `${group.label} — ${plural(n)}`,
    description,
    alternates: { canonical: `/blog/tag/${slug}` },
    // Tag com um artigo só repete o post: fica fora do índice, mas os links seguem valendo.
    ...(n < MIN_TAG_ARTICLES ? { robots: { index: false, follow: true } } : {}),
    ...socialImage('pagina', 'blog', `/blog/tag/${slug}`),
  };
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag: slug } = await params;
  const group = getTagGroup(slug);
  if (!group) notFound();
  const { label, articles } = group;
  const others = getTagGroups().filter((g) => g.slug !== slug && g.articles.length >= MIN_TAG_ARTICLES);

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
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">#{label}</h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            {plural(articles.length)} sobre {label}.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>

        {others.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Outras tags</h2>
            <div className="flex flex-wrap gap-2">
              {others.map((g) => (
                <Link
                  key={g.slug}
                  href={`/blog/tag/${g.slug}`}
                  className="inline-flex items-center gap-1.5 min-h-11 px-3 text-sm font-semibold rounded-full border border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  #{g.label} <span className="text-ink-3 tabular-nums">({g.articles.length})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
