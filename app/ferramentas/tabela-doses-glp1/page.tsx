import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import PrintButton from '@/components/ui/PrintButton';
import { calcByVolume, fmt } from '@/components/calculator/calc';
import { getPeptideBySlug } from '@/lib/peptides';
import { TITRATION_SCHEMES, getTitrationDoses, type TitrationScheme } from '@/lib/titration';
import { SITE_URL } from '@/lib/site';

const PATH = '/ferramentas/tabela-doses-glp1';
const WATER_VOLUMES = [1, 2];
const WEEKS_PER_STEP = 4;
const LOG_ROWS = 12;

// Esquemas com a mesma escada (Mounjaro e Zepbound) viram uma tabela só.
function uniqueSchemes(): { scheme: TitrationScheme; label: string }[] {
  const seen = new Map<string, { scheme: TitrationScheme; label: string }>();
  for (const s of TITRATION_SCHEMES) {
    const key = `${s.peptideSlug}:${s.steps.map((x) => x.dose).join('/')}`;
    const brand = s.name.split(' — ')[1]?.replace(/\s*\(.*\)$/, '');
    const existing = seen.get(key);
    if (existing) {
      if (brand) existing.label += ` / ${brand}`;
    } else {
      seen.set(key, { scheme: s, label: s.name.replace(/\s*\(.*\)$/, '') });
    }
  }
  return Array.from(seen.values());
}

const PEPTIDE_SLUGS = Array.from(new Set(TITRATION_SCHEMES.map((s) => s.peptideSlug)));

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Qual a tabela de doses do Mounjaro (tirzepatida)?',
    a: 'A escada de bula começa em 2,5 mg por semana e sobe 2,5 mg a cada 4 semanas ou mais: 2,5 → 5 → 7,5 → 10 → 12,5 → 15 mg. A dose de 2,5 mg é de adaptação; as de manutenção são 5, 10 e 15 mg.',
  },
  {
    q: 'Qual a tabela de doses do Ozempic e do Wegovy (semaglutida)?',
    a: 'Ozempic: 0,25 mg por 4 semanas, depois 0,5 mg, podendo subir para 1 mg e 2 mg. Wegovy: 0,25 → 0,5 → 1,0 → 1,7 → 2,4 mg, com 4 semanas em cada etapa até a manutenção de 2,4 mg por semana.',
  },
  {
    q: 'Posso ficar mais tempo em uma dose antes de subir?',
    a: 'Sim. Quatro semanas é o mínimo de bula, não uma obrigação. Se os efeitos gastrointestinais estiverem fortes, permanecer mais tempo na etapa atual é a conduta usual — a decisão deve ser tomada com o médico.',
    link: { label: 'Montar calendário com datas', href: '/ferramentas/titulacao' },
  },
  {
    q: 'Como ler a tabela de unidades na seringa?',
    a: 'Ela vale para frasco reconstituído e seringa de insulina U100 (100 unidades = 1 ml). Ache a coluna do seu frasco e do volume de água que você adicionou; a linha da dose mostra quantas unidades puxar. Não se aplica a canetas, que já entregam a dose medida.',
  },
  {
    q: 'A tabela serve para caneta?',
    a: 'A escada de doses, sim. A conversão em unidades de seringa, não: canetas têm mecanismo dosador próprio e devem ser usadas como indica a bula. Retirar o conteúdo de uma caneta com seringa não é recomendado pelos fabricantes.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/ferramentas/titulacao', label: 'Subida de dose com datas', desc: 'Calendário semana a semana e export para a agenda.' },
  { href: '/ferramentas/custo-glp1', label: 'Custo por dose e por mês', desc: 'Quanto custa cada etapa da titulação.' },
  { href: '/ferramentas/reconstituicao/tirzepatida', label: 'Calculadora de tirzepatida', desc: 'Outros frascos e volumes de água.' },
  { href: '/ferramentas/reconstituicao/semaglutida', label: 'Calculadora de semaglutida', desc: 'Outros frascos e volumes de água.' },
];

export const metadata: Metadata = {
  title: 'Tabela de Doses de Mounjaro, Ozempic e Wegovy para imprimir',
  description:
    'Tabela de doses de tirzepatida (Mounjaro), semaglutida (Ozempic/Wegovy) e retatrutida: escada de titulação semana a semana e unidades na seringa por frasco. Pronta para imprimir.',
  openGraph: {
    title: 'Tabela de Doses GLP-1 para imprimir',
    description: 'Escada de titulação e unidades na seringa de tirzepatida, semaglutida e retatrutida.',
    url: PATH,
  },
  alternates: { canonical: PATH },
};

const th = 'p-2.5 font-bold text-left text-xs uppercase tracking-wider text-ink-3';
const td = 'p-2.5 tabular-nums whitespace-nowrap';

