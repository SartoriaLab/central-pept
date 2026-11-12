import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: '/peptideos', title: 'Peptídeos', text: 'Enciclopédia com doses, meia-vida e status regulatório.' },
  { href: '/ferramentas', title: 'Ferramentas', text: 'Reconstituição, mistura, conversor e cronograma.' },
  { href: '/comparar', title: 'Comparar', text: 'Peptídeos lado a lado, critério por critério.' },
  { href: '/blog', title: 'Blog', text: 'Guias e artigos em linguagem direta.' },
];

export default function NotFound() {
  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Erro 404</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Página não encontrada
          </h1>
          <p className="mt-4 text-lg text-ink-2 leading-relaxed max-w-2xl">
            O endereço pode ter mudado ou sido digitado com erro. Use a busca no topo (tecla{' '}
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-surface text-sm font-mono">/</kbd>)
            ou siga por um dos caminhos abaixo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="btn-teal">Ir para o início</Link>
            <Link href="/ferramentas/reconstituicao" className="btn-outline">Abrir calculadora</Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid gap-3 sm:grid-cols-2">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="card-hover p-5 block group">
              <span className="font-bold text-ink group-hover:text-teal-700 transition-colors">{l.title}</span>
              <p className="mt-1 text-sm text-ink-2 leading-snug">{l.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
