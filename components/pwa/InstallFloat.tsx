'use client';

// Banner flutuante "Baixe o app", montado no layout: aparece em todas as páginas, preso ao
// rodapé da tela (canto direito no computador). Fecha no X e volta em FLOAT_SNOOZE_DAYS.
// Fora das páginas de venda, do admin, do embed e da própria /app. Some para quem já instalou.
// Quando a página tem outra barra fixa no rodapé (marcada com data-bottom-bar: mini-resultado,
// oferta do ebook, checkout), sobe para não cobrir: regra `.install-float` em globals.css.

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { dismissFloat, floatDismissed } from '@/lib/install';
import { EVENTS, trackOnce } from '@/lib/track';
import { useInstall } from './useInstall';
import { CloseIcon, PhoneIcon } from './icons';

const BLOCKED = /^\/(ebooks|embed|admin|app|tabela-personalizada)(\/|$)/;

export default function InstallFloat() {
  const info = useInstall();
  const pathname = usePathname() || '/';
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    setClosed(floatDismissed());
  }, []);

  const visible =
    info.ready &&
    !closed &&
    !info.standalone &&
    !info.inIframe &&
    !BLOCKED.test(pathname) &&
    (info.canPrompt || info.platform !== 'desktop');

  useEffect(() => {
    if (visible) trackOnce(EVENTS.installView, { so: info.platform, posicao: 'flutuante' });
  }, [visible, info.platform]);

  if (!visible) return null;

  return (
    <aside
      className="install-float no-print fixed z-30 left-3 right-3 md:left-auto md:right-6 md:w-96 flex items-center gap-3 pl-3 pr-1.5 py-2.5 rounded-2xl bg-surface border border-teal-100 shadow-2xl animate-slide-up"
      aria-label="Baixar o app"
    >
      <span className="w-10 h-10 flex-shrink-0 rounded-xl bg-teal-700 text-white dark:text-bg flex items-center justify-center" aria-hidden>
        <PhoneIcon size={20} />
      </span>
      <p className="min-w-0 flex-1 leading-snug">
        <span className="block text-sm font-bold text-ink">Baixe nosso app</span>
        <span className="block text-xs text-ink-2">Grátis e sem loja.</span>
      </p>
      <button
        type="button"
        onClick={() => info.start('flutuante')}
        className="btn-teal !h-9 !px-3 text-xs whitespace-nowrap"
      >
        {info.canPrompt ? 'Instalar' : 'Baixar'}
      </button>
      <button
        type="button"
        onClick={() => {
          dismissFloat();
          setClosed(true);
        }}
        className="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center text-ink-3 hover:text-ink"
        aria-label="Fechar"
      >
        <CloseIcon />
      </button>
    </aside>
  );
}
