// Quanto tempo dura um frasco e quantos frascos um ciclo pede. Funções puras
// (testadas em tests/vial-plan.test.ts), usadas por components/calculator/VialPlanner.tsx.

export type Freq = 'diaria' | '2x-dia' | '3x-semana' | '2x-semana' | 'semanal' | 'cada';

export const FREQ_LABELS: Record<Freq, string> = {
  diaria: '1× por dia',
  '2x-dia': '2× por dia',
  '3x-semana': '3× por semana',
  '2x-semana': '2× por semana',
  semanal: '1× por semana',
  cada: 'A cada X dias',
};

/** Dias entre aplicações. */
export function intervalDays(freq: Freq, everyDays = 1): number {
  switch (freq) {
    case 'diaria': return 1;
    case '2x-dia': return 0.5;
    case '3x-semana': return 7 / 3;
    case '2x-semana': return 3.5;
    case 'semanal': return 7;
    case 'cada': return Math.max(1, everyDays);
  }
}

export type VialPlanInput = {
  vialMg: number;
  doseMg: number;
  freq: Freq;
  everyDays?: number;
  cycleWeeks: number;
  /** Validade depois de reconstituir (dias). */
  shelfDays: number;
};

export type VialPlan = {
  /** Doses inteiras que cabem no frasco. */
  dosesPerVial: number;
  /** Doses aplicadas antes de vencer o frasco aberto. */
  dosesInShelf: number;
  /** Doses realmente usadas por frasco (o menor dos dois). */
  usablePerVial: number;
  /** Quantos dias um frasco dura. */
  daysPerVial: number;
  /** A validade termina antes de o conteúdo acabar. */
  limitedByShelf: boolean;
  /** mg que sobram e vão fora em cada frasco. */
  wastedMgPerVial: number;
  totalDoses: number;
  vialsNeeded: number;
  totalMg: number;
};

const EPS = 1e-9;

export function planVials(i: VialPlanInput): VialPlan | null {
  if (!(i.vialMg > 0 && i.doseMg > 0 && i.cycleWeeks > 0 && i.shelfDays > 0)) return null;
  const step = intervalDays(i.freq, i.everyDays);
  const dosesPerVial = Math.floor(i.vialMg / i.doseMg + EPS);
  if (dosesPerVial < 1) {
    return {
      dosesPerVial: 0, dosesInShelf: 0, usablePerVial: 0, daysPerVial: 0, limitedByShelf: false,
      wastedMgPerVial: 0, totalDoses: 0, vialsNeeded: 0, totalMg: 0,
    };
  }
  // Aplicações no dia 0, step, 2·step… enquanto o frasco aberto ainda vale.
  const dosesInShelf = Math.floor((i.shelfDays - EPS) / step) + 1;
  const usablePerVial = Math.min(dosesPerVial, dosesInShelf);
  const totalDoses = Math.ceil((i.cycleWeeks * 7) / step - EPS);
  return {
    dosesPerVial,
    dosesInShelf,
    usablePerVial,
    daysPerVial: usablePerVial * step,
    limitedByShelf: dosesInShelf < dosesPerVial,
    wastedMgPerVial: Math.max(0, i.vialMg - usablePerVial * i.doseMg),
    totalDoses,
    vialsNeeded: Math.ceil(totalDoses / usablePerVial - EPS),
    totalMg: totalDoses * i.doseMg,
  };
}
