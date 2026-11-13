'use client';

// Botão de compra da landing. Leva a origem da oferta (?origem=card&de=/peptideos/x)
// para a Kiwify como UTM; o webhook grava esses campos em `conversions`.

import { useEffect, useState } from 'react';
import { EVENTS, track } from '@/lib/track';

type Props = {
  ebookId: string;
  slug: string;
  checkoutUrl: string;
  label: string;
  /** Posição do botão na landing (hero, final, barra). */
  position: string;
  className?: string;
};

function withUtm(base: string, slug: string, origem: string, de: string): string {
  try {
    const url = new URL(base);
    url.searchParams.set('utm_source', 'site');
    url.searchParams.set('utm_medium', origem);
    url.searchParams.set('utm_campaign', `ebook-${slug}`);
    if (de) url.searchParams.set('utm_content', de.slice(0, 120));
    return url.toString();
  } catch {
    return base;
  }
}

export default function CheckoutButton({ ebookId, slug, checkoutUrl, label, position, className = 'btn-teal' }: Props) {
  const [origem, setOrigem] = useState('direto');
  const [href, setHref] = useState(() => withUtm(checkoutUrl, slug, 'direto', ''));

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const o = (q.get('origem') || 'direto').slice(0, 40);
    setOrigem(o);
    setHref(withUtm(checkoutUrl, slug, o, q.get('de') || ''));
  }, [checkoutUrl, slug]);

  return (
    <a
      href={href}
      rel="noopener"
      onClick={() => track(EVENTS.ebookCheckout, { ebook: ebookId, posicao: `landing-${position}`, origem })}
      className={className}
    >
      {label}
    </a>
  );
}
