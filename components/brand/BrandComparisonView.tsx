// Página "Marca A vs Marca B" (/comparar/<slug>), montada só com dados de lib/brands.ts e
// lib/titration.ts. A rota app/comparar/[slug]/page.tsx escolhe entre esta e a de moléculas.

import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import ShareButtons from '@/components/ui/ShareButtons';
import EbookOffer from '@/components/ebook/EbookOffer';
import { ebookForPeptide, offerFor } from '@/lib/ebooks';
import { getArticleBySlug } from '@/lib/articles';
import { getBrandComparisons, type ResolvedBrandComparison } from '@/lib/brand-comparisons';
import { getTitrationScheme } from '@/lib/titration';
import { SITE_URL } from '@/lib/site';
import type { Brand } from '@/lib/brands';

const num = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

function ladder(b: Brand): string {
  const s = getTitrationScheme(b.titrationSchemeId);
  if (!s) return b.maintenance;
  return `${s.steps.map((st) => num(st.dose)).join(' → ')} mg`;
}

const ROWS: { label: string; value: (b: Brand) => string }[] = [
  { label: 'Princípio ativo', value: (b) => b.activeIngredient },
  { label: 'Fabricante', value: (b) => b.manufacturer },
  { label: 'Classe', value: (b) => b.drugClass },
  { label: 'Aprovação na FDA', value: (b) => String(b.fdaApprovalYear) },
  { label: 'Indicações (bula FDA)', value: (b) => b.indications.join('; ') },
  { label: 'Apresentação', value: (b) => b.presentation },
  { label: 'Subida de dose (bula)', value: ladder },
  { label: 'Dose de manutenção', value: (b) => b.maintenance },
];

export function brandComparisonFaq(c: ResolvedBrandComparison): FAQItem[] {
  const { a, b } = c;
  const same = a.peptideSlug === b.peptideSlug;
  const faq: FAQItem[] = [
    { q: `Qual a diferença entre ${a.name} e ${b.name}?`, a: c.differenceText },
    {
      q: `${a.name} e ${b.name} têm o mesmo princípio ativo?`,
      a: same
        ? `Sim. Os dois são ${a.activeIngredient.toLowerCase()}, da ${a.manufacturer}. Mudam a indicação em bula, a apresentação e as doses de manutenção.`
        : `Não. ${a.name} é ${a.activeIngredient.toLowerCase()} (${a.manufacturer}) e ${b.name} é ${b.activeIngredient.toLowerCase()} (${b.manufacturer}).`,
    },
  ];
  if (c.headToHeadResult) {
    faq.push({
      q: `Qual emagrece mais, ${a.name} ou ${b.name}?`,
      a: `No estudo ${c.headToHeadResult.trial}: ${c.headToHeadResult.result} São médias de grupo, não promessa para uma pessoa.`,
    });
  }
  faq.push(
    {
      q: `Posso trocar ${a.name} por ${b.name}?`,
      a: `Só com orientação médica. ${same ? 'Mesmo com a mesma molécula, as doses e a indicação podem ser diferentes.' : 'As doses das duas não se convertem uma na outra, e a troca costuma recomeçar a subida de dose.'} A decisão depende do diagnóstico e da resposta de cada pessoa.`,
    },
    { q: `${a.name} e ${b.name} são vendidos no Brasil?`, a: `${a.name}: ${a.brazil} ${b.name}: ${b.brazil}` },
  );
  return faq;
}

