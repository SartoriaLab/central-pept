// Dose esquecida de GLP-1: o que a bula de cada marca manda fazer. Mesmas regras e fontes do
// post /blog/dose-esquecida-semaglutida-tirzepatida (mudou a bula → mude os dois).
// Funções puras, sem `Date.now()`: quem chama informa o "agora" (testes em tests/missed-dose.test.ts).

import { parseLocalDate } from './dates';

export type MissedMed = {
  id: string;
  /** Nome da marca. */
  label: string;
  /** Princípio ativo, em minúsculas. */
  active: string;
  /** Slug em lib/peptides.ts (escolhe o guia oferecido). */
  peptideSlug: string;
  kind: 'weekly' | 'daily';
  /**
   * Prazo da bula para aplicar a dose atrasada. Em dias, conta dias de calendário (esqueceu na
   * segunda: vale até o fim do sábado); em horas, conta a partir do horário previsto.
   */
  window?: { unit: 'days' | 'hours'; value: number };
  /** Como a bula escreve o prazo. */
  windowText?: string;
  source: string;
};

export const MISSED_MEDS: MissedMed[] = [
  {
    id: 'ozempic', label: 'Ozempic', active: 'semaglutida', peptideSlug: 'semaglutida', kind: 'weekly',
    window: { unit: 'days', value: 5 }, windowText: 'até 5 dias depois da data prevista',
    source: 'Bula do Ozempic (ANVISA e FDA)',
  },
  {
    id: 'wegovy', label: 'Wegovy', active: 'semaglutida', peptideSlug: 'semaglutida', kind: 'weekly',
    window: { unit: 'days', value: 5 }, windowText: 'até 5 dias depois da data prevista',
    source: 'Bula brasileira do Wegovy (ANVISA)',
  },
  {
    id: 'mounjaro', label: 'Mounjaro', active: 'tirzepatida', peptideSlug: 'tirzepatida', kind: 'weekly',
    window: { unit: 'hours', value: 96 }, windowText: 'até 4 dias (96 horas) depois do horário previsto',
    source: 'Bula do Mounjaro (Eli Lilly)',
  },
  {
    id: 'zepbound', label: 'Zepbound', active: 'tirzepatida', peptideSlug: 'tirzepatida', kind: 'weekly',
    window: { unit: 'hours', value: 96 }, windowText: 'até 4 dias (96 horas) depois do horário previsto',
    source: 'Bula do Zepbound (Eli Lilly, FDA)',
  },
  {
    id: 'rybelsus', label: 'Rybelsus', active: 'semaglutida oral', peptideSlug: 'semaglutida', kind: 'daily',
    source: 'Bula do Rybelsus (ANVISA e FDA)',
  },
];

/** Intervalo mínimo entre duas injeções semanais ao trocar o dia da aplicação (bulas: 72 horas). */
export const MIN_GAP_DAYS = 3;

export type MissedResult =
  /** A data prevista ainda não chegou. */
  | { status: 'not-late'; due: Date }
  /** Dentro do prazo: aplicar assim que lembrar e manter o dia de sempre. */
  | { status: 'take-now'; deadline: Date; next: Date; lateDays: number }
  /** Passou do prazo: pular e aplicar a próxima no dia de sempre. */
  | { status: 'skip'; next: Date; lateDays: number }
  /** Uma semana depois: hoje já é o dia da dose seguinte. */
  | { status: 'next-due'; lateDays: number }
  /** Mais de uma dose esquecida: a bula manda falar com o médico. */
  | { status: 'several'; lateDays: number }
  /** Comprimido diário: não se recupera. */
  | { status: 'daily' };

const DAY_MS = 24 * 60 * 60 * 1000;

function addDays(d: Date, days: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, d.getHours(), d.getMinutes());
}

/** Dias de calendário entre duas datas (ignora o horário). */
function calendarDays(from: Date, to: Date): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((b - a) / DAY_MS);
}

/**
 * O que fazer com a dose que deveria ter sido tomada em `dueISO` (AAAA-MM-DD) às `dueTime` (hh:mm),
 * considerando que agora é `now`. Devolve null se a data ou o medicamento não forem válidos.
 */
export function missedDose(medId: string, dueISO: string, dueTime: string, now: Date): MissedResult | null {
  const med = MISSED_MEDS.find((m) => m.id === medId);
  if (!med) return null;
  const [h, min] = /^\d{2}:\d{2}$/.test(dueTime) ? dueTime.split(':').map(Number) : [8, 0];
  const due = parseLocalDate(dueISO, h, min);
  if (Number.isNaN(due.getTime())) return null;

  const lateDays = calendarDays(due, now);
  if (med.kind === 'daily') return lateDays < 0 ? { status: 'not-late', due } : { status: 'daily' };

  if (now.getTime() < due.getTime()) return { status: 'not-late', due };
  if (lateDays > 7) return { status: 'several', lateDays };
  if (lateDays === 7) return { status: 'next-due', lateDays };

  const next = addDays(due, 7);
  const w = med.window!;
  if (w.unit === 'days') {
    if (lateDays > w.value) return { status: 'skip', next, lateDays };
    const last = addDays(due, w.value);
    return { status: 'take-now', deadline: new Date(last.getFullYear(), last.getMonth(), last.getDate(), 23, 59), next, lateDays };
  }
  const deadline = new Date(due.getTime() + w.value * 60 * 60 * 1000);
  if (now.getTime() > deadline.getTime()) return { status: 'skip', next, lateDays };
  return { status: 'take-now', deadline, next, lateDays };
}
