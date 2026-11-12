import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ferramentas',
  description:
    'Calculadoras e utilitários para trabalhar com peptídeos: reconstituição, mistura, conversão de unidades.',
  alternates: { canonical: '/ferramentas' },
};

type Tool = {
  slug: string;
  title: string;
  desc: string;
  status: 'ativa' | 'em breve';
};

const TOOLS: Tool[] = [
  {
    slug: 'reconstituicao',
    title: 'Reconstituição',
    desc: 'Descubra quanta água adicionar, a concentração resultante, unidades na seringa e quantas doses cabem no frasco. Resultado em tempo real.',
    status: 'ativa',
  },
  {
    slug: 'mistura',
    title: 'Mistura',
    desc: 'Combine 2 a 4 peptídeos em um único frasco e veja a dose exata de cada um entregue numa seringa compartilhada.',
    status: 'ativa',
  },
  {
    slug: 'conversor',
    title: 'Conversor mg ↔ mcg ↔ UI',
    desc: 'Converta entre miligramas, microgramas e unidades internacionais. Mostra a quantidade como múltiplo da dose típica.',
    status: 'ativa',
  },
  {
    slug: 'cronograma',
    title: 'Cronograma de Doses',
    desc: 'Planeje um ciclo de aplicações e baixe como arquivo .ics para importar no Google Calendar, Apple Calendar ou Outlook.',
    status: 'ativa',
  },
  {
    slug: 'titulacao',
    title: 'Subida de Dose — Ozempic e Mounjaro',
    desc: 'Calendário semana a semana de escalonamento para semaglutida (Ozempic/Wegovy) e tirzepatida (Mounjaro/Zepbound). Com datas e export .ics.',
    status: 'ativa',
  },
];

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
        <div className="grid gap-4 md:gap-6 sm:grid-cols-2">
          {TOOLS.map((t) => {
            const active = t.status === 'ativa';
            const Wrapper: React.ElementType = active ? Link : 'div';
            return (
              <Wrapper
                key={t.slug}
                {...(active ? { href: `/ferramentas/${t.slug}` } : {})}
                className={`group relative card p-6 overflow-hidden transition-all ${
                  active
                    ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {active && (
                  <span className="absolute top-0 right-0 w-32 h-32 rounded-full bg-teal opacity-10 blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity" aria-hidden />
                )}
                <div className="relative">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold leading-tight">{t.title}</h2>
                    {!active && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 rounded-full flex-shrink-0">
                        em breve
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-ink-2 leading-relaxed">{t.desc}</p>
                  {active && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 group-hover:gap-2 transition-all">
                      Abrir
                      <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10h10M10 5l5 5-5 5"/></svg>
                    </span>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </>
  );
}
