// Escolha do tema do dia. Puro: recebe o histórico, devolve o tema.
import type { Format, HistoryEntry, Topic } from './types';

/** Um tema não volta antes disso (em qualquer formato). */
export const COOLDOWN_DAYS = 45;

/** Post e ficha do mesmo peptídeo de nicho (prioridade 0) ficam ao menos isso separados. */
export const PEPTIDE_GAP_DAYS = 14;

const DAY = 24 * 60 * 60 * 1000;

/**
 * Prioridade do tema pelo que mais engaja o público (mulheres de 30 a 55 com caneta GLP-1; pesquisa
 * de 2026 em docs/instagram-setup.md, Parte 8): 3 = VIRAL_RANK; 2 = dúvida prática de GLP-1 que gera busca e envio
 * (enjoo, dose esquecida, guardar, unidades, efeito colateral, falsificação, parar o remédio);
 * 1 = resto de GLP-1, cagrilintida (CagriSema) e pele; 0 = demais peptídeos.
 */
const VIRAL =
  /dose-esquecida|nausea|efeitos-colaterais|como-guardar|faz-efeito|efeito-rebote|falso|quantas-unidades|seringa|semaglutida-vs-tirzepatida$|retatrutida-no-brasil|manipulada|sem-diabetes|frasco-reconstituido|como-reconstituir-(tirzepatida|semaglutida)|agua-bacteriostatica/;

/**
 * Os mais virais do nicho no Instagram brasileiro (levantamento de 21/11/2026: Reels com mais
 * visualizações de perfis de GLP-1), em ordem: saem primeiro no Reels, nesta ordem, antes do resto.
 * "Parou a caneta, a fome volta", traços da seringa, caneta falsa, "a aplicação dura 7 dias?",
 * dose esquecida, medo de efeito colateral, "Mounjaro 2.0"...
 */
export const VIRAL_RANK = [
  'post:efeito-rebote-apos-parar-tirzepatida',
  'post:seringa-insulina-30-50-100-unidades',
  'post:mounjaro-falso-como-identificar',
  'post:quanto-tempo-tirzepatida-faz-efeito',
  'post:dose-esquecida-semaglutida-tirzepatida',
  'post:efeitos-colaterais-tirzepatida',
  'post:retatrutida-vs-tirzepatida-estudos',
  'post:nausea-tirzepatida-como-lidar',
  'post:onde-aplicar-tirzepatida-semaglutida',
  'post:quantas-unidades-tirzepatida-semaglutida',
  'post:semaglutida-vs-tirzepatida',
  'post:efeito-rebote-apos-parar-semaglutida',
  'post:ozempic-falso-como-identificar',
  'post:retatrutida-no-brasil-anvisa',
  // Outros peptídeos que viralizaram (GHK-Cu na pele, BPC-157 "Wolverine", BPC-157 + TB-500,
  // retatrutida "Mounjaro 2.0"): sempre com o que falta de estudo em humanos e de registro.
  'post:ghk-cu-para-que-serve',
  'peptide:bpc-157',
  'comparison:bpc-157-vs-tb-500',
  'post:retatrutida-o-que-e',
  'post:ghk-cu-vitamina-c-retinol-acidos',
  'post:tb-500-para-que-serve',
  'comparison:bpc-157-vs-ghk-cu',
  'post:bpc-157-ciclo-duracao',
];
const rank = (t: Topic) => VIRAL_RANK.indexOf(t.id);

/** No carrossel, os do ranking ficam abaixo das outras dúvidas práticas: são do Reels. */
export function topicPriority(t: Topic, format: Format = 'reels'): number {
  if (rank(t) >= 0) return format === 'reels' ? 3 : 1.5;
  if (VIRAL.test(t.id)) return 2;
  if (['glp-1', 'cosmetic'].includes(t.category) || t.id.includes('cagrilintida')) return 1;
  return 0;
}

/**
 * Regras, em ordem: (1) fora da quarentena de COOLDOWN_DAYS; (1b) peptídeo de nicho que saiu há
 * menos de PEPTIDE_GAP_DAYS (em post ou ficha) fica para depois; (2) maior `topicPriority`;
 * (3) categoria diferente da última publicação; (4) nunca usado antes do usado há mais tempo.
 * Sem candidato fora da quarentena, volta o tema de uso mais antigo. Empates seguem a ordem de
 * `topics`. `exclude`: temas que já falharam nesta execução (ou reservados pela fila).
 */
export function pickTopic(
  topics: Topic[],
  history: HistoryEntry[],
  format: Format,
  now: Date,
  exclude: Set<string> = new Set(),
): Topic | undefined {
  const lastUse = new Map<string, number>();
  for (const h of history) {
    const t = h.at.getTime();
    if ((lastUse.get(h.topicId) ?? -Infinity) < t) lastUse.set(h.topicId, t);
  }
  const lastCategory = [...history].sort((a, b) => b.at.getTime() - a.at.getTime())[0]?.category;

  const pool = topics.filter((t) => !exclude.has(t.id));
  if (pool.length === 0) return undefined;

  const age = (t: Topic) => lastUse.get(t.id) ?? -Infinity;
  const byOldest = (a: Topic, b: Topic) => age(a) - age(b);

  const allRested = pool.filter((t) => now.getTime() - age(t) >= COOLDOWN_DAYS * DAY);
  if (allRested.length === 0) return [...pool].sort(byOldest)[0];

  // Peptídeo de nicho que acabou de sair (post ou ficha) espera PEPTIDE_GAP_DAYS.
  const byId = new Map(topics.map((t) => [t.id, t]));
  const recent = new Set(
    history
      .filter((h) => now.getTime() - h.at.getTime() < PEPTIDE_GAP_DAYS * DAY)
      .map((h) => byId.get(h.topicId))
      .filter((t): t is Topic => !!t && topicPriority(t) === 0)
      .flatMap((t) => t.peptides),
  );
  const spaced = allRested.filter((t) => topicPriority(t) > 0 || !t.peptides.some((p) => recent.has(p)));
  const rested = spaced.length > 0 ? spaced : allRested;

  const prio = (t: Topic) => topicPriority(t, format);
  const top = Math.max(...rested.map(prio));
  const fresh = rested.filter((t) => prio(t) === top);
  // Os do ranking saem na ordem dele, sem alternar categoria.
  if (top === 3) return [...fresh].sort((a, b) => byOldest(a, b) || rank(a) - rank(b))[0];
  const otherCategory = fresh.filter((t) => t.category !== lastCategory);
  const candidates = otherCategory.length > 0 ? otherCategory : fresh;
  // sort é estável: empates mantêm a ordem original.
  return [...candidates].sort(byOldest)[0];
}
