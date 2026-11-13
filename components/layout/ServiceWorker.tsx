'use client';

import { useEffect } from 'react';

/** Registra o service worker (/sw.js) em produção: calculadoras abrem sem internet. */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    // Dentro de iframe (/embed) não registra: o site de terceiros não precisa disso.
    if (window.self !== window.top) return;
    const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
  }, []);
  return null;
}
