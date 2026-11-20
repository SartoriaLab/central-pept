'use client';

// Faixa dentro do card de detalhes do frasco, abaixo do resultado: o ponto em que a pessoa
// acabou de ver o número. Leva para a landing da oferta da página (a mesma do bloco de cima).

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { offerHref } from '@/components/ebook/EbookOffer';
import { markOfferClicked } from '@/components/ebook/offer-store';
import type { EbookOffer as Offer } from '@/lib/ebooks';
import { EVENTS, track } from '@/lib/track';

type Props = { offer: Offer; title: string; sub: string };

export default function OfferStrip({ offer, title, sub }: Props) {
  const pathname = usePathname() || '/';
  return (
    <Link
      href={offerHref(offer, 'faixa', pathname)}
      onClick={() => {
        markOfferClicked();
        track(EVENTS.ebookClick, { ebook: offer.id, posicao: 'faixa', pagina: pathname });
      }}
      className="no-print group flex items-center gap-3 border-t border-border bg-teal-50 px-4 py-3 text-ink transition hover:bg-teal-100"
    >
      <span className="min-w-0 flex-1 text-sm leading-snug">
        <strong className="block font-bold">{title}</strong>
        <span className="text-ink-2">{sub}</span>
      </span>
      <span className="whitespace-nowrap rounded bg-teal-700 px-3 py-2 text-sm font-bold text-white">
        {offer.priceLabel}
      </span>
    </Link>
  );
}
