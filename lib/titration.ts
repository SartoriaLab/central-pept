// Esquemas de titulação (subida de dose) de agonistas GLP-1.
// Compartilhado pela calculadora de titulação, pela tabela de doses imprimível,
// pela calculadora de custo, pelas páginas de marca e pelas de reconstituição por peptídeo.
//
// Atenção ao consumir: há esquemas semanais (semaglutida/tirzepatida injetáveis) e diários
// (liraglutida injetável, semaglutida oral). Ferramentas que só fazem sentido para
// aplicação semanal ou para frasco injetável devem filtrar por `frequency`/`route`.

export type TitrationRoute = 'injetavel' | 'oral';
export type TitrationFrequency = 'diaria' | 'semanal';

export type TitrationScheme = {
  id: string;
  /** Slug do peptídeo em lib/peptides.ts. */
  peptideSlug: string;
  name: string;
  /** Unidade da dose: 'mg/semana' ou 'mg/dia'. */
  unit: string;
  route: TitrationRoute;
  frequency: TitrationFrequency;
  /** Duração mínima de cada etapa pela bula, em dias (28 = 4 semanas). */
  stepDays: number;
  /** Durações de etapa oferecidas na calculadora (a primeira é a da bula). */
  stepOptionsDays: number[];
  /** Doses de cada etapa, em ordem; todas as etapas duram `stepDays`. */
  steps: { dose: number }[];
  notes: string;
};

const WEEKLY_STEP_OPTIONS = [28, 42, 56];

// Baseados nas bulas FDA (Ozempic, Wegovy, Mounjaro, Zepbound, Victoza, Saxenda, Rybelsus)
// e, para retatrutida, nos ensaios de fase 3.
export const TITRATION_SCHEMES: TitrationScheme[] = [
  {
    id: 'semaglutida-t2d',
    peptideSlug: 'semaglutida',
    name: 'Semaglutida — Ozempic (diabetes tipo 2)',
    unit: 'mg/semana',
    route: 'injetavel',
    frequency: 'semanal',
    stepDays: 28,
    stepOptionsDays: WEEKLY_STEP_OPTIONS,
    steps: [{ dose: 0.25 }, { dose: 0.5 }, { dose: 1.0 }, { dose: 2.0 }],
    notes: 'Protocolo Ozempic. Cada etapa dura 4 semanas (por padrão) antes de subir.',
  },
  {
    id: 'semaglutida-obesity',
    peptideSlug: 'semaglutida',
    name: 'Semaglutida — Wegovy (obesidade/sobrepeso)',
    unit: 'mg/semana',
    route: 'injetavel',
    frequency: 'semanal',
    stepDays: 28,
    stepOptionsDays: WEEKLY_STEP_OPTIONS,
    steps: [{ dose: 0.25 }, { dose: 0.5 }, { dose: 1.0 }, { dose: 1.7 }, { dose: 2.4 }],
    notes: 'Protocolo Wegovy. 5 etapas até a dose de manutenção de 2,4 mg/semana.',
  },
  {
    id: 'tirzepatida-t2d',
    peptideSlug: 'tirzepatida',
    name: 'Tirzepatida — Mounjaro (diabetes tipo 2)',
    unit: 'mg/semana',
    route: 'injetavel',
    frequency: 'semanal',
    stepDays: 28,
    stepOptionsDays: WEEKLY_STEP_OPTIONS,
    steps: [{ dose: 2.5 }, { dose: 5 }, { dose: 7.5 }, { dose: 10 }, { dose: 12.5 }, { dose: 15 }],
    notes: 'Protocolo Mounjaro. Titulação em incrementos de 2,5 mg a cada ≥4 semanas.',
  },
  {
    id: 'tirzepatida-obesity',
    peptideSlug: 'tirzepatida',
    name: 'Tirzepatida — Zepbound (obesidade/sobrepeso)',
    unit: 'mg/semana',
    route: 'injetavel',
    frequency: 'semanal',
    stepDays: 28,
    stepOptionsDays: WEEKLY_STEP_OPTIONS,
    steps: [{ dose: 2.5 }, { dose: 5 }, { dose: 7.5 }, { dose: 10 }, { dose: 12.5 }, { dose: 15 }],
    notes: 'Mesmo esquema do Mounjaro; marca Zepbound aprovada em 2023 para obesidade.',
  },
  {
    id: 'retatrutida',
    peptideSlug: 'retatrutida',
    name: 'Retatrutida (tri-agonista — experimental, fase 3)',
    unit: 'mg/semana',
    route: 'injetavel',
    frequency: 'semanal',
    stepDays: 28,
    stepOptionsDays: WEEKLY_STEP_OPTIONS,
    steps: [{ dose: 2 }, { dose: 4 }, { dose: 6 }, { dose: 8 }, { dose: 10 }, { dose: 12 }],
    notes: 'Retatrutida (LY3437943, tri-agonista GLP-1/GIP/glucagon). Ainda em fase 3 (TRIUMPH) — ainda sem aprovação FDA/ANVISA. Protocolo baseado nos trials: incrementos de 2 mg a cada 4 semanas até 12 mg/semana.',
  },
  {
    id: 'liraglutida-t2d',
    peptideSlug: 'liraglutida',
    name: 'Liraglutida — Victoza (diabetes tipo 2)',
    unit: 'mg/dia',
    route: 'injetavel',
    frequency: 'diaria',
    stepDays: 7,
    stepOptionsDays: [7, 14],
    steps: [{ dose: 0.6 }, { dose: 1.2 }, { dose: 1.8 }],
    notes: 'Protocolo Victoza. Aplicação diária: 0,6 mg por 1 semana (adaptação) e depois 1,2 mg. A subida para 1,8 mg/dia é opcional — só se for preciso mais controle da glicose, após pelo menos 1 semana em 1,2 mg.',
  },
  {
    id: 'liraglutida-obesity',
    peptideSlug: 'liraglutida',
    name: 'Liraglutida — Saxenda (obesidade/sobrepeso)',
    unit: 'mg/dia',
    route: 'injetavel',
    frequency: 'diaria',
    stepDays: 7,
    stepOptionsDays: [7, 14],
    steps: [{ dose: 0.6 }, { dose: 1.2 }, { dose: 1.8 }, { dose: 2.4 }, { dose: 3.0 }],
    notes: 'Protocolo Saxenda. Aplicação diária, subindo 0,6 mg a cada semana até a manutenção de 3 mg/dia. Se um aumento não for tolerado, a bula permite adiar a subida por cerca de mais 1 semana; em adolescentes a escalada pode levar até 8 semanas.',
  },
  {
    id: 'semaglutida-oral-t2d',
    peptideSlug: 'semaglutida',
    name: 'Semaglutida oral — Rybelsus (diabetes tipo 2)',
    unit: 'mg/dia',
    route: 'oral',
    frequency: 'diaria',
    stepDays: 30,
    stepOptionsDays: [30, 60],
    steps: [{ dose: 3 }, { dose: 7 }, { dose: 14 }],
    notes: 'Protocolo Rybelsus (comprimido). 3 mg/dia nos dias 1 a 30 (só adaptação), 7 mg/dia a partir do dia 31 e, se for preciso mais controle da glicose, 14 mg/dia a partir do dia 61. Tomar em jejum, com até 120 ml de água, 30 minutos antes de comer. A bula americana atual inclui também uma formulação nova (vendida como Ozempic comprimido) com 1,5 → 4 → 9 mg/dia, que não é intercambiável mg a mg com o Rybelsus.',
  },
];

