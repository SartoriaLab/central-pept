import { describe, expect, it } from 'vitest';
import { buildFrascoQuiz, fmtMg } from '@/lib/quiz-frasco';

describe('pergunta do frasco', () => {
  it('10 mg em 2 ml: 0,5 mg em 10 unidades', () => {
    const q = buildFrascoQuiz(10, 2)!;
    expect(q.answerMg).toBeCloseTo(0.5);
    expect(q.options).toHaveLength(3);
    expect(q.options.filter((o) => o.correct).map((o) => o.label)).toEqual(['0,5 mg']);
    expect(q.options.map((o) => o.label).sort()).toEqual(['0,5 mg', '1 mg', '5 mg'].sort());
  });

  it('frasco com 1 ml não repete opção', () => {
    const q = buildFrascoQuiz(5, 1)!;
    const labels = q.options.map((o) => o.label);
    expect(new Set(labels).size).toBe(3);
    expect(q.options.find((o) => o.correct)?.label).toBe('0,5 mg');
  });

  it('valores quebrados e pequenos', () => {
    const q = buildFrascoQuiz(2, 3)!;
    expect(q.options.find((o) => o.correct)?.label).toBe('0,067 mg');
    expect(new Set(q.options.map((o) => o.label)).size).toBe(3);
  });

  it('ordem estável para a mesma entrada', () => {
    expect(buildFrascoQuiz(15, 2.5)!.options).toEqual(buildFrascoQuiz(15, 2.5)!.options);
  });

  it('recusa entrada inválida', () => {
    expect(buildFrascoQuiz(0, 2)).toBeNull();
    expect(buildFrascoQuiz(5, 0)).toBeNull();
    expect(buildFrascoQuiz(NaN, 2)).toBeNull();
  });

  it('formata mg', () => {
    expect(fmtMg(0.25)).toBe('0,25 mg');
    expect(fmtMg(2)).toBe('2 mg');
  });
});
