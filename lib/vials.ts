import { getPeptides, type Peptide } from '@/lib/peptides';

// Páginas "peptídeo × frasco": /ferramentas/reconstituicao/<peptideo>/<frasco>
// O segmento do frasco é o tamanho em mg, ex.: "10-mg" (decimal vira "2-5-mg").

export function vialSlug(mg: number): string {
  return `${String(mg).replace('.', '-')}-mg`;
}

export function parseVialSlug(slug: string): number | null {
  const m = /^(\d+(?:-\d+)?)-mg$/.exec(slug);
  if (!m) return null;
  const n = Number(m[1].replace('-', '.'));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function vialPath(p: Pick<Peptide, 'slug'>, mg: number): string {
  return `/ferramentas/reconstituicao/${p.slug}/${vialSlug(mg)}`;
}

/**
 * Com um frasco só no catálogo, a página do frasco repete a calculadora do peptídeo:
 * fica com canonical para a calculadora e fora do sitemap.
 */
export function isCanonicalVial(p: Pick<Peptide, 'commonAmounts'>): boolean {
  return p.commonAmounts.length > 1;
}

/** Todas as combinações peptídeo × frasco cadastradas no catálogo. */
export function getVialPages(): { peptide: Peptide; mg: number }[] {
  return getPeptides().flatMap((peptide) => peptide.commonAmounts.map((mg) => ({ peptide, mg })));
}
