'use client';

// Faixa fina da home anunciando o app. Com instalação disponível (Android/Chrome), o botão
// instala direto; nos demais casos abre a janela com o passo a passo do aparelho.
// Some para quem já instalou, para quem fechou (30 dias) e dentro de iframe.

import { useEffect } from 'react';
import { EVENTS, trackOnce } from '@/lib/track';
import { useInstall } from './useInstall';
import { CloseIcon, PhoneIcon } from './icons';

export default function InstallBanner() {
  const info = useInstall();
  const visible = info.ready && !info.standalone && !info.dismissed && !info.inIframe;

  useEffect(() => {
    if (visible) trackOnce(EVENTS.installView, { so: info.platform, posicao: 'home' });
  }, [visible, info.platform]);

  if (!visible) return null;

  return (
    <div className="no-print bg-teal-50 border-b border-teal-100">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3 text-sm text-ink">
        <span className="w-8 h-8 flex-shrink-0 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center" aria-hidden>
          <PhoneIcon size={16} />
        </span>
        <p className="min-w-0 flex-1 leading-snug">
          <strong className="font-semibold">Novo: a calculadora vira app no seu celular.</strong>{' '}
          <span className="text-ink-2">Sem loja, funciona sem internet.</span>
        </p>
        <button
          type="button"
          onClick={() => info.start('home')}
          className="btn-teal !h-9 !px-3 text-xs whitespace-nowrap"
        >
          {info.canPrompt ? 'Instalar' : 'Ver como'}
        </button>
        <button
          type="button"
          onClick={info.dismiss}
          className="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center text-ink-2 hover:text-ink"
          aria-label="Fechar"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
