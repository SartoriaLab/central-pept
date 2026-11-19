// Cenários do @dosecerta_br: o fundo e as cores mudam de um post para o outro (o feed não fica
// repetitivo); a Gotinha, o logo, a fonte e o rodapé ficam sempre iguais (a marca).
import type { Format } from './types';

export const THEME_IDS = ['noite', 'claro', 'cor', 'caderno', 'azulejo'] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export type Theme = {
  id: ThemeId;
  /** Fundo (cor ou gradiente CSS). */
  bg: string;
  /** Desenho por cima do fundo (grade do caderno, rejunte do azulejo), em backgroundImage. */
  pattern?: { image: string; size: string };
  ink: string;
  ink2: string;
  ink3: string;
  /** Balão da capa e cartões. */
  card: string;
  cardInk: string;
  /** Texto escuro sobre a cor de destaque (botões). */
  onAccent: string;
  /** Fundo claro: a cor da categoria escurece para ter contraste. */
  light: boolean;
  /** Gotinha à direita e ilustração à esquerda (espelha a composição). */
  flip: boolean;
};

const NAVY = '#0b1220';
const SLATE = '#0f172a';

export const THEMES: Record<ThemeId, (accent: string) => Theme> = {
  noite: () => ({
    id: 'noite', bg: NAVY, ink: '#f8fafc', ink2: '#cbd5e1', ink3: '#64748b',
    card: '#f8fafc', cardInk: NAVY, onAccent: NAVY, light: false, flip: false,
  }),
  claro: () => ({
    id: 'claro', bg: '#fbf6ec', ink: SLATE, ink2: '#334155', ink3: '#94a3b8',
    card: SLATE, cardInk: '#fbf6ec', onAccent: '#ffffff', light: true, flip: true,
  }),
  cor: (accent) => ({
    id: 'cor', bg: `linear-gradient(160deg, ${accent} 0%, ${mix(accent, NAVY, 0.55)} 45%, ${NAVY} 100%)`,
    ink: '#ffffff', ink2: '#e2e8f0', ink3: '#94a3b8', card: '#ffffff', cardInk: NAVY, onAccent: NAVY, light: false, flip: false,
  }),
  caderno: () => ({
    id: 'caderno', bg: '#fffdf6',
    pattern: { image: 'linear-gradient(#dbe4f0 2px, transparent 2px), linear-gradient(90deg, #dbe4f0 2px, transparent 2px)', size: '60px 60px' },
    ink: SLATE, ink2: '#334155', ink3: '#94a3b8', card: '#fde68a', cardInk: SLATE, onAccent: '#ffffff', light: true, flip: true,
  }),
  azulejo: () => ({
    id: 'azulejo', bg: '#e6f4f1',
    pattern: { image: 'linear-gradient(#ffffff 6px, transparent 6px), linear-gradient(90deg, #ffffff 6px, transparent 6px)', size: '135px 135px' },
    ink: SLATE, ink2: '#1e293b', ink3: '#64748b', card: SLATE, cardInk: '#ffffff', onAccent: '#ffffff', light: true, flip: false,
  }),
};

/** Mistura duas cores hex (t = peso da segunda). */
export function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

/** Cor da categoria legível no cenário: em fundo claro, escurecida. */
export function accentOn(theme: Theme, accent: string): string {
  // No cenário "cor" o fundo já é a cor da categoria: o destaque vira branco.
  if (theme.id === 'cor') return '#ffffff';
  return theme.light ? mix(accent, '#000000', 0.35) : accent;
}

/**
 * Cenário do post: gira pela data, então dois dias seguidos nunca repetem, e o Reels do dia
 * sai num cenário diferente do carrossel.
 */
export function themeFor(date: string, format: Format): ThemeId {
  const day = Math.floor(new Date(`${date}T12:00:00Z`).getTime() / 86_400_000);
  return THEME_IDS[(day + (format === 'reels' ? 2 : 0)) % THEME_IDS.length];
}
