import { describe, expect, it } from 'vitest';
import { planVials } from '@/lib/vial-plan';

describe('planVials', () => {
  it('BPC-157 5 mg, 250 mcg/dia, 4 semanas: 20 doses por frasco, 2 frascos', () => {
    const p = planVials({ vialMg: 5, doseMg: 0.25, freq: 'diaria', cycleWeeks: 4, shelfDays: 28 })!;
    expect(p.dosesPerVial).toBe(20);
    expect(p.usablePerVial).toBe(20);
    expect(p.daysPerVial).toBe(20);
    expect(p.limitedByShelf).toBe(false);
    expect(p.totalDoses).toBe(28);
    expect(p.vialsNeeded).toBe(2);
  });

  it('semanal 10 mg com dose 2,5 mg: 4 doses em 28 dias, sem perda', () => {
    const p = planVials({ vialMg: 10, doseMg: 2.5, freq: 'semanal', cycleWeeks: 12, shelfDays: 28 })!;
    expect(p.usablePerVial).toBe(4);
    expect(p.wastedMgPerVial).toBe(0);
    expect(p.vialsNeeded).toBe(3);
  });

  it('frasco grande demais: validade limita e há sobra', () => {
    const p = planVials({ vialMg: 20, doseMg: 2.5, freq: 'semanal', cycleWeeks: 8, shelfDays: 28 })!;
    expect(p.dosesPerVial).toBe(8);
    expect(p.dosesInShelf).toBe(4);
    expect(p.limitedByShelf).toBe(true);
    expect(p.wastedMgPerVial).toBe(10);
    expect(p.vialsNeeded).toBe(2);
  });

  it('dose maior que o frasco', () => {
    const p = planVials({ vialMg: 2, doseMg: 5, freq: 'semanal', cycleWeeks: 4, shelfDays: 28 })!;
    expect(p.dosesPerVial).toBe(0);
    expect(p.vialsNeeded).toBe(0);
  });

  it('entrada inválida', () => {
    expect(planVials({ vialMg: 0, doseMg: 1, freq: 'diaria', cycleWeeks: 4, shelfDays: 28 })).toBeNull();
  });

  it('3× por semana: 12 aplicações em 28 dias', () => {
    const p = planVials({ vialMg: 100, doseMg: 1, freq: '3x-semana', cycleWeeks: 4, shelfDays: 28 })!;
    expect(p.dosesInShelf).toBe(12);
    expect(p.totalDoses).toBe(12);
  });
});
