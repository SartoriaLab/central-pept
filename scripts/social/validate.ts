// Barreira antes de publicar sem revisão: todo número com unidade do texto gerado precisa
// existir na fonte, e nada de linguagem de venda ou promessa de resultado. Puro.
import type { Draft, SceneVisual } from './types';
import { isIllustration } from './illustrations';
import { LAYOUTS, layoutProblems } from './layouts';

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
  // Só na mesma linha e só o verbo: "boca seca" no fim de uma linha + "3️⃣" na seguinte não é promessa.
  { re: /\b(perca|perder|emagre[çc]a|secar)[ \t]+(at[ée][ \t]+)?\d+/i, why: 'promete perda de peso em número' },
  // Enquadramento de peso (23/11/2026: Reels sobre reganho sinalizado, conta fora das recomendações).
  { re: /(?<!\p{L})emagre[cç]/iu, why: 'fala em emagrecer' },
  { re: /(?<!\p{L})(perd(a|er|eu|eram|endo)|perdid[oa]s?|redu[çc][ãa]o|queda)\s+(\p{L}+\s+)?(de\s+|do\s+)?peso(?!\p{L})|peso\s+perdido/iu, why: 'fala em perda de peso' },
  { re: /(?<!\p{L})reganh|(recuper\p{L}*|volta\p{L}*|ganh\p{L}*)\s+(de\s+|do\s+|o\s+)?peso(?!\p{L})/iu, why: 'fala em reganho de peso' },
  { re: /(?<!\p{L})quilos?(?!\p{L})|%\s+do\s+peso/iu, why: 'fala em quilos ou % do peso' },
  { re: /antes\s+e\s+depois/i, why: 'antes e depois' },
  { re: /sem efeitos? colaterais?/i, why: 'nega efeito colateral' },
  { re: /\b(seringa|agulha)s?\s+(entrando|na pele|no braço|na barriga)/i, why: 'descreve aplicação' },
];

/** O gancho abre com a dor ou a mania, nunca com cumprimento. */
const GREETING = /^\s*(oi+e?|ol[áa]|e a[íi]|bom dia|boa (tarde|noite)|hey)(?![\p{L}\d])/iu;
/** Bordões da antiga mascote: o perfil não usa mais (nem o Claude, nem o texto antigo da fila). */
const CATCHPHRASE = /gotinha|t[áa] falado/i;

export const LIMITS = {
  hook: 70,
  slideTitle: 70,
  slideBody: 220,
  // Carrossel de 7 a 10 imagens (capa + conteúdo + guia) é o que mais engaja e é salvo.
  slides: [2, 8] as const,
  // Reels de até ~35 s: vídeo curto é mais visto até o fim, o sinal que mais pesa no alcance.
  narration: [3, 4] as const,
  narrationLine: 160,
  // Reels explicador de 40 a 60 s (8 a 12 cenas, até 170 palavras): curto é visto até o fim.
  scenes: [8, 12] as const,
  sceneWords: 170,
  hookWords: 10,
  sceneChip: 22,
  sceneKicker: 40,
  sceneTitle: 26,
  sceneSpeech: 140,
  sceneSource: 50,
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
    ...(draft.narration ?? []).map((n) => n.text),
    ...(draft.scenes ?? []).flatMap((c) => [c.chip, c.kicker, c.title, c.accent, c.speech, c.source ?? '', ...visualTexts(c.visual)]),
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
    if (CATCHPHRASE.test(t)) problems.push(`bordão da antiga mascote no texto: "${t.slice(0, 60)}"`);
  }

  if (draft.hookIcon !== undefined && !isIllustration(draft.hookIcon)) problems.push(`ilustração da capa desconhecida "${draft.hookIcon}"`);
  if (draft.hook.length > LIMITS.hook) problems.push(`gancho com ${draft.hook.length} caracteres (máx. ${LIMITS.hook})`);
  for (const h of [draft.hook, draft.scenes?.[0]?.speech ?? draft.narration?.[0]?.text ?? '']) {
    if (GREETING.test(h)) problems.push(`gancho começa com cumprimento: "${h.slice(0, 60)}"`);
  }
  const [minS, maxS] = LIMITS.slides;
  if (draft.slides.length < minS || draft.slides.length > maxS) problems.push(`${draft.slides.length} slides (use ${minS} a ${maxS})`);
  draft.slides.forEach((s, i) => {
    if (s.title.length > LIMITS.slideTitle) problems.push(`slide ${i + 1}: título longo (${s.title.length})`);
    if (s.body.length > LIMITS.slideBody) problems.push(`slide ${i + 1}: texto longo (${s.body.length}, máx. ${LIMITS.slideBody})`);
    if (s.icon !== undefined && !isIllustration(s.icon)) problems.push(`slide ${i + 1}: ilustração desconhecida "${s.icon}"`);
    if (s.layout !== undefined && !(LAYOUTS as readonly string[]).includes(s.layout)) problems.push(`slide ${i + 1}: tipo desconhecido "${s.layout}"`);
    else problems.push(...layoutProblems(i + 1, s));
  });
  // Ritmo: pelo menos um slide fora do padrão quando há 4 ou mais.
  if (draft.slides.length >= 4 && draft.slides.every((s) => (s.layout ?? 'padrao') === 'padrao')) {
    problems.push('todos os slides são "padrao": use ao menos um tipo diferente (mito, passos, lado, numero ou pergunta)');
  }
  if (draft.scenes) {
    const [minC, maxC] = LIMITS.scenes;
    if (draft.scenes.length < minC || draft.scenes.length > maxC) problems.push(`${draft.scenes.length} cenas (use ${minC} a ${maxC})`);
    draft.scenes.forEach((c, i) => problems.push(...sceneProblems(i + 1, c)));
    const words = (t: string) => t.split(/\s+/).filter(Boolean).length;
    const total = draft.scenes.reduce((n, c) => n + words(c.speech), 0);
    if (total > LIMITS.sceneWords) problems.push(`${total} palavras faladas nas cenas (máx. ${LIMITS.sceneWords}, cerca de 60 s)`);
    const hook = draft.scenes[0] ? words(draft.scenes[0].speech) : 0;
    if (hook > LIMITS.hookWords) problems.push(`gancho (cena 1) com ${hook} palavras (máx. ${LIMITS.hookWords})`);
  } else if (draft.narration) {
    const [minN, maxN] = LIMITS.narration;
    if (draft.narration.length < minN || draft.narration.length > maxN) problems.push(`${draft.narration.length} falas (use ${minN} a ${maxN})`);
    draft.narration.forEach((n, i) => {
      if (n.text.length > LIMITS.narrationLine) problems.push(`fala ${i + 1} longa (${n.text.length})`);
    });
  } else {
    problems.push('sem cenas do Reels (scenes)');
  }
  if (draft.caption.length > LIMITS.caption) problems.push(`legenda com ${draft.caption.length} caracteres (máx. ${LIMITS.caption})`);
  if (!draft.question.trim().endsWith('?')) problems.push('pergunta dos comentários precisa terminar com "?"');
  if (draft.question.length > LIMITS.question) problems.push(`pergunta com ${draft.question.length} caracteres (máx. ${LIMITS.question})`);
  if (draft.share !== undefined && draft.share.length > LIMITS.share) problems.push(`convite para compartilhar com ${draft.share.length} caracteres (máx. ${LIMITS.share})`);

  return [...new Set(problems)];
}

