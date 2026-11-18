'use client';

// Pop-up de saída com a oferta da página (registrada por EbookOffer em offer-store).
//
// Regras, para não atrapalhar quem está usando o site:
// - só na saída, nunca na entrada: no computador, o cursor sai pelo topo da janela; no celular,
//   rolagem rápida para cima depois de a pessoa ter lido boa parte da página;
// - no mínimo 12 s na página antes de poder abrir;
// - no máximo uma vez a cada 7 dias (localStorage) e nunca depois de a pessoa clicar numa oferta
//   ou fechar a barra da calculadora nesta visita;
// - fora de /ebooks, /embed, /admin e páginas legais; desligável em lib/ebooks.ts (EXIT_OFFER_ENABLED).

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EbookCover from '@/components/ebook/EbookCover';
import AnchorNote from './AnchorNote';
import { offerHref } from '@/components/ebook/EbookOffer';
import {
  getPageOffer,
  markOfferClicked,
  offerBarClosed,
  offerClicked,
  subscribePageOffer,
} from '@/components/ebook/offer-store';
import { EXIT_COUPON, EXIT_OFFER_ENABLED, couponPrice, formatPrice } from '@/lib/ebooks';
import { COUPON_KEY } from './CheckoutButton';
import { EVENTS, track } from '@/lib/track';

const LAST_SHOWN = 'cp:popup-saida';
const WEEK = 7 * 24 * 60 * 60 * 1000;
const MIN_TIME = 12_000;
const BLOCKED = /^\/(ebooks|embed|admin|termos|privacidade|contato|newsletter|tabela-personalizada)(\/|$)/;

function shownRecently(): boolean {
  try {
    const at = Number(window.localStorage.getItem(LAST_SHOWN) || 0);
    return Date.now() - at < WEEK;
  } catch {
    // sem armazenamento não há como limitar a frequência: não mostra
    return true;
  }
}

function rememberShown(): void {
  try {
    window.localStorage.setItem(LAST_SHOWN, String(Date.now()));
  } catch {
    // idem
  }
}

export default function ExitOffer() {
  const offer = useSyncExternalStore(subscribePageOffer, getPageOffer, () => null);
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const canShow = useCallback(
    () => EXIT_OFFER_ENABLED && !!getPageOffer() && !BLOCKED.test(pathname) && !offerClicked() && !offerBarClosed() && !shownRecently(),
    [pathname],
  );

  // Gatilhos de saída.
  useEffect(() => {
    if (!offer || !EXIT_OFFER_ENABLED || BLOCKED.test(pathname)) return;
    const start = Date.now();
    let maxDepth = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();

    const fire = () => {
      if (Date.now() - start < MIN_TIME || !canShow()) return;
      rememberShown();
      lastFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
      track(EVENTS.ebookPopupView, { ebook: getPageOffer()!.id, pagina: pathname });
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) fire();
    };

    const onScroll = () => {
      const y = window.scrollY;
      const t = performance.now();
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      if (doc > 0) maxDepth = Math.max(maxDepth, y / doc);
      // Subida rápida (mais de 0,6 px/ms) depois de ter lido pelo menos metade da página.
      const speed = (lastY - y) / Math.max(1, t - lastT);
      if (maxDepth > 0.5 && lastY - y > 80 && speed > 0.6) fire();
      lastY = y;
      lastT = t;
    };

    const touch = window.matchMedia('(hover: none)').matches;
    if (touch) window.addEventListener('scroll', onScroll, { passive: true });
    else document.addEventListener('mouseout', onMouseOut);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [offer, pathname, canShow]);

  // Fecha ao trocar de página.
  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    lastFocus.current?.focus?.();
  }, []);

  // Esc fecha; Tab fica dentro do diálogo.
  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current;
    el?.querySelector<HTMLElement>('a,button')?.focus();
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
  }, [open, close]);

  if (!open || !offer) return null;

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
        aria-labelledby="popup-saida-titulo"
        className="relative w-full max-w-md rounded-2xl bg-surface border border-border shadow-2xl p-5 sm:p-6 animate-slide-up"
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-2 right-2 w-10 h-10 rounded-lg flex items-center justify-center text-ink-3 hover:text-ink"
          aria-label="Fechar"
        >
          <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
        <div className="flex items-start gap-4 pr-8">
          <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Antes de sair</p>
            <h2 id="popup-saida-titulo" className="mt-1 text-lg font-extrabold text-ink leading-tight">
              {offer.title}
            </h2>
            <p className="mt-1 text-sm text-ink-2 leading-snug">{offer.hook}</p>
          </div>
        </div>
        <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
          {offer.bullets.slice(0, 2).map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-teal-700" aria-hidden>✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <AnchorNote text={offer.anchor} className="mt-4" />
        {offer.launchNote ? <p className="mt-2 text-center text-xs font-bold text-amber-700 dark:text-amber-300">{offer.launchNote}</p> : null}
        {EXIT_COUPON ? (
          <div className="mt-4 rounded-xl border-2 border-dashed border-teal-500 bg-teal-50 px-4 py-3 text-center dark:bg-teal-400/10">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Cupom de {EXIT_COUPON.percent}% para você
            </p>
            <p className="mt-1 font-mono text-xl font-extrabold tracking-widest text-ink">{EXIT_COUPON.code}</p>
            <p className="mt-1 text-sm text-ink-2">
              <span className="line-through">{offer.priceLabel}</span>{' '}
              <strong className="text-teal-700">{formatPrice(couponPrice(offer.price, EXIT_COUPON.percent))}</strong>
              {' '}· já vai aplicado no checkout
            </p>
          </div>
        ) : null}
        <Link
          href={offerHref(offer, 'popup', pathname) + (EXIT_COUPON ? `&cupom=${EXIT_COUPON.code}` : '')}
          onClick={() => {
            if (EXIT_COUPON) {
              try {
                window.sessionStorage.setItem(COUPON_KEY, EXIT_COUPON.code);
              } catch {}
            }
            markOfferClicked();
            track(EVENTS.ebookPopupClick, { ebook: offer.id, pagina: pathname });
            setOpen(false);
          }}
          className="btn-teal w-full mt-5"
        >
          {EXIT_COUPON ? 'Usar meu cupom' : `${offer.cta} · ${offer.priceLabel}`}
        </Link>
        <p className="mt-2 text-center text-xs text-ink-3">
          {offer.pages} páginas · acesso imediato · 7 dias de garantia
        </p>
        <button type="button" onClick={close} className="mt-3 w-full text-center text-sm text-ink-3 hover:text-ink">
          Agora não
        </button>
      </div>
    </div>
  );
}
