import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import Syringe from '@/components/calculator/Syringe';
import { fmt } from '@/components/calculator/calc';
import { getSyringe, SYRINGES, unitsToMl } from '@/lib/syringes';
import { social } from '@/lib/og';
import { SITE_URL } from '@/lib/site';

type Params = { tamanho: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return SYRINGES.map((s) => ({ tamanho: s.slug }));
}

// Concentrações comuns depois da reconstituição (mg/ml).
const CONCENTRATIONS = [1, 2.5, 5, 10];

const mlText = (u: number) => `${fmt(unitsToMl(u), 3)} ml`;
const mgText = (mg: number) => (mg < 1 ? `${fmt(mg * 1000, 0)} mcg` : `${fmt(mg, 2)} mg`);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const s = getSyringe((await params).tamanho);
  if (!s) return { title: 'Seringa não encontrada', robots: { index: false, follow: true } };
  const title = `Seringa de insulina de ${s.units} unidades (${fmt(s.ml, 1)} ml): como ler`;
  const description = `Quanto vale cada traço da seringa U-100 de ${s.units} U, tabela de unidades em ml e quantos mg cabem em cada marca para concentrações de 1 a 10 mg/ml.`;
  const path = `/seringas/${s.slug}`;
  return { title, description, alternates: { canonical: path }, ...social({ kind: 'pagina', slug: 'seringas', path, title, description }) };
}

export default async function SyringeSizePage({ params }: { params: Promise<Params> }) {
  const s = getSyringe((await params).tamanho);
  if (!s) notFound();

  const step = s.units === 30 ? 5 : 10;
  const marks = Array.from({ length: s.units / step }, (_, i) => (i + 1) * step);
  const examples = [Math.round(s.units * 0.25), Math.round(s.units * 0.5), Math.round(s.units * 0.8)];
  const others = SYRINGES.filter((x) => x.slug !== s.slug);

  const faq: FAQItem[] = [
    {
      q: `Quanto vale cada traço da seringa de ${s.units} unidades?`,
      a: `Nos modelos comuns, ${s.tick} ${s.tick === 1 ? 'unidade' : 'unidades'} (${fmt(s.tick / 100, 2)} ml). Os traços maiores, numerados, aparecem a cada ${step} unidades. Confira a escala impressa na sua seringa: há modelos com meia unidade.`,
    },
    {
      q: `Quantos ml cabem na seringa de ${s.units} unidades?`,
      a: `${fmt(s.ml, 1)} ml. Na seringa U-100, 100 unidades = 1 ml, então ${s.units} unidades = ${fmt(s.ml, 1)} ml.`,
    },
    {
      q: `Quantos mg tem ${examples[1]} unidades?`,
      a: `Depende da concentração do frasco: ${CONCENTRATIONS.map((c) => `${mgText((examples[1] / 100) * c)} a ${fmt(c, 1)} mg/ml`).join('; ')}. A conta é mg = unidades ÷ 100 × concentração.`,
      link: { label: 'Calculadora de reconstituição', href: '/ferramentas/reconstituicao' },
    },
    {
      q: `Quando usar a seringa de ${s.units} unidades?`,
      a: `É a melhor escolha para ${s.bestFor}. ${others.map((o) => `A de ${o.units} U serve para ${o.bestFor}`).join('. ')}.`,
    },
  ];

  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <div className="mb-4">
            <Breadcrumb
              items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Seringas', href: '/seringas' }, { label: s.label }]}
              siteUrl={SITE_URL}
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Seringa U-100</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Seringa de {s.units} unidades ({fmt(s.ml, 1)} ml)
          </h1>
          <p className="mt-4 text-lg text-ink-2 leading-relaxed max-w-3xl">
            Cada traço vale {s.tick} {s.tick === 1 ? 'unidade' : 'unidades'} ({fmt(s.tick / 100, 2)} ml) e a escala vai até{' '}
            {s.units} U. Melhor para {s.bestFor}.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <section aria-labelledby="exemplos">
          <h2 id="exemplos" className="text-xl md:text-2xl font-bold mb-4">Como fica na escala</h2>
          <div className="card p-4 space-y-4">
            {examples.map((u) => (
              <div key={u}>
                <p className="text-sm font-semibold text-ink-2">
                  {u} unidades = {mlText(u)}
                </p>
                <Syringe units={u} maxUnits={s.units} />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="tabela">
          <h2 id="tabela" className="text-xl md:text-2xl font-bold mb-2">Quantos mg em cada marca</h2>
          <p className="text-sm text-ink-2 mb-4 max-w-3xl">
            Escolha a coluna da concentração do seu frasco (mg do frasco ÷ ml de água). mg = unidades ÷ 100 × concentração.
          </p>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                  <th scope="col" className="p-3 font-bold">Unidades</th>
                  <th scope="col" className="p-3 font-bold">Volume</th>
                  {CONCENTRATIONS.map((c) => (
                    <th key={c} scope="col" className="p-3 font-bold whitespace-nowrap">{fmt(c, 1)} mg/ml</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marks.map((u) => (
                  <tr key={u} className="border-b border-border last:border-0">
                    <th scope="row" className="p-3 font-semibold text-left tabular-nums">{u} U</th>
                    <td className="p-3 tabular-nums text-ink-2">{mlText(u)}</td>
                    {CONCENTRATIONS.map((c) => (
                      <td key={c} className="p-3 tabular-nums whitespace-nowrap">{mgText(unitsToMl(u) * c)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-ink-2">
            Para a sua dose e frasco exatos, use a{' '}
            <Link href="/ferramentas/reconstituicao" className="text-teal-700 font-semibold hover:underline">
              calculadora de reconstituição
            </Link>
            .
          </p>
        </section>

        <section className="mt-10" aria-labelledby="outras">
          <h2 id="outras" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Outros tamanhos</h2>
          <div className="flex flex-wrap gap-2">
            {others.map((o) => (
              <Link key={o.slug} href={`/seringas/${o.slug}`} className="chip-lg">
                Seringa de {o.label}
              </Link>
            ))}
            <Link href="/seringas" className="chip-lg">
              Como ler qualquer seringa
            </Link>
          </div>
        </section>

        <FAQ items={faq} title={`Perguntas frequentes: seringa de ${s.units} unidades`} />
        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
