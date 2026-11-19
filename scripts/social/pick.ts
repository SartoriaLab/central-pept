// Escolha do tema do dia. Puro: recebe o histórico, devolve o tema.
import type { Format, HistoryEntry, Topic } from './types';

/** Um tema não volta antes disso (em qualquer formato). */
export const COOLDOWN_DAYS = 45;

/** Post e ficha do mesmo peptídeo de nicho (prioridade 0) ficam ao menos isso separados. */
export const PEPTIDE_GAP_DAYS = 14;

const DAY = 24 * 60 * 60 * 1000;

/**
 * Prioridade do tema pelo que mais engaja o público (mulheres de 30 a 55 com caneta GLP-1; pesquisa
 * de 2026 em docs/instagram-setup.md, Parte 8): 2 = dúvida prática de GLP-1 que gera busca e envio
 * (enjoo, dose esquecida, guardar, unidades, efeito colateral, falsificação, parar o remédio);
 * 1 = resto de GLP-1, cagrilintida (CagriSema) e pele; 0 = demais peptídeos.
 */
const VIRAL =
  /dose-esquecida|nausea|efeitos-colaterais|como-guardar|faz-efeito|efeito-rebote|falso|quantas-unidades|seringa|semaglutida-vs-tirzepatida$|retatrutida-no-brasil|manipulada|sem-diabetes|frasco-reconstituido|como-reconstituir-(tirzepatida|semaglutida)|agua-bacteriostatica/;

export function topicPriority(t: Topic): number {
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
  _format: Format,
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

  const top = Math.max(...rested.map(topicPriority));
  const fresh = rested.filter((t) => topicPriority(t) === top);
  const otherCategory = fresh.filter((t) => t.category !== lastCategory);
  const candidates = otherCategory.length > 0 ? otherCategory : fresh;
  // sort é estável: empates mantêm a ordem original.
  return [...candidates].sort(byOldest)[0];
}
