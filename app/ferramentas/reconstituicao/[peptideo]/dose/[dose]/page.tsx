import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import { calcByVolume, fmt, fmtConcentration } from '@/components/calculator/calc';
import { getPeptideBySlug, type Peptide } from '@/lib/peptides';
import { getBrandsByPeptide } from '@/lib/brands';
import { dosePath, doseSlug, getDosePages, getDoseSteps, getPageDoses, parseDoseSlug } from '@/lib/dose-pages';
import { stepPeriodLabel } from '@/lib/titration';
import { vialPath, isCanonicalVial } from '@/lib/vials';
import { social } from '@/lib/og';
import { SITE_URL } from '@/lib/site';

type Params = { peptideo: string; dose: string };

const WATER_VOLUMES = [1, 2, 3];
/** Prazo de uso do frasco reconstituído (dias), regra geral. */
const SHELF_DAYS = 28;

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getDosePages().map(({ peptide, dose }) => ({ peptideo: peptide.slug, dose: doseSlug(dose) }));
}

function resolve(params: Params): { p: Peptide; dose: number } | null {
  const p = getPeptideBySlug(params.peptideo);
  const dose = parseDoseSlug(params.dose);
  if (!p || dose === null || !getPageDoses(p.slug).includes(dose)) return null;
  return { p, dose };
}

const mg = (n: number) => `${fmt(n, 2)} mg`;

/** Frasco e água que deixam a dose mais perto de 10–50 U. */
function bestCombo(vials: number[], dose: number) {
  const score = (u: number) => (u >= 10 && u <= 50 ? 0 : u < 10 ? 10 - u : u - 50);
  const combos = vials.flatMap((vial) =>
    WATER_VOLUMES.map((water) => ({ vial, water, r: calcByVolume(vial, water, dose) })),
  );
  return combos
    .filter((c) => c.r)
    .sort((a, b) => score(a.r!.unitsPerDose) - score(b.r!.unitsPerDose))[0];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return { title: 'Página não encontrada', robots: { index: false, follow: true } };
  const { p, dose } = r;
  const vials = p.commonAmounts.filter((v) => v >= dose);
  const best = bestCombo(vials.length ? vials : p.commonAmounts, dose);
  const title = `${p.name} ${fmt(dose, 2)} mg: quantas unidades puxar na seringa`;
  const description = best
    ? `Dose de ${mg(dose)} de ${p.name}: ${fmt(best.r!.unitsPerDose, 1)} unidades na seringa U100 com frasco de ${mg(best.vial)} e ${fmt(best.water, 1)} ml de água. Tabela para cada frasco, duração do frasco e etapa da subida de dose.`
    : `Dose de ${mg(dose)} de ${p.name} em unidades na seringa U100, por frasco e volume de água.`;
  const path = dosePath(p.slug, dose);
  return { title, description, alternates: { canonical: path }, ...social({ kind: 'calculadora', slug: p.slug, path, title, description }) };
}

