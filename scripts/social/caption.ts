// Legenda final: gancho + corpo (IA) + chamada da bio + aviso + hashtags (código). Puro.
import { INSTAGRAM_HANDLE } from '@/lib/site';
import type { Cta, Draft, Topic } from './types';

export const MAX_CAPTION = 2200;
export const MAX_HASHTAGS = 5;

export const DISCLAIMER = 'Conteúdo educativo. Não substitui orientação médica.';

const CATEGORY_TAGS: Record<string, string[]> = {
  'glp-1': ['glp1', 'emagrecimento', 'saudemetabolica', 'peptideos'],
  'weight-loss': ['emagrecimento', 'saudemetabolica', 'peptideos', 'metabolismo'],
  healing: ['peptideos', 'recuperacao', 'lesao', 'saude'],
  gh: ['peptideos', 'hormonio', 'composicaocorporal', 'saude'],
  cosmetic: ['peptideos', 'pele', 'skincare', 'antienvelhecimento'],
  longevity: ['longevidade', 'peptideos', 'envelhecimentosaudavel', 'saude'],
  cognitive: ['peptideos', 'foco', 'saudemental', 'ciencia'],
  hormone: ['peptideos', 'hormonios', 'saudemasculina', 'saude'],
  sexual: ['peptideos', 'saude', 'bemestar', 'ciencia'],
  geral: ['peptideos', 'saude', 'ciencia', 'bemestar'],
};

export function hashtagsFor(topic: Topic): string[] {
  const own = topic.peptides.slice(0, 2).map((s) => s.replace(/[^a-z0-9]/g, ''));
  const base = CATEGORY_TAGS[topic.category] ?? CATEGORY_TAGS.geral;
  return [...new Set([...own, ...base])].slice(0, MAX_HASHTAGS).map((t) => `#${t}`);
}

export function ctaLine(cta: Cta | null): string {
  if (!cta) return `🧮 Calculadoras grátis no link da bio (@${INSTAGRAM_HANDLE}).`;
  const more = cta.others > 0 ? ` e mais ${cta.others} ${cta.others === 1 ? 'guia' : 'guias'}` : '';
  return `📘 O passo a passo completo está no guia "${cta.title}" (${cta.priceLabel})${more}. Link na bio: @${INSTAGRAM_HANDLE}`;
}

export function buildCaption(draft: Draft, topic: Topic, cta: Cta | null): string {
  const tail = ['', ctaLine(cta), '', DISCLAIMER, '', hashtagsFor(topic).join(' ')].join('\n');
  const head = `${draft.hook}\n\n`;
  const room = MAX_CAPTION - head.length - tail.length - 1; // 1 = "\n" entre corpo e cauda
  let body = draft.caption.trim();
  if (body.length > room) body = `${body.slice(0, Math.max(0, room - 1)).trimEnd()}…`;
  return `${head}${body}\n${tail}`;
}

/** Última fala do Reels (lida pela voz). */
export function ctaSpeech(cta: Cta | null): string {
  if (!cta) return 'A calculadora grátis está no link da bio. Salve este vídeo para consultar depois.';
  return `O passo a passo completo está no guia ${cta.title}. O link está na bio.`;
}
