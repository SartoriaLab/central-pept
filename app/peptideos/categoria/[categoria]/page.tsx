import type { Metadata } from 'next';
import { social } from '@/lib/og';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FAQ from '@/components/ui/FAQ';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import {
  getCategoryPage,
  getCategoryPages,
  getCategoryPageSlugs,
  getCategoryPeptides,
} from '@/lib/categories';
import { REGULATORY_LABELS } from '@/lib/peptides';
import { COMPARISONS } from '@/lib/comparisons';
import { getArticlesByPeptide, type Article } from '@/lib/articles';
import { getBrandsByPeptide } from '@/lib/brands';
import { SITE_URL } from '@/lib/site';

type Params = { categoria: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getCategoryPageSlugs().map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { categoria } = await params;
  const c = getCategoryPage(categoria);
  if (!c) return { title: 'Categoria não encontrada', robots: { index: false, follow: true } };
  const title = `${c.title}: lista, doses e comparação`;
  const description = c.summary.length > 158 ? `${c.summary.slice(0, 155).trimEnd()}…` : c.summary;
  return {
    title,
    description,
    alternates: { canonical: `/peptideos/categoria/${c.slug}` },
    ...social({ kind: 'categoria', slug: c.slug, path: `/peptideos/categoria/${c.slug}`, title, description }),
  };
}

const TONE_CLASS: Record<string, string> = {
  success: 'bg-green-50 text-green-800 border-green-200',
  neutral: 'bg-surface text-ink-2 border-border',
  warn: 'bg-amber-50 text-amber-900 border-amber-200',
  danger: 'bg-red-50 text-red-800 border-red-200',
};

