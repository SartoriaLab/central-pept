import { describe, expect, it } from 'vitest';
import { calcByUnits, calcByVolume, doseToMg, fmt } from '@/components/calculator/calc';
import { parseVialSlug, vialSlug } from '@/lib/vials';

describe('calculadora de reconstituição', () => {
  it('converte dose para mg', () => {
    expect(doseToMg(250, 'mcg')).toBe(0.25);
    expect(doseToMg(2.5, 'mg')).toBe(2.5);
  });

  it('calcula unidades pela água (tirzepatida 10 mg + 2 ml, dose 2,5 mg)', () => {
    const r = calcByVolume(10, 2, 2.5)!;
    expect(r.concentration).toBe(5);
    expect(r.unitsPerDose).toBe(50);
    expect(r.dosesPerVial).toBe(4);
  });

  it('calcula a água pelas unidades (BPC-157 5 mg, 250 mcg em 10 U)', () => {
    const r = calcByUnits(5, 10, 0.25)!;
    expect(r.waterMl).toBeCloseTo(2, 10);
    expect(r.concentration).toBeCloseTo(2.5, 10);
  });

  it('as duas fórmulas são inversas', () => {
    const a = calcByVolume(15, 3, 7.5)!;
    const b = calcByUnits(15, a.unitsPerDose, 7.5)!;
    expect(b.waterMl).toBeCloseTo(3, 10);
  });

  it('rejeita valores vazios, zero ou negativos', () => {
    expect(calcByVolume(0, 2, 1)).toBeNull();
    expect(calcByVolume(10, -1, 1)).toBeNull();
    expect(calcByUnits(10, 10, NaN)).toBeNull();
  });

  it('formata no padrão brasileiro', () => {
    expect(fmt(null)).toBe('—');
    expect(fmt(2.5, 1)).toMatch(/2,5/);
  });
});

describe('slugs de frasco', () => {
  it('ida e volta', () => {
    for (const mg of [1.6, 5, 10, 2.5, 30]) {
      expect(parseVialSlug(vialSlug(mg))).toBe(mg);
    }
  });
});
