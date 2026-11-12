'use client';

import { EVENTS, track } from '@/lib/track';

// Botão de imprimir / salvar em PDF. O CSS de impressão (globals.css) já esconde
// botões, cabeçalho e rodapé — sobra só o conteúdo da página.
export default function PrintButton({ label = 'Imprimir ou salvar em PDF' }: { label?: string }) {
  return (
    <button type="button" onClick={() => {
        track(EVENTS.print, { pagina: window.location.pathname });
        window.print();
      }} className="btn-teal no-print">
      <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 7V3h8v4M6 14H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2M6 11h8v6H6z" />
      </svg>
      {label}
    </button>
  );
}
