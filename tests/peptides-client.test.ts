import { describe, expect, it } from 'vitest';
import { getCalcPeptides, getCardPeptides, getComparePeptides, getPeptides } from '@/lib/peptides';

// Listas que viram prop de componente client: vão inteiras no HTML de cada página.
const HEAVY = ['longDescription', 'sideEffects', 'contraindications', 'references', 'reviewedBy'] as const;

describe('listas de peptídeos para o cliente', () => {
  const full = getPeptides();
  const lists = { calc: getCalcPeptides(), card: getCardPeptides(), compare: getComparePeptides() };

  it.each(Object.entries(lists))('%s: mesmos peptídeos, na mesma ordem', (_name, list) => {
    expect(list.map((p) => p.slug)).toEqual(full.map((p) => p.slug));
  });

  it.each(Object.entries(lists))('%s: sem os textos longos da ficha', (_name, list) => {
    for (const p of list) for (const f of HEAVY) expect(p, `${p.slug}.${f}`).not.toHaveProperty(f);
  });

  it('calculadoras recebem dose, frequência e frascos iguais aos da ficha', () => {
    lists.calc.forEach((p, i) => {
      const { slug, name, typicalDose, doseUnit, frequency, shortDescription, commonAmounts, category } = full[i];
      expect(p).toEqual({ slug, name, typicalDose, doseUnit, frequency, shortDescription, commonAmounts, category });
    });
  });

  it('enciclopédia mantém status, WADA, faixa de dose e meia-vida', () => {
    lists.card.forEach((p, i) => {
      expect(p.regulatoryStatus).toBe(full[i].regulatoryStatus);
      expect(p.wadaProhibited).toBe(full[i].wadaProhibited);
      expect(p.doseRange).toBe(full[i].doseRange);
      expect(p.halfLife).toBe(full[i].halfLife);
    });
  });

  it('comparador recebe o começo do mecanismo e sabe quando o texto continua', () => {
    lists.compare.forEach((p, i) => {
      const original = full[i].mechanism;
      expect(p.mechanism?.slice(0, 180)).toBe(original?.slice(0, 180));
      expect((p.mechanism?.length ?? 0) > 180).toBe((original?.length ?? 0) > 180);
    });
  });
});
