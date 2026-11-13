import type { Metadata } from 'next';
import { socialImage } from '@/lib/og';
import Link from 'next/link';
import { getGlossary, type GlossaryTerm } from '@/lib/glossary';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Glossário de Peptídeos: termos técnicos explicados',
  description:
    'Glossário de peptídeos em português: reconstituição, água bacteriostática, meia-vida, titulação, GLP-1, GIP, COA, HPLC e outros termos explicados de forma clara.',
  alternates: { canonical: '/glossario' },
  ...socialImage('pagina', 'glossario', '/glossario'),
};

export default function GlossarioPage() {
  const sorted = getGlossary();

  // Agrupar por letra inicial
  const groups = sorted.reduce<Record<string, GlossaryTerm[]>>((acc, t) => {
    const letter = t.term[0].normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
    acc[letter] = acc[letter] || [];
    acc[letter].push(t);
    return acc;
  }, {});

  const letters = Object.keys(groups).sort();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glossário de peptídeos — Central Peptídeos',
    url: `${SITE_URL}/glossario`,
    inLanguage: 'pt-BR',
    hasDefinedTerm: sorted.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
      url: `${SITE_URL}/glossario/${t.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Glossário</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Termos técnicos, explicados
          </h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            {sorted.length} termos do universo de peptídeos — de &quot;bacteriostática&quot; a
            &quot;WADA&quot; — explicados de forma clara e sem jargão desnecessário.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Navegação por letra */}
        <nav aria-label="Navegação do glossário" className="mb-8 flex flex-wrap gap-1.5 pb-4 border-b border-border sticky top-16 md:top-20 bg-bg/95 backdrop-blur z-20 -mx-4 px-4 py-3">
          {letters.map((l) => (
            <a
              key={l}
              href={`#letra-${l}`}
              className="w-10 h-10 flex items-center justify-center rounded-md border border-border bg-surface text-sm font-bold text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 transition-colors"
            >
              {l}
            </a>
          ))}
        </nav>

        {letters.map((letter) => (
          <section key={letter} id={`letra-${letter}`} className="mb-8 scroll-mt-32">
            <h2 className="text-2xl font-extrabold text-teal-700 mb-3">{letter}</h2>
            <dl className="space-y-4">
              {groups[letter].map((t) => (
                <div key={t.slug} className="card p-4">
                  <dt className="font-bold text-ink mb-1.5">
                    <Link href={`/glossario/${t.slug}`} className="hover:text-teal-700 hover:underline">
                      {t.term}
                    </Link>
                  </dt>
                  <dd className="text-sm text-ink-2 leading-relaxed">
                    {t.definition}{' '}
                    <Link href={`/glossario/${t.slug}`} className="font-semibold text-teal-700 hover:underline whitespace-nowrap">
                      Saiba mais →
                    </Link>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}
