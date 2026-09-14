import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Comparator from '@/components/peptide/Comparator';
import {
  getPeptides,
  getPeptideBySlug,
  CATEGORY_LABELS,
  REGULATORY_LABELS,
  type Peptide,
} from '@/lib/peptides';
import { COMPARISONS, getComparison, getComparisonSlugs } from '@/lib/comparisons';
import { getArticleBySlug } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import Breadcrumb from '@/components/ui/Breadcrumb';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import AffiliateBox from '@/components/affiliate/AffiliateBox';
import WhatsAppStickyBar from '@/components/affiliate/WhatsAppStickyBar';
import { PEPTIDE_COPY } from '@/lib/affiliates';
import { SITE_URL } from '@/lib/site';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getComparisonSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return { title: 'Comparação não encontrada', robots: { index: false, follow: true } };
  const names = c.peptideSlugs.map((s) => getPeptideBySlug(s)?.name ?? s).join(' e ');
  const description = `Compare ${names} lado a lado: mecanismo, dose, meia-vida, efeitos colaterais e status regulatório. Tabela objetiva, em português.`;
  return {
    title: `${c.title}: comparativo completo`,
    description,
    alternates: { canonical: `/comparar/${slug}` },
    openGraph: {
      title: `${c.title} — comparativo`,
      description,
      url: `/comparar/${slug}`,
      images: [{ url: `/api/og?title=${encodeURIComponent(c.title)}&eyebrow=Comparativo`, width: 1200, height: 630, alt: c.title }],
    },
  };
}

function categoryLabel(p: Peptide): string {
  return p.category && p.category in CATEGORY_LABELS
    ? CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS]
    : 'peptídeo';
}

function regLabel(p: Peptide): string {
  return p.regulatoryStatus ? REGULATORY_LABELS[p.regulatoryStatus].label : 'sem classificação regulatória definida';
}

function buildComparisonFaq(items: Peptide[]): FAQItem[] {
  if (items.length < 2) return [];
  const [a, b] = items;
  return [
    {
      q: `Qual a diferença entre ${a.name} e ${b.name}?`,
      a: `${a.name} é da categoria "${categoryLabel(a)}": ${a.shortDescription} Já ${b.name} é "${categoryLabel(b)}": ${b.shortDescription} ${
        a.category === b.category
          ? 'Ambos pertencem à mesma categoria, mas diferem em dose, meia-vida e perfil de efeitos — veja a tabela acima.'
          : 'São de categorias e finalidades diferentes.'
      }`,
    },
    {
      q: `${a.name} ou ${b.name}: qual a dose típica?`,
      a: `A dose típica de ${a.name} é ${a.typicalDose} ${a.doseUnit} (${a.frequency}). A de ${b.name} é ${b.typicalDose} ${b.doseUnit} (${b.frequency}). Use a calculadora de reconstituição para converter isso em unidades na seringa.`,
    },
    {
      q: `${a.name} e ${b.name} são aprovados por agências reguladoras?`,
      a: `${a.name}: ${regLabel(a)}. ${b.name}: ${regLabel(b)}. Consulte a ficha de cada um para o detalhamento e as referências primárias.`,
    },
    {
      q: `Posso combinar ${a.name} e ${b.name}?`,
      a: `Não é uma decisão para tomar "no olho". Combinar peptídeos exige avaliar compatibilidade, estabilidade, dose e frequência de cada um, idealmente com orientação profissional. Este comparativo é informativo e não recomenda protocolos.`,
    },
  ];
}

export default async function ComparisonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  const peptides = getPeptides();
  const items = c.peptideSlugs
    .map((s) => getPeptideBySlug(s))
    .filter((p): p is Peptide => !!p);
  const faq = buildComparisonFaq(items);
  const post = c.relatedPost ? getArticleBySlug(c.relatedPost) : undefined;
  const others = COMPARISONS.filter((x) => x.slug !== c.slug);
  const ctaPeptide = c.peptideSlugs.find((s) => s in PEPTIDE_COPY);

  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <div className="mb-4">
            <Breadcrumb items={[{ label: 'Comparar', href: '/comparar' }, { label: c.title }]} siteUrl={SITE_URL} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Comparativo</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {c.title}
          </h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            {items.map((p) => p.name).join(' e ')} lado a lado: mecanismo, dose,
            meia-vida, efeitos e status regulatório numa tabela única.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <Comparator peptides={peptides} initialSlugs={c.peptideSlugs} />

        {post && (
          <Link
            href={`/blog/${post.slug}`}
            className="mt-8 card-hover p-5 flex items-start gap-4 group"
          >
            <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" /></svg>
            </span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">Guia completo</div>
              <div className="font-bold text-ink group-hover:text-teal-700 transition-colors leading-snug">{post.title}</div>
              <p className="mt-1 text-sm text-ink-2 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        )}

        <div className="mt-8">
          <AffiliateBox
            productId="fornecedor_oficial"
            slot={`comparar-${slug}`}
            peptide={ctaPeptide}
          />
        </div>

        {ctaPeptide && (
          <WhatsAppStickyBar
            productId="fornecedor_oficial"
            slot={`sticky-comparar-${slug}`}
            peptide={ctaPeptide}
          />
        )}

        <FAQ items={faq} title={`Perguntas frequentes: ${c.title}`} />

        <section className="mt-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Outras comparações</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/comparar/${o.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 transition-colors"
              >
                {o.title}
              </Link>
            ))}
          </div>
        </section>

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
