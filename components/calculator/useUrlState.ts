'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { decodeState, encodeState, type Codecs } from '@/lib/url-state';

type Options = {
  /** Guarda o último estado neste navegador (chave do localStorage). */
  storageKey?: string;
};

/**
 * Estado de calculadora espelhado na URL (link compartilhável) e no localStorage.
 * Ordem ao abrir: URL > último estado salvo > padrão. O primeiro render usa o padrão
 * (igual ao HTML estático), e a leitura acontece depois de montar.
 */
export function useUrlState<S extends Record<string, unknown>>(defaults: S, codecs: Codecs<S>, opts: Options = {}) {
  const [state, setState] = useState<S>(defaults);
  const [hydrated, setHydrated] = useState(false);
  const defaultsRef = useRef(defaults);
  const codecsRef = useRef(codecs);

  useEffect(() => {
    const fromUrl = decodeState(new URLSearchParams(window.location.search), codecsRef.current);
    let saved: Partial<S> = {};
    if (opts.storageKey && Object.keys(fromUrl).length === 0) {
      try {
        const raw = localStorage.getItem(opts.storageKey);
        if (raw) saved = decodeState(new URLSearchParams(raw), codecsRef.current);
      } catch {
        /* armazenamento bloqueado */
      }
    }
    setState((s) => ({ ...s, ...saved, ...fromUrl }));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escreve URL e localStorage depois de cada mudança (com folga para digitação).
  useEffect(() => {
    if (!hydrated) return;
    const t = window.setTimeout(() => {
      const params = encodeState(state, defaultsRef.current, codecsRef.current);
      const qs = params.toString();
      const url = `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`;
      window.history.replaceState(window.history.state, '', url);
      if (opts.storageKey) {
        try {
          localStorage.setItem(opts.storageKey, qs);
        } catch {
          /* armazenamento bloqueado */
        }
      }
    }, 300);
    return () => window.clearTimeout(t);
  }, [state, hydrated, opts.storageKey]);

  const set = useCallback(<K extends keyof S>(key: K, value: S[K] | ((prev: S[K]) => S[K])) => {
    setState((s) => ({ ...s, [key]: typeof value === 'function' ? (value as (p: S[K]) => S[K])(s[key]) : value }));
  }, []);

  const patch = useCallback((p: Partial<S>) => setState((s) => ({ ...s, ...p })), []);
  const reset = useCallback(() => setState(defaultsRef.current), []);

  /** Link absoluto com o estado atual. */
  const shareUrl = useCallback(() => {
    const qs = encodeState(state, defaultsRef.current, codecsRef.current).toString();
    return `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ''}`;
  }, [state]);

  return { state, set, patch, reset, hydrated, shareUrl };
}
