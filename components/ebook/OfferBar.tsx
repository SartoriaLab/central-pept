'use client';

// Barra fina no rodapé do celular com a oferta da calculadora. Aparece quando a pessoa já viu o
// bloco de oferta e rolou para além dele (o mini-resultado da reconstituição aparece no caso
// oposto, resultado abaixo da tela, então os dois não disputam o espaço).
// Fecha com um toque e não volta na mesma visita (sessionStorage). Nunca na impressão.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { closeOfferBar, markOfferClicked, offerBarClosed } from '@/components/ebook/offer-store';
import type { EbookOffer } from '@/lib/ebooks';
import { EVENTS, track, trackOnce } from '@/lib/track';

type Props = {
  offer: EbookOffer;
  show: boolean;
  href: string;
  /** href é o checkout da Kiwify (compra direta), não a página do guia. */
  direct?: boolean;
};

export default function OfferBar({ offer, show, href, direct = false }: Props) {
  const [closed, setClosed] = useState(true);

  useEffect(() => {
    setClosed(offerBarClosed());
  }, []);

  const visible = show && !closed;

  useEffect(() => {
    if (visible) trackOnce(EVENTS.ebookView, { ebook: offer.id, posicao: 'barra', pagina: window.location.pathname });
  }, [visible, offer.id]);

  if (!visible) return null;

  return (
    <div
      data-bottom-bar
      className="md:hidden no-print fixed left-3 right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-30 flex items-center gap-2 pl-4 pr-2 py-2 rounded-xl bg-ink text-bg shadow-xl animate-slide-up"
      role="complementary"
      aria-label="Guia em PDF"
    >
      <p className="min-w-0 flex-1 text-xs leading-snug">
        <span className="block font-bold truncate">{offer.title}</span>
        <span className="text-bg/75">
          {offer.launch ? `Lançamento: ${offer.priceLabel} · depois ${offer.launch.afterLabel}` : `${offer.priceLabel} · 7 dias de garantia`}
        </span>
      </p>
      {direct ? (
        <a
          href={href}
          rel="noopener"
          onClick={() => {
            markOfferClicked();
            track(EVENTS.ebookCheckout, { ebook: offer.id, posicao: 'barra', origem: 'direto', pagina: window.location.pathname });
          }}
          className="flex h-9 items-center whitespace-nowrap rounded-lg bg-[#16a34a] px-3 text-xs font-black uppercase text-white"
        >
          {offer.cta === 'Ver a tabela' ? 'Quero a tabela' : 'Quero o guia'}
        </a>
      ) : (
        <Link
          href={href}
          onClick={() => {
            markOfferClicked();
            track(EVENTS.ebookClick, { ebook: offer.id, posicao: 'barra', pagina: window.location.pathname });
          }}
          className="btn-teal !h-9 !px-3 text-xs whitespace-nowrap"
        >
          {offer.cta}
        </Link>
      )}
      <button
        type="button"
        onClick={() => {
          closeOfferBar();
          setClosed(true);
        }}
        className="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center text-bg/70 hover:text-bg"
        aria-label="Fechar"
      >
        <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </button>
    </div>
  );
}
