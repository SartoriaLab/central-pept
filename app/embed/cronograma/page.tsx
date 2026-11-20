import type { Metadata } from 'next';
import ScheduleCalculator from '@/components/calculator/ScheduleCalculator';
import { getCalcPeptides } from '@/lib/peptides';
import { SITE_URL } from '@/lib/site';

// Versão para iframe (sem cabeçalho/rodapé, sem localStorage, botões nem oferta).
// Canônica: /ferramentas/cronograma.
export const metadata: Metadata = {
  title: 'Cronograma de doses de peptídeos',
  description: 'Cronograma de aplicações de peptídeos para incorporar em outros sites.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ferramentas/cronograma' },
};

export default function EmbedCronogramaPage() {
  return (
    <div className="px-3 py-4 md:px-5 md:py-5">
      <ScheduleCalculator peptides={getCalcPeptides()} embed />
      <p className="mt-5 text-xs text-ink-3 leading-relaxed">
        Ferramenta informativa — não substitui orientação médica.{' '}
        <a href={`${SITE_URL}/ferramentas/cronograma`} target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline">
          Cronograma de doses de peptídeos
        </a>{' '}
        por Central Peptídeos.
      </p>
    </div>
  );
}
