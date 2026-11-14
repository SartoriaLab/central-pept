import type { Metadata } from 'next';
import DoseLadder from '@/components/calculator/DoseLadder';
import { SITE_URL } from '@/lib/site';

// Versão para iframe: só a escada de doses. Canônica: /ferramentas/tabela-doses-glp1.
export const metadata: Metadata = {
  title: 'Escada de doses de Mounjaro, Ozempic e Wegovy',
  description: 'Tabela de subida de dose de GLP-1 para incorporar em outros sites.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ferramentas/tabela-doses-glp1' },
};

export default function EmbedTabelaDosesPage() {
  return (
    <div className="px-3 py-4 md:px-5 md:py-5">
      <DoseLadder />
      <p className="mt-5 text-xs text-ink-3 leading-relaxed">
        Doses de bula, informativas — siga sempre a orientação do seu médico.{' '}
        <a href={`${SITE_URL}/ferramentas/tabela-doses-glp1`} target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline">
          Tabela de doses de GLP-1
        </a>{' '}
        por Central Peptídeos.
      </p>
    </div>
  );
}
