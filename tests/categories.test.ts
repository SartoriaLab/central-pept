import { describe, expect, it } from 'vitest';
import { getCategoryPages, getCategoryPeptides, halfLifeHours } from '@/lib/categories';
import { getPeptides } from '@/lib/peptides';

describe('páginas de categoria e listas', () => {
  it.each(getCategoryPages().map((c) => [c.slug, c] as const))('%s tem peptídeos', (_slug, c) => {
    expect(getCategoryPeptides(c).length).toBeGreaterThan(0);
  });

  it('meia-vida em ordem crescente', () => {
    const page = getCategoryPages().find((c) => c.slug === 'meia-vida')!;
    const hours = getCategoryPeptides(page)
      .map((p) => halfLifeHours(p.halfLife))
      .filter((h): h is number => h !== null);
    expect(hours).toEqual([...hours].sort((a, b) => a - b));
  });

  it('lê a meia-vida dos textos das fichas', () => {
    expect(halfLifeHours('~4h (subcutâneo)')).toBe(4);
    expect(halfLifeHours('2-10 min')).toBeCloseTo(2 / 60);
    expect(halfLifeHours('~7 dias')).toBe(168);
    expect(halfLifeHours('Plasmática muito curta (minutos)')).toBeCloseTo(1 / 60);
    expect(halfLifeHours(undefined)).toBeNull();
  });

  it('toda ficha tem meia-vida legível ou declarada como não caracterizada', () => {
    // Sem dado publicado, a ficha diz "Não caracterizada…" em vez de um número inventado.
    const bad = getPeptides()
      .filter((p) => halfLifeHours(p.halfLife) === null && !p.halfLife?.startsWith('Não caracterizada'))
      .map((p) => `${p.slug}: ${p.halfLife}`);
    expect(bad, bad.join('\n')).toEqual([]);
  });
});
