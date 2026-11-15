'use client';

// Medição da landing do guia: a visita (com a origem da oferta que trouxe a pessoa) e o
// clique no pacote. Sem isso não dá para calcular a taxa de conversão da página.

import { useEffect } from 'react';
import Link from 'next/link';
import { EVENTS, track, trackOnce } from '@/lib/track';

function origem(): string {
  if (typeof window === 'undefined') return 'direto';
  return (new URLSearchParams(window.location.search).get('origem') || 'direto').slice(0, 40);
}

export function LandingView({ ebookId }: { ebookId: string }) {
  useEffect(() => {
    trackOnce(EVENTS.ebookLanding, { ebook: ebookId, origem: origem() });
  }, [ebookId]);
  return null;
}

/** Link de um card de lista de guias (/ebooks, /links): registra o clique com a posição. */
export function IndexLink({
  ebookId, href, className, children, posicao = 'indice', pagina = '/ebooks',
}: { ebookId: string; href: string; className?: string; children: React.ReactNode; posicao?: string; pagina?: string }) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(EVENTS.ebookClick, { ebook: ebookId, posicao, pagina })}
    >
      {children}
    </Link>
  );
}

export function KitLink({
  ebookId, kitId, href, className, children,
}: { ebookId: string; kitId: string; href: string; className?: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track(EVENTS.ebookKitClick, { ebook: kitId, de: ebookId })}
    >
      {children}
    </Link>
  );
}
