import type { Metadata } from 'next';
import { social } from '@/lib/og';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import { SITE_URL } from '@/lib/site';
import ReconstitutionCalculator from '@/components/calculator/ReconstitutionCalculator';
import { getPeptides } from '@/lib/peptides';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import ToolSchema from '@/components/ui/ToolSchema';
import EmbedSnippet from '@/components/ui/EmbedSnippet';

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'O que é água bacteriostática e por que usá-la?',
    a: 'Água bacteriostática é água estéril contendo álcool benzílico (0,9%) como conservante, que inibe o crescimento bacteriano. É o diluente indicado para reconstituir peptídeos que serão usados em múltiplas aplicações ao longo de dias ou semanas, pois permite que o frasco seja perfurado várias vezes sem contaminação. Para aplicação única, pode-se usar água estéril para injeção (sem conservante).',
  },
  {
    q: 'Qual a diferença entre "unidades" e "ml"?',
    a: 'Em seringas de insulina, 1 ml = 100 unidades (U). Ou seja, 10 U equivalem a 0,1 ml. A calculadora usa unidades porque seringas de insulina (as usadas para aplicação subcutânea de peptídeos) são marcadas em U, que é uma escala mais precisa para volumes pequenos.',
  },
  {
    q: 'Quantos mg vai dar cada dose se eu usar mais ou menos água?',
    a: 'A quantidade de peptídeo por dose é decidida por você (ex.: 250 mcg de BPC-157 por aplicação). O que muda com a quantidade de água é a concentração (mg/ml) e portanto quantas unidades da seringa você precisa puxar. Mais água = menor concentração = mais unidades por dose (mais fácil de medir). Menos água = maior concentração = menos unidades por dose.',
  },
  {
    q: 'Por que a calculadora alerta quando passo de 50 unidades?',
    a: 'A maioria das seringas de insulina tem 30, 50 ou 100 unidades de capacidade. Se sua dose exige mais unidades do que a seringa comporta, você vai precisar aplicar duas vezes ou escolher uma seringa maior. A calculadora alerta para evitar esse erro e sugere valores na faixa ideal (10-50 U), que é a mais fácil de medir com precisão.',
  },
  {
    q: 'Posso guardar o frasco reconstituído? Por quanto tempo?',
    a: 'Depende do peptídeo e do diluente. Em geral, frascos reconstituídos com água bacteriostática devem ser mantidos na geladeira (2-8°C) e usados em até 28 dias. Peptídeos como BPC-157, semaglutida e tirzepatida costumam manter estabilidade por esse período refrigerados. Não congele — o congelamento pode degradar o peptídeo.',
  },
  {
    q: 'O site serve como receita médica?',
    a: 'Não. Este site é uma ferramenta de cálculo e uma fonte de informação educativa. As doses típicas listadas são baseadas em literatura científica pública (estudos clínicos, bulas FDA) e não substituem orientação médica. Qualquer uso de peptídeos deve ser discutido com profissional de saúde habilitado.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/blog/como-reconstituir-semaglutida', label: 'Como reconstituir semaglutida', desc: 'Passo a passo completo com seringa de insulina.' },
  { href: '/blog/agua-bacteriostatica-guia', label: 'Água bacteriostática: guia', desc: 'Qual diluente usar e como armazenar o frasco.' },
  { href: '/peptideos/semaglutida', label: 'Ficha da semaglutida', desc: 'Dose, meia-vida, efeitos e referências.' },
  { href: '/ferramentas/mistura', label: 'Calculadora de mistura', desc: 'Combine peptídeos e veja a dose de cada um.' },
];

const TOTAL = getPeptides().length;

export const metadata: Metadata = {
  title: 'Calculadora de Peptídeos: reconstituição e unidades na seringa',
  description:
    `Calcule quanta água bacteriostática usar e quantas unidades puxar na seringa: concentração, unidades por dose e doses por frasco em tempo real. ${TOTAL} peptídeos, incluindo tirzepatida e semaglutida.`,
  ...social({
    kind: 'pagina', slug: 'reconstituicao', path: '/ferramentas/reconstituicao',
    title: 'Calculadora de Reconstituição de Peptídeos',
    description: 'Calcule concentração, unidades por dose e doses por frasco em tempo real.',
  }),
  alternates: { canonical: '/ferramentas/reconstituicao' },
};

export default function ReconstitucaoPage() {
  const peptides = getPeptides();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name="Calculadora de Reconstituição de Peptídeos"
        description={`Calcule concentração, unidades por dose e doses por frasco em tempo real, com ${TOTAL} peptídeos catalogados.`}
        path="/ferramentas/reconstituicao"
      />
      <div className="mb-4 no-print">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Reconstituição' }]} siteUrl={SITE_URL} />
      </div>

      <header className="mb-8 no-print">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Calculadora de Reconstituição
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Escolha o peptídeo, informe quantidade e volume de água — a calculadora
          mostra quantas unidades puxar na seringa em tempo real.
        </p>
      </header>

      <ReconstitutionCalculator peptides={peptides} />

      <section className="mt-10 no-print" aria-labelledby="por-peptideo">
        <h2 id="por-peptideo" className="text-xl md:text-2xl font-bold mb-2">Calculadora por peptídeo</h2>
        <p className="text-sm text-ink-2 mb-4 max-w-2xl">
          Páginas já preenchidas com a dose de referência, os frascos mais comuns e uma tabela
          pronta de unidades na seringa.
        </p>
        <div className="flex flex-wrap gap-2">
          {peptides.map((p) => (
            <Link
              key={p.slug}
              href={`/ferramentas/reconstituicao/${p.slug}`}
              className="chip-lg"
            >
              {p.name}
            </Link>
          ))}
        </div>
      </section>

      <EmbedSnippet
        embedUrl={`${SITE_URL}/embed/reconstituicao`}
        creditUrl={`${SITE_URL}/ferramentas/reconstituicao`}
        creditLabel="Calculadora de reconstituição de peptídeos"
        title="Calculadora de reconstituição de peptídeos"
      />

      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
