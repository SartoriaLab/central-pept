import type { Metadata } from 'next';
import VialPlanner from '@/components/calculator/VialPlanner';
import { getCalcPeptides } from '@/lib/peptides';
import { SITE_URL } from '@/lib/site';

// Versão para iframe (sem cabeçalho/rodapé, sem localStorage, botões nem oferta).
// Canônica: /ferramentas/duracao-frasco.
export const metadata: Metadata = {
  title: 'Quanto tempo dura o frasco',
  description: 'Calculadora de duração do frasco de peptídeo para incorporar em outros sites.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ferramentas/duracao-frasco' },
};

export default function EmbedDuracaoFrascoPage() {
  return (
    <div className="px-3 py-4 md:px-5 md:py-5">
      <VialPlanner peptides={getCalcPeptides()} embed />
      <p className="mt-5 text-xs text-ink-3 leading-relaxed">
        Ferramenta informativa — não substitui orientação médica.{' '}
        <a href={`${SITE_URL}/ferramentas/duracao-frasco`} target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline">
          Quanto tempo dura o frasco de peptídeo
        </a>{' '}
        por Central Peptídeos.
      </p>
    </div>
  );
}
