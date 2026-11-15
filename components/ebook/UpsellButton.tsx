'use client';

// Botão do upsell na página de obrigado: leva ao checkout da oferta pós-compra do kit.

import { EVENTS, track } from '@/lib/track';

export default function UpsellButton({ href, label, from }: { href: string; label: string; from: string }) {
  return (
    <a
      href={href}
      rel="noopener"
      onClick={() => track(EVENTS.ebookCheckout, { ebook: 'KIT', posicao: 'upsell', origem: from })}
      className="btn-teal w-full sm:w-auto"
    >
      {label}
    </a>
  );
}