const num = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { categoria } = await params;
  const c = getCategoryPage(categoria);
  if (!c) notFound();

  const peptides = getCategoryPeptides(c);
  const slugs = new Set(peptides.map((p) => p.slug));

  // Comparativos só entre peptídeos da categoria primeiro; depois os que tocam a categoria.
  const inside = COMPARISONS.filter((x) => x.peptideSlugs.every((s) => slugs.has(s)));
  const touching = COMPARISONS.filter((x) => !inside.includes(x) && x.peptideSlugs.some((s) => slugs.has(s)));
  const comparisons = [...inside, ...touching].slice(0, 10);

  const seen = new Set<string>();
  const articles: Article[] = [];
  for (const p of peptides) {
    for (const a of getArticlesByPeptide(p.slug)) {
      if (a.draft || seen.has(a.slug)) continue;
      seen.add(a.slug);
      articles.push(a);
    }
  }
  articles.sort((a, b) => (b.updatedAt ?? b.publishedAt).localeCompare(a.updatedAt ?? a.publishedAt));

  const brands = peptides.flatMap((p) => getBrandsByPeptide(p.slug));
  const others = getCategoryPages().filter((x) => x.slug !== c.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: c.title,
    description: c.summary,
    numberOfItems: peptides.length,
    itemListElement: peptides.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/peptideos/${p.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <div className="mb-4">
            <Breadcrumb items={[{ label: 'Peptídeos', href: '/peptideos' }, { label: c.label }]} siteUrl={SITE_URL} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">
            {peptides.length} {peptides.length === 1 ? 'peptídeo' : 'peptídeos'} · {c.label}
          </span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">{c.title}</h1>
          <p className="mt-4 text-lg text-ink-2 leading-relaxed max-w-3xl">{c.summary}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="prose-article">
          {c.intro.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <section className="mt-10" aria-labelledby="lista">
          <h2 id="lista" className="text-xl md:text-2xl font-bold mb-4">Lista comparada</h2>
          {/* relative: prende o sr-only do cabeçalho dentro da área de rolagem (senão alarga a página no celular) */}
          <div className="card overflow-x-auto relative">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                  <th scope="col" className="p-3 font-bold">Peptídeo</th>
                  <th scope="col" className="p-3 font-bold">Dose de referência</th>
                  <th scope="col" className="p-3 font-bold">Frequência</th>
                  <th scope="col" className="p-3 font-bold">Meia-vida</th>
                  <th scope="col" className="p-3 font-bold">Status</th>
                  <th scope="col" className="p-3 font-bold"><span className="sr-only">Calculadora</span></th>
                </tr>
              </thead>
              <tbody>
                {peptides.map((p) => {
                  const status = p.regulatoryStatus ? REGULATORY_LABELS[p.regulatoryStatus] : undefined;
                  return (
                    <tr key={p.slug} className="border-b border-border last:border-0 align-top">
                      <th scope="row" className="p-3 text-left font-semibold">
                        <Link href={`/peptideos/${p.slug}`} className="text-teal-700 hover:underline">{p.name}</Link>
                      </th>
                      <td className="p-3 tabular-nums whitespace-nowrap">{num(p.typicalDose)} {p.doseUnit}</td>
                      <td className="p-3 text-ink-2">{p.frequency}</td>
                      <td className="p-3 text-ink-2">{p.halfLife ?? '—'}</td>
                      <td className="p-3">
                        {status ? (
                          <span className={`inline-flex px-2 py-0.5 rounded-full border text-xs font-semibold whitespace-nowrap ${TONE_CLASS[status.tone]}`}>
                            {status.label}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <Link href={`/ferramentas/reconstituicao/${p.slug}`} className="font-semibold text-teal-700 hover:underline">
                          Calcular
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink-3">
            Dose de referência é o valor usado como padrão nas calculadoras do site, a partir de bulas e
            estudos — não é prescrição. Detalhes e fontes na ficha de cada peptídeo.
          </p>
        </section>

        <section className="mt-10" aria-labelledby="resumo-peptideos">
          <h2 id="resumo-peptideos" className="text-xl md:text-2xl font-bold mb-4">Cada peptídeo em uma frase</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {peptides.map((p) => (
              <Link key={p.slug} href={`/peptideos/${p.slug}`} className="card-hover p-4 block group">
                <span className="font-bold text-ink group-hover:text-teal-700 transition-colors">{p.name}</span>
                <p className="mt-1 text-sm text-ink-2 leading-snug">{p.shortDescription}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="pontos">
          <h2 id="pontos" className="text-xl md:text-2xl font-bold mb-3">O que pesa na avaliação</h2>
          <ul className="space-y-2 text-ink-2 list-disc pl-5 leading-relaxed">
            {c.keyPoints.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </section>


        {brands.length > 0 && (
          <section className="mt-10" aria-labelledby="marcas">
            <h2 id="marcas" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Marcas comerciais</h2>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <Link
                  key={b.slug}
                  href={`/medicamentos/${b.slug}`}
                  className="chip-lg"
                >
                  {b.name} ({b.activeIngredient.toLowerCase()})
                </Link>
              ))}
            </div>
          </section>
        )}

        {comparisons.length > 0 && (
          <section className="mt-10" aria-labelledby="comparativos">
            <h2 id="comparativos" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Comparativos</h2>
            <div className="flex flex-wrap gap-2">
              {comparisons.map((x) => (
                <Link
                  key={x.slug}
                  href={`/comparar/${x.slug}`}
                  className="chip-lg"
                >
                  {x.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        {articles.length > 0 && (
          <section className="mt-10" aria-labelledby="guias">
            <h2 id="guias" className="text-xl md:text-2xl font-bold mb-4">Guias e artigos</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {articles.slice(0, 10).map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`} className="card-hover p-4 block group">
                  <span className="font-semibold text-ink group-hover:text-teal-700 transition-colors leading-snug">{a.title}</span>
                  <p className="mt-1 text-sm text-ink-2 leading-snug line-clamp-2">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <FAQ items={c.faq} />

        <section className="mt-10" aria-labelledby="outras-categorias">
          <h2 id="outras-categorias" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Outros objetivos</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/peptideos/categoria/${o.slug}`}
                className="chip-lg"
              >
                {o.label}
              </Link>
            ))}
            <Link
              href="/peptideos"
              className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full border border-teal bg-teal-50 text-teal-700 hover:bg-teal hover:text-white transition-colors"
            >
              Todos os peptídeos
            </Link>
          </div>
        </section>

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
