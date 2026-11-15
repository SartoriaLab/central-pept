// Tabela personalizada de reconstituição (produto pago, gerada em /tabela-personalizada).
// Funções puras: os mesmos números da calculadora de reconstituição, organizados para imprimir.
// Testadas em tests/tabela.test.ts.

import { intervalDays, type Freq } from './vial-plan';

export type Syringe = 30 | 50 | 100;

export type TabelaInput = {
  vialMg: number;
  waterMl: number;
  /** Dose da pessoa, já em mg. */
  doseMg: number;
  syringe: Syringe;
  freq: Freq;
  everyDays?: number;
  /** Data da reconstituição (AAAA-MM-DD). */
  startISO: string;
  /** Validade do frasco depois de reconstituído, em dias. */
  shelfDays: number;
  /** Outras doses para a tabela (ex.: escada de titulação), em mg. */
  extraDosesMg?: number[];
};

export type DoseRow = { doseMg: number; units: number; ml: number; fits: boolean; mine: boolean };
export type CalendarRow = { n: number; dateISO: string; period?: 'manhã' | 'noite'; leftMg: number };

export type Tabela = {
  concentration: number;
  unitsPerDose: number;
  mlPerDose: number;
  /** Doses inteiras que o frasco tem. */
  dosesPerVial: number;
  doseRows: DoseRow[];
  calendar: CalendarRow[];
  discardISO: string;
  /** O frasco vence antes de acabar. */
  limitedByShelf: boolean;
  /** mg que sobram no frasco no dia do descarte. */
  wastedMg: number;
};

const EPS = 1e-9;
const MAX_ROWS = 12;
const MAX_CALENDAR = 120;

/** Soma dias a uma data AAAA-MM-DD sem passar por fuso horário. */
export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

export function unitsFor(doseMg: number, vialMg: number, waterMl: number): number {
  return (doseMg * waterMl * 100) / vialMg;
}

function round(n: number, dec: number): number {
  const f = 10 ** dec;
  return Math.round(n * f) / f;
}

export function buildTabela(i: TabelaInput): Tabela | null {
  if (!(i.vialMg > 0 && i.waterMl > 0 && i.doseMg > 0 && i.shelfDays > 0)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(i.startISO)) return null;

  const concentration = i.vialMg / i.waterMl;
  const unitsPerDose = unitsFor(i.doseMg, i.vialMg, i.waterMl);
  const dosesPerVial = Math.floor(i.vialMg / i.doseMg + EPS);

  // Doses da tabela: a da pessoa, as extras (escada) e meia, 1,5× e 2× a dose dela.
  const candidates = [i.doseMg, ...(i.extraDosesMg ?? []), i.doseMg / 2, i.doseMg * 1.5, i.doseMg * 2]
    .map((d) => round(d, 4))
    .filter((d) => d > 0 && d <= i.vialMg + EPS);
  const unique = Array.from(new Set(candidates)).sort((a, b) => a - b);
  // Corta pelas pontas mantendo a dose da pessoa.
  while (unique.length > MAX_ROWS) {
    const mineAt = unique.indexOf(round(i.doseMg, 4));
    if (mineAt > unique.length / 2) unique.shift();
    else unique.pop();
  }
  const doseRows: DoseRow[] = unique.map((d) => {
    const units = unitsFor(d, i.vialMg, i.waterMl);
    return { doseMg: d, units, ml: units / 100, fits: units <= i.syringe + EPS, mine: d === round(i.doseMg, 4) };
  });

  // Calendário: aplicações a cada `step` dias enquanto há dose inteira e o frasco ainda vale.
  const step = intervalDays(i.freq, i.everyDays);
  const calendar: CalendarRow[] = [];
  for (let k = 0; k < Math.min(dosesPerVial, MAX_CALENDAR); k++) {
    const day = k * step;
    if (day >= i.shelfDays - EPS) break;
    const whole = Math.floor(day + EPS);
    calendar.push({
      n: k + 1,
      dateISO: addDaysISO(i.startISO, whole),
      period: step < 1 ? (day - whole < 0.25 ? 'manhã' : 'noite') : undefined,
      leftMg: Math.max(0, round(i.vialMg - (k + 1) * i.doseMg, 4)),
    });
  }
  const used = calendar.length;

  return {
    concentration,
    unitsPerDose,
    mlPerDose: unitsPerDose / 100,
    dosesPerVial,
    doseRows,
    calendar,
    discardISO: addDaysISO(i.startISO, Math.floor(i.shelfDays + EPS)),
    limitedByShelf: used < dosesPerVial,
    wastedMg: Math.max(0, round(i.vialMg - used * i.doseMg, 4)),
  };
}

/** Frequência a partir do texto da ficha ("1x por semana", "2-3x por dia"…); null se não der para saber. */
export function guessFreq(text: string | undefined): Freq | null {
  const t = (text ?? '').toLowerCase().trim();
  if (/^(2-3x|2x|3x) por dia/.test(t)) return '2x-dia';
  if (/^(1-2x|1x) por dia/.test(t)) return 'diaria';
  if (/^(2-3x|3x) por semana/.test(t)) return '3x-semana';
  if (/^2x por semana/.test(t)) return '2x-semana';
  if (/^1x por semana/.test(t)) return 'semanal';
  return null;
}
