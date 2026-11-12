import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import { calcByVolume, doseToMg, fmt, fmtConcentration } from '@/components/calculator/calc';
import { getPeptideBySlug, type Peptide } from '@/lib/peptides';
import { getArticlesByPeptide } from '@/lib/articles';
import { getTitrationDoses } from '@/lib/titration';
import { getVialPages, parseVialSlug, vialPath, vialSlug } from '@/lib/vials';
import { social } from '@/lib/og';
import ShareButtons from '@/components/ui/ShareButtons';
import { SITE_URL } from '@/lib/site';

type Params = { peptideo: string; frasco: string };

// Volumes de água bacteriostática nas colunas da tabela (ml).
const WATER_VOLUMES = [1, 2, 3];

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getVialPages().map(({ peptide, mg }) => ({ peptideo: peptide.slug, frasco: vialSlug(mg) }));
}

function resolve(params: Params): { p: Peptide; vial: number } | null {
  const p = getPeptideBySlug(params.peptideo);
  const vial = parseVialSlug(params.frasco);
  if (!p || vial === null || !p.commonAmounts.includes(vial)) return null;
  return { p, vial };
}

/** Dose na unidade do catálogo (mg ou mcg), sem zeros sobrando. */
const doseText = (p: Peptide, dose: number) => `${fmt(dose, 2)} ${p.doseUnit}`;

/**
 * Doses das linhas da tabela, na unidade do peptídeo: escada de titulação quando existe;
 * senão metade, dose típica e dobro. Nunca maior que o frasco.
 */
function tableDoses(p: Peptide, vial: number): number[] {
  const titration = getTitrationDoses(p.slug); // sempre em mg
  const candidates = titration.length > 0 ? titration : [p.typicalDose / 2, p.typicalDose, p.typicalDose * 2];
  const doses = candidates.filter((d) => doseToMg(d, p.doseUnit) <= vial);
  return doses.length > 0 ? doses : [p.typicalDose];
}

/** Volume de água que deixa a dose típica mais perto da faixa confortável de 10 a 50 U. */
function bestWater(p: Peptide, vial: number): number {
  const doseMg = doseToMg(p.typicalDose, p.doseUnit);
  const score = (w: number) => {
    const u = calcByVolume(vial, w, doseMg)?.unitsPerDose ?? 0;
    return u >= 10 && u <= 50 ? 0 : u < 10 ? 10 - u : u - 50;
  };
  return [...WATER_VOLUMES].sort((a, b) => score(a) - score(b))[0];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return { title: 'Página não encontrada', robots: { index: false, follow: true } };
  const { p, vial } = r;
  const water = bestWater(p, vial);
  const units = calcByVolume(vial, water, doseToMg(p.typicalDose, p.doseUnit))?.unitsPerDose ?? 0;
  const title = `${p.name} ${fmt(vial, 2)} mg: quantas unidades puxar na seringa`;
  const description = `Frasco de ${p.name} ${fmt(vial, 2)} mg com ${fmt(water, 1)} ml de água: dose de ${doseText(p, p.typicalDose)} = ${fmt(units, 1)} unidades na seringa U100. Tabela pronta para cada dose e volume de água.`;
  const path = vialPath(p, vial);
  return {
    title,
    description,
    alternates: { canonical: path },
    ...social({ kind: 'calculadora', slug: p.slug, path, title, description }),
  };
}

