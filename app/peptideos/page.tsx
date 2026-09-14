import type { Metadata } from 'next';
import { getPeptides } from '@/lib/peptides';
import PeptideBrowser from '@/components/peptide/PeptideBrowser';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

export const metadata: Metadata = {
  title: 'Peptídeos',
  description:
    'Enciclopédia de peptídeos: dose típica, frequência e descrição de 21 compostos. Busca e filtro por categoria.',
  alternates: { canonical: '/peptideos' },
};

export default function PeptideosPage() {
  const peptides = getPeptides();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Enciclopédia</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Peptídeos catalogados
          </h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            {peptides.length} fichas com mecanismo, dose típica, efeitos documentados e
            status regulatório. Clique em qualquer um para usar a calculadora com a
            dose pré-preenchida.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <PeptideBrowser peptides={peptides} />

        <section className="mt-10">
          <AffiliateBox productId="fornecedor_oficial" slot="peptideos-index" />
        </section>

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
