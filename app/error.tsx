'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="bg-gradient-mesh">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-14 md:py-20" role="alert">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Algo deu errado</span>
        <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-4 text-lg text-ink-2 leading-relaxed max-w-2xl">
          Foi um erro do nosso lado. Tente de novo; se continuar, volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => reset()} className="btn-teal">Tentar de novo</button>
          <Link href="/" className="btn-outline">Ir para o início</Link>
        </div>
      </div>
    </section>
  );
}
