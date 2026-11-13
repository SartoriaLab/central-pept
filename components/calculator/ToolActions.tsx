'use client';

import { useState } from 'react';
import { EVENTS, track } from '@/lib/track';

type Props = {
  /** Slug da ferramenta (métricas). */
  tool: string;
  /** Link com o estado atual. */
  shareUrl: () => string;
  /** Título usado no compartilhamento nativo. */
  title: string;
  onReset?: () => void;
};

const ICON = { width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

/** Ações comuns das calculadoras: copiar link, compartilhar, imprimir e limpar. */
export default function ToolActions({ tool, shareUrl, title, onReset }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt('Copie o link:', url);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
    track(EVENTS.share, { ferramenta: tool, via: 'copiar' });
  }

  async function share() {
    const url = shareUrl();
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (typeof nav.share === 'function') {
      try {
        await nav.share({ title, url });
        track(EVENTS.share, { ferramenta: tool, via: 'nativo' });
      } catch {
        /* cancelado */
      }
    } else {
      await copy();
    }
  }

  const btn =
    'inline-flex items-center gap-1.5 min-h-11 px-3 rounded-lg border border-border bg-surface text-sm font-semibold text-ink-2 hover:border-teal hover:text-teal-700 transition-colors';

  return (
    <div className="flex flex-wrap gap-2 no-print" role="group" aria-label="Ações do cálculo">
      <button type="button" onClick={copy} className={btn}>
        <svg viewBox="0 0 20 20" {...ICON}><path d="M8 12l4-4M7 9l-2 2a3 3 0 0 0 4 4l2-2M13 11l2-2a3 3 0 0 0-4-4L9 7" /></svg>
        <span aria-live="polite">{copied ? 'Link copiado' : 'Copiar link'}</span>
      </button>
      <button type="button" onClick={share} className={`${btn} sm:hidden`}>
        <svg viewBox="0 0 20 20" {...ICON}><path d="M10 3v10M6 7l4-4 4 4M4 12v4h12v-4" /></svg>
        Compartilhar
      </button>
      <button
        type="button"
        onClick={() => {
          track(EVENTS.print, { pagina: window.location.pathname });
          window.print();
        }}
        className={btn}
      >
        <svg viewBox="0 0 20 20" {...ICON}><path d="M6 7V3h8v4M6 14H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2M6 11h8v6H6z" /></svg>
        Imprimir
      </button>
      {onReset && (
        <button type="button" onClick={onReset} className={btn}>
          <svg viewBox="0 0 20 20" {...ICON}><path d="M4 10a6 6 0 1 0 2-4.5M4 3v3h3" /></svg>
          Limpar
        </button>
      )}
    </div>
  );
}
