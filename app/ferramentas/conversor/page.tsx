import type { Metadata } from 'next';
import { social } from '@/lib/og';
import Breadcrumb from '@/components/ui/Breadcrumb';
import RelatedLinks, { type RelatedLink } from '@/components/ui/RelatedLinks';
import { SITE_URL } from '@/lib/site';
import UnitConverter from '@/components/calculator/UnitConverter';
import { getPeptides } from '@/lib/peptides';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import ToolSchema from '@/components/ui/ToolSchema';
import EmbedSnippet from '@/components/ui/EmbedSnippet';

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Qual a diferença entre mg, mcg e UI?',
    a: 'mg (miligrama) e mcg (micrograma) são unidades de massa: 1 mg = 1.000 mcg. UI (unidade internacional) mede atividade biológica, não massa — e sua conversão para mg depende do peptídeo específico. Já as "unidades" da seringa de insulina são volume: numa seringa U-100, 100 U = 1 ml.',
  },
  {
    q: 'Quantos mcg tem 1 mg?',
    a: '1 mg equivale a 1.000 mcg. Assim, 0,25 mg = 250 mcg e 5 mg = 5.000 mcg. Peptídeos de baixa dose (BPC-157, ipamorelina) costumam ser dosados em mcg; GLP-1 e alguns outros, em mg.',
  },
  {
    q: 'Por que a conversão de UI muda conforme o peptídeo?',
    a: 'UI mede potência biológica, e cada substância tem um fator próprio entre UI e massa. Por isso o conversor pede que você escolha o peptídeo — sem ele não há como converter UI ↔ mg corretamente. Para HGH, por exemplo, ~3 UI ≈ 1 mg, mas esse fator não vale para outros compostos.',
  },
  {
    q: 'Como converter as unidades da seringa (U) para mg?',
    a: 'As unidades da seringa de insulina são volume: 100 U = 1 ml. Para saber quantos mg há em X unidades, você precisa da concentração do frasco (mg/ml), que vem da reconstituição. Use a calculadora de reconstituição para isso; o conversor cuida das conversões de massa (mg/mcg/UI).',
  },
  {
    q: '100 unidades numa seringa de insulina são quanto em ml?',
    a: 'Numa seringa de insulina padrão U-100, 100 unidades = 1 ml, 50 U = 0,5 ml e 10 U = 0,1 ml. Essa é a escala de volume; quantos mg isso representa depende da concentração do peptídeo no frasco.',
  },
];

const RELATED_LINKS: RelatedLink[] = [
  { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Quantas unidades puxar na seringa.' },
  { href: '/peptideos', label: 'Enciclopédia de peptídeos', desc: 'Dose típica e unidade de cada peptídeo.' },
  { href: '/blog/agua-bacteriostatica-guia', label: 'Água bacteriostática: guia', desc: 'O diluente correto para reconstituir.' },
];

export const metadata: Metadata = {
  title: 'Conversor mg, mcg e UI para peptídeos',
  description:
    'Conversão rápida entre mg, mcg e UI considerando o peptídeo específico. Mostra a quantidade como múltiplo da dose típica.',
  ...social({
    kind: 'pagina', slug: 'conversor', path: '/ferramentas/conversor',
    title: 'Conversor mg ↔ mcg ↔ UI',
    description: 'Conversor de unidades para peptídeos.',
  }),
  alternates: { canonical: '/ferramentas/conversor' },
};

export default function ConversorPage() {
  const peptides = getPeptides();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <ToolSchema
        name="Conversor de Unidades de Peptídeos"
        description="Conversão entre mg, mcg e UI considerando o peptídeo específico, com a quantidade como múltiplo da dose típica."
        path="/ferramentas/conversor"
      />
      <div className="mb-4">
        <Breadcrumb items={[{ label: 'Ferramentas', href: '/ferramentas' }, { label: 'Conversor' }]} siteUrl={SITE_URL} />
      </div>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          Conversor de Unidades
        </h1>
        <p className="mt-2 text-ink-2 max-w-2xl text-base md:text-lg">
          Converta entre mg, mcg e UI. Se escolher um peptídeo, mostramos a quantidade
          como múltiplo da dose típica.
        </p>
      </header>

      <UnitConverter peptides={peptides} />

      <EmbedSnippet
        tool="conversor"
        embedUrl={SITE_URL + "/embed/conversor"}
        creditUrl={SITE_URL + "/ferramentas/conversor"}
        creditLabel="Conversor mg, mcg e UI para peptídeos"
        title="Conversor mg, mcg e UI para peptídeos"
        height={700}
      />

      <RelatedLinks links={RELATED_LINKS} />

      <FAQ items={FAQ_ITEMS} />

      <MedicalDisclaimer variant="prominent" />
    </div>
  );
}
