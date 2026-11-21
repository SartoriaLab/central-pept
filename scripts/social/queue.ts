// Fila de textos prontos (social/fila/<data>-<formato>/): o plano simula a escolha do tema dia a
// dia, como o robô faria, e cada pasta guarda o tema (brief.json) e o texto escrito (texto.json).
// No dia, `run.ts <formato> --fila` publica o texto da pasta; sem pasta, a tarefa cai no --brief.
import { COOLDOWN_DAYS, pickTopic } from './pick';
import type { Format, HistoryEntry, Topic } from './types';

/**
 * Horário de cada formato em Brasília por dia da semana (0 = domingo), iguais às tarefas de
 * agendar.ps1 (mudou aqui → mude lá). Reels todo dia no pico de cada dia (pesquisa de 21/11/2026 em
 * docs/instagram-setup.md, Parte 7): 19h no começo da noite, 18h na sexta (cai depois das 21h) e
 * 10h no sábado (pico de manhã). Carrossel todo dia ao meio-dia.
 */
export const REELS_HOURS = ['19:00', '19:00', '19:00', '19:00', '19:00', '18:00', '10:00'] as const;
export const CAROUSEL_HOUR = '12:00';

const weekday = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay();

export type QueueItem = { date: string; format: Format; topicId: string };

export const queueKey = (date: string, format: Format) => `${date}-${format}`;

export function slotTime(date: string, format: Format): Date {
  const hour = format === 'reels' ? REELS_HOURS[weekday(date)] : CAROUSEL_HOUR;
  return new Date(`${date}T${hour}:00-03:00`);
}

/** Datas (AAAA-MM-DD) a partir de `start`, por `days` dias. */
export function dateRange(start: string, days: number): string[] {
  const base = new Date(`${start}T12:00:00Z`);
  return Array.from({ length: days }, (_, i) => new Date(base.getTime() + i * 86_400_000).toISOString().slice(0, 10));
}

/** Os dois formatos todo dia; o Reels escolhe primeiro e fica com o tema mais viral do dia. */
export function formatsOn(_date: string): Format[] {
  return ['reels', 'carrossel'];
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
