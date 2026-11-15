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

// Nome comercial que muita gente busca no lugar da molécula.
const BRAND_TAGS: Record<string, string> = { tirzepatida: 'mounjaro', semaglutida: 'ozempic', liraglutida: 'saxenda' };

export function hashtagsFor(topic: Topic): string[] {
  const own = topic.peptides.slice(0, 2).map((s) => s.replace(/[^a-z0-9]/g, ''));
  const brands = topic.peptides.slice(0, 2).flatMap((s) => (BRAND_TAGS[s] ? [BRAND_TAGS[s]] : []));
  const base = CATEGORY_TAGS[topic.category] ?? CATEGORY_TAGS.geral;
  return [...new Set([...own, ...brands, ...base])].slice(0, MAX_HASHTAGS).map((t) => `#${t}`);
}

/** Primeira linha (a única antes do "mais"): gancho + pedido para salvar, o sinal que mais pesa. */
export const SAVE_ASK = '📌 Salve para consultar depois.';

export const FOLLOW_LINE = `👉 Siga @${INSTAGRAM_HANDLE}: todo dia uma dúvida de peptídeos e GLP-1 explicada sem achismo.`;

export function questionLine(question: string): string {
  return `💬 ${question.trim()} Conta aqui nos comentários.`;
}

export function ctaLine(cta: Cta | null): string {
  if (!cta) return '🧮 Calculadoras grátis no link da bio.';
  const more = cta.others > 0 ? `, mais ${cta.others} ${cta.others === 1 ? 'guia' : 'guias'}` : '';
  return `📘 Guia "${cta.title}" (${cta.priceLabel})${more} e calculadoras grátis no link da bio.`;
}

/** Gancho e salvar → corpo (IA) → pergunta → seguir → guia → aviso → hashtags. */
export function buildCaption(draft: Draft, topic: Topic, cta: Cta | null): string {
  const tail = ['', questionLine(draft.question), '', FOLLOW_LINE, '', ctaLine(cta), '', DISCLAIMER, '', hashtagsFor(topic).join(' ')].join('\n');
  const head = `${draft.hook} ${SAVE_ASK}\n\n`;
  const room = MAX_CAPTION - head.length - tail.length - 1; // 1 = "\n" entre corpo e cauda
  let body = draft.caption.trim();
  if (body.length > room) body = `${body.slice(0, Math.max(0, room - 1)).trimEnd()}…`;
  return `${head}${body}\n${tail}`;
}

/** Última fala do Reels (lida pela voz). */
export function ctaSpeech(cta: Cta | null): string {
  if (!cta) return 'A calculadora grátis está no link da bio. Siga o Dose Certa para ver a próxima dúvida.';
  return `O passo a passo completo está no guia ${cta.title}, no link da bio. Siga o Dose Certa para ver a próxima dúvida.`;
}
