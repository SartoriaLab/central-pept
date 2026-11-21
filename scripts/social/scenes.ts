// Cenas do Reels e slides do carrossel no visual "papel" (papel.tsx), a partir do rascunho.
// Texto novo traz `scenes` prontas; texto antigo da fila (só `narration`) ganha cenas montadas
// aqui: uma por frase, com o título e a ilustração do slide correspondente. Puro.
import { lines, sides, type SlideLayout } from './layouts';
import type { Draft, Scene, SceneVisual, Topic } from './types';

/**
 * Divide um título único em duas linhas (a segunda vai em destaque) pelo meio, em caracteres,
 * sem quebrar palavra.
 */
export function splitTitle(text: string): [string, string] {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return [text.trim(), ''];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
}

export const KIND_CHIP: Record<Topic['kind'], string> = { post: 'sem achismo', peptide: 'ficha rápida', comparison: 'comparativo' };

/** Frases de um texto (ponto final, interrogação, exclamação), juntando as muito curtas. */
export function sentences(text: string): string[] {
  const parts = text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
  const out: string[] = [];
  for (const p of parts) {
    if (out.length && (p.length < 30 || out[out.length - 1].length < 30)) out[out.length - 1] += ` ${p}`;
    else out.push(p);
  }
  return out;
}

/** Desenho de um slide antigo conforme o tipo (layout) e a ilustração. */
export function visualForSlide(s: Draft['slides'][number]): SceneVisual | undefined {
  const layout: SlideLayout = s.layout ?? 'padrao';
  if (layout === 'passos') return { type: 'lista', items: lines(s.body).slice(0, 4).map((text) => ({ text, mark: 'ok' as const })) };
  if (layout === 'lado') {
    const [a, b] = sides(s.body);
    // Lado a lado não julga: as duas linhas levam a mesma marca (vermelho daria a ideia de "errado").
    if (a && b) return { type: 'lista', items: [{ text: `${a.label}: ${a.text}`, mark: 'ok' }, { text: `${b.label}: ${b.text}`, mark: 'ok' }] };
  }
  if (layout === 'numero') return { type: 'numero', value: s.title, note: '' };
  if (layout === 'mito') return { type: 'carimbo', text: 'Mito', note: s.title.length <= 40 ? `“${s.title}”` : undefined };
  return s.icon ? { type: 'icone', icon: s.icon } : undefined;
}

/** Cenas do Reels: as do rascunho ou, no texto antigo, uma por frase da narração. */
export function scenesFor(draft: Draft, topic: Topic): Scene[] {
  if (draft.scenes?.length) return draft.scenes;
  const narration = draft.narration ?? [];
  const chip = KIND_CHIP[topic.kind];
  const out: Scene[] = [];
  narration.forEach((line, li) => {
    // Fala 0 = gancho (título = hook); as demais seguem os slides na ordem.
    const slide = li === 0 ? undefined : draft.slides[Math.min(li - 1, draft.slides.length - 1)];
    const [title, accent] = splitTitle(li === 0 ? draft.hook : slide?.title ?? topic.title);
    const base = slide ? visualForSlide(slide) : undefined;
    const icon = li === 0 ? draft.hookIcon ?? draft.slides[0]?.icon : slide?.icon;
    const visual: SceneVisual = base && base.type !== 'icone' ? base : icon ? { type: 'icone', icon } : { type: 'carimbo', text: 'Sem achismo' };
    for (const speech of sentences(line.text)) {
      out.push({ chip, kicker: '', title, accent, tone: li === 0 || slide?.layout === 'mito' ? 'vermelho' : 'azul', speech, visual });
    }
  });
  return out;
}
