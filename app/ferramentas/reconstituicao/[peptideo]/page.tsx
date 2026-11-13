import type { Metadata } from 'next';
import { social } from '@/lib/og';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import ToolSchema from '@/components/ui/ToolSchema';
import ReconstitutionCalculator from '@/components/calculator/ReconstitutionCalculator';
import { calcByVolume, doseToMg, fmt, fmtConcentration } from '@/components/calculator/calc';
import {
  getPeptideBySlug,
  getPeptideSlugs,
  getPeptides,
  REGULATORY_LABELS,
  type Peptide,
} from '@/lib/peptides';
import { getArticlesByPeptide } from '@/lib/articles';
import { COMPARISONS } from '@/lib/comparisons';
import { doseLabel as titrationDoseLabel, getTitrationDoses, getTitrationFrequency } from '@/lib/titration';
import { SITE_URL } from '@/lib/site';
import { vialPath } from '@/lib/vials';
import { dosePath, getPageDoses } from '@/lib/dose-pages';

type Params = { peptideo: string };

// Volumes de água usados nas tabelas prontas (ml).
const WATER_VOLUMES = [1, 2, 3];

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getPeptideSlugs().map((peptideo) => ({ peptideo }));
}

const doseLabel = (p: Peptide, dose = p.typicalDose) => `${fmt(dose, 2)} ${p.doseUnit}`;
const vialsLabel = (p: Peptide) => p.commonAmounts.map((a) => `${fmt(a, 2)} mg`).join(', ');

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { peptideo } = await params;
  const p = getPeptideBySlug(peptideo);
  if (!p) return { title: 'Calculadora não encontrada', robots: { index: false, follow: true } };
  const title = `Calculadora de ${p.name}: quantas unidades puxar na seringa`;
  const description = `Calcule a reconstituição de ${p.name}: frasco de ${vialsLabel(p)}, água bacteriostática e dose de ${doseLabel(p)} convertidos em unidades na seringa U100. Tabela pronta e cálculo em tempo real.`;
  return {
    title,
    description,
    alternates: { canonical: `/ferramentas/reconstituicao/${p.slug}` },
    ...social({ kind: 'calculadora', slug: p.slug, path: `/ferramentas/reconstituicao/${p.slug}`, title, description }),
  };
}

type Row = { vial: number; water: number; concentration: number; units: number; doses: number };

function buildRows(p: Peptide): Row[] {
  const doseMg = doseToMg(p.typicalDose, p.doseUnit);
  const rows: Row[] = [];
  for (const vial of p.commonAmounts) {
    for (const water of WATER_VOLUMES) {
      const r = calcByVolume(vial, water, doseMg);
      if (r) rows.push({ vial, water, concentration: r.concentration, units: r.unitsPerDose, doses: r.dosesPerVial });
    }
  }
  return rows;
}

// Linha mais confortável de medir: unidades por dose o mais perto possível da faixa 10-50 U.
function pickExample(rows: Row[]): Row | undefined {
  const score = (r: Row) => (r.units >= 10 && r.units <= 50 ? 0 : r.units < 10 ? 10 - r.units : r.units - 50);
  return [...rows].sort((a, b) => score(a) - score(b))[0];
}

function unitsNote(units: number): string | null {
  if (units > 100) return 'passa de 100 U: use menos água ou divida em duas aplicações';
  if (units < 5) return 'volume muito pequeno: use mais água para medir com precisão';
  return null;
}

