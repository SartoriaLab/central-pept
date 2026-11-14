// Páginas "peptídeo × dose": /ferramentas/reconstituicao/<peptideo>/dose/<dose>
// ("tirzepatida 7,5 mg quantas unidades"). Duas origens:
// - doses dos esquemas injetáveis semanais de lib/titration.ts (GLP-1 em frasco);
// - LABEL_DOSES: dose fixa de bula de peptídeos vendidos em frasco liofilizado.
// Peptídeo sem dose humana estabelecida (BPC-157, TB-500, CJC...) não ganha página: seria
// um protocolo para droga sem aprovação, e a ficha já diz que a dose não foi caracterizada.

import { getPeptideBySlug, type Peptide } from './peptides';
import { TITRATION_SCHEMES, type TitrationScheme } from './titration';

export function doseSlug(mg: number): string {
  return `${String(mg).replace('.', '-')}-mg`;
}

export function parseDoseSlug(slug: string): number | null {
  const m = /^(\d+(?:-\d+)?)-mg$/.exec(slug);
  if (!m) return null;
  const n = Number(m[1].replace('-', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function dosePath(peptideSlug: string, mg: number): string {
  return `/ferramentas/reconstituicao/${peptideSlug}/dose/${doseSlug(mg)}`;
}

export type LabelDose = {
  peptideSlug: string;
  dose: number;
  /** Aplicações por semana; null = conforme necessário. */
  perWeek: number | null;
  /** De onde vem a dose (aparece na página). */
  source: string;
};

export const LABEL_DOSES: LabelDose[] = [
  { peptideSlug: 'tesamorelina', dose: 2, perWeek: 7, source: 'dose fixa de 2 mg por dia da bula do Egrifta SV (FDA)' },
  {
    peptideSlug: 'pt-141',
    dose: 1.75,
    perWeek: null,
    source: 'dose da bula do Vyleesi (FDA): 1,75 mg conforme necessário, no máximo uma por 24 horas e oito por mês',
  },
  { peptideSlug: 'timosina-alfa-1', dose: 1.6, perWeek: 2, source: 'esquema de 1,6 mg duas vezes por semana da bula do Zadaxin (hepatite B)' },
];

/** Frequência e origem da dose da página: esquema semanal (1/semana) ou dose de bula. */
export function getDoseInfo(peptideSlug: string, dose: number): { perWeek: number | null; source?: string } {
  const label = LABEL_DOSES.find((d) => d.peptideSlug === peptideSlug && d.dose === dose);
  return label ? { perWeek: label.perWeek, source: label.source } : { perWeek: 1 };
}

/** Esquemas que geram páginas de dose. */
function doseSchemes(): TitrationScheme[] {
  return TITRATION_SCHEMES.filter((s) => s.route === 'injetavel' && s.frequency === 'semanal');
}

/** Doses com página própria de um peptídeo, em ordem crescente. */
export function getPageDoses(peptideSlug: string): number[] {
  const doses = doseSchemes()
    .filter((s) => s.peptideSlug === peptideSlug)
    .flatMap((s) => s.steps.map((st) => st.dose))
    .concat(LABEL_DOSES.filter((d) => d.peptideSlug === peptideSlug).map((d) => d.dose));
  return Array.from(new Set(doses)).sort((a, b) => a - b);
}

export function getDosePages(): { peptide: Peptide; dose: number }[] {
  const slugs = Array.from(new Set([...doseSchemes().map((s) => s.peptideSlug), ...LABEL_DOSES.map((d) => d.peptideSlug)]));
  return slugs.flatMap((slug) => {
    const peptide = getPeptideBySlug(slug);
    return peptide ? getPageDoses(slug).map((dose) => ({ peptide, dose })) : [];
  });
}

/** Onde a dose aparece em cada esquema: etapa, total, dose anterior e seguinte. */
export function getDoseSteps(peptideSlug: string, dose: number) {
  return doseSchemes()
    .filter((s) => s.peptideSlug === peptideSlug)
    .flatMap((scheme) => {
      const i = scheme.steps.findIndex((st) => st.dose === dose);
      if (i < 0) return [];
      return [{
        scheme,
        index: i,
        total: scheme.steps.length,
        prev: i > 0 ? scheme.steps[i - 1].dose : undefined,
        next: i < scheme.steps.length - 1 ? scheme.steps[i + 1].dose : undefined,
      }];
    });
}
