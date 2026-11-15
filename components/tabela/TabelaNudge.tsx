'use client';

// Aviso curto que aparece depois de imprimir, copiar ou compartilhar o cálculo: quem quer
// o resultado fora da tela é exatamente quem a Tabela personalizada atende.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { offerHref } from '@/components/ebook/EbookOffer';
import { markOfferClicked } from '@/components/ebook/offer-store';
import type { EbookOffer as Offer } from '@/lib/ebooks';
import { EVENTS, track } from '@/lib/track';

export default function TabelaNudge({ offer, className = '' }: { offer: Offer; className?: string }) {
  const pathname = usePathname() || '/';
  return (
    <aside
      className={`no-print flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200 ${className}`}
      aria-label="Tabela em PDF"
    >
      <span className="min-w-0 flex-1 leading-snug">
        Quer isso numa folha para a geladeira, com o calendário do frasco e a etiqueta?
      </span>
      <Link
        href={offerHref(offer, 'aviso', pathname)}
        onClick={() => {
          markOfferClicked();
          track(EVENTS.ebookClick, { ebook: offer.id, posicao: 'aviso', pagina: pathname });
        }}
        className="btn-teal !h-9 !px-3 text-xs whitespace-nowrap"
      >
        {offer.priceLabel}
      </Link>
    </aside>
  );
}
