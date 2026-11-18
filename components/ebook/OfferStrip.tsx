'use client';

// Faixa escura dentro do card de resultado, logo abaixo da seringa: o ponto em que a pessoa
// acabou de ver o número. Leva para a landing da oferta da página (a mesma do bloco de baixo).

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
      className="no-print group flex items-center gap-3 bg-[#134e4a] px-4 py-3 text-white transition hover:bg-[#115e59]"
    >
      <span className="text-xl" aria-hidden>⚠️</span>
      <span className="min-w-0 flex-1 text-sm leading-snug">
        <strong className="block font-extrabold">{title}</strong>
        <span className="text-white/75">{sub}</span>
      </span>
      <span className="whitespace-nowrap rounded-lg bg-amber-400 px-3 py-2 text-sm font-extrabold text-slate-900 group-hover:bg-amber-300">
        {offer.priceLabel} →
      </span>
    </Link>
  );
}
