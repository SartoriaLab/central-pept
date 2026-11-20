import type { Metadata } from 'next';
import { socialImage } from '@/lib/og';
import Link from 'next/link';
import Comparator from '@/components/peptide/Comparator';
import { getComparePeptides } from '@/lib/peptides';
import { COMPARISONS } from '@/lib/comparisons';
import { getBrandComparisons } from '@/lib/brand-comparisons';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import EbookOffer from '@/components/ebook/EbookOffer';
import { ebookForHub, offerFor } from '@/lib/ebooks';

export const metadata: Metadata = {
  title: 'Comparador de Peptídeos: dose, meia-vida e efeitos lado a lado',
  description: 'Compare até 4 peptídeos lado a lado: mecanismo, dose, meia-vida, efeitos e status regulatório. Comparativos prontos de semaglutida, tirzepatida, BPC-157, ipamorelina e outros.',
  alternates: { canonical: '/comparar' },
  ...socialImage('pagina', 'comparar', '/comparar'),
};

export default function CompararPage() {
  const peptides = getComparePeptides();

  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Comparador</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Compare peptídeos lado a lado
          </h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            Até 4 peptídeos simultaneamente. Veja diferenças de mecanismo, dose,
            meia-vida, efeitos e status regulatório em uma tabela única.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">
            Marcas: Ozempic, Mounjaro, Wegovy e outras
          </h2>
          <div className="flex flex-wrap gap-2">
            {getBrandComparisons().map((c) => (
              <Link key={c.slug} href={`/comparar/${c.slug}`} className="chip-lg">
                {c.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">
            Comparações populares
          </h2>
          <div className="flex flex-wrap gap-2">
            {COMPARISONS.map((c) => (
              <Link
                key={c.slug}
                href={`/comparar/${c.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 transition-colors"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>

        <Comparator peptides={peptides} />

        <EbookOffer offer={offerFor(ebookForHub())} />

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