export default async function DosePage({ params }: { params: Promise<Params> }) {
  const r = resolve(await params);
  if (!r) notFound();
  const { p, dose } = r;

  const vials = p.commonAmounts.filter((v) => v >= dose);
  const best = bestCombo(vials.length ? vials : p.commonAmounts, dose);
  const steps = getDoseSteps(p.slug, dose);
  const allDoses = getPageDoses(p.slug);
  const brands = getBrandsByPeptide(p.slug);
  const path = dosePath(p.slug, dose);
  const isFirst = steps.some((s) => s.index === 0);

  const faq: FAQItem[] = [];
  if (best) {
    faq.push({
      q: `Quantas unidades são ${mg(dose)} de ${p.name}?`,
      a: `Depende do frasco e da água. Com frasco de ${mg(best.vial)} e ${fmt(best.water, 1)} ml de água (${fmtConcentration(best.r!.concentration)} mg/ml), ${mg(dose)} são ${fmt(best.r!.unitsPerDose, 1)} unidades (${fmt(best.r!.unitsPerDose / 100, 3)} ml) na seringa de insulina U100. Para outros frascos, veja a tabela.`,
    });
  }
  if (vials.length > 0) {
    faq.push({
      q: `Quanto tempo dura um frasco na dose de ${mg(dose)}?`,
      a: `${vials
        .map((v) => {
          const n = Math.floor(v / dose + 1e-9);
          return `Frasco de ${mg(v)}: ${n} ${n === 1 ? 'aplicação' : 'aplicações'} semanais`;
        })
        .join('; ')}. Depois de reconstituído, o frasco costuma valer ${SHELF_DAYS} dias na geladeira; o que passar disso é descartado.`,
    });
  }
  for (const s of steps) {
    faq.push({
      q: `Em que etapa da subida entra a dose de ${mg(dose)}? (${s.scheme.name.split(' — ')[1] ?? s.scheme.name})`,
      a: `É a etapa ${s.index + 1} de ${s.total} do esquema ${s.scheme.name}: ${stepPeriodLabel(s.index, s.scheme.stepDays, s.index === s.total - 1).toLowerCase()} pelo calendário de bula.${s.prev !== undefined ? ` Vem depois de ${mg(s.prev)}.` : ' É a dose inicial.'}${s.next !== undefined ? ` A próxima é ${mg(s.next)}, se houver indicação e boa tolerância.` : ' É a dose máxima do esquema.'}`,
    });
  }
  if (!isFirst) {
    faq.push({
      q: `Posso começar direto em ${mg(dose)}?`,
      a: `Não é o que as bulas indicam. A subida gradual, começando em ${mg(allDoses[0])}, existe para reduzir náusea, vômito e outros efeitos gastrointestinais. Qualquer mudança de dose deve ser decidida com o médico.`,
      link: { label: 'Calendário de subida de dose', href: '/ferramentas/titulacao' },
    });
  }

  const related: RelatedLink[] = [
    { href: `/ferramentas/reconstituicao/${p.slug}`, label: `Calculadora de ${p.name}`, desc: 'Qualquer frasco, dose e volume de água.' },
    { href: '/ferramentas/titulacao', label: 'Subida de dose', desc: 'Calendário com datas de cada etapa.' },
    { href: `/peptideos/${p.slug}`, label: `Ficha de ${p.name}`, desc: 'Mecanismo, efeitos e referências.' },
    ...brands.map((b) => ({ href: `/medicamentos/${b.slug}`, label: b.name, desc: b.summary })),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-4 no-print">
        <Breadcrumb
          items={[
            { label: 'Ferramentas', href: '/ferramentas' },
            { label: 'Reconstituição', href: '/ferramentas/reconstituicao' },
            { label: p.name, href: `/ferramentas/reconstituicao/${p.slug}` },
            { label: `Dose ${mg(dose)}` },
          ]}
          siteUrl={SITE_URL}
        />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          {p.name} <span className="text-teal-700">{mg(dose)}</span>: quantas unidades puxar
        </h1>
        {best && (
          <p className="mt-4 text-lg text-ink-2 leading-relaxed">
            Com frasco de {mg(best.vial)} e {fmt(best.water, 1)} ml de água bacteriostática, a dose de {mg(dose)} são{' '}
            <strong className="text-ink">{fmt(best.r!.unitsPerDose, 1)} unidades</strong> na seringa de insulina U100 (
            {fmt(best.r!.unitsPerDose / 100, 3)} ml). Outros frascos e volumes estão na tabela.
          </p>
        )}
        {best && (
          <div className="mt-5 no-print">
            <Link
              href={`/ferramentas/reconstituicao/${p.slug}?mg=${best.vial}&water=${best.water}&dose=${dose}`}
              className="btn-teal"
            >
              Abrir na calculadora
              <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M10 4l6 6-6 6" /></svg>
            </Link>
          </div>
        )}
      </header>

      <section aria-labelledby="tabela">
        <h2 id="tabela" className="text-xl md:text-2xl font-bold mb-2">Unidades para {mg(dose)} em cada frasco</h2>
        <p className="text-sm text-ink-2 mb-4 max-w-3xl">
          Seringa U100 (100 unidades = 1 ml). Linha: frasco; coluna: água que você colocou nele.
        </p>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-ink-3 border-b border-border">
                <th scope="col" className="p-3 font-bold">Frasco</th>
                {WATER_VOLUMES.map((w) => (
                  <th key={w} scope="col" className="p-3 font-bold whitespace-nowrap">{fmt(w, 1)} ml de água</th>
                ))}
                <th scope="col" className="p-3 font-bold whitespace-nowrap">Aplicações / duração</th>
              </tr>
            </thead>
            <tbody>
              {p.commonAmounts.map((v) => {
                if (v < dose) {
                  return (
                    <tr key={v} className="border-b border-border last:border-0">
                      <th scope="row" className="p-3 font-semibold text-left">{mg(v)}</th>
                      <td colSpan={WATER_VOLUMES.length + 1} className="p-3 text-ink-3">Frasco menor que a dose</td>
                    </tr>
                  );
                }
                const n = Math.floor(v / dose + 1e-9);
                const wasted = n * 7 > SHELF_DAYS;
                return (
                  <tr key={v} className="border-b border-border last:border-0">
                    <th scope="row" className="p-3 font-semibold text-left whitespace-nowrap">
                      {isCanonicalVial(p) ? (
                        <Link href={vialPath(p, v)} className="text-teal-700 hover:underline">{mg(v)}</Link>
                      ) : (
                        mg(v)
                      )}
                    </th>
                    {WATER_VOLUMES.map((w) => {
                      const c = calcByVolume(v, w, dose);
                      if (!c) return <td key={w} className="p-3">—</td>;
                      const over = c.unitsPerDose > 100;
                      return (
                        <td key={w} className="p-3 tabular-nums whitespace-nowrap">
                          <span className={`font-bold ${over ? 'text-amber-700' : 'text-teal-700'}`}>{fmt(c.unitsPerDose, 1)} U</span>
                          <span className="block text-xs text-ink-3">{over ? 'passa de 100 U' : `${fmt(c.unitsPerDose / 100, 3)} ml`}</span>
                        </td>
                      );
                    })}
                    <td className="p-3 tabular-nums whitespace-nowrap">
                      {n} {n === 1 ? 'semana' : 'semanas'}
                      {wasted && <span className="block text-xs text-amber-700">passa de {SHELF_DAYS} dias</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-ink-2 max-w-3xl">
          Conta: unidades = dose (mg) × água (ml) × 100 ÷ mg do frasco. Uma aplicação por semana; em amarelo, o frasco
          duraria mais que os {SHELF_DAYS} dias de uso depois de reconstituído.
        </p>
      </section>

      {steps.length > 0 && (
        <section className="mt-10" aria-labelledby="subida">
          <h2 id="subida" className="text-xl md:text-2xl font-bold mb-3">Onde {mg(dose)} entra na subida de dose</h2>
          <ul className="space-y-3">
            {steps.map((s) => (
              <li key={s.scheme.id} className="card p-4">
                <p className="font-semibold text-ink">{s.scheme.name}</p>
                <p className="mt-1 text-sm text-ink-2">
                  Etapa {s.index + 1} de {s.total} · {stepPeriodLabel(s.index, s.scheme.stepDays, s.index === s.total - 1)}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  {s.prev !== undefined && (
                    <Link href={dosePath(p.slug, s.prev)} className="chip-lg">← {mg(s.prev)}</Link>
                  )}
                  {s.next !== undefined && (
                    <Link href={dosePath(p.slug, s.next)} className="chip-lg">{mg(s.next)} →</Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 no-print" aria-labelledby="outras-doses">
        <h2 id="outras-doses" className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">Outras doses de {p.name}</h2>
        <div className="flex flex-wrap gap-2">
          {allDoses.filter((d) => d !== dose).map((d) => (
            <Link key={d} href={dosePath(p.slug, d)} className="chip-lg">{p.name} {mg(d)}</Link>
          ))}
        </div>
      </section>

      <RelatedLinks links={related} title={`Mais sobre ${p.name}`} />
      <FAQ items={faq} title={`Perguntas frequentes: ${p.name} ${mg(dose)}`} />
      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
