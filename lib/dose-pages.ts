// Páginas "peptídeo × dose": /ferramentas/reconstituicao/<peptideo>/dose/<dose>
// ("tirzepatida 7,5 mg quantas unidades"). Só doses de esquemas injetáveis semanais,
// que é onde frasco reconstituído e seringa de insulina fazem sentido.

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

/** Esquemas que geram páginas de dose. */
function doseSchemes(): TitrationScheme[] {
  return TITRATION_SCHEMES.filter((s) => s.route === 'injetavel' && s.frequency === 'semanal');
}

/** Doses com página própria de um peptídeo, em ordem crescente. */
export function getPageDoses(peptideSlug: string): number[] {
  const doses = doseSchemes()
    .filter((s) => s.peptideSlug === peptideSlug)
    .flatMap((s) => s.steps.map((st) => st.dose));
  return Array.from(new Set(doses)).sort((a, b) => a - b);
}

export function getDosePages(): { peptide: Peptide; dose: number }[] {
  const slugs = Array.from(new Set(doseSchemes().map((s) => s.peptideSlug)));
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
