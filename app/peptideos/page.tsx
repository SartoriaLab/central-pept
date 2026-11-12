import type { Metadata } from 'next';
import { getPeptides } from '@/lib/peptides';
import PeptideBrowser from '@/components/peptide/PeptideBrowser';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import Link from 'next/link';
import { getCategoryPages } from '@/lib/categories';
import { getBrands } from '@/lib/brands';

const TOTAL = getPeptides().length;

export const metadata: Metadata = {
  title: `Enciclopédia de Peptídeos: dose, efeitos e status de ${TOTAL} compostos`,
  description:
    `Fichas de ${TOTAL} peptídeos — semaglutida, tirzepatida, BPC-157, ipamorelina e outros — com dose típica, meia-vida, efeitos colaterais, status regulatório e referências.`,
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

        <section className="mt-10" aria-labelledby="por-objetivo">
          <h2 id="por-objetivo" className="text-xl md:text-2xl font-bold mb-2">Peptídeos por objetivo</h2>
          <p className="text-sm text-ink-2 mb-4 max-w-2xl">
            Listas comparadas por finalidade, com dose, meia-vida e status regulatório lado a lado.
          </p>
          <div className="flex flex-wrap gap-2">
            {getCategoryPages().map((c) => (
              <Link key={c.slug} href={`/peptideos/categoria/${c.slug}`} className="chip-lg">
                {c.title}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="por-marca">
          <h2 id="por-marca" className="text-xl md:text-2xl font-bold mb-2">Procurando pela marca?</h2>
          <div className="flex flex-wrap gap-2">
            {getBrands().map((b) => (
              <Link key={b.slug} href={`/medicamentos/${b.slug}`} className="chip-lg">
                {b.name} ({b.activeIngredient.toLowerCase()})
              </Link>
            ))}
          </div>
        </section>

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