export default async function VialPage({ params }: { params: Promise<Params> }) {
  const r = resolve(await params);
  if (!r) notFound();
  const { p, vial } = r;

  const vialLabel = `${fmt(vial, 2)} mg`;
  const doses = tableDoses(p, vial);
  const typicalMg = doseToMg(p.typicalDose, p.doseUnit);
  const water = bestWater(p, vial);
  const best = calcByVolume(vial, water, typicalMg);
  const path = vialPath(p, vial);
  const calcHref = `/ferramentas/reconstituicao/${p.slug}?mg=${vial}&water=${water}&dose=${p.typicalDose}`;
  const otherVials = p.commonAmounts.filter((v) => v !== vial);

  const faq: FAQItem[] = [];
  if (best) {
    faq.push({
      q: `Quantas unidades de ${p.name} ${vialLabel} devo puxar?`,
      a: `Com ${fmt(water, 1)} ml de água bacteriostática no frasco de ${vialLabel}, a concentração fica em ${fmtConcentration(best.concentration)} mg/ml. A dose de ${doseText(p, p.typicalDose)} equivale a ${fmt(best.unitsPerDose, 1)} unidades (${fmt(best.unitsPerDose / 100, 3)} ml) numa seringa de insulina U100. Se você usou outro volume de água, as unidades mudam na mesma proporção — veja a tabela acima.`,
    });
    faq.push({
      q: `Quanta água bacteriostática colocar no frasco de ${vialLabel}?`,
      a: `${WATER_VOLUMES.map((w) => {
        const c = calcByVolume(vial, w, typicalMg);
        return c ? `${fmt(w, 1)} ml de água: ${fmt(c.unitsPerDose, 1)} U por dose de ${doseText(p, p.typicalDose)}` : '';
      })
        .filter(Boolean)
        .join('; ')}. A água não muda a quantidade de peptídeo no frasco, só a concentração. Prefira o volume que deixa a dose entre 10 e 50 unidades, mais fácil de medir.`,
    });
    faq.push({
      q: `Quantas doses rende um frasco de ${p.name} ${vialLabel}?`,
      a: `${doses
        .map((d) => `Dose de ${doseText(p, d)}: ${fmt(vial / doseToMg(d, p.doseUnit), 1)} doses`)
        .join('. ')}. O rendimento não depende da água adicionada. Frequência de referência: ${p.frequency}.`,
    });
  }
  faq.push({
    q: 'Por quanto tempo o frasco reconstituído pode ser usado?',
    a: 'Como regra geral, frascos reconstituídos com água bacteriostática ficam na geladeira (2-8 °C), protegidos da luz, e são usados em até 28 dias. Não congele depois de reconstituir. A estabilidade exata varia por peptídeo e por fabricante.',
    link: { label: 'Guia da água bacteriostática', href: '/blog/agua-bacteriostatica-guia' },
  });

  const guides = getArticlesByPeptide(p.slug).slice(0, 3);
  const related: RelatedLink[] = [
    { href: `/ferramentas/reconstituicao/${p.slug}`, label: `Calculadora de ${p.name}`, desc: 'Qualquer frasco, dose e volume de água, em tempo real.' },
    { href: `/peptideos/${p.slug}`, label: `Ficha de ${p.name}`, desc: 'Mecanismo, efeitos, contraindicações e referências.' },
    ...guides.map((a) => ({ href: `/blog/${a.slug}`, label: a.title, desc: a.excerpt })),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-4 no-print">
        <Breadcrumb
          items={[
            { label: 'Ferramentas', href: '/ferramentas' },
            { label: 'Reconstituição', href: '/ferramentas/reconstituicao' },
            { label: p.name, href: `/ferramentas/reconstituicao/${p.slug}` },
            { label: `Frasco ${vialLabel}` },
          ]}
          siteUrl={SITE_URL}
        />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          {p.name} <span className="text-teal-700">{vialLabel}</span>: quantas unidades puxar
        </h1>
        {best && (
          <p className="mt-4 text-lg text-ink-2 leading-relaxed">
            Frasco de {vialLabel} + {fmt(water, 1)} ml de água bacteriostática ={' '}
            {fmtConcentration(best.concentration)} mg/ml. A dose de {doseText(p, p.typicalDose)} são{' '}
            <strong className="text-ink">{fmt(best.unitsPerDose, 1)} unidades</strong> na seringa de insulina U100
            ({fmt(best.unitsPerDose / 100, 3)} ml), e o frasco rende {fmt(best.dosesPerVial, 1)} doses.
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3 no-print">
          <Link href={calcHref} className="btn-teal">
            Abrir calculadora com este frasco
            <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M10 4l6 6-6 6" /></svg>
          </Link>
          {p.lastReviewed && (
            <p className="text-xs text-ink-3">
              Dados da ficha revisados em{' '}
              <time dateTime={p.lastReviewed}>
                {new Date(`${p.lastReviewed}T12:00:00-03:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </time>
            </p>
          )}
        </div>
      </header>

      <section aria-labelledby="tabela">
        <h2 id="tabela" className="text-xl md:text-2xl font-bold mb-2">
          Tabela: unidades por dose no frasco de {vialLabel}
        </h2>
        <p className="text-sm text-ink-2 mb-4 max-w-3xl">
          Seringa de insulina U100 (100 unidades = 1 ml). Escolha a coluna da quantidade de água que
          você colocou no frasco e a linha da sua dose.
        </p>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                <th scope="col" className="p-3 font-bold">Dose</th>
                {WATER_VOLUMES.map((w) => (
                  <th key={w} scope="col" className="p-3 font-bold whitespace-nowrap">{fmt(w, 1)} ml de água</th>
                ))}
                <th scope="col" className="p-3 font-bold whitespace-nowrap">Doses no frasco</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((d) => {
                const dMg = doseToMg(d, p.doseUnit);
                return (
                  <tr key={d} className="border-b border-border last:border-0">
                    <th scope="row" className="p-3 font-semibold text-left tabular-nums whitespace-nowrap">
                      {doseText(p, d)}
                      {d === p.typicalDose && <span className="block text-xs font-normal text-ink-3">dose de referência</span>}
                    </th>
                    {WATER_VOLUMES.map((w) => {
                      const c = calcByVolume(vial, w, dMg);
                      if (!c) return <td key={w} className="p-3">—</td>;
                      const over = c.unitsPerDose > 100;
                      return (
                        <td key={w} className="p-3 tabular-nums whitespace-nowrap">
                          <span className={`font-bold ${over ? 'text-amber-700' : 'text-teal-700'}`}>{fmt(c.unitsPerDose, 1)} U</span>
                          <span className="block text-xs text-ink-3">{over ? 'passa de 100 U' : `${fmt(c.unitsPerDose / 100, 3)} ml`}</span>
                        </td>
                      );
                    })}
                    <td className="p-3 tabular-nums">{fmt(vial / dMg, 1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-2 max-w-3xl">
          Concentração do frasco de {vialLabel}:{' '}
          {WATER_VOLUMES.map((w) => `${fmtConcentration(vial / w)} mg/ml com ${fmt(w, 1)} ml`).join(' · ')}.
          Acima de 100 U a dose não cabe numa seringa de 1 ml: use menos água ou divida em duas aplicações.
        </p>
      </section>

      <section className="mt-10 max-w-3xl" aria-labelledby="passo-a-passo">
        <h2 id="passo-a-passo" className="text-xl md:text-2xl font-bold mb-3">Como preparar o frasco de {vialLabel}</h2>
        <ol className="space-y-2 text-ink-2 list-decimal pl-5 leading-relaxed">
          <li>Limpe a tampa de borracha do frasco e a da água bacteriostática com álcool 70%.</li>
          <li>Puxe {fmt(water, 1)} ml de água bacteriostática e injete devagar, deixando escorrer pela parede do frasco.</li>
          <li>Gire o frasco com suavidade até dissolver. Não agite.</li>
          {best && (
            <li>
              Para a dose de {doseText(p, p.typicalDose)}, puxe <strong>{fmt(best.unitsPerDose, 1)} unidades</strong> na seringa U100.
            </li>
          )}
          <li>Guarde na geladeira (2-8 °C), protegido da luz.</li>
        </ol>
        <p className="mt-3 text-sm text-ink-2">
          Conta usada: unidades = dose (mg) × água (ml) × 100 ÷ mg do frasco.{' '}
          <Link href="/blog/agua-bacteriostatica-guia" className="text-teal-700 font-semibold hover:underline">
            Guia da água bacteriostática
          </Link>
          .
        </p>
      </section>

      {otherVials.length > 0 && (
        <section className="mt-10 no-print" aria-labelledby="outros-frascos">
          <h2 id="outros-frascos" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">
            Outros frascos de {p.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherVials.map((v) => (
              <Link key={v} href={vialPath(p, v)} className="chip-lg">
                {p.name} {fmt(v, 2)} mg
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 pt-6 border-t border-border no-print">
        <ShareButtons title={`${p.name} ${vialLabel}: quantas unidades puxar na seringa`} url={path} />
      </div>

      <RelatedLinks links={related} title={`Mais sobre ${p.name}`} />

      <FAQ items={faq} title={`Perguntas frequentes: ${p.name} ${vialLabel}`} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
