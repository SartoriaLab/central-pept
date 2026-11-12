import Link from 'next/link';
import { articleOgImageUrl, getRelatedArticles, type Article } from '@/lib/articles';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import ShareButtons from '@/components/ui/ShareButtons';
import RelatedPosts from '@/components/blog/RelatedPosts';
import Breadcrumb from '@/components/ui/Breadcrumb';

const SITE = process.env.SITE_URL || 'https://centralpeptideos.com.br';

type Props = {
  article: Article;
  children: React.ReactNode;
};

export default function ArticleLayout({ article, children }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [`${SITE}${articleOgImageUrl(article)}`],
    datePublished: article.publishedAt.includes('T') ? article.publishedAt : `${article.publishedAt}T00:00:00-03:00`,
    dateModified: (() => { const d = article.updatedAt || article.publishedAt; return d.includes('T') ? d : `${d}T00:00:00-03:00`; })(),
    author: article.author
      ? {
          '@type': 'Person',
          name: article.author.name,
          ...(article.author.url ? { url: article.author.url } : {}),
          ...(article.author.credentials ? { jobTitle: article.author.credentials } : {}),
        }
      : { '@type': 'Organization', name: 'Central Peptídeos' },
    ...(article.reviewedBy && {
      reviewedBy: {
        '@type': 'Person',
        name: article.reviewedBy.name,
        ...(article.reviewedBy.url ? { url: article.reviewedBy.url } : {}),
        ...(article.reviewedBy.credentials ? { jobTitle: article.reviewedBy.credentials } : {}),
      },
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Central Peptídeos',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blog/${article.slug}` },
    keywords: article.tags.join(', '),
  };

  const related = getRelatedArticles(article);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className={`bg-gradient-to-br ${article.coverColor || 'from-teal-500/20 to-teal-500/0'} border-b border-border`}>
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-8 pb-10 md:pt-12 md:pb-14">
          <div className="mb-5">
            <Breadcrumb
              items={[{ label: 'Blog', href: '/blog' }, { label: article.title }]}
              siteUrl={SITE}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => {
              const slug = tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
              return (
                <Link
                  key={tag}
                  href={`/blog/tag/${slug}`}
                  className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface/70 backdrop-blur text-ink-2 border border-border hover:border-teal hover:text-teal-700 transition-colors"
                >
                  #{tag}
                </Link>
              );
            })}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-[1.1]">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-ink-2 leading-relaxed">{article.excerpt}</p>
          {article.draft && (
            <div className="mt-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
              <strong>Rascunho em revisão.</strong> Este artigo ainda não passou por revisão editorial final — informações podem ser ajustadas. Use como referência, não como guia definitivo.
            </div>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-3">
            <time dateTime={article.publishedAt}>
              {article.updatedAt ? 'Atualizado em ' : 'Publicado em '}
              {new Date(article.updatedAt || article.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </time>
            <span>·</span>
            <span>{article.readMinutes} min de leitura</span>
            {article.author && (
              <>
                <span>·</span>
                <span>
                  por{' '}
                  {article.author.url ? (
                    <a href={article.author.url} target="_blank" rel="noreferrer noopener" className="text-teal-700 hover:underline font-semibold">
                      {article.author.name}
                    </a>
                  ) : (
                    <span className="font-semibold">{article.author.name}</span>
                  )}
                  {article.author.credentials && <span className="text-ink-3">, {article.author.credentials}</span>}
                </span>
              </>
            )}
            {article.reviewedBy && (
              <>
                <span>·</span>
                <span>
                  Revisado por{' '}
                  <span className="font-semibold">{article.reviewedBy.name}</span>
                  {article.reviewedBy.credentials && <span className="text-ink-3">, {article.reviewedBy.credentials}</span>}
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Corpo */}
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-12 prose-article">
        {article.tldr && (
          <aside className="not-prose mb-8 p-5 rounded-xl bg-teal-50 border-l-4 border-teal" aria-label="Resumo">
            <div className="flex items-center gap-2 mb-1.5">
              <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-teal-700">
                <path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Resumo rápido</span>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed">{article.tldr}</p>
          </aside>
        )}
        {children}

        {/* Social share */}
        <div className="mt-10 pt-8 border-t border-border not-prose">
          <ShareButtons title={article.title} url={`/blog/${article.slug}`} />
        </div>

        {/* Peptídeos relacionados */}
        {article.relatedPeptides && article.relatedPeptides.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border not-prose">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">
              Peptídeos citados neste artigo
            </h2>
            <div className="flex flex-wrap gap-2">
              {article.relatedPeptides.map((slug) => (
                <Link
                  key={slug}
                  href={`/peptideos/${slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  {slug}
                  <svg viewBox="0 0 20 20" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10h10M10 5l5 5-5 5" /></svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        <RelatedPosts posts={related} />

        <MedicalDisclaimer variant="prominent" />
      </article>
    </>
  );
}
