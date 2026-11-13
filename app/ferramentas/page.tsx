import Link from 'next/link';
import type { Metadata } from 'next';
import { socialImage } from '@/lib/og';
import ToolIcon, { toolColor } from '@/components/ui/ToolIcon';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Calculadoras de Peptídeos: reconstituição, dose e custo',
  description:
    'Calculadoras gratuitas de peptídeos: reconstituição, mistura, conversor de unidades, cronograma, subida de dose, custo por dose e tabela de doses GLP-1.',
  alternates: { canonical: '/ferramentas' },
  ...socialImage('pagina', 'ferramentas', '/ferramentas'),
};

export default function FerramentasPage() {
  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Ferramentas</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Calculadoras precisas
          </h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            Resultado em tempo real, explicação passo a passo, sem cadastro.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t, i) => {
            const featured = i === 0;
            return (
              <Link
                key={t.slug}
                href={`/ferramentas/${t.slug}`}
                className={`group relative card p-6 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${
                  featured ? 'sm:col-span-2 lg:col-span-3 md:p-8' : ''
                }`}
              >
                <span className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity ${toolColor(t.slug) === 'orange' ? 'bg-orange-400' : 'bg-teal'}`} aria-hidden />
                <div className={`relative ${featured ? 'md:flex md:items-start md:gap-6' : ''}`}>
                  <ToolIcon slug={t.slug} className={featured ? 'mb-4 md:mb-0' : 'mb-4'} />
                  <div className="min-w-0">
                    {featured && (
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Mais usada</span>
                    )}
                    <h2 className={`font-bold leading-tight ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>{t.title}</h2>
                    <p className={`mt-2 text-ink-2 leading-relaxed ${featured ? 'text-base max-w-2xl' : 'text-sm'}`}>{t.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 group-hover:gap-2 transition-all">
                      Abrir
                      <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10h10M10 5l5 5-5 5"/></svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
