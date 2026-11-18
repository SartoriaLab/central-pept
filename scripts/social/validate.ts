// Barreira antes de publicar sem revisão: todo número com unidade do texto gerado precisa
// existir na fonte, e nada de linguagem de venda ou promessa de resultado. Puro.
import type { Draft } from './types';
import { isIllustration } from './illustrations';
import { isPose } from './poses';

const UNIT: Record<string, string> = {
  mg: 'mg', mcg: 'mcg', 'µg': 'mcg', 'μg': 'mcg', ml: 'ml', ui: 'ui', u: 'u', unidade: 'u', unidades: 'u',
  '%': '%', semana: 'semana', semanas: 'semana', dia: 'dia', dias: 'dia', hora: 'h', horas: 'h', h: 'h',
  kg: 'kg', minuto: 'min', minutos: 'min', min: 'min', mes: 'mes', meses: 'mes', 'mês': 'mes',
};

const NUM = String.raw`\d+(?:[.,]\d+)?`;
const UNIT_RE = String.raw`(mg|mcg|µg|μg|ml|ui|unidades|unidade|u|%|semanas|semana|dias|dia|horas|hora|h|kg|minutos|minuto|min|meses|mês|mes)`;
// "2,5 mg", "200-500 mcg", "1 a 2 semanas", "30 U"
const QTY = new RegExp(String.raw`(${NUM})(?:\s*(?:-|–|a|até|ou)\s*(${NUM}))?\s*${UNIT_RE}(?![\p{L}\d])`, 'giu');

function norm(n: string): string {
  return String(Number(n.replace(',', '.')));
}

/** Quantidades normalizadas ("2.5 mg"). Faixas entram pelas duas pontas. */
export function extractQuantities(text: string): Set<string> {
  const out = new Set<string>();
  for (const m of text.matchAll(QTY)) {
    const unit = UNIT[m[3].toLowerCase()];
    if (!unit) continue;
    out.add(`${norm(m[1])} ${unit}`);
    if (m[2]) out.add(`${norm(m[2])} ${unit}`);
  }
  return out;
}

export const BANNED: { re: RegExp; why: string }[] = [
  { re: /\bcompr(e|ar|ou|ando)\b/i, why: 'fala em comprar' },
  { re: /\bvendemos\b|\bvende-se\b|à venda/i, why: 'fala em vender' },
  { re: /\bonde (achar|encontrar|conseguir)\b/i, why: 'indica onde conseguir' },
  { re: /\b(frete|pix|whatsapp|direct|dm)\b/i, why: 'canal de venda' },
  { re: /\bcura(r)?\b/i, why: 'promete cura' },
  { re: /\bgarantid[oa]s?\b/i, why: 'promete resultado' },
  { re: /\b(perca|perder|emagre[çc]a|secar?)\s+(at[ée]\s+)?\d+/i, why: 'promete perda de peso em número' },
  { re: /sem efeitos? colaterais?/i, why: 'nega efeito colateral' },
  { re: /\b(seringa|agulha)s?\s+(entrando|na pele|no braço|na barriga)/i, why: 'descreve aplicação' },
];

/** O gancho abre com a dor ou a mania, nunca com cumprimento. */
const GREETING = /^\s*(oi+e?|ol[áa]|e a[íi]|bom dia|boa (tarde|noite)|hey)(?![\p{L}\d])/iu;
/** Os bordões são do código (caption.ts): no texto do Claude viram repetição. */
const CATCHPHRASE = /senta( a[íi])?,? que a gotinha|t[áa] falado/i;

export const LIMITS = {
  hook: 70,
  slideTitle: 70,
  slideBody: 220,
  slides: [2, 6] as const,
  narration: [3, 6] as const,
  narrationLine: 200,
  caption: 1500,
  question: 120,
  share: 80,
};

/** Lista de problemas; vazia = pode publicar. */
export function validateDraft(draft: Draft, source: string): string[] {
  const problems: string[] = [];
  const allowed = extractQuantities(source);
  const texts = [
    draft.hook,
    ...draft.slides.flatMap((s) => [s.title, s.body]),
    ...draft.narration.map((n) => n.text),
    draft.caption,
    draft.question,
    draft.share ?? '',
  ];

  for (const t of texts) {
    for (const q of extractQuantities(t)) {
      if (!allowed.has(q)) problems.push(`número fora da fonte: "${q}" em "${t.slice(0, 60)}"`);
    }
    for (const b of BANNED) {
      if (b.re.test(t)) problems.push(`${b.why}: "${t.slice(0, 60)}"`);
    }
    if (CATCHPHRASE.test(t)) problems.push(`bordão no texto (o código já acrescenta): "${t.slice(0, 60)}"`);
  }

  if (draft.hookIcon !== undefined && !isIllustration(draft.hookIcon)) problems.push(`ilustração da capa desconhecida "${draft.hookIcon}"`);
  if (draft.hookPose !== undefined && !isPose(draft.hookPose)) problems.push(`pose da capa desconhecida "${draft.hookPose}"`);
  if (draft.hook.length > LIMITS.hook) problems.push(`gancho com ${draft.hook.length} caracteres (máx. ${LIMITS.hook})`);
  for (const h of [draft.hook, draft.narration[0]?.text ?? '']) {
    if (GREETING.test(h)) problems.push(`gancho começa com cumprimento: "${h.slice(0, 60)}"`);
  }
  const [minS, maxS] = LIMITS.slides;
  if (draft.slides.length < minS || draft.slides.length > maxS) problems.push(`${draft.slides.length} slides (use ${minS} a ${maxS})`);
  draft.slides.forEach((s, i) => {
    if (s.title.length > LIMITS.slideTitle) problems.push(`slide ${i + 1}: título longo (${s.title.length})`);
    if (s.body.length > LIMITS.slideBody) problems.push(`slide ${i + 1}: texto longo (${s.body.length}, máx. ${LIMITS.slideBody})`);
    if (s.icon !== undefined && !isIllustration(s.icon)) problems.push(`slide ${i + 1}: ilustração desconhecida "${s.icon}"`);
    if (s.pose !== undefined && !isPose(s.pose)) problems.push(`slide ${i + 1}: pose desconhecida "${s.pose}"`);
  });
  const [minN, maxN] = LIMITS.narration;
  if (draft.narration.length < minN || draft.narration.length > maxN) problems.push(`${draft.narration.length} falas (use ${minN} a ${maxN})`);
  draft.narration.forEach((n, i) => {
    if (n.text.length > LIMITS.narrationLine) problems.push(`fala ${i + 1} longa (${n.text.length})`);
    if (n.pose !== undefined && !isPose(n.pose)) problems.push(`fala ${i + 1}: pose desconhecida "${n.pose}"`);
  });
  if (draft.caption.length > LIMITS.caption) problems.push(`legenda com ${draft.caption.length} caracteres (máx. ${LIMITS.caption})`);
  if (!draft.question.trim().endsWith('?')) problems.push('pergunta dos comentários precisa terminar com "?"');
  if (draft.question.length > LIMITS.question) problems.push(`pergunta com ${draft.question.length} caracteres (máx. ${LIMITS.question})`);
  if (draft.share !== undefined && draft.share.length > LIMITS.share) problems.push(`convite para compartilhar com ${draft.share.length} caracteres (máx. ${LIMITS.share})`);

  return [...new Set(problems)];
}
