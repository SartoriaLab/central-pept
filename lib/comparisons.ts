// Comparações estáticas de alta intenção de busca ("X vs Y").
// Cada uma vira uma rota indexável /comparar/<slug>.
export type Comparison = {
  slug: string;          // 'semaglutida-vs-tirzepatida'
  peptideSlugs: string[]; // peptídeos comparados (2+)
  title: string;         // 'Semaglutida vs Tirzepatida'
  relatedPost?: string;  // slug de um post de blog correspondente, se houver
};

export const COMPARISONS: Comparison[] = [
  // ── GLP-1 / emagrecimento ──
  { slug: 'semaglutida-vs-tirzepatida', peptideSlugs: ['semaglutida', 'tirzepatida'], title: 'Semaglutida vs Tirzepatida', relatedPost: 'semaglutida-vs-tirzepatida' },
  { slug: 'tirzepatida-vs-retatrutida', peptideSlugs: ['tirzepatida', 'retatrutida'], title: 'Tirzepatida vs Retatrutida', relatedPost: 'retatrutida-o-que-e' },
  { slug: 'semaglutida-vs-retatrutida', peptideSlugs: ['semaglutida', 'retatrutida'], title: 'Semaglutida vs Retatrutida', relatedPost: 'retatrutida-o-que-e' },
  { slug: 'semaglutida-vs-tirzepatida-vs-retatrutida', peptideSlugs: ['semaglutida', 'tirzepatida', 'retatrutida'], title: 'Semaglutida vs Tirzepatida vs Retatrutida', relatedPost: 'semaglutida-vs-tirzepatida' },
  { slug: 'aod-9604-vs-semaglutida', peptideSlugs: ['aod-9604', 'semaglutida'], title: 'AOD-9604 vs Semaglutida', relatedPost: 'aod-9604-o-que-e' },
  { slug: 'aod-9604-vs-tirzepatida', peptideSlugs: ['aod-9604', 'tirzepatida'], title: 'AOD-9604 vs Tirzepatida', relatedPost: 'aod-9604-o-que-e' },
  { slug: 'tesamorelina-vs-aod-9604', peptideSlugs: ['tesamorelina', 'aod-9604'], title: 'Tesamorelina vs AOD-9604', relatedPost: 'tesamorelina-gordura-visceral' },
  { slug: 'mots-c-vs-aod-9604', peptideSlugs: ['mots-c', 'aod-9604'], title: 'MOTS-c vs AOD-9604', relatedPost: 'mots-c-o-que-e' },

  { slug: 'tesamorelina-vs-semaglutida', peptideSlugs: ['tesamorelina', 'semaglutida'], title: 'Tesamorelina vs Semaglutida', relatedPost: 'tesamorelina-gordura-visceral' },
  { slug: 'tesamorelina-vs-tirzepatida', peptideSlugs: ['tesamorelina', 'tirzepatida'], title: 'Tesamorelina vs Tirzepatida', relatedPost: 'tesamorelina-gordura-visceral' },
  { slug: 'aod-9604-vs-retatrutida', peptideSlugs: ['aod-9604', 'retatrutida'], title: 'AOD-9604 vs Retatrutida', relatedPost: 'aod-9604-o-que-e' },
  { slug: 'mots-c-vs-semaglutida', peptideSlugs: ['mots-c', 'semaglutida'], title: 'MOTS-c vs Semaglutida', relatedPost: 'mots-c-o-que-e' },

  // ── Cicatrização / pele ──
  { slug: 'bpc-157-vs-tb-500-vs-ghk-cu', peptideSlugs: ['bpc-157', 'tb-500', 'ghk-cu'], title: 'BPC-157 vs TB-500 vs GHK-Cu', relatedPost: 'tb-500-para-que-serve' },
  { slug: 'bpc-157-vs-tb-500', peptideSlugs: ['bpc-157', 'tb-500'], title: 'BPC-157 vs TB-500', relatedPost: 'tb-500-para-que-serve' },
  { slug: 'bpc-157-vs-ghk-cu', peptideSlugs: ['bpc-157', 'ghk-cu'], title: 'BPC-157 vs GHK-Cu', relatedPost: 'ghk-cu-para-que-serve' },
  { slug: 'tb-500-vs-ghk-cu', peptideSlugs: ['tb-500', 'ghk-cu'], title: 'TB-500 vs GHK-Cu', relatedPost: 'ghk-cu-para-que-serve' },

  // ── Hormônio do crescimento ──
  { slug: 'cjc-1295-vs-ipamorelina', peptideSlugs: ['cjc-1295', 'ipamorelina'], title: 'CJC-1295 vs Ipamorelina', relatedPost: 'cjc-ipamorelina-como-combinar' },
  { slug: 'cjc-1295-vs-sermorelina', peptideSlugs: ['cjc-1295', 'sermorelina'], title: 'CJC-1295 vs Sermorelina', relatedPost: 'sermorelina-o-que-e' },
  { slug: 'cjc-1295-vs-tesamorelina', peptideSlugs: ['cjc-1295', 'tesamorelina'], title: 'CJC-1295 vs Tesamorelina', relatedPost: 'tesamorelina-gordura-visceral' },
  { slug: 'sermorelina-vs-tesamorelina', peptideSlugs: ['sermorelina', 'tesamorelina'], title: 'Sermorelina vs Tesamorelina', relatedPost: 'sermorelina-o-que-e' },
  { slug: 'ipamorelina-vs-sermorelina', peptideSlugs: ['ipamorelina', 'sermorelina'], title: 'Ipamorelina vs Sermorelina', relatedPost: 'sermorelina-o-que-e' },
  { slug: 'ipamorelina-vs-tesamorelina', peptideSlugs: ['ipamorelina', 'tesamorelina'], title: 'Ipamorelina vs Tesamorelina', relatedPost: 'tesamorelina-gordura-visceral' },
  { slug: 'ipamorelina-vs-ghrp-2', peptideSlugs: ['ipamorelina', 'ghrp-2'], title: 'Ipamorelina vs GHRP-2', relatedPost: 'ghrp-2-o-que-e' },
  { slug: 'ipamorelina-vs-ghrp-6', peptideSlugs: ['ipamorelina', 'ghrp-6'], title: 'Ipamorelina vs GHRP-6', relatedPost: 'ghrp-6-o-que-e' },
  { slug: 'ipamorelina-vs-hexarelina', peptideSlugs: ['ipamorelina', 'hexarelina'], title: 'Ipamorelina vs Hexarelina', relatedPost: 'hexarelina-o-que-e' },
  { slug: 'ghrp-2-vs-ghrp-6', peptideSlugs: ['ghrp-2', 'ghrp-6'], title: 'GHRP-2 vs GHRP-6', relatedPost: 'ghrp-2-o-que-e' },
  { slug: 'hexarelina-vs-ghrp-2', peptideSlugs: ['hexarelina', 'ghrp-2'], title: 'Hexarelina vs GHRP-2', relatedPost: 'hexarelina-o-que-e' },
  { slug: 'hexarelina-vs-ghrp-6', peptideSlugs: ['hexarelina', 'ghrp-6'], title: 'Hexarelina vs GHRP-6', relatedPost: 'hexarelina-o-que-e' },

  { slug: 'cjc-1295-vs-ipamorelina-vs-sermorelina', peptideSlugs: ['cjc-1295', 'ipamorelina', 'sermorelina'], title: 'CJC-1295 vs Ipamorelina vs Sermorelina', relatedPost: 'cjc-ipamorelina-como-combinar' },
  { slug: 'ghrp-2-vs-ghrp-6-vs-hexarelina', peptideSlugs: ['ghrp-2', 'ghrp-6', 'hexarelina'], title: 'GHRP-2 vs GHRP-6 vs Hexarelina', relatedPost: 'ghrp-2-o-que-e' },
  { slug: 'sermorelina-vs-ghrp-6', peptideSlugs: ['sermorelina', 'ghrp-6'], title: 'Sermorelina vs GHRP-6', relatedPost: 'sermorelina-o-que-e' },

  // ── Cognitivo / longevidade / outros ──
  { slug: 'semax-vs-selank', peptideSlugs: ['semax', 'selank'], title: 'Semax vs Selank', relatedPost: 'semax-nootropico' },
  { slug: 'mots-c-vs-epithalon', peptideSlugs: ['mots-c', 'epithalon'], title: 'MOTS-c vs Epithalon', relatedPost: 'mots-c-o-que-e' },
  { slug: 'ghk-cu-vs-epithalon', peptideSlugs: ['ghk-cu', 'epithalon'], title: 'GHK-Cu vs Epithalon', relatedPost: 'epithalon-telomerase' },
  { slug: 'pt-141-vs-melanotan-ii', peptideSlugs: ['pt-141', 'melanotan-ii'], title: 'PT-141 vs Melanotan II', relatedPost: 'pt-141-bremelanotida' },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

export function getComparisonSlugs(): string[] {
  return COMPARISONS.map((c) => c.slug);
}

/** Comparações que incluem um peptídeo (para linkar ficha/calculadora → comparativos). */
export function getComparisonsByPeptide(peptideSlug: string): Comparison[] {
  return COMPARISONS.filter((c) => c.peptideSlugs.includes(peptideSlug));
}

/**
 * Outras comparações, com as que compartilham peptídeo primeiro.
 * Mantém a lista de "outras comparações" curta e relevante conforme o catálogo cresce.
 */
export function getRelatedComparisons(current: Comparison, limit = 10): Comparison[] {
  const own = new Set(current.peptideSlugs);
  return COMPARISONS.filter((c) => c.slug !== current.slug)
    .map((c, i) => ({ c, i, shared: c.peptideSlugs.filter((s) => own.has(s)).length }))
    .sort((a, b) => b.shared - a.shared || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.c);
}
