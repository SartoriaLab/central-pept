import type { Metadata } from 'next';
import Link from 'next/link';
import Comparator from '@/components/peptide/Comparator';
import { getPeptides } from '@/lib/peptides';
import { COMPARISONS } from '@/lib/comparisons';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';

export const metadata: Metadata = {
  title: 'Comparador de Peptídeos',
  description: 'Compare até 4 peptídeos lado a lado: mecanismo, dose, meia-vida, efeitos e status regulatório.',
  alternates: { canonical: '/comparar' },
};

export default function CompararPage() {
  const peptides = getPeptides();

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

        <MedicalDisclaimer variant="prominent" />
      </div>
    </>
  );
}