export default function TabelaDosesGlp1Page() {
  const schemes = uniqueSchemes();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Tabela de doses GLP-1' }]} siteUrl={SITE_URL} />
      </div>

      {/* div em vez de <header>: o CSS de impressão esconde <header>, e o título precisa sair no papel */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Tabela de doses — <span className="text-teal-700">Mounjaro, Ozempic e Wegovy</span>
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Escada de titulação semana a semana e unidades na seringa para cada frasco, em uma
          página pensada para imprimir e deixar junto da medicação.
        </p>
        <div className="mt-4">
          <PrintButton />
        </div>
      </div>

      <section aria-labelledby="escada">
        <h2 id="escada" className="text-xl md:text-2xl font-bold mb-3">1. Escada de doses (titulação)</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {schemes.map(({ scheme, label }) => (
            <div key={scheme.id} className="card overflow-hidden">
              <h3 className="px-3 pt-3 font-bold text-ink">{label}</h3>
              <table className="w-full text-sm mt-1">
                <thead>
                  <tr className="border-b border-border">
                    <th scope="col" className={th}>Etapa</th>
                    <th scope="col" className={th}>Semanas</th>
                    <th scope="col" className={th}>Dose semanal</th>
                  </tr>
                </thead>
                <tbody>
                  {scheme.steps.map((step, i) => {
                    const start = 1 + i * WEEKS_PER_STEP;
                    const last = i === scheme.steps.length - 1;
                    return (
                      <tr key={step.dose} className="border-b border-border last:border-0">
                        <td className={td}>{i + 1}</td>
                        <td className={td}>{last ? `${start} em diante` : `${start} a ${start + WEEKS_PER_STEP - 1}`}</td>
                        <td className={`${td} font-bold text-teal-700`}>{fmt(step.dose, 2)} mg</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-ink-2 max-w-3xl">
          Quatro semanas por etapa é o mínimo de bula. Nem todos chegam à dose máxima: a dose de
          manutenção é a menor que mantém o resultado com efeitos toleráveis. Retatrutida ainda é
          experimental (fase 3), sem aprovação regulatória.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="unidades">
        <h2 id="unidades" className="text-xl md:text-2xl font-bold mb-1">2. Unidades na seringa (frasco reconstituído)</h2>
        <p className="text-sm text-ink-2 mb-4 max-w-3xl">
          Seringa de insulina U100: 100 unidades = 1 ml. Só para frasco reconstituído — não vale para caneta.
          &quot;—&quot; indica dose maior que o frasco ou acima de 100 U (não cabe em uma seringa de 1 ml).
        </p>
        <div className="space-y-5">
          {PEPTIDE_SLUGS.map((slug) => {
            const p = getPeptideBySlug(slug);
            if (!p) return null;
            const doses = getTitrationDoses(slug);
            const cols = p.commonAmounts.flatMap((vial) => WATER_VOLUMES.map((water) => ({ vial, water })));
            return (
              <div key={slug} className="card overflow-x-auto relative">
                <h3 className="px-3 pt-3 font-bold text-ink">{p.name}</h3>
                <table className="w-full text-sm mt-1">
                  <thead>
                    <tr className="border-b border-border">
                      <th scope="col" className={`${th} sticky left-0 bg-surface`}>Dose</th>
                      {cols.map((c) => (
                        <th key={`${c.vial}-${c.water}`} scope="col" className={`${th} whitespace-nowrap`}>
                          <span className="block text-ink-2">{fmt(c.vial, 2)} mg</span>
                          <span className="block font-semibold normal-case tracking-normal">+ {fmt(c.water, 1)} ml</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {doses.map((d) => (
                      <tr key={d} className="border-b border-border last:border-0">
                        <th scope="row" className={`${td} font-semibold text-left whitespace-nowrap sticky left-0 bg-surface`}>{fmt(d, 2)} mg</th>
                        {cols.map((c) => {
                          const r = d <= c.vial ? calcByVolume(c.vial, c.water, d) : null;
                          const ok = r && r.unitsPerDose <= 100;
                          return (
                            <td key={`${c.vial}-${c.water}`} className={td}>
                              {ok ? <span className="font-bold text-teal-700">{fmt(r.unitsPerDose, 1)} U</span> : <span className="text-ink-3">—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-ink-2 no-print">
          Outro frasco ou outra quantidade de água? Use a{' '}
          <Link href="/ferramentas/reconstituicao" className="text-teal-700 font-semibold hover:underline">calculadora de reconstituição</Link>.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="registro">
        <h2 id="registro" className="text-xl md:text-2xl font-bold mb-3">3. Registro das aplicações</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className={th}>Semana</th>
                <th scope="col" className={th}>Data</th>
                <th scope="col" className={th}>Dose</th>
                <th scope="col" className={th}>Local da aplicação</th>
                <th scope="col" className={th}>Observações</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: LOG_ROWS }, (_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className={`${td} text-ink-3`}>{i + 1}</td>
                  <td className="p-2.5 h-9" />
                  <td className="p-2.5" />
                  <td className="p-2.5" />
                  <td className="p-2.5" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-3">
          Central Peptídeos — {SITE_URL.replace(/^https?:\/\//, '')}. Material informativo: não substitui prescrição nem orientação médica.
        </p>
      </section>


      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
