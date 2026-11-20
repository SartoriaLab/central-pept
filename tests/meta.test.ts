import { describe, expect, it } from 'vitest';
import { clipDescription } from '@/lib/meta';

describe('clipDescription', () => {
  it('não mexe em texto que cabe', () => {
    expect(clipDescription('Termos de uso do site.')).toBe('Termos de uso do site.');
  });

  it('junta espaços e quebras de linha', () => {
    expect(clipDescription('  Dose  típica\nde 250 mcg.  ')).toBe('Dose típica de 250 mcg.');
  });

  it('corta no fim da frase quando ela passa da metade do limite', () => {
    const text = `${'a'.repeat(95)}. ${'b'.repeat(100)}.`;
    expect(clipDescription(text)).toBe(`${'a'.repeat(95)}.`);
  });

  it('frase curta demais no começo: corta na palavra inteira, com reticências', () => {
    const text = `Curta. ${'palavra '.repeat(40)}`;
    const out = clipDescription(text);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('palavra…')).toBe(true);
  });

  it('número decimal com ponto não conta como fim de frase', () => {
    const text = `${'x'.repeat(90)} dose de 1.5 mg ${'y '.repeat(60)}`;
    expect(clipDescription(text)).toMatch(/…$/);
  });

  it('não deixa vírgula nem travessão antes das reticências', () => {
    const text = `${'palavra '.repeat(19)}fim, ${'resto '.repeat(20)}`;
    const out = clipDescription(text, 158);
    expect(out).not.toMatch(/[,;:—-]…$/);
  });

  it('respeita o limite pedido', () => {
    expect(clipDescription('um dois três quatro cinco seis', 12).length).toBeLessThanOrEqual(12);
  });
});
