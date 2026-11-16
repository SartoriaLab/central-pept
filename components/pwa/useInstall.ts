'use client';

// Estado da instalação da PWA para os componentes de convite (InstallPrompt, InstallBanner,
// InstallPanel). Tudo é decidido no navegador, depois da hidratação: `ready` fica false no
// servidor e no primeiro render, para não haver diferença de HTML.

import { useCallback, useEffect, useState } from 'react';
import {
  INSTALL_READY_EVENT,
  detectPlatform,
  dismissInstall,
  dismissedRecently,
  isInAppBrowser,
  isStandalone,
  readDismissedAt,
  type InstallPlatform,
} from '@/lib/install';
import { EVENTS, track } from '@/lib/track';

export type InstallPosition = 'calculadora' | 'home' | 'pagina';

export type InstallInfo = {
  ready: boolean;
  platform: InstallPlatform;
  /** O navegador ofereceu a instalação (Android/Chrome/Edge): o botão funciona. */
  canPrompt: boolean;
  standalone: boolean;
  inApp: boolean;
  inIframe: boolean;
  dismissed: boolean;
  /** Abre a janela de instalação do navegador. Devolve true se a pessoa aceitou. */
  install: (posicao: InstallPosition, extra?: Record<string, string | boolean>) => Promise<boolean>;
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
      track(EVENTS.installed, { so: platform });
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
    async (posicao: InstallPosition, extra: Record<string, string | boolean> = {}) => {
      const deferred = window.__cpInstall;
      if (!deferred) return false;
      window.__cpInstall = null; // o Chrome só deixa usar o evento uma vez
      setState((s) => ({ ...s, canPrompt: false }));
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

  const dismiss = useCallback(() => {
    dismissInstall();
    setState((s) => ({ ...s, dismissed: true }));
  }, []);

  return { ...state, install, dismiss };
}