function buildFaq(p: Peptide, rows: Row[], example: Row | undefined): FAQItem[] {
  const items: FAQItem[] = [];
  if (example) {
    items.push({
      q: `Quantas unidades de ${p.name} devo puxar na seringa?`,
      a: `Depende da concentração que você preparou. Exemplo: frasco de ${fmt(example.vial, 2)} mg com ${fmt(example.water, 1)} ml de água bacteriostática fica com ${fmtConcentration(example.concentration)} mg/ml; a dose de ${doseLabel(p)} equivale a ${fmt(example.units, 1)} unidades (${fmt(example.units / 100, 3)} ml) numa seringa de insulina U100. Com outra quantidade de água, as unidades mudam na mesma proporção — a calculadora acima refaz a conta.`,
    });
    const sameVial = rows.filter((r) => r.vial === example.vial);
    items.push({
      q: `Quanta água bacteriostática colocar no frasco de ${p.name}?`,
      a: `Não existe um volume único correto: a água não altera a quantidade de peptídeo no frasco, só a concentração. Para o frasco de ${fmt(example.vial, 2)} mg e dose de ${doseLabel(p)}: ${sameVial
        .map((r) => `${fmt(r.water, 1)} ml de água = ${fmt(r.units, 1)} U por dose`)
        .join('; ')}. Prefira o volume que deixa a dose entre 10 e 50 unidades, faixa mais fácil de medir com precisão.`,
    });
    items.push({
      q: `Quantas doses rende um frasco de ${p.name}?`,
      a: `${p.commonAmounts
        .map((v) => `Frasco de ${fmt(v, 2)} mg ÷ dose de ${doseLabel(p)} = ${fmt(v / doseToMg(p.typicalDose, p.doseUnit), 1)} doses`)
        .join('. ')}. O número de doses não depende da água adicionada. Frequência de referência: ${p.frequency}.`,
    });
  }
  items.push({
    q: `Qual a dose típica de ${p.name}?`,
    a: `A dose de referência usada nesta calculadora é ${doseLabel(p)} (${p.frequency})${
      p.doseRange ? `, dentro da faixa descrita na literatura de ${p.doseRange}` : ''
    }. É um valor de referência de estudos e bulas, não uma recomendação individual — a dose real deve ser definida com profissional de saúde.`,
  });
  if (p.regulatoryStatus) {
    items.push({
      q: `${p.name} é aprovado por agências reguladoras?`,
      a: `Status atual: ${REGULATORY_LABELS[p.regulatoryStatus].label}.${
        p.wadaProhibited ? ' Consta na Lista Proibida da WADA para esporte competitivo.' : ''
      } A ficha completa traz o detalhamento e as referências primárias.`,
      link: { label: `Ficha de ${p.name}`, href: `/peptideos/${p.slug}` },
    });
  }
  items.push({
    q: 'Por quanto tempo o frasco reconstituído pode ser usado?',
    a: 'Como regra geral, frascos reconstituídos com água bacteriostática ficam na geladeira (2-8 °C), protegidos da luz, e são usados em até 28 dias. Não congele depois de reconstituir. A estabilidade exata varia por peptídeo e por fabricante.',
    link: { label: 'Guia da água bacteriostática', href: '/blog/agua-bacteriostatica-guia' },
  });
  return items;
}