/** Textos que aparecem no desenho da cena (também passam pela checagem de números e de venda). */
export function visualTexts(v: SceneVisual): string[] {
  switch (v.type) {
    case 'frasco': return [v.label, v.tag ?? '', v.stamp ?? ''];
    case 'frascos': return [v.left.label, v.left.note ?? '', v.right.label, v.right.note ?? ''];
    case 'numero': return [v.value, v.note];
    case 'barras': return v.bars.flatMap((b) => [b.label, b.display]);
    case 'pontos': return [v.note];
    case 'linha': return [...v.steps, v.note ?? ''];
    case 'lista': return v.items.map((x) => x.text);
    case 'icone': return [v.note ?? ''];
    case 'carimbo': return [v.text, v.note ?? ''];
  }
}

/** Forma de uma cena: limites de texto e do desenho (o que cabe no quadro). */
export function sceneProblems(n: number, c: NonNullable<Draft['scenes']>[number]): string[] {
  const p: string[] = [];
  const at = `cena ${n}`;
  const max = (label: string, text: string | undefined, limit: number) => {
    if (text && text.length > limit) p.push(`${at}: ${label} com ${text.length} caracteres (máx. ${limit})`);
  };
  max('selo', c.chip, LIMITS.sceneChip);
  max('linha de cima', c.kicker, LIMITS.sceneKicker);
  max('título', c.title, LIMITS.sceneTitle);
  max('destaque do título', c.accent, LIMITS.sceneTitle);
  max('fala', c.speech, LIMITS.sceneSpeech);
  max('fonte', c.source, LIMITS.sceneSource);
  if (!c.speech.trim()) p.push(`${at}: fala vazia`);
  const v = c.visual;
  switch (v.type) {
    case 'frasco':
      max('rótulo', v.label, 14);
      max('etiqueta', v.tag, 14);
      max('carimbo', v.stamp, 18);
      break;
    case 'frascos':
      max('rótulo', v.left.label, 14);
      max('rótulo', v.right.label, 14);
      max('nota do frasco', v.left.note, 28);
      max('nota do frasco', v.right.note, 28);
      break;
    case 'numero':
      max('número', v.value, 9);
      max('nota', v.note, 50);
      break;
    case 'barras':
      if (v.bars.length < 2 || v.bars.length > 4) p.push(`${at}: ${v.bars.length} barras (use 2 a 4)`);
      if (v.bars.some((b) => !(b.value >= 0))) p.push(`${at}: barra com valor negativo ou inválido`);
      v.bars.forEach((b) => max('rótulo da barra', b.label, 26));
      break;
    case 'pontos':
      if (!(v.total >= 1 && v.total <= 400)) p.push(`${at}: pontos.total precisa ficar entre 1 e 400`);
      if (!(v.marked >= 0 && v.marked <= v.total)) p.push(`${at}: pontos.marked precisa ficar entre 0 e total`);
      max('nota', v.note, 50);
      break;
    case 'linha':
      if (v.steps.length < 2 || v.steps.length > 5) p.push(`${at}: ${v.steps.length} etapas (use 2 a 5)`);
      if (!(Number.isInteger(v.current) && v.current >= 0 && v.current < v.steps.length)) p.push(`${at}: linha.current fora das etapas`);
      v.steps.forEach((s) => max('etapa', s, 12));
      max('nota', v.note, 50);
      break;
    case 'lista':
      if (v.items.length < 2 || v.items.length > 4) p.push(`${at}: ${v.items.length} itens (use 2 a 4)`);
      v.items.forEach((x) => max('item', x.text, 40));
      break;
    case 'icone':
      if (!isIllustration(v.icon)) p.push(`${at}: ilustração desconhecida "${v.icon}"`);
      max('nota', v.note, 50);
      break;
    case 'carimbo':
      max('carimbo', v.text, 18);
      max('nota', v.note, 40);
      break;
    default:
      p.push(`${at}: desenho desconhecido`);
  }
  return p;
}
