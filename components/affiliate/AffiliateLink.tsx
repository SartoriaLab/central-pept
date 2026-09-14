'use client';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  slot: string;
  peptide?: string;
  className?: string;
  children: ReactNode;
};

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
  }
}

/**
 * Link de afiliado com evento Plausible. O clique já é registrado no banco
 * por /api/click; o evento serve para ver o funil no painel do Plausible
 * sem precisar de acesso ao Postgres.
 */
export default function AffiliateLink({ href, slot, peptide, className, children }: Props) {
  const track = () => {
    try {
      window.plausible?.('outbound-whatsapp', {
        props: { slot, peptide: peptide ?? 'generico' },
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener"
      onClick={track}
      className={className}
    >
      {children}
    </a>
  );
}
