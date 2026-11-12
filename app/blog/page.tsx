import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import NewsletterSignup from '@/components/ui/NewsletterSignup';
import ArticleCard from '@/components/blog/ArticleCard';

export const metadata: Metadata = {
  title: 'Blog de Peptídeos: guias de dose, reconstituição e GLP-1',
  description: 'Guias práticos sobre peptídeos: como reconstituir, quanto custa, como identificar produto falso, efeitos colaterais e comparações entre semaglutida, tirzepatida e outros.',
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
          <div className="grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
