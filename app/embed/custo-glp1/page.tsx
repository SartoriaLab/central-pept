import type { Metadata } from 'next';
import GlpCostCalculator from '@/components/calculator/GlpCostCalculator';
import { SITE_URL } from '@/lib/site';

// Versão para iframe (sem cabeçalho/rodapé, sem localStorage, botões nem oferta).
// Canônica: /ferramentas/custo-glp1.
export const metadata: Metadata = {
  title: 'Custo por dose de Mounjaro, Ozempic e tirzepatida',
  description: 'Calculadora de custo por dose e por mês de GLP-1 para incorporar em outros sites.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ferramentas/custo-glp1' },
};

export default function EmbedCustoGlp1Page() {
  return (
    <div className="px-3 py-4 md:px-5 md:py-5">
      <GlpCostCalculator embed />
      <p className="mt-5 text-xs text-ink-3 leading-relaxed">
        Ferramenta informativa — não substitui orientação médica.{' '}
        <a href={`${SITE_URL}/ferramentas/custo-glp1`} target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline">
          Custo por dose de GLP-1
        </a>{' '}
        por Central Peptídeos.
      </p>
    </div>
  );
}
