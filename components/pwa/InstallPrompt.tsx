'use client';

// Convite discreto para instalar o site na tela inicial, mostrado embaixo do resultado da
// calculadora. Regras em lib/install.ts, estado em useInstall. Nunca no embed, no navegador
// de rede social nem na impressão. Quem volta em outro dia vê um título próprio.

import { useEffect, useState } from 'react';
import { countVisitDay, shouldOfferInstall } from '@/lib/install';
import { EVENTS, trackOnce } from '@/lib/track';
import { useInstall } from './useInstall';
import { CloseIcon, PhoneIcon } from './icons';

export default function InstallPrompt({ className = '' }: { className?: string }) {
  const info = useInstall();
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    setReturning(countVisitDay() >= 2);
  }, []);

  const visible =
    info.ready &&
    shouldOfferInstall({
      platform: info.platform,
      standalone: info.standalone,
      dismissed: info.dismissed,
      hasPrompt: info.canPrompt,
      inIframe: info.inIframe,
      inApp: info.inApp,
    });

  useEffect(() => {
    if (visible) trackOnce(EVENTS.installView, { so: info.platform, posicao: 'calculadora', retorno: returning });
  }, [visible, info.platform, returning]);

  if (!visible) return null;

  const ios = info.platform === 'ios';

  return (
    <aside
      className={`no-print flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 pl-3 pr-1.5 py-2 text-sm text-ink ${className}`}
      aria-label="Instalar na tela inicial"
    >
      <span className="w-9 h-9 flex-shrink-0 rounded-lg bg-teal-700/10 text-teal-700 flex items-center justify-center" aria-hidden>
        <PhoneIcon />
      </span>
      <span className="min-w-0 flex-1 leading-snug">
        <span className="block font-semibold">
          {returning ? 'De volta por aqui? Deixe a calculadora na tela inicial' : 'Tenha a calculadora na tela inicial'}
        </span>
        <span className="block text-xs text-ink-2">
          {ios ? (
            <>
              Toque em <strong>Compartilhar</strong> e depois em <strong>Adicionar à Tela de Início</strong>. Abre
              mesmo sem internet.
            </>
          ) : (
            'Abre com um toque, mesmo sem internet.'
          )}
        </span>
      </span>
      {!ios ? (
        <button
          type="button"
          onClick={() => void info.install('calculadora', { retorno: returning })}
          className="btn-teal !h-9 !px-3 text-xs whitespace-nowrap"
        >
          Instalar
        </button>
      ) : null}
      <button
        type="button"
        onClick={info.dismiss}
        className="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center text-ink-2 hover:text-ink"
        aria-label="Fechar"
      >
        <CloseIcon />
      </button>
    </aside>
  );
}
