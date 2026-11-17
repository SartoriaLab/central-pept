'use client';

// Janela com o passo a passo de instalação do aparelho da pessoa. Montada uma vez no
// layout; qualquer botão "Instalar" a abre com openInstallGuide() (lib/install.ts) quando o
// navegador não tem instalação em um toque (iPhone, navegador do Instagram, Firefox...).

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { INSTALL_GUIDE_EVENT, guideKind, hintSpot, type HintSpot, type InstallGuideKind } from '@/lib/install';
import { SITE_URL } from '@/lib/site';
import { EVENTS, track } from '@/lib/track';
import InstallSteps, { GUIDE_TITLES, HINT_STEPS } from './InstallSteps';
import { ArrowDownIcon, CloseIcon } from './icons';

export default function InstallGuide() {
  const pathname = usePathname();
  const [kind, setKind] = useState<InstallGuideKind | null>(null);
  const [copied, setCopied] = useState(false);
  // Depois de "Mostrar onde tocar": a janela vira um lembrete pequeno, que não cobre a página
  // e aponta para o botão do navegador enquanto a pessoa faz os passos.
  const [hint, setHint] = useState<HintSpot | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const open = () => {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setCopied(false);
      setHint(null);
      setKind(guideKind(navigator.userAgent, navigator.maxTouchPoints ?? 0));
    };
    window.addEventListener(INSTALL_GUIDE_EVENT, open);
    return () => window.removeEventListener(INSTALL_GUIDE_EVENT, open);
  }, []);

  const close = useCallback(() => {
    setKind(null);
    setHint(null);
    lastFocus.current?.focus?.();
  }, []);

  // Fecha ao trocar de página.
  useEffect(() => {
    setKind(null);
    setHint(null);
  }, [pathname]);

  // Esc fecha; Tab fica dentro da janela.
  useEffect(() => {
    if (!kind) return;
    const el = dialogRef.current;
    el?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>('a,button'));
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [kind, close]);

  if (!kind) return null;

  if (hint) {
    const top = hint === 'top-right';
    const steps = HINT_STEPS[kind] ?? [];
    return (
      <div
        data-install-hint
        role="status"
        className={`no-print fixed z-[150] left-3 right-3 sm:left-auto sm:w-96 rounded-2xl bg-teal-700 text-white dark:text-bg shadow-2xl pl-4 pr-11 py-3 animate-fade-in ${top ? 'install-hint-top' : 'install-hint-bottom'}`}
      >
        <p className="text-sm font-bold leading-snug">
          {hint === 'none' ? 'No menu do navegador:' : top ? 'Toque no botão aqui em cima:' : 'Toque no botão aqui embaixo:'}
        </p>
        <ol className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-semibold">
          {steps.map((s, i) => (
            <li key={s.label} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>→</span>}
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">
                {s.icon}
                {s.label}
              </span>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={close}
          className="absolute top-1 right-1 w-10 h-10 rounded-lg flex items-center justify-center opacity-80 hover:opacity-100"
          aria-label="Fechar"
        >
          <CloseIcon size={18} />
        </button>
        {hint !== 'none' && (
          <span
            aria-hidden
            className={`absolute w-8 h-8 rounded-full bg-teal-700 text-white dark:text-bg border-2 border-surface shadow-lg flex items-center justify-center animate-bounce ${top ? 'bottom-full mb-1' : 'top-full mt-1'} ${hint === 'bottom-center' ? 'left-1/2 -ml-4' : 'right-3'}`}
          >
            {/* a rotação fica num elemento de dentro: o animate-bounce usa o transform do de fora */}
            <span className={`block ${top ? 'rotate-180' : ''}`}>
              <ArrowDownIcon size={18} />
            </span>
          </span>
        )}
      </div>
    );
  }

  function showHint() {
    if (!kind) return;
    track(EVENTS.installGuide, { so: 'ios', guia: kind });
    setHint(hintSpot(kind, navigator.userAgent));
  }

  function copyLink() {
    navigator.clipboard
      ?.writeText(SITE_URL)
      .then(() => setCopied(true))
      .catch(() => {});
  }

  return (
    <div
      className="no-print fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/50 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guia-instalar-titulo"
        className="relative w-full max-w-md rounded-2xl bg-surface border border-border shadow-2xl p-5 sm:p-6 animate-slide-up"
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-2 right-2 w-10 h-10 rounded-lg flex items-center justify-center text-ink-3 hover:text-ink"
          aria-label="Fechar"
        >
          <CloseIcon size={18} />
        </button>
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Instalar o app</p>
        <h2 id="guia-instalar-titulo" className="mt-1 pr-8 text-lg font-extrabold text-ink leading-tight">
          {GUIDE_TITLES[kind]}
        </h2>
        <InstallSteps kind={kind} className="mt-4" />
        {kind === 'in-app' || kind === 'desktop' ? (
          <button type="button" onClick={copyLink} className="btn-outline w-full mt-5">
            {copied ? 'Link copiado' : 'Copiar o link do site'}
          </button>
        ) : null}
        <p className="mt-4 text-xs text-ink-3 leading-relaxed">
          Grátis e sem loja. O app abre direto na calculadora, mesmo sem internet.
        </p>
        {hintSpot(kind) ? (
          <button type="button" onClick={showHint} className="btn-teal w-full mt-4">
            Mostrar onde tocar
          </button>
        ) : (
          <button type="button" onClick={close} className="btn-teal w-full mt-4">
            Entendi
          </button>
        )}
      </div>
    </div>
  );
}
