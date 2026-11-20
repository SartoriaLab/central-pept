import { describe, expect, it } from 'vitest';
import { MISSED_MEDS, missedDose } from '@/lib/missed-dose';
import { getBrands } from '@/lib/brands';
import { getPeptideBySlug } from '@/lib/peptides';

// 2026-11-16 é uma segunda-feira.
const MONDAY = '2026-11-16';
const at = (iso: string, h = 12, m = 0) => {
  const [y, mo, d] = iso.split('-').map(Number);
  return new Date(y, mo - 1, d, h, m);
};

describe('dose esquecida: regras de bula', () => {
  it('toda marca existe em lib/brands e aponta para peptídeo do catálogo', () => {
    const brands = new Set(getBrands().map((b) => b.slug));
    for (const m of MISSED_MEDS) {
      expect(brands.has(m.id), m.id).toBe(true);
      expect(getPeptideBySlug(m.peptideSlug), m.id).toBeDefined();
    }
  });

  it('Ozempic: esqueceu na segunda, até sábado aplica; domingo pula', () => {
    const sat = missedDose('ozempic', MONDAY, '08:00', at('2026-11-21', 22));
    expect(sat?.status).toBe('take-now');
    if (sat?.status === 'take-now') {
      expect(sat.lateDays).toBe(5);
      expect(sat.next.getDate()).toBe(23); // segunda seguinte
      expect(sat.deadline.getDate()).toBe(21);
    }
    const sun = missedDose('ozempic', MONDAY, '08:00', at('2026-11-22', 9));
    expect(sun?.status).toBe('skip');
    if (sun?.status === 'skip') expect(sun.next.getDate()).toBe(23);
  });

  it('Wegovy segue o prazo de 5 dias da bula brasileira', () => {
    expect(missedDose('wegovy', MONDAY, '08:00', at('2026-11-19'))?.status).toBe('take-now');
    expect(missedDose('wegovy', MONDAY, '08:00', at('2026-11-22'))?.status).toBe('skip');
  });

  it('Mounjaro: 96 horas a partir do horário previsto', () => {
    expect(missedDose('mounjaro', MONDAY, '08:00', at('2026-11-20', 7, 59))?.status).toBe('take-now');
    expect(missedDose('mounjaro', MONDAY, '08:00', at('2026-11-20', 8, 1))?.status).toBe('skip');
    const r = missedDose('mounjaro', MONDAY, '08:00', at('2026-11-18', 10));
    if (r?.status !== 'take-now') throw new Error('esperava take-now');
    expect(r.deadline.getDate()).toBe(20);
    expect(r.deadline.getHours()).toBe(8);
  });

  it('Zepbound usa a mesma regra da tirzepatida', () => {
    expect(missedDose('zepbound', MONDAY, '20:00', at('2026-11-20', 19))?.status).toBe('take-now');
    expect(missedDose('zepbound', MONDAY, '20:00', at('2026-11-20', 21))?.status).toBe('skip');
  });

  it('no dia previsto, depois do horário, já conta como atrasada e ainda dá tempo', () => {
    expect(missedDose('ozempic', MONDAY, '08:00', at(MONDAY, 21))?.status).toBe('take-now');
  });

  it('data prevista no futuro não é atraso', () => {
    expect(missedDose('ozempic', MONDAY, '08:00', at('2026-11-15'))?.status).toBe('not-late');
    expect(missedDose('mounjaro', MONDAY, '20:00', at(MONDAY, 9))?.status).toBe('not-late');
  });

  it('uma semana depois é o dia da dose seguinte; mais que isso são várias doses', () => {
    expect(missedDose('ozempic', MONDAY, '08:00', at('2026-11-23'))?.status).toBe('next-due');
    expect(missedDose('mounjaro', MONDAY, '08:00', at('2026-11-23'))?.status).toBe('next-due');
    expect(missedDose('ozempic', MONDAY, '08:00', at('2026-11-24'))?.status).toBe('several');
    expect(missedDose('wegovy', MONDAY, '08:00', at('2026-12-07'))?.status).toBe('several');
  });

  it('Rybelsus: comprimido diário não se recupera', () => {
    expect(missedDose('rybelsus', MONDAY, '07:00', at(MONDAY, 15))?.status).toBe('daily');
    expect(missedDose('rybelsus', MONDAY, '07:00', at('2026-11-18'))?.status).toBe('daily');
  });

  it('entrada inválida devolve null', () => {
    expect(missedDose('ozempic', '', '08:00', at(MONDAY))).toBeNull();
    expect(missedDose('aspirina', MONDAY, '08:00', at(MONDAY))).toBeNull();
  });

  it('nunca manda aplicar com a próxima dose a menos de 1 dia', () => {
    // Pior caso da regra de 5 dias: aplica no sábado, próxima na segunda (a bula aceita).
    for (const m of MISSED_MEDS.filter((x) => x.kind === 'weekly')) {
      for (let d = 0; d <= 6; d++) {
        const now = at(`2026-11-${16 + d}`, 23);
        const r = missedDose(m.id, MONDAY, '08:00', now);
        if (r?.status === 'take-now') expect((r.next.getTime() - now.getTime()) / 36e5, `${m.id} +${d}`).toBeGreaterThan(24);
      }
    }
  });
});
