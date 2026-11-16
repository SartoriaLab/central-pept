'use client';

import { useEffect } from 'react';
import { isStandalone } from '@/lib/install';
import { EVENTS, track } from '@/lib/track';

const PWA_OPEN_KEY = 'cp:pwa-aberta';

/** Registra o service worker (/sw.js) em produção: calculadoras abrem sem internet. */
export default function ServiceWorker() {
  useEffect(() => {
    // Dentro de iframe (/embed) não registra: o site de terceiros não precisa disso.
    if (window.self !== window.top) return;
    trackPwaOpen();
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);
  return null;
}

/** Aberto pelo ícone da tela inicial: um evento por sessão, para medir quem volta pelo app. */
function trackPwaOpen() {
  if (!isStandalone()) return;
  try {
    if (window.sessionStorage.getItem(PWA_OPEN_KEY)) return;
    window.sessionStorage.setItem(PWA_OPEN_KEY, '1');
  } catch {
    return;
  }
  track(EVENTS.pwaOpen, { pagina: window.location.pathname });
}
