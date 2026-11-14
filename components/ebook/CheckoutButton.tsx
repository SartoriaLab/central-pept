'use client';

// Botão de compra da landing. Leva a origem da oferta (?origem=card&de=/peptideos/x)
// para a Kiwify como UTM; o webhook grava esses campos em `conversions`.

import { useEffect, useState } from 'react';
import { EVENTS, track } from '@/lib/track';
import { EXIT_COUPON } from '@/lib/ebooks';

/** Cupom do pop-up de saída guardado na sessão (ExitOffer grava, o checkout lê). */
export const COUPON_KEY = 'cp:cupom';

/** Cupom válido vindo da URL (?cupom=) ou da sessão; só aceita o cupom de saída atual. */
function activeCoupon(q: URLSearchParams): string | null {
  if (!EXIT_COUPON) return null;
  let code = q.get('cupom');
  try {
    if (code) window.sessionStorage.setItem(COUPON_KEY, code);
    else code = window.sessionStorage.getItem(COUPON_KEY);
  } catch {}
  return code && code.toUpperCase() === EXIT_COUPON.code ? EXIT_COUPON.code : null;
}

type Props = {
  ebookId: string;
  slug: string;
  checkoutUrl: string;
  label: string;
  /** Posição do botão na landing (hero, final, barra). */
  position: string;
  className?: string;
};

function withUtm(base: string, slug: string, origem: string, de: string, coupon: string | null = null): string {
  try {
    const url = new URL(base);
    if (coupon) url.searchParams.set('coupon', coupon);
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
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const o = (q.get('origem') || 'direto').slice(0, 40);
    const c = activeCoupon(q);
    setOrigem(o);
    setCoupon(c);
    setHref(withUtm(checkoutUrl, slug, o, q.get('de') || '', c));
  }, [checkoutUrl, slug]);

  const button = (
    <a
      href={href}
      rel="noopener"
      onClick={() => track(EVENTS.ebookCheckout, { ebook: ebookId, posicao: `landing-${position}`, origem, ...(coupon ? { cupom: coupon } : {}) })}
      className={className}
    >
      {label}
    </a>
  );
  if (!coupon || !EXIT_COUPON) return button;
  return (
    <span className="inline-flex flex-col items-stretch gap-1">
      {button}
      <span className="text-center text-xs font-semibold text-teal-700">
        Cupom {coupon} ({EXIT_COUPON.percent}%) já vai aplicado no checkout
      </span>
    </span>
  );
}
