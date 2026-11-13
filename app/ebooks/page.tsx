import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EbookCover from '@/components/ebook/EbookCover';
import { KIND_LABELS, formatPrice, getActiveEbooks, type EbookKind } from '@/lib/ebooks';
import { socialImage } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Guias em PDF sobre peptídeos e GLP-1',
  description:
    'Guias práticos em PDF: semaglutida e tirzepatida semana a semana, reconstituição sem erro, checagens antes de comprar e comparativos de peptídeos, com fontes.',
  alternates: { canonical: '/ebooks' },
  ...socialImage('pagina', 'home', '/ebooks'),
};

const ORDER: EbookKind[] = ['kit', 'individual', 'transversal', 'categoria'];

export default function EbooksPage() {
  const ebooks = getActiveEbooks().sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
  // Sem nenhum checkout configurado a página não existe.
  if (ebooks.length === 0) notFound();

  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Guias em PDF</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Guias em PDF</h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            O passo a passo que a bula não detalha, com as mesmas fontes do site. Entrega por email e
            7 dias de garantia.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ebooks.map((e) => (
            <Link key={e.id} href={`/ebooks/${e.slug}`} className="card-hover p-5 flex gap-4 items-start group">
              <EbookCover title={e.title} cover={e.cover} />
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wider text-teal-700">{KIND_LABELS[e.kind]}</span>
                <span className="block mt-1 font-bold text-ink leading-snug group-hover:text-teal-700 transition-colors">{e.title}</span>
                <span className="block mt-2 text-sm text-ink-2 leading-snug line-clamp-3">{e.subtitle}</span>
                <span className="block mt-3 text-sm font-semibold text-ink tabular-nums">{formatPrice(e.price)}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
