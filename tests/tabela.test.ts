import { describe, expect, it } from 'vitest';
import { addDaysISO, buildTabela } from '@/lib/tabela';

describe('tabela personalizada', () => {
  it('soma dias sem erro de fuso', () => {
    expect(addDaysISO('2026-11-15', 28)).toBe('2026-12-13');
    expect(addDaysISO('2026-02-27', 2)).toBe('2026-03-01');
  });

  it('tirzepatida 10 mg + 2 ml, 2,5 mg semanal: 50 U e 4 doses em 28 dias', () => {
    const t = buildTabela({
      vialMg: 10, waterMl: 2, doseMg: 2.5, syringe: 100, freq: 'semanal',
      startISO: '2026-11-15', shelfDays: 28, extraDosesMg: [5, 7.5],
    })!;
    expect(t.unitsPerDose).toBeCloseTo(50);
    expect(t.concentration).toBe(5);
    expect(t.dosesPerVial).toBe(4);
    expect(t.calendar.map((c) => c.dateISO)).toEqual(['2026-11-15', '2026-11-22', '2026-11-29', '2026-12-06']);
    expect(t.calendar.at(-1)?.leftMg).toBe(0);
    expect(t.limitedByShelf).toBe(false);
    expect(t.discardISO).toBe('2026-12-13');
    const mine = t.doseRows.find((r) => r.mine)!;
    expect(mine.doseMg).toBe(2.5);
    // 7,5 mg = 150 U: não cabe numa seringa de 100 U
    expect(t.doseRows.find((r) => r.doseMg === 7.5)?.fits).toBe(false);
  });

  it('frasco que vence antes de acabar mostra a sobra', () => {
    const t = buildTabela({
      vialMg: 15, waterMl: 2, doseMg: 2.5, syringe: 100, freq: 'semanal',
      startISO: '2026-11-15', shelfDays: 28,
    })!;
    expect(t.dosesPerVial).toBe(6);
    expect(t.calendar).toHaveLength(4);
    expect(t.limitedByShelf).toBe(true);
    expect(t.wastedMg).toBe(5);
  });

  it('2× por dia alterna manhã e noite', () => {
    const t = buildTabela({
      vialMg: 5, waterMl: 2, doseMg: 0.25, syringe: 30, freq: '2x-dia',
      startISO: '2026-11-15', shelfDays: 28,
    })!;
    expect(t.calendar.slice(0, 3).map((c) => [c.dateISO, c.period])).toEqual([
      ['2026-11-15', 'manhã'], ['2026-11-15', 'noite'], ['2026-11-16', 'manhã'],
    ]);
    expect(t.calendar).toHaveLength(20);
  });

  it('recusa entrada inválida', () => {
    expect(buildTabela({ vialMg: 0, waterMl: 2, doseMg: 1, syringe: 100, freq: 'semanal', startISO: '2026-11-15', shelfDays: 28 })).toBeNull();
    expect(buildTabela({ vialMg: 5, waterMl: 2, doseMg: 1, syringe: 100, freq: 'semanal', startISO: 'ontem', shelfDays: 28 })).toBeNull();
  });
});
