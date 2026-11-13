// Seringas de insulina U-100 (100 unidades = 1 ml). Cada tamanho vira /seringas/<slug>.

export type SyringeInfo = {
  slug: string;
  units: 30 | 50 | 100;
  ml: number;
  /** Rótulo curto ("30 U (0,3 ml)"). */
  label: string;
  /** Menor divisão marcada nos modelos comuns, em unidades. */
  tick: number;
  /** Para que costuma servir melhor. */
  bestFor: string;
};

export const SYRINGES: SyringeInfo[] = [
  {
    slug: '30-unidades',
    units: 30,
    ml: 0.3,
    label: '30 U (0,3 ml)',
    tick: 1,
    bestFor: 'doses pequenas, até 30 unidades: a escala é a mais espaçada e a leitura, a mais precisa',
  },
  {
    slug: '50-unidades',
    units: 50,
    ml: 0.5,
    label: '50 U (0,5 ml)',
    tick: 1,
    bestFor: 'doses entre 10 e 50 unidades, o meio-termo entre capacidade e precisão',
  },
  {
    slug: '100-unidades',
    units: 100,
    ml: 1,
    label: '100 U (1 ml)',
    tick: 2,
    bestFor: 'doses acima de 50 unidades; em muitos modelos cada traço vale 2 unidades',
  },
];

export function getSyringe(slug: string): SyringeInfo | undefined {
  return SYRINGES.find((s) => s.slug === slug);
}

/** Unidades na seringa U-100 → ml. */
export const unitsToMl = (u: number) => u / 100;
