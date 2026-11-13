import type { Metadata } from 'next';
import UnitConverter from '@/components/calculator/UnitConverter';
import { getPeptides } from '@/lib/peptides';
import { SITE_URL } from '@/lib/site';

// Versão para iframe (sem cabeçalho/rodapé). Canônica: /ferramentas/conversor.
export const metadata: Metadata = {
  title: 'Conversor mg, mcg e UI',
  description: 'Conversor de unidades de peptídeos para incorporar em outros sites.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ferramentas/conversor' },
};

export default function EmbedConversorPage() {
  return (
    <div className="px-3 py-4 md:px-5 md:py-5">
      <UnitConverter peptides={getPeptides()} embed />
      <p className="mt-5 text-xs text-ink-3 leading-relaxed">
        Ferramenta informativa — não substitui orientação médica.{' '}
        <a href={`${SITE_URL}/ferramentas/conversor`} target="_blank" rel="noopener" className="font-semibold text-teal-700 hover:underline">
          Conversor mg ↔ mcg
        </a>{' '}
        por Central Peptídeos.
      </p>
    </div>
  );
}
