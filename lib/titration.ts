// Esquemas de titulação (subida de dose) de agonistas GLP-1.
// Compartilhado pela calculadora de titulação, pela tabela de doses imprimível,
// pela calculadora de custo e pelas páginas de reconstituição por peptídeo.

export type TitrationScheme = {
  id: string;
  /** Slug do peptídeo em lib/peptides.ts. */
  peptideSlug: string;
  name: string;
  unit: string;
  steps: { week: number; dose: number }[]; // week é relativa; dose na unidade do esquema
  notes: string;
};

// Baseados em bulas FDA (Ozempic/Wegovy/Mounjaro/Zepbound) e, para retatrutida, nos ensaios.
export const TITRATION_SCHEMES: TitrationScheme[] = [
  {
    id: 'semaglutida-t2d',
    peptideSlug: 'semaglutida',
    name: 'Semaglutida — Ozempic (diabetes tipo 2)',
    unit: 'mg/semana',
    steps: [
      { week: 1, dose: 0.25 },
      { week: 5, dose: 0.5 },
      { week: 9, dose: 1.0 },
      { week: 13, dose: 2.0 },
    ],
    notes: 'Protocolo Ozempic. Cada etapa dura 4 semanas (por padrão) antes de subir.',
  },
  {
    id: 'semaglutida-obesity',
    peptideSlug: 'semaglutida',
    name: 'Semaglutida — Wegovy (obesidade/sobrepeso)',
    unit: 'mg/semana',
    steps: [
      { week: 1, dose: 0.25 },
      { week: 5, dose: 0.5 },
      { week: 9, dose: 1.0 },
      { week: 13, dose: 1.7 },
      { week: 17, dose: 2.4 },
    ],
    notes: 'Protocolo Wegovy. 5 etapas até a dose de manutenção de 2,4 mg/semana.',
  },
  {
    id: 'tirzepatida-t2d',
    peptideSlug: 'tirzepatida',
    name: 'Tirzepatida — Mounjaro (diabetes tipo 2)',
    unit: 'mg/semana',
    steps: [
      { week: 1, dose: 2.5 },
      { week: 5, dose: 5 },
      { week: 9, dose: 7.5 },
      { week: 13, dose: 10 },
      { week: 17, dose: 12.5 },
      { week: 21, dose: 15 },
    ],
    notes: 'Protocolo Mounjaro. Titulação em incrementos de 2,5 mg a cada ≥4 semanas.',
  },
  {
    id: 'tirzepatida-obesity',
    peptideSlug: 'tirzepatida',
    name: 'Tirzepatida — Zepbound (obesidade/sobrepeso)',
    unit: 'mg/semana',
    steps: [
      { week: 1, dose: 2.5 },
      { week: 5, dose: 5 },
      { week: 9, dose: 7.5 },
      { week: 13, dose: 10 },
      { week: 17, dose: 12.5 },
      { week: 21, dose: 15 },
    ],
    notes: 'Mesmo esquema do Mounjaro; marca Zepbound aprovada em 2023 para obesidade.',
  },
  {
    id: 'retatrutida',
    peptideSlug: 'retatrutida',
    name: 'Retatrutida (tri-agonista — experimental, fase 3)',
    unit: 'mg/semana',
    steps: [
      { week: 1, dose: 2 },
      { week: 5, dose: 4 },
      { week: 9, dose: 6 },
      { week: 13, dose: 8 },
      { week: 17, dose: 10 },
      { week: 21, dose: 12 },
    ],
    notes: 'Retatrutida (LY3437943, tri-agonista GLP-1/GIP/glucagon). Ainda em fase 3 (TRIUMPH) — ainda sem aprovação FDA/ANVISA. Protocolo baseado nos trials: incrementos de 2 mg a cada 4 semanas até 12 mg/semana.',
  },
];

/** Doses (mg/semana) distintas da titulação de um peptídeo, em ordem crescente. */
export function getTitrationDoses(peptideSlug: string): number[] {
  const doses = TITRATION_SCHEMES.filter((s) => s.peptideSlug === peptideSlug).flatMap((s) =>
    s.steps.map((st) => st.dose),
  );
  return Array.from(new Set(doses)).sort((a, b) => a - b);
}
