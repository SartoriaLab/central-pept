'use client';

import { useEffect } from 'react';
import { detectPlatform, isStandalone, markInstalledOnce } from '@/lib/install';
import { EVENTS, track } from '@/lib/track';

const PWA_OPEN_KEY = 'cp:pwa-aberta';

/**
 * Registra o service worker (/sw.js) em produção: calculadoras abrem sem internet.
 * Também é o único lugar que conta instalações e aberturas do app (montado uma vez no layout).
 */
export default function ServiceWorker() {
  useEffect(() => {
    // Dentro de iframe (/embed) não registra: o site de terceiros não precisa disso.
    if (window.self !== window.top) return;
    const so = detectPlatform(navigator.userAgent, navigator.maxTouchPoints ?? 0);
    trackPwaOpen(so);
    // Android/Chrome avisa quando a instalação termina.
    const onInstalled = () => {
      if (markInstalledOnce()) track(EVENTS.installed, { so, via: 'navegador' });
    };
    window.addEventListener('appinstalled', onInstalled);
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register, { once: true });
    }
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);
  return null;
}

/**
 * Aberto pelo ícone da tela inicial. Na primeira vez no aparelho conta como instalação (o
 * iPhone não avisa quando instala; no Android o aviso acima já marcou e não conta de novo).
 * Depois, um evento de abertura por sessão, para medir quem volta pelo app.
 */
function trackPwaOpen(so: string) {
  if (!isStandalone()) return;
  if (markInstalledOnce()) track(EVENTS.installed, { so, via: 'primeira-abertura' });
  try {
    if (window.sessionStorage.getItem(PWA_OPEN_KEY)) return;
    window.sessionStorage.setItem(PWA_OPEN_KEY, '1');
  } catch {
    return;
  }
  track(EVENTS.pwaOpen, { so, pagina: window.location.pathname });
}
