import type { Metadata } from 'next';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import { SITE_URL } from '@/lib/site';
import MixCalculator from '@/components/calculator/MixCalculator';
import { getPeptides } from '@/lib/peptides';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import ToolSchema from '@/components/ui/ToolSchema';

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Posso misturar dois peptídeos na mesma seringa?',
    a: 'Em muitos casos sim, desde que sejam compatíveis e reconstituídos com o mesmo tipo de diluente. A combinação mais comum é CJC-1295 + ipamorelina (ambos voltados a GH). A calculadora não decide compatibilidade — ela assume que os peptídeos estão no mesmo frasco ou aspirados na mesma seringa e mostra a dose entregue de cada um. Não combine GLP-1 (semaglutida/tirzepatida) com outros peptídeos: diluições e frequências são diferentes.',
  },
  {
    q: 'Como a calculadora determina a dose de cada peptídeo?',
    a: 'Você informa a concentração de cada peptídeo no frasco (mg/ml, que vem da reconstituição) e o volume total puxado na seringa. A calculadora multiplica concentração × volume para cada peptídeo e mostra quantos mg/mcg de cada um são entregues naquela aplicação.',
  },
  {
    q: 'Misturar reduz a eficácia dos peptídeos?',
    a: 'Se são quimicamente compatíveis e usados logo após a mistura, a eficácia costuma ser preservada. O risco maior é de estabilidade — alguns peptídeos degradam mais rápido em conjunto. Na dúvida, mantenha os frascos separados e combine só no momento da aplicação, aspirando um depois do outro na mesma seringa.',
  },
  {
    q: 'Quantos peptídeos posso combinar de uma vez?',
    a: 'A calculadora suporta de 2 a 4 peptídeos simultaneamente. Na prática, combinações de 2 são as mais usadas (ex.: um GHRH + um GHRP). Quanto mais peptídeos, maior a chance de incompatibilidade e mais difícil o ajuste fino de dose.',
  },
  {
    q: 'A ordem de aspiração na seringa importa?',
    a: 'Para o cálculo de dose, não — o que importa é o volume de cada peptídeo. Para a técnica, aspire primeiro o mais concentrado e evite introduzir ar entre um e outro. Se estiver combinando a partir de frascos separados, troque ou limpe a agulha entre as aspirações.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/blog/cjc-ipamorelina-como-combinar', label: 'CJC-1295 + Ipamorelina', desc: 'O combo mais usado para GH, explicado.' },
  { href: '/peptideos/cjc-1295', label: 'Ficha do CJC-1295', desc: 'Dose, meia-vida e mecanismo.' },
  { href: '/peptideos/ipamorelina', label: 'Ficha da ipamorelina', desc: 'Dose, efeitos e status regulatório.' },
  { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Concentração e unidades por dose.' },
];

export const metadata: Metadata = {
  title: 'Calculadora de Mistura',
  description:
    'Combine 2 a 4 peptídeos em um frasco e descubra a dose exata de cada um entregue em uma única aplicação.',
  openGraph: {
    title: 'Calculadora de Mistura de Peptídeos',
    description: 'Dose correta de cada peptídeo numa seringa combinada.',
  },
  alternates: { canonical: '/ferramentas/mistura' },
};

export default function MisturaPage() {
  const peptides = getPeptides();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name="Calculadora de Mistura de Peptídeos"
        description="Combine 2 a 4 peptídeos em um frasco e descubra a dose exata de cada um entregue em uma única aplicação."
        path="/ferramentas/mistura"
      />
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Mistura' }]} siteUrl={SITE_URL} />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Calculadora de Mistura
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Combinando 2 a 4 peptídeos no mesmo frasco? Descubra a dose exata que cada
          um entrega quando você puxa uma quantidade de unidades na seringa.
        </p>
      </header>

      <MixCalculator peptides={peptides} />

      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
