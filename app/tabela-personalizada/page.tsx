import type { Metadata } from 'next';
import TabelaGenerator from '@/components/tabela/TabelaGenerator';
import { NO_EBOOK_PEPTIDES } from '@/lib/ebooks';
import { getCalcPeptides } from '@/lib/peptides';

// Página de entrega da Tabela personalizada (produto pago na Kiwify). Fora do sitemap e da busca.
export const metadata: Metadata = {
  title: 'Sua tabela personalizada',
  robots: { index: false, follow: false },
  alternates: { canonical: '/ebooks/tabela-personalizada' },
};

export default function TabelaPersonalizadaPage() {
  const peptides = getCalcPeptides()
    .filter((p) => !NO_EBOOK_PEPTIDES.includes(p.slug))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <header className="no-print mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Tabela personalizada</p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink">Gere a tabela do seu frasco</h1>
        <p className="mt-2 text-ink-2">
          Confira os números, depois baixe em PDF ou imprima. Dá para gerar de novo sempre que trocar de frasco.
        </p>
      </header>
      <TabelaGenerator peptides={peptides} />
    </div>
  );
}
