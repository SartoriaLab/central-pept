import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks from '@/components/ui/RelatedLinks';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import { getGlossary, getGlossarySlugs, getGlossaryTerm } from '@/lib/glossary';
import { SITE_URL } from '@/lib/site';

type Params = { termo: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getGlossarySlugs().map((termo) => ({ termo }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { termo } = await params;
  const t = getGlossaryTerm(termo);
  if (!t) return { title: 'Termo não encontrado', robots: { index: false, follow: true } };
  const title = `${t.term}: o que é e para que serve`;
  const description = t.definition.length > 158 ? `${t.definition.slice(0, 155).trimEnd()}…` : t.definition;
  return {
    title,
    description,
    alternates: { canonical: `/glossario/${t.slug}` },
    openGraph: { title, description, url: `/glossario/${t.slug}`, type: 'article' },
  };
}

export default async function GlossaryTermPage({ params }: { params: Promise<Params> }) {
  const { termo } = await params;
  const t = getGlossaryTerm(termo);
  if (!t) notFound();

  const all = getGlossary();
  const related = (t.related ?? [])
    .map((slug) => getGlossaryTerm(slug))
    .filter((x): x is NonNullable<typeof x> => !!x);
  const index = all.findIndex((x) => x.slug === t.slug);
  const prev = index > 0 ? all[index - 1] : undefined;
  const next = index < all.length - 1 ? all[index + 1] : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.definition,
    url: `${SITE_URL}/glossario/${t.slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Glossário de peptídeos — Central Peptídeos',
      url: `${SITE_URL}/glossario`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <div className="mb-4">
            <Breadcrumb items={[{ label: 'Glossário', href: '/glossario' }, { label: t.term }]} siteUrl={SITE_URL} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Glossário</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">{t.term}</h1>
          <p className="mt-4 text-lg text-ink-2 leading-relaxed">{t.definition}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="prose-article">
          <h2>Entenda melhor</h2>
          {t.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {related.length > 0 && (
          <section className="mt-10" aria-labelledby="termos-relacionados">
            <h2 id="termos-relacionados" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">
              Termos relacionados
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/glossario/${r.slug}`} className="card-hover p-4 block group">
                  <span className="font-semibold text-ink group-hover:text-teal-700 transition-colors">{r.term}</span>
                  <p className="mt-1 text-sm text-ink-2 leading-snug line-clamp-2">{r.definition}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {t.links && t.links.length > 0 && <RelatedLinks links={t.links} title="Onde isso aparece no site" />}

        <nav aria-label="Outros termos" className="mt-12 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-3 text-sm">
          {prev ? (
            <Link href={`/glossario/${prev.slug}`} className="font-semibold text-teal-700 hover:underline">← {prev.term}</Link>
          ) : <span />}
          <Link href="/glossario" className="font-semibold text-ink-2 hover:text-teal-700">Todos os termos</Link>
          {next ? (
            <Link href={`/glossario/${next.slug}`} className="font-semibold text-teal-700 hover:underline">{next.term} →</Link>
          ) : <span />}
        </nav>

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
