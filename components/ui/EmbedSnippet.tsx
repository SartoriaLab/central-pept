'use client';

import { useState } from 'react';
import { EVENTS, track } from '@/lib/track';

type Props = {
  /** URL absoluta da versão embed (ex.: https://site/embed/reconstituicao). */
  embedUrl: string;
  /** URL absoluta da página completa, usada no link de crédito. */
  creditUrl: string;
  /** Texto âncora do link de crédito. */
  creditLabel: string;
  /** Atributo title do iframe (acessibilidade). */
  title: string;
  height?: number;
};

// Código para incorporar a ferramenta em outro site. O link de crédito fica fora do
// iframe de propósito: é ele que conta como referência para a página original.
export default function EmbedSnippet({ embedUrl, creditUrl, creditLabel, title, height = 900 }: Props) {
  const [copied, setCopied] = useState(false);

  const code = [
    `<iframe src="${embedUrl}" title="${title}" width="100%" height="${height}" style="border:1px solid #e2e8f0;border-radius:12px;max-width:100%" loading="lazy"></iframe>`,
    `<p style="font-size:13px;margin:6px 0 0">Ferramenta: <a href="${creditUrl}">${creditLabel}</a> — Central Peptídeos</p>`,
  ].join('\n');

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      track(EVENTS.embedCopy, { ferramenta: 'reconstituicao' });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mt-10 no-print max-w-3xl" aria-labelledby="incorporar">
      <h2 id="incorporar" className="text-xl md:text-2xl font-bold mb-2">Incorporar no seu site</h2>
      <p className="text-sm text-ink-2 mb-3 leading-relaxed">
        Tem um blog, clínica ou farmácia? Cole o código abaixo na sua página para exibir a calculadora.
        É gratuito — pedimos apenas que o link de crédito seja mantido.
      </p>
      <textarea
        readOnly
        value={code}
        rows={5}
        aria-label="Código para incorporar a calculadora"
        onFocus={(e) => e.currentTarget.select()}
        className="w-full rounded border border-border-2 bg-surface p-3 font-mono text-xs text-ink-2 leading-relaxed"
      />
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button type="button" onClick={copy} className="btn-teal !h-10 text-sm">
          {copied ? 'Código copiado' : 'Copiar código'}
        </button>
        <span className="text-xs text-ink-3" aria-live="polite">
          Para abrir já com um peptídeo, acrescente <code>?peptide=tirzepatida</code> ao endereço do iframe.
        </span>
      </div>
    </section>
  );
}
