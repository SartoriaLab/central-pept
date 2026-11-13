'use client';

// Oferta de ebook dentro das páginas. Recebe a oferta já resolvida no servidor
// (lib/ebooks.ts → toOffer) e não renderiza nada quando ela é null.
//
// Variantes:
//   card   — capa, 3 itens do sumário e preço (ficha, marca, fim de artigo, índices)
//   line   — uma linha (logo depois do resumo do artigo)
//   result — compacta, embaixo do resultado da calculadora; `lead` usa o dado calculado
//
// Nunca aparece na impressão (no-print) nem nos embeds (a calculadora não recebe oferta).

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EbookCover from '@/components/ebook/EbookCover';
import type { EbookOffer as Offer } from '@/lib/ebooks';
import { EVENTS, track, trackOnce } from '@/lib/track';

type Props = {
  offer: Offer | null | undefined;
  variant?: 'card' | 'line' | 'result';
  /** Frase com o dado da pessoa (variante result). */
  lead?: string;
  className?: string;
};

export default function EbookOffer({ offer, variant = 'card', lead, className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el || !offer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackOnce(EVENTS.ebookView, { ebook: offer.id, posicao: variant });
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [offer, variant]);

  if (!offer) return null;

  const href = `/ebooks/${offer.slug}?origem=${variant}&de=${encodeURIComponent(pathname || '/')}`;
  const onClick = () => track(EVENTS.ebookClick, { ebook: offer.id, posicao: variant });
  const price = offer.priceLabel;

  if (variant === 'line') {
    return (
      <aside ref={ref} className={`not-prose no-print my-6 ${className}`} aria-label="Guia em PDF">
        <Link
          href={href}
          onClick={onClick}
          className="group flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 rounded-xl border border-border bg-surface hover:border-teal transition-colors"
        >
          <span className="text-sm text-ink-2 leading-snug flex-1 min-w-[12rem]">{offer.line}</span>
          <span className="text-sm font-semibold text-teal-700 whitespace-nowrap group-hover:underline">
            Ver o guia · {price} →
          </span>
        </Link>
      </aside>
    );
  }

  if (variant === 'result') {
    return (
      <aside
        ref={ref}
        className={`no-print rounded-xl border border-teal-100 bg-teal-50 p-4 ${className}`}
        aria-label="Guia em PDF"
      >
        <div className="flex items-start gap-3">
          <EbookCover title={offer.title} cover={offer.cover} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Próximo passo</p>
            <p className="mt-1 text-sm text-ink leading-snug">
              {lead ? <strong>{lead} </strong> : null}
              {offer.hook}
            </p>
            <Link
              href={href}
              onClick={onClick}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 hover:underline"
            >
              {offer.title} · {price} →
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside ref={ref} className={`not-prose no-print my-10 card p-5 md:p-6 ${className}`} aria-label="Guia em PDF">
      <div className="flex items-start gap-4 md:gap-5">
        <EbookCover title={offer.title} cover={offer.cover} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Guia em PDF</p>
          <h2 className="mt-1 text-lg md:text-xl font-extrabold text-ink leading-tight">{offer.title}</h2>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed">{offer.hook}</p>
          <ul className="mt-3 space-y-1 text-sm text-ink-2">
            {offer.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-teal-700" aria-hidden>✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={href} onClick={onClick} className="btn-teal">
              Ver o guia · {price}
            </Link>
            <span className="text-xs text-ink-3">7 dias de garantia · Pix, cartão ou boleto</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