export default function BrandComparisonView({ c }: { c: ResolvedBrandComparison }) {
  const { a, b } = c;
  const faq = brandComparisonFaq(c);
  const post = c.relatedPost ? getArticleBySlug(c.relatedPost) : undefined;
  const others = getBrandComparisons().filter((o) => o.slug !== c.slug);
  const molecule = a.peptideSlug === b.peptideSlug ? null : `${a.peptideSlug}-vs-${b.peptideSlug}`;

  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <div className="mb-4">
            <Breadcrumb items={[{ label: 'Comparar', href: '/comparar' }, { label: c.title }]} siteUrl={SITE_URL} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Comparativo de marcas</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {c.title}: qual a diferença
          </h1>
          <p className="mt-4 text-lg text-ink-2 max-w-3xl leading-relaxed">{c.differenceText}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <section aria-labelledby="tabela-marcas">
          <h2 id="tabela-marcas" className="text-xl md:text-2xl font-bold mb-4">Lado a lado</h2>
          <div className="card overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                  <th scope="col" className="p-2 sm:p-3 font-bold w-24 sm:w-44" />
                  {[a, b].map((x) => (
                    <th key={x.slug} scope="col" className="p-2 sm:p-3 font-bold text-ink text-base normal-case tracking-normal">
                      <Link href={`/medicamentos/${x.slug}`} className="hover:text-teal-700">{x.name}</Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.label} className="border-b border-border last:border-0 align-top">
                    <th scope="row" className="p-2 sm:p-3 text-left text-ink-3 font-semibold break-words hyphens-auto">{r.label}</th>
                    <td className="p-2 sm:p-3 text-ink-2 leading-relaxed break-words">{r.value(a)}</td>
                    <td className="p-2 sm:p-3 text-ink-2 leading-relaxed break-words">{r.value(b)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {c.headToHeadResult && (
          <section className="mt-8 rounded-xl border border-teal-100 bg-teal-50 p-5" aria-labelledby="frente-a-frente">
            <h2 id="frente-a-frente" className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Comparação direta: {c.headToHeadResult.trial}
            </h2>
            <p className="mt-2 text-ink leading-relaxed">{c.headToHeadResult.result}</p>
            <p className="mt-2 text-xs text-ink-3">Médias dos grupos do estudo, não resultado garantido para uma pessoa.</p>
          </section>
        )}

        <EbookOffer offer={offerFor(ebookForPeptide(a.peptideSlug), { pen: true })} className="!my-8" />

        <section className="mt-10 grid gap-4 md:grid-cols-2" aria-label="Situação no Brasil e estudos">
          {[a, b].map((x) => (
            <div key={x.slug} className="card p-5">
              <h2 className="font-bold text-ink">{x.name}</h2>
              <p className="mt-2 text-sm text-ink-2 leading-relaxed"><strong className="text-ink">No Brasil:</strong> {x.brazil}</p>
              <ul className="mt-3 space-y-2 text-sm text-ink-2">
                {x.evidence.slice(0, 2).map((e) => (
                  <li key={e.trial}><strong className="text-ink">{e.trial}:</strong> {e.result}</li>
                ))}
              </ul>
              <Link href={`/medicamentos/${x.slug}`} className="mt-3 inline-block text-sm font-semibold text-teal-700 hover:underline">
                Tudo sobre {x.name} →
              </Link>
            </div>
          ))}
        </section>

        <div className="mt-8 flex flex-wrap gap-2">
          {molecule && (
            <Link href={`/comparar/${molecule}`} className="chip-lg">{a.activeIngredient} vs {b.activeIngredient}</Link>
          )}
          <Link href={`/ferramentas/reconstituicao/${a.peptideSlug}`} className="chip-lg">Calculadora de {a.activeIngredient.toLowerCase()}</Link>
          {post && <Link href={`/blog/${post.slug}`} className="chip-lg">{post.title}</Link>}
        </div>

        <div className="mt-8">
          <ShareButtons title={`${c.title}: qual a diferença`} url={`/comparar/${c.slug}`} />
        </div>

        <FAQ items={faq} title={`Perguntas frequentes: ${c.title}`} />

        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Outras comparações de marcas</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link key={o.slug} href={`/comparar/${o.slug}`} className="chip-lg">{o.title}</Link>
            ))}
          </div>
        </section>

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
