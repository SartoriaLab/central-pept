'use client';
// Convite para seguir o @dosecerta_br. O site recebe ~2 mil visitas por semana (Vercel, nov/2026)
// e era o único caminho até o perfil que não existia: quem chega pela calculadora vira seguidor
// e o perfil ganha a primeira base para os Reels serem testados. Clique vai para site_events.
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/site';
import { EVENTS } from '@/lib/event-names';
import { track } from '@/lib/track';

type Props = { via: 'rodape' | 'post' | 'calculadora'; variant?: 'card' | 'line' };

function Glyph({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function InstagramFollow({ via, variant = 'card' }: Props) {
  const onClick = () => track(EVENTS.instagramFollow, { via });
  if (variant === 'line') {
    return (
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 py-1.5 font-semibold text-teal-700 hover:underline"
      >
        <Glyph size={15} />@{INSTAGRAM_HANDLE}
      </a>
    );
  }
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="not-prose flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 md:p-5 no-underline hover:border-teal-500 transition-colors"
    >
      <span className="shrink-0 grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400 text-white">
        <Glyph size={24} />
      </span>
      <span className="min-w-0">
        <span className="block font-bold text-ink">Uma dúvida por dia, em 1 minuto</span>
        <span className="block text-sm text-ink-2 leading-snug">
          Mounjaro, Ozempic e peptídeos explicados com fonte, em vídeo curto. Siga @{INSTAGRAM_HANDLE}.
        </span>
      </span>
      <span className="ml-auto shrink-0 rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white">Seguir</span>
    </a>
  );
}
