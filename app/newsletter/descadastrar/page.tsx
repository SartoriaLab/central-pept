import type { Metadata } from 'next';
import { Suspense } from 'react';
import UnsubscribeForm from './UnsubscribeForm';

export const metadata: Metadata = {
  title: 'Cancelar newsletter',
  robots: { index: false, follow: false },
};

export default function DescadastrarPage() {
  return (
    <div className="max-w-xl mx-auto px-4 md:px-6 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Cancelar a newsletter</h1>
      <p className="mt-3 text-ink-2 leading-relaxed">
        Ao confirmar, seu email é apagado da nossa lista e você não recebe mais
        nenhuma mensagem.
      </p>
      {/* Confirmação por botão: leitores de email que abrem links sozinhos não descadastram ninguém. */}
      <Suspense fallback={null}>
        <UnsubscribeForm />
      </Suspense>
    </div>
  );
}
