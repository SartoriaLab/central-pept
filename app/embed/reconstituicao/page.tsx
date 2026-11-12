import type { Metadata } from 'next';
import ReconstitutionCalculator from '@/components/calculator/ReconstitutionCalculator';
import { getPeptides } from '@/lib/peptides';
import { SITE_URL } from '@/lib/site';

// Versão sem cabeçalho/rodapé para rodar em iframe de outros sites.
// Fica fora do índice: a página canônica é /ferramentas/reconstituicao.
export const metadata: Metadata = {
  title: 'Calculadora de Reconstituição de Peptídeos',
  description: 'Calculadora de reconstituição de peptídeos para incorporar em outros sites.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ferramentas/reconstituicao' },
};

export default function EmbedReconstituicaoPage() {
  const full = `${SITE_URL}/ferramentas/reconstituicao`;
  return (
    <div className="px-3 py-4 md:px-5 md:py-5">
      <ReconstitutionCalculator peptides={getPeptides()} />
      <p className="mt-5 text-xs text-ink-3 leading-relaxed">
        Ferramenta informativa — não substitui orientação médica.{' '}
        <a href={full} target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline">
          Calculadora de reconstituição de peptídeos
        </a>{' '}
        por Central Peptídeos.
      </p>
    </div>
  );
}
