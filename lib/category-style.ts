// Cores por categoria de peptídeo e por tom de status regulatório.
// Um lugar só: cards da enciclopédia, comparador, imagens de compartilhamento e selos.
// Classes Tailwind escritas por extenso (o Tailwind só gera classes que encontra no código).

/** Hex da cor de cada categoria (imagens OG, onde não há Tailwind). */
export const CATEGORY_HEX: Record<string, string> = {
  healing: '#22c55e',
  'glp-1': '#3b82f6',
  gh: '#8b5cf6',
  sexual: '#ec4899',
  cosmetic: '#f59e0b',
  longevity: '#14b8a6',
  'weight-loss': '#f97316',
  cognitive: '#6366f1',
  hormone: '#f43f5e',
};

/** Barra de acento dos cards (mesma cor de CATEGORY_HEX). */
export const CATEGORY_ACCENT: Record<string, string> = {
  healing: 'bg-green-500',
  'glp-1': 'bg-blue-500',
  gh: 'bg-violet-500',
  sexual: 'bg-pink-500',
  cosmetic: 'bg-amber-500',
  longevity: 'bg-teal-500',
  'weight-loss': 'bg-orange-500',
  cognitive: 'bg-indigo-500',
  hormone: 'bg-rose-500',
};

export function categoryAccent(category?: string): string {
  return (category && CATEGORY_ACCENT[category]) || 'bg-teal';
}

/** Fundo, borda e texto dos selos de status regulatório (REGULATORY_LABELS[x].tone). */
export const TONE_CLASS = {
  success: 'bg-green-50 border-green-200 text-green-800',
  neutral: 'bg-bg border-border-2 text-ink-2',
  warn: 'bg-amber-50 border-amber-200 text-amber-900',
  danger: 'bg-red-50 border-red-200 text-red-800',
} as const;
