// Legenda final: gancho + corpo (IA) + chamada da bio + aviso + hashtags (código). Puro.
import { INSTAGRAM_HANDLE } from '@/lib/site';
import { DM_KEYWORD } from '@/lib/instagram-dm';
import type { Cta, Draft, Topic } from './types';

export const MAX_CAPTION = 2200;
export const MAX_HASHTAGS = 5;

export const DISCLAIMER = 'Conteúdo educativo. Não substitui orientação médica.';

const CATEGORY_TAGS: Record<string, string[]> = {
  // Sem #emagrecimento: o Instagram deixa de recomendar conteúdo que promove produto para emagrecer.
  'glp-1': ['glp1', 'efeitocolateral', 'peptideos', 'metabolismo'],
  'weight-loss': ['glp1', 'efeitocolateral', 'peptideos', 'metabolismo'],
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

// Tudo na voz do perfil, em primeira pessoa, como no vídeo. Sem mascote nem bordão.

/** Primeira linha (a única antes do "mais"): gancho + pedido para salvar, o sinal que mais pesa. */
export const SAVE_ASK = '📌 Salva pra não esquecer.';

/** Seguir como promessa de algo diário (motivo para voltar), não só como pedido. */
export const FOLLOW_LINE = `💧 Segue o @${INSTAGRAM_HANDLE}: todo dia uma dúvida de Mounjaro, Ozempic e peptídeos explicada sem achismo, com fonte.`;

/** Sem o complemento do Claude, convite genérico para mandar o post. */
export const SHARE_FALLBACK = 'aquela amiga que também está nessa';

export function questionLine(question: string): string {
  return `💬 ${question.trim()} Me conta aqui embaixo 👇`;
}

/**
 * Compartilhar é o que mais leva o post para quem ainda não segue: o convite aponta uma pessoa
 * concreta ("aquela amiga que também come correndo"), não "alguém".
 */
function shareTarget(share?: string): string {
  const who = (share ?? '').trim().replace(/^(manda|mande|envia|envie)\s+(isso\s+)?(pra|para)\s+/i, '').replace(/[.!]+$/, '');
  return who || SHARE_FALLBACK;
}

export function shareLine(share?: string): string {
  return `👯‍♀️ Manda pra ${shareTarget(share)}.`;
}

/**
 * Palavra que a pessoa comenta para receber o guia no direct (app/api/instagram/webhook, regras
 * em lib/instagram-dm.ts). O webhook acha o guia pelo título entre aspas desta linha da legenda.
 */
export function ctaLine(cta: Cta | null): string {
  if (!cta) return `🧮 Comenta ${DM_KEYWORD} que eu te mando as calculadoras grátis no direct.`;
  // Sem preço nem desconto na legenda: as diretrizes de recomendação do Instagram tiram da
  // aba Explorar/Reels (não seguidores) o post que vende produto com alegação de saúde. Preço e
  // cupom vão só no direct (lib/instagram-dm.ts).
  const more = cta.others > 0 ? ` Mais ${cta.others} ${cta.others === 1 ? 'guia' : 'guias'} e calculadoras grátis no link da bio.` : ' Calculadoras grátis no link da bio.';
  return `📘 Comenta ${DM_KEYWORD} que eu te mando no direct o guia "${cta.title}".${more}`;
}

/** Gancho e salvar → corpo (IA) → pergunta → compartilhar → seguir → guia → aviso → hashtags. */
export function buildCaption(draft: Draft, topic: Topic, cta: Cta | null): string {
  const tail = [
    '', questionLine(draft.question), '', shareLine(draft.share), '', FOLLOW_LINE, '', ctaLine(cta), '', DISCLAIMER, '', hashtagsFor(topic).join(' '),
  ].join('\n');
  const hook = draft.hook.trim();
  const head = `${/[.!?…]$/.test(hook) ? hook : `${hook}.`} ${SAVE_ASK}\n\n`;
  const room = MAX_CAPTION - head.length - tail.length - 1; // 1 = "\n" entre corpo e cauda
  let body = draft.caption.trim();
  if (body.length > room) body = `${body.slice(0, Math.max(0, room - 1)).trimEnd()}…`;
  return `${head}${body}\n${tail}`;
}

/**
 * Última fala do Reels: pedir o comentário (vira direct com o guia) e o envio do vídeo (o sinal
 * que mais leva a quem não segue). A palavra vai em minúscula porque em maiúscula a voz soletra.
 */
export function ctaSpeech(cta: Cta | null, share?: string): string {
  // Sem "desconto" na fala, como na legenda (diretrizes de recomendação): o cupom vai no direct.
  const what = cta ? 'o guia completo no direct' : 'as calculadoras grátis no direct';
  // "Comenta guia" sai "comenta aqui a" na voz (conferido com transcrição): "a palavra" separa.
  return `Comenta a palavra ${DM_KEYWORD.toLowerCase()} aqui embaixo que eu te mando ${what}. E manda esse vídeo pra ${shareTarget(share)}.`;
}
