'use client';

// Estado da instalação da PWA para os componentes de convite (InstallButton, InstallPrompt,
// InstallBanner, InstallPanel, InstallGuide). Tudo é decidido no navegador, depois da
// hidratação: `ready` fica false no servidor e no primeiro render, para não haver diferença
// de HTML. Várias instâncias convivem na mesma página: quem conta a instalação é só o
// ServiceWorker.tsx (layout), nunca este hook.

import { useCallback, useEffect, useState } from 'react';
import {
  INSTALL_READY_EVENT,
  detectPlatform,
  dismissInstall,
  dismissedRecently,
  isInAppBrowser,
  isStandalone,
  openInstallGuide,
  readDismissedAt,
  type InstallPlatform,
} from '@/lib/install';
import { EVENTS, track } from '@/lib/track';

export type InstallPosition = 'cabecalho' | 'calculadora' | 'home' | 'pagina' | 'guia';

type Extra = Record<string, string | boolean>;

export type InstallInfo = {
  ready: boolean;
  platform: InstallPlatform;
  /** O navegador ofereceu a instalação (Android/Chrome/Edge): o botão instala direto. */
  canPrompt: boolean;
  standalone: boolean;
  inApp: boolean;
  inIframe: boolean;
  dismissed: boolean;
  /** Abre a janela de instalação do navegador. Devolve true se a pessoa aceitou. */
  install: (posicao: InstallPosition, extra?: Extra) => Promise<boolean>;
  /** Clique em "Instalar": instala direto se der; senão abre o passo a passo do aparelho. */
  start: (posicao: InstallPosition, extra?: Extra) => void;
  dismiss: () => void;
};

export function useInstall(): InstallInfo {
  const [state, setState] = useState({
    ready: false,
    platform: 'desktop' as InstallPlatform,
    canPrompt: false,
    standalone: false,
    inApp: false,
    inIframe: false,
    dismissed: false,
  });

  useEffect(() => {
    const platform = detectPlatform(navigator.userAgent, navigator.maxTouchPoints ?? 0);
    const read = () =>
      setState({
        ready: true,
        platform,
        canPrompt: Boolean(window.__cpInstall),
        standalone: isStandalone(),
        inApp: isInAppBrowser(navigator.userAgent),
        inIframe: window.self !== window.top,
        dismissed: dismissedRecently(readDismissedAt(), Date.now()),
      });
    const installed = () => {
      window.__cpInstall = null;
      read();
    };
    read();
    window.addEventListener(INSTALL_READY_EVENT, read);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener(INSTALL_READY_EVENT, read);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  const install = useCallback(
    async (posicao: InstallPosition, extra: Extra = {}) => {
      const deferred = window.__cpInstall;
      if (!deferred) return false;
      window.__cpInstall = null; // o Chrome só deixa usar o evento uma vez
      window.dispatchEvent(new Event(INSTALL_READY_EVENT)); // os outros convites da página releem
      let outcome = 'erro';
      try {
        await deferred.prompt();
        outcome = (await deferred.userChoice).outcome;
      } catch {
        // segue com 'erro'
      }
      track(EVENTS.installClick, { so: state.platform, resultado: outcome, posicao, ...extra });
      return outcome === 'accepted';
    },
    [state.platform],
  );

  const start = useCallback(
    (posicao: InstallPosition, extra: Extra = {}) => {
      if (window.__cpInstall) {
        void install(posicao, extra);
        return;
      }
      track(EVENTS.installClick, { so: state.platform, resultado: 'guia', posicao, ...extra });
      openInstallGuide();
    },
    [install, state.platform],
  );

  const dismiss = useCallback(() => {
    dismissInstall();
    setState((s) => ({ ...s, dismissed: true }));
  }, []);

  return { ...state, install, start, dismiss };
}
