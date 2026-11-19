// Fila de textos prontos (social/fila/<data>-<formato>/): o plano simula a escolha do tema dia a
// dia, como o robô faria, e cada pasta guarda o tema (brief.json) e o texto escrito (texto.json).
// No dia, `run.ts <formato> --fila` publica o texto da pasta; sem pasta, a tarefa cai no --brief.
import { COOLDOWN_DAYS, pickTopic } from './pick';
import type { Format, HistoryEntry, Topic } from './types';

/** Dias com Reels (0 = domingo), iguais ao cron da tarefa dosecerta-reels. */
export const REELS_DAYS = [0, 1, 3, 5];

/** Horário de cada formato em Brasília, iguais às tarefas agendadas. */
const HOUR: Record<Format, string> = { carrossel: '12:00', reels: '19:30' };

export type QueueItem = { date: string; format: Format; topicId: string };

export const queueKey = (date: string, format: Format) => `${date}-${format}`;

export function slotTime(date: string, format: Format): Date {
  return new Date(`${date}T${HOUR[format]}:00-03:00`);
}

/** Datas (AAAA-MM-DD) a partir de `start`, por `days` dias. */
export function dateRange(start: string, days: number): string[] {
  const base = new Date(`${start}T12:00:00Z`);
  return Array.from({ length: days }, (_, i) => new Date(base.getTime() + i * 86_400_000).toISOString().slice(0, 10));
}

export function formatsOn(date: string): Format[] {
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  return REELS_DAYS.includes(weekday) ? ['carrossel', 'reels'] : ['carrossel'];
}

/**
 * Plano dos próximos dias: para cada horário, o tema que o robô escolheria com o histórico real
 * mais o que a própria fila já vai publicar. Itens que já existem (`existing`) ficam como estão, e
 * seus temas não são escolhidos de novo em outro dia.
 */
export function planQueue(
  topics: Topic[],
  history: HistoryEntry[],
  start: string,
  days: number,
  existing: QueueItem[] = [],
): QueueItem[] {
  const byKey = new Map(existing.map((e) => [queueKey(e.date, e.format), e]));
  const category = new Map(topics.map((t) => [t.id, t.category]));
  // Itens da fila antes do início contam como já publicados (quarentena de cada tema).
  const sim = [
    ...history,
    ...existing
      .filter((e) => e.date < start)
      .map((e) => ({ topicId: e.topicId, format: e.format, category: category.get(e.topicId) ?? 'geral', at: slotTime(e.date, e.format) })),
  ];
  const out: QueueItem[] = [];
  const later = existing.filter((e) => e.date >= start);

  for (const date of dateRange(start, days)) {
    for (const format of formatsOn(date)) {
      const at = slotTime(date, format);
      let item = byKey.get(queueKey(date, format));
      if (!item) {
        // Temas que a fila já publica perto deste horário (dentro da quarentena) ficam de fora.
        const near = (e: QueueItem) => Math.abs(slotTime(e.date, e.format).getTime() - at.getTime()) < COOLDOWN_DAYS * 86_400_000;
        const reserved = new Set(later.filter(near).map((e) => e.topicId));
        const topic = pickTopic(topics, sim, format, at, reserved) ?? pickTopic(topics, sim, format, at);
        if (!topic) continue;
        item = { date, format, topicId: topic.id };
      }
      out.push(item);
      sim.push({ topicId: item.topicId, format, category: category.get(item.topicId) ?? 'geral', at });
    }
  }
  return out;
}

/** Temas que a fila vai publicar de `from` em diante: o --brief não os usa para não repetir. */
export function reservedFrom(items: QueueItem[], from: string): Set<string> {
  return new Set(items.filter((i) => i.date >= from).map((i) => i.topicId));
}
