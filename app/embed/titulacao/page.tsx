import type { Metadata } from 'next';
import TitrationCalculator from '@/components/calculator/TitrationCalculator';
import { SITE_URL } from '@/lib/site';

// Versão para iframe (sem cabeçalho/rodapé). Canônica: /ferramentas/titulacao.
export const metadata: Metadata = {
  title: 'Subida de dose: Ozempic, Wegovy e Mounjaro',
  description: 'Calendário de subida de dose de GLP-1 para incorporar em outros sites.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ferramentas/titulacao' },
};

export default function EmbedTitulacaoPage() {
  return (
    <div className="px-3 py-4 md:px-5 md:py-5">
      <TitrationCalculator embed />
      <p className="mt-5 text-xs text-ink-3 leading-relaxed">
        Ferramenta informativa — siga sempre a orientação do seu médico.{' '}
        <a href={`${SITE_URL}/ferramentas/titulacao`} target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline">
          Subida de dose de GLP-1
        </a>{' '}
        por Central Peptídeos.
      </p>
    </div>
  );
}
