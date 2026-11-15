'use client';

// Oferta de ebook dentro das páginas. Recebe a oferta já resolvida no servidor
// (lib/ebooks.ts → offerFor/toOffer) e não renderiza nada quando ela é null.
//
// Variantes:
//   card   — capa, gancho, 3 itens, âncora de preço e botão (ficha, marca, fim de artigo, índices)
//   line   — faixa curta com capa e botão (logo depois do resumo do artigo)
//   result — embaixo do resultado da calculadora; `lead` usa o dado calculado. No celular, quando
//            a pessoa rola para além do bloco, aparece uma barra fina no rodapé (OfferBar).
//
// Toda variante registra a oferta para o pop-up de saída (offer-store → ExitOffer).
// Nunca aparece na impressão (no-print) nem nos embeds (a calculadora não recebe oferta).

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EbookCover from '@/components/ebook/EbookCover';
import AnchorNote from './AnchorNote';
import OfferBar from '@/components/ebook/OfferBar';
import { clearPageOffer, markOfferClicked, setPageOffer } from '@/components/ebook/offer-store';
import type { EbookOffer as Offer } from '@/lib/ebooks';
import { EVENTS, track, trackOnce } from '@/lib/track';

type Variant = 'card' | 'line' | 'result';

type Props = {
  offer: Offer | null | undefined;
  variant?: Variant;
  /** Frase com o dado da pessoa (variantes result e line). */
  lead?: string;
  className?: string;
  /** Conteúdo extra no bloco do resultado (ex.: prévia da tabela). */
  children?: ReactNode;
};

/** Link da landing com a origem (variante e página), lida pelo CheckoutButton para as UTMs. */
export function offerHref(offer: Offer, origem: string, pathname: string | null): string {
  return `/ebooks/${offer.slug}?origem=${origem}&de=${encodeURIComponent(pathname || '/')}`;
}

export default function EbookOffer({ offer, variant = 'card', lead, className = '', children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname() || '/';
  // Para a barra do celular: o bloco já passou para cima da tela.
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (!offer) return;
    setPageOffer(offer);
    return () => clearPageOffer(offer);
  }, [offer]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !offer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) trackOnce(EVENTS.ebookView, { ebook: offer.id, posicao: variant, pagina: pathname });
        setPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [offer, variant, pathname]);

  if (!offer) return null;

  const href = offerHref(offer, variant, pathname);
  const onClick = () => {
    markOfferClicked();
    track(EVENTS.ebookClick, { ebook: offer.id, posicao: variant, pagina: pathname });
  };
  const price = offer.priceLabel;
  const proof = `${offer.pages} páginas · acesso imediato · 7 dias de garantia`;

  if (variant === 'line') {
    return (
      <aside ref={ref} className={`not-prose no-print my-6 ${className}`} aria-label="Guia em PDF">
        <div className="flex items-center gap-3 px-3 py-3 sm:px-4 rounded-xl border border-teal-100 bg-teal-50">
          <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} size="xs" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink leading-snug">
              {lead ? <strong>{lead} </strong> : null}
              {offer.line}
            </p>
            <Link href={href} onClick={onClick} className="btn-teal !h-9 !px-3 mt-2 text-xs">
              {offer.cta} · {price}
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  if (variant === 'result') {
    return (
      <>
        <aside
          ref={ref}
          className={`no-print rounded-xl border border-teal-100 bg-teal-50 p-4 ${className}`}
          aria-label="Guia em PDF"
        >
          <div className="flex items-start gap-3">
            <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Próximo passo</p>
              <p className="mt-1 text-sm text-ink leading-snug">
                {lead ? <strong>{lead} </strong> : null}
                {offer.hook}
              </p>
            </div>
          </div>
          {children}
          <AnchorNote text={offer.anchor} className="mt-3" />
          <Link href={href} onClick={onClick} className="btn-teal w-full mt-3">
            {offer.cta} · {price}
          </Link>
          <p className="mt-2 text-center text-xs text-ink-3">{proof}</p>
        </aside>
        <OfferBar offer={offer} show={passed} href={offerHref(offer, 'barra', pathname)} />
      </>
    );
  }

  return (
    <aside ref={ref} className={`not-prose no-print my-10 card p-5 md:p-6 ${className}`} aria-label="Guia em PDF">
      <div className="flex items-start gap-4 md:gap-5">
        <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">{offer.coverLabel}</p>
          <h2 className="mt-1 text-lg md:text-xl font-extrabold text-ink leading-tight">{offer.title}</h2>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed">{offer.hook}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <ul className="space-y-1.5 text-sm text-ink-2">
          {offer.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-teal-700" aria-hidden>✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {offer.sample ? (
          // Página real do PDF: mostra o produto antes do clique.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offer.sample}
            alt={`Página de amostra do guia ${offer.title}`}
            width={112}
            height={158}
            loading="lazy"
            className="hidden sm:block w-28 h-auto rounded-md border border-border shadow-sm bg-white"
          />
        ) : null}
      </div>
      <AnchorNote text={offer.anchor} className="mt-4" />
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2">
        <Link href={href} onClick={onClick} className="btn-teal w-full sm:w-auto">
          {offer.cta === 'Ver a tabela' ? 'Quero a minha tabela' : 'Quero ver o guia'} · {price}
        </Link>
        <span className="text-xs text-ink-3 text-center sm:text-left">{proof}</span>
      </div>
    </aside>
  );
}
