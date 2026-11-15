// Escolha do tema do dia. Puro: recebe o histórico, devolve o tema.
import type { Format, HistoryEntry, Topic } from './types';

/** Um tema não volta antes disso (em qualquer formato). */
export const COOLDOWN_DAYS = 45;

const DAY = 24 * 60 * 60 * 1000;

/**
 * Regras, em ordem: (1) fora da quarentena de COOLDOWN_DAYS; (2) nunca usado antes do usado há
 * mais tempo; (3) categoria diferente da última publicação. Sem candidato na quarentena, volta o
 * tema de uso mais antigo. Empates seguem a ordem de `topics`.
 * `exclude`: temas que já falharam nesta execução.
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

  const fresh = pool.filter((t) => now.getTime() - age(t) >= COOLDOWN_DAYS * DAY);
  if (fresh.length === 0) return [...pool].sort(byOldest)[0];

  const otherCategory = fresh.filter((t) => t.category !== lastCategory);
  const candidates = otherCategory.length > 0 ? otherCategory : fresh;
  // sort é estável: empates mantêm a ordem original.
  return [...candidates].sort(byOldest)[0];
}