export function getTitrationScheme(id: string): TitrationScheme | undefined {
  return TITRATION_SCHEMES.find((s) => s.id === id);
}

/**
 * Doses (mg) distintas da titulação de um peptídeo, em ordem crescente.
 * Por padrão só os esquemas injetáveis — doses orais (Rybelsus) não fazem sentido
 * em tabelas de frasco reconstituído. Filtre por `frequency` em ferramentas que só
 * tratam de aplicação semanal.
 */
export function getTitrationDoses(
  peptideSlug: string,
  opts: { route?: TitrationRoute | 'todas'; frequency?: TitrationFrequency } = {},
): number[] {
  const { route = 'injetavel', frequency } = opts;
  const doses = TITRATION_SCHEMES.filter(
    (s) =>
      s.peptideSlug === peptideSlug &&
      (route === 'todas' || s.route === route) &&
      (!frequency || s.frequency === frequency),
  ).flatMap((s) => s.steps.map((st) => st.dose));
  return Array.from(new Set(doses)).sort((a, b) => a - b);
}

/** Frequência dos esquemas de um peptídeo numa via (undefined se não houver esquema). */
export function getTitrationFrequency(peptideSlug: string, route: TitrationRoute = 'injetavel'): TitrationFrequency | undefined {
  return TITRATION_SCHEMES.find((s) => s.peptideSlug === peptideSlug && s.route === route)?.frequency;
}

/** "Dose semanal" / "Dose diária". */
export function doseLabel(frequency: TitrationFrequency): string {
  return frequency === 'diaria' ? 'Dose diária' : 'Dose semanal';
}

/** "1× por semana" / "1× por dia". */
export function frequencyShort(frequency: TitrationFrequency): string {
  return frequency === 'diaria' ? '1× por dia' : '1× por semana';
}

/** Via e frequência por extenso, para tabelas de resumo. */
export function administrationLabel(scheme: TitrationScheme): string {
  if (scheme.route === 'oral') return 'Oral (comprimido), uma vez por dia, em jejum';
  return scheme.frequency === 'diaria' ? 'Subcutânea, uma vez por dia' : 'Subcutânea, uma vez por semana';
}

/** Duração em texto: 7 → "1 semana", 28 → "4 semanas", 30 → "30 dias". */
export function durationLabel(days: number): string {
  if (days % 7 === 0) {
    const w = days / 7;
    return `${w} semana${w === 1 ? '' : 's'}`;
  }
  return `${days} dia${days === 1 ? '' : 's'}`;
}

/**
 * Período da etapa `index` (0-based), contado do início do tratamento:
 * "Semanas 1 a 4", "Semana 2", "Semana 17 em diante", "Dias 1 a 30", "Dia 61 em diante".
 */
export function stepPeriodLabel(index: number, stepDays: number, last: boolean): string {
  if (stepDays % 7 === 0) {
    const len = stepDays / 7;
    const start = 1 + index * len;
    const end = start + len - 1;
    if (last) return `Semana ${start} em diante`;
    return start === end ? `Semana ${start}` : `Semanas ${start} a ${end}`;
  }
  const start = 1 + index * stepDays;
  if (last) return `Dia ${start} em diante`;
  return `Dias ${start} a ${start + stepDays - 1}`;
}
