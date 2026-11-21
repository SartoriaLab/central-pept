// Animação do Reels quadro a quadro (papel.tsx + render.ts), no padrão de explicador:
// fundo, selo e marca nunca cortam; o título sai com fade subindo e entra linha a linha
// de trás de uma máscara; o desenho entra por partes no ritmo da fala e fica "vivo"
// (flutua de leve) até a cena acabar. Tudo aqui é puro: recebe o tempo, devolve números.

/** Relógio de uma cena: segundos desde o começo dela e a duração total. */
export type Clock = {
  t: number;
  dur: number;
  /** A cena anterior/seguinte tem o mesmo desenho: ele não entra/sai, só continua. */
  keepIn?: boolean;
  keepOut?: boolean;
};

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const easeOut = (x: number) => 1 - (1 - clamp(x)) ** 3;
export const easeIn = (x: number) => clamp(x) ** 3;
export const easeInOut = (x: number) => {
  const v = clamp(x);
  return v < 0.5 ? 4 * v ** 3 : 1 - (-2 * v + 2) ** 3 / 2;
};
/** Passa um pouco do ponto e volta (entrada "com mola"). */
export const easeBack = (x: number, s = 1.6) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const v = x - 1;
  return 1 + (s + 1) * v ** 3 + s * v ** 2;
};

/** Progresso 0→1 de uma animação que começa em `start` e dura `len` segundos. */
export const prog = (t: number, start: number, len: number) => clamp((t - start) / Math.max(1e-3, len));

/** Quando o título começa a entrar e quanto tempo leva cada linha. */
export const TITLE_IN = { start: 0.04, line: 0.42, stagger: 0.12 } as const;
/** Saída no fim da cena (cabe no respiro depois da última palavra). */
export const EXIT = 0.16;
/** O desenho começa a entrar aqui. */
export const VISUAL_START = 0.22;

/** Janela em que as partes do desenho vão aparecendo, acompanhando a fala. */
export function pacing(dur: number): number {
  return clamp(dur * 0.55, 0.6, 3.6);
}

/** Saída da cena: 0 (normal) a 1 (sumiu). */
export function exitAt(c: Clock): number {
  return easeIn(prog(c.t, c.dur - EXIT, EXIT));
}

/** Linha `i` do título: deslocamento (fração da altura, 1 = escondida embaixo) e opacidade. */
export function titleLine(c: Clock, i: number): { y: number; opacity: number } {
  const p = prog(c.t, TITLE_IN.start + i * TITLE_IN.stagger, TITLE_IN.line);
  return { y: 1 - easeBack(p, 0.9), opacity: clamp(p * 3) };
}

/** Início da parte `k` de `n` do desenho (as partes vão aparecendo ao longo da fala). */
export function partStart(c: Clock, k: number, n: number): number {
  if (c.keepIn) return -10;
  return VISUAL_START + (n <= 1 ? 0 : (pacing(c.dur) * k) / n);
}

/** Flutuação contínua do desenho (px e graus): o quadro nunca fica parado. */
export function idle(t: number, amp = 7, period = 3.4): { y: number; rot: number } {
  const a = (2 * Math.PI * t) / period;
  return { y: Math.sin(a) * amp, rot: Math.sin(a * 0.7 + 1) * 1.1 };
}

/** Balanço amortecido (etiqueta pendurada, carimbo batendo). */
export function wobble(t: number, start: number, amp = 10, freq = 9, decay = 4): number {
  const s = t - start;
  if (s < 0) return 0;
  return amp * Math.exp(-decay * s) * Math.cos(freq * s);
}

/**
 * Número que conta até o valor ("28,3%", "2.339", "365 dias"): troca o primeiro número do texto
 * pelo valor parcial com as mesmas casas e o mesmo separador. Texto sem número volta igual.
 */
export function countUp(text: string, p: number): string {
  const m = text.match(/\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)?/);
  if (!m || p >= 1) return text;
  const raw = m[0];
  const thousands = /^\d{1,3}(?:\.\d{3})+/.test(raw);
  const dec = raw.match(/[.,](\d+)$/);
  const decimals = thousands ? (raw.includes(',') ? raw.split(',')[1].length : 0) : dec ? dec[1].length : 0;
  const sep = thousands ? ',' : dec ? raw[raw.length - dec[1].length - 1] : '';
  const value = Number(thousands ? raw.replace(/\./g, '').replace(',', '.') : raw.replace(',', '.'));
  const cur = value * clamp(p);
  let out = cur.toFixed(decimals);
  if (decimals) out = out.replace('.', sep);
  if (thousands) {
    const [int, frac] = out.split(',');
    out = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (frac ? `,${frac}` : '');
  }
  return text.replace(raw, out);
}
