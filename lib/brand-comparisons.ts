// Comparações entre marcas ("Mounjaro vs Ozempic"), na mesma rota das comparações de
// moléculas: /comparar/<slug>. Os dados vêm de lib/brands.ts (bulas e ensaios); aqui fica só
// o par, a diferença principal e, quando existe, o estudo que comparou as duas frente a frente.
//
// Marcas irmãs (mesmo princípio ativo) usam o texto `sibling.difference` da própria marca.
// Pares de moléculas diferentes têm a diferença escrita aqui, com números das marcas.

import { getBrand, type Brand } from './brands';

export type BrandComparison = {
  slug: string;
  brands: [string, string];
  /** Texto da diferença principal. Vazio = usa sibling.difference da primeira marca. */
  difference?: string;
  /** Comparação direta publicada (copiada do `evidence` de uma das marcas). */
  headToHead?: { brand: string; trial: string };
  relatedPost?: string;
};

export const BRAND_COMPARISONS: BrandComparison[] = [
  {
    slug: 'mounjaro-vs-ozempic',
    brands: ['mounjaro', 'ozempic'],
    difference:
      'São moléculas diferentes. Mounjaro é tirzepatida, que age nos receptores GIP e GLP-1; Ozempic é semaglutida, que age só no GLP-1. Os dois são aprovados para diabetes tipo 2 e aplicados uma vez por semana. No estudo SURPASS-2, que comparou os dois em diabetes tipo 2, a tirzepatida reduziu mais a glicemia e o peso.',
    headToHead: { brand: 'mounjaro', trial: 'SURPASS-2' },
    relatedPost: 'semaglutida-vs-tirzepatida',
  },
  {
    slug: 'ozempic-vs-wegovy',
    brands: ['ozempic', 'wegovy'],
    relatedPost: 'ozempic-para-perder-peso-sem-diabetes',
  },
  {
    slug: 'mounjaro-vs-zepbound',
    brands: ['mounjaro', 'zepbound'],
    relatedPost: 'efeitos-colaterais-tirzepatida',
  },
  {
    slug: 'zepbound-vs-wegovy',
    brands: ['zepbound', 'wegovy'],
    difference:
      'São moléculas diferentes, as duas aprovadas para controle de peso e aplicadas uma vez por semana. Zepbound é tirzepatida (GIP e GLP-1); Wegovy é semaglutida (GLP-1). No SURMOUNT-5, a comparação direta entre as duas em obesidade, a tirzepatida levou a uma perda média maior de peso em 72 semanas.',
    headToHead: { brand: 'zepbound', trial: 'SURMOUNT-5' },
    relatedPost: 'semaglutida-vs-tirzepatida',
  },
  {
    slug: 'mounjaro-vs-wegovy',
    brands: ['mounjaro', 'wegovy'],
    difference:
      'Mounjaro é tirzepatida com indicação para diabetes tipo 2 (a mesma molécula do Zepbound, indicado para controle de peso); Wegovy é semaglutida com indicação para controle de peso. No SURMOUNT-5, que comparou tirzepatida e semaglutida em obesidade, a tirzepatida levou a uma perda média maior. A marca indicada depende do diagnóstico, que define a bula seguida.',
    headToHead: { brand: 'zepbound', trial: 'SURMOUNT-5' },
    relatedPost: 'semaglutida-vs-tirzepatida',
  },
  {
    slug: 'rybelsus-vs-ozempic',
    brands: ['rybelsus', 'ozempic'],
    relatedPost: 'quanto-tempo-ozempic-faz-efeito',
  },
  {
    slug: 'saxenda-vs-victoza',
    brands: ['saxenda', 'victoza'],
    relatedPost: 'liraglutida-saxenda-victoza',
  },
  {
    slug: 'saxenda-vs-wegovy',
    brands: ['saxenda', 'wegovy'],
    difference:
      'Os dois são indicados para controle de peso, mas são moléculas e rotinas diferentes: Saxenda é liraglutida aplicada todo dia; Wegovy é semaglutida aplicada uma vez por semana. No STEP 8, que comparou as duas frente a frente, a semaglutida levou a uma perda média de peso bem maior.',
    headToHead: { brand: 'saxenda', trial: 'STEP 8' },
    relatedPost: 'liraglutida-saxenda-victoza',
  },
];

export type ResolvedBrandComparison = BrandComparison & {
  a: Brand;
  b: Brand;
  title: string;
  differenceText: string;
  headToHeadResult?: { trial: string; result: string };
};

function resolve(c: BrandComparison): ResolvedBrandComparison | undefined {
  const a = getBrand(c.brands[0]);
  const b = getBrand(c.brands[1]);
  if (!a || !b) return undefined;
  const sibling = a.sibling.slug === b.slug ? a.sibling.difference : b.sibling.slug === a.slug ? b.sibling.difference : undefined;
  const differenceText = c.difference ?? sibling ?? '';
  const source = c.headToHead ? getBrand(c.headToHead.brand) : undefined;
  const ev = source?.evidence.find((e) => e.trial.includes(c.headToHead!.trial));
  return { ...c, a, b, title: `${a.name} vs ${b.name}`, differenceText, headToHeadResult: ev };
}

export function getBrandComparison(slug: string): ResolvedBrandComparison | undefined {
  const c = BRAND_COMPARISONS.find((x) => x.slug === slug);
  return c ? resolve(c) : undefined;
}

export function getBrandComparisons(): ResolvedBrandComparison[] {
  return BRAND_COMPARISONS.map(resolve).filter((x): x is ResolvedBrandComparison => !!x);
}

export function getBrandComparisonSlugs(): string[] {
  return BRAND_COMPARISONS.map((c) => c.slug);
}

/** Comparações de marca que incluem uma marca (para a página da marca). */
export function getBrandComparisonsFor(brandSlug: string): ResolvedBrandComparison[] {
  return getBrandComparisons().filter((c) => c.brands.includes(brandSlug));
}
