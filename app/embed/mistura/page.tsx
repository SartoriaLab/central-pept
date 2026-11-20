import type { Metadata } from 'next';
import MixCalculator from '@/components/calculator/MixCalculator';
import { getCalcPeptides } from '@/lib/peptides';
import { SITE_URL } from '@/lib/site';

// Versão para iframe (sem cabeçalho/rodapé, sem localStorage, botões nem oferta).
// Canônica: /ferramentas/mistura.
export const metadata: Metadata = {
  title: 'Calculadora de mistura de peptídeos',
  description: 'Calculadora de mistura de peptídeos na mesma seringa para incorporar em outros sites.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ferramentas/mistura' },
};

export default function EmbedMisturaPage() {
  return (
    <div className="px-3 py-4 md:px-5 md:py-5">
      <MixCalculator peptides={getCalcPeptides()} embed />
      <p className="mt-5 text-xs text-ink-3 leading-relaxed">
        Ferramenta informativa — não substitui orientação médica.{' '}
        <a href={`${SITE_URL}/ferramentas/mistura`} target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline">
          Calculadora de mistura de peptídeos
        </a>{' '}
        por Central Peptídeos.
      </p>
    </div>
  );
}
