import type { Metadata } from 'next';
import MissedDoseCalculator from '@/components/calculator/MissedDoseCalculator';
import { SITE_URL } from '@/lib/site';

// Versão para iframe (sem cabeçalho/rodapé, botões nem oferta). Canônica: /ferramentas/dose-esquecida.
export const metadata: Metadata = {
  title: 'Esqueci a dose do Ozempic, Wegovy ou Mounjaro',
  description: 'Ferramenta de dose esquecida de GLP-1 para incorporar em outros sites.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ferramentas/dose-esquecida' },
};

export default function EmbedDoseEsquecidaPage() {
  return (
    <div className="px-3 py-4 md:px-5 md:py-5">
      <MissedDoseCalculator embed />
      <p className="mt-5 text-xs text-ink-3 leading-relaxed">
        Ferramenta informativa — siga sempre a orientação do seu médico.{' '}
        <a href={`${SITE_URL}/ferramentas/dose-esquecida`} target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline">
          Dose esquecida de Ozempic e Mounjaro
        </a>{' '}
        por Central Peptídeos.
      </p>
    </div>
  );
}