export default async function PeptideReconstitutionPage({ params }: { params: Promise<Params> }) {
  const { peptideo } = await params;
  const p = getPeptideBySlug(peptideo);
  if (!p) notFound();

  const peptides = getPeptides();
  const rows = buildRows(p);
  const example = pickExample(rows);
  const faq = buildFaq(p, rows, example);
  const path = `/ferramentas/reconstituicao/${p.slug}`;

  // Doses da titulação (só GLP-1 com esquema cadastrado) × frascos comuns, com 2 ml de água.
  // Só esquemas injetáveis (o Rybelsus, oral, não entra). Liraglutida é diária; as demais, semanais.
  const titrationDoses = getTitrationDoses(p.slug);
  const pageDoses = getPageDoses(p.slug);
  const titrationFrequency = getTitrationFrequency(p.slug);
  const TITRATION_WATER = 2;

  const guides = getArticlesByPeptide(p.slug).slice(0, 3);
  const comparisons = COMPARISONS.filter((c) => c.peptideSlugs.includes(p.slug)).slice(0, 3);
  const related: RelatedLink[] = [
    { href: `/peptideos/${p.slug}`, label: `Ficha de ${p.name}`, desc: 'Mecanismo, efeitos, contraindicações e referências.' },
    ...guides.map((a) => ({ href: `/blog/${a.slug}`, label: a.title, desc: a.excerpt })),
    ...comparisons.map((c) => ({ href: `/comparar/${c.slug}`, label: c.title, desc: 'Comparativo lado a lado.' })),
  ];
  const others = peptides.filter((x) => x.slug !== p.slug);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name={`Calculadora de Reconstituição de ${p.name}`}
        description={`Converte frasco (mg), água bacteriostática (ml) e dose de ${p.name} em unidades na seringa U100, em tempo real.`}
        path={path}
      />
      <div className="mb-4 no-print">
        <Breadcrumb
          items={[
            { label: 'Ferramentas', href: '/ferramentas' },
            { label: 'Reconstituição', href: '/ferramentas/reconstituicao' },
            { label: p.name },
          ]}
          siteUrl={SITE_URL}
        />
      </div>

      <header className="mb-8 no-print">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Calculadora de <span className="text-teal-700">{p.name}</span>
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Informe o frasco e a água bacteriostática: a calculadora mostra quantas unidades
          puxar na seringa para a dose de {p.name}. Dose de referência: {doseLabel(p)} ({p.frequency}).
        </p>
        {example && (
          <p className="mt-2 text-ink-2 max-w-2xl">
            Resposta rápida: frasco de {fmt(example.vial, 2)} mg com {fmt(example.water, 1)} ml de água →{' '}
            <strong className="text-ink">{fmt(example.units, 1)} unidades</strong> por dose de {doseLabel(p)}.
          </p>
        )}
        {p.lastReviewed && (
          <p className="mt-2 text-xs text-ink-3">
            Dados da ficha revisados em{' '}
            <time dateTime={p.lastReviewed}>
              {new Date(`${p.lastReviewed}T12:00:00-03:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </time>{' '}
            · <Link href="/metodologia" className="text-teal-700 hover:underline">como revisamos</Link>
          </p>
        )}
      </header>

      <ReconstitutionCalculator peptides={peptides} initialPeptideSlug={p.slug} />

      {rows.length > 0 && (
        <section className="mt-10" aria-labelledby="tabela-pronta">
          <h2 id="tabela-pronta" className="text-xl md:text-2xl font-bold mb-2">
            Tabela pronta: {p.name} em unidades na seringa
          </h2>
          <p className="text-sm text-ink-2 mb-4 max-w-3xl">
            Valores para a dose de {doseLabel(p)} em seringa de insulina U100 (100 unidades = 1 ml),
            nos frascos mais comuns ({vialsLabel(p)}). Para outra dose ou outro frasco, use a calculadora acima.
          </p>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                  <th scope="col" className="p-3 font-bold">Frasco</th>
                  <th scope="col" className="p-3 font-bold">Água</th>
                  <th scope="col" className="p-3 font-bold">Concentração</th>
                  <th scope="col" className="p-3 font-bold">Puxar por dose</th>
                  <th scope="col" className="p-3 font-bold">Doses por frasco</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const note = unitsNote(r.units);
                  return (
                    <tr key={`${r.vial}-${r.water}`} className="border-b border-border last:border-0">
                      <td className="p-3 font-semibold tabular-nums">{fmt(r.vial, 2)} mg</td>
                      <td className="p-3 tabular-nums">{fmt(r.water, 1)} ml</td>
                      <td className="p-3 tabular-nums">{fmtConcentration(r.concentration)} mg/ml</td>
                      <td className="p-3">
                        <span className="font-bold text-teal-700 tabular-nums">{fmt(r.units, 1)} U</span>
                        <span className="text-ink-3"> ({fmt(r.units / 100, 3)} ml)</span>
                        {note && <span className="block text-xs text-amber-700 mt-0.5">{note}</span>}
                      </td>
                      <td className="p-3 tabular-nums">{fmt(r.doses, 1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 no-print">
            <span className="text-sm text-ink-2">Tabela completa por frasco:</span>
            {p.commonAmounts.map((v) => (
              <Link key={v} href={vialPath(p, v)} className="chip-lg">
                {p.name} {fmt(v, 2)} mg
              </Link>
            ))}
          </div>
        </section>
      )}

      {titrationDoses.length > 0 && (
        <section className="mt-10" aria-labelledby="tabela-titulacao">
          <h2 id="tabela-titulacao" className="text-xl md:text-2xl font-bold mb-2">
            Unidades em cada dose da subida ({p.name})
          </h2>
          <p className="text-sm text-ink-2 mb-4 max-w-3xl">
            Doses da escada de titulação, com {TITRATION_WATER} ml de água bacteriostática em cada frasco.
            Acima de 100 U a dose não cabe numa seringa de 1 ml.
          </p>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                  <th scope="col" className="p-3 font-bold">{titrationFrequency ? titrationDoseLabel(titrationFrequency) : 'Dose'}</th>
                  {p.commonAmounts.map((v) => (
                    <th key={v} scope="col" className="p-3 font-bold">
                      Frasco {fmt(v, 2)} mg
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {titrationDoses.map((d) => (
                  <tr key={d} className="border-b border-border last:border-0">
                    <td className="p-3 font-semibold tabular-nums">
                      {pageDoses.includes(d) ? (
                        <Link href={dosePath(p.slug, d)} className="text-teal-700 hover:underline">{fmt(d, 2)} mg</Link>
                      ) : (
                        <>{fmt(d, 2)} mg</>
                      )}
                    </td>
                    {p.commonAmounts.map((v) => {
                      const r = calcByVolume(v, TITRATION_WATER, d);
                      if (!r) return <td key={v} className="p-3">—</td>;
                      if (d > v) return <td key={v} className="p-3 text-ink-3">dose maior que o frasco</td>;
                      return (
                        <td key={v} className="p-3 tabular-nums">
                          <span className={r.unitsPerDose > 100 ? 'font-bold text-amber-700' : 'font-bold text-teal-700'}>
                            {fmt(r.unitsPerDose, 1)} U
                          </span>
                          {r.unitsPerDose > 100 && <span className="block text-xs text-amber-700">passa de 100 U</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink-2">
            Veja o calendário completo em{' '}
            <Link href="/ferramentas/titulacao" className="text-teal-700 font-semibold hover:underline">subida de dose GLP-1</Link>
            {' '}e a versão para imprimir em{' '}
            <Link href="/ferramentas/tabela-doses-glp1" className="text-teal-700 font-semibold hover:underline">tabela de doses</Link>.
          </p>
        </section>
      )}

      <section className="mt-10 max-w-3xl" aria-labelledby="como-calcular">
        <h2 id="como-calcular" className="text-xl md:text-2xl font-bold mb-3">Como a conta é feita</h2>
        <ol className="space-y-2 text-ink-2 list-decimal pl-5 leading-relaxed">
          <li><strong>Concentração</strong> = mg do frasco ÷ ml de água adicionada.</li>
          <li><strong>Volume da dose</strong> = dose em mg ÷ concentração.</li>
          <li><strong>Unidades na seringa</strong> = volume em ml × 100 (seringa U100).</li>
        </ol>
        {example && (
          <p className="mt-3 text-ink-2 leading-relaxed">
            Exemplo com {p.name}: frasco de {fmt(example.vial, 2)} mg + {fmt(example.water, 1)} ml de água ={' '}
            {fmtConcentration(example.concentration)} mg/ml. Dose de {doseLabel(p)} ÷ essa concentração ={' '}
            {fmt(example.units / 100, 3)} ml, ou seja, <strong>{fmt(example.units, 1)} unidades</strong>.
            {p.halfLife && <> Meia-vida de referência: {p.halfLife}.</>}
          </p>
        )}
      </section>


      <RelatedLinks links={related} title={`Mais sobre ${p.name}`} />

      <FAQ items={faq} title={`Perguntas frequentes: calculadora de ${p.name}`} />

      <section className="mt-10 no-print" aria-labelledby="outras-calculadoras">
        <h2 id="outras-calculadoras" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">
          Calculadora de outros peptídeos
        </h2>
        <div className="flex flex-wrap gap-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/ferramentas/reconstituicao/${o.slug}`}
              className="chip-lg"
            >
              {o.name}
            </Link>
          ))}
        </div>
      </section>

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
