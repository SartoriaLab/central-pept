// Poses e bocas da Gotinha (desenho em mascot.tsx). Fica separado do JSX para o validador e o
// schema do Claude não dependerem do componente. Puro.

/** Pose → quando usar (vai para o Claude escolher a de cada fala e slide). */
export const POSE_HINTS = {
  feliz: 'acenando, simpática; fala neutra ou boa notícia',
  explicando: 'dedo para cima; explicação, passo a passo',
  pensando: 'mão no queixo, olhando para cima; dúvida, "por que isso acontece"',
  alerta: 'olhos arregalados, mãos para cima; risco, sinal de alerta',
  piscadinha: 'piscando um olho; dica esperta, cumplicidade',
  comemorando: 'braços para cima, olhos sorrindo; acerto, resultado bom',
  apontando: 'apontando para baixo e para o lado; "olha isso aqui", resumo do que fazer',
  ih: 'sobrancelha torta, mão levantada; mania ou erro comum, "não é bem assim"',
} as const;

export type Pose = keyof typeof POSE_HINTS;
export const POSES = Object.keys(POSE_HINTS) as [Pose, ...Pose[]];

export function isPose(v: unknown): v is Pose {
  return typeof v === 'string' && v in POSE_HINTS;
}

export const MOUTHS = ['fechada', 'meia', 'aberta', 'o'] as const;
export type Mouth = (typeof MOUTHS)[number];
