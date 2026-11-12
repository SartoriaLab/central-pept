import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artigos e guias sobre peptídeos: reconstituição, comparações, armazenamento e protocolos.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const articles = getArticles();

  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Blog</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Artigos e guias
          </h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            Conteúdo aprofundado sobre reconstituição, comparações entre peptídeos,
            armazenamento e protocolos. Tudo com fontes.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="mb-10">
          <NewsletterSignup />
        </div>

        {articles.length === 0 ? (
          <div className="card p-10 text-center text-ink-3">
            Primeiros artigos em breve.
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
                    {a.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider text-ink-3">
                        #{tag}
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
      </div>
    </>
  );
}
