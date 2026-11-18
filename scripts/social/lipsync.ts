// Animação da Gotinha no Reels: boca no ritmo das palavras faladas e piscadas. Devolve a linha
// do tempo de estados (boca + olhos) de uma cena. Puro.
import type { Mouth } from './poses';
import type { Word } from './voice';

export type MouthSeg = { start: number; end: number; mouth: Mouth };
export type Blink = { start: number; end: number };
export type MascotSeg = { start: number; end: number; mouth: Mouth; blink: boolean };

export const SYLLABLE = 0.12; // tempo de cada abre-e-fecha dentro de uma palavra
export const BLINK = 0.12; // duração da piscada
export const BLINK_GAP = [2.8, 4] as const; // intervalo entre piscadas, em segundos
const JOIN = 0.06; // pausa menor que isso entre palavras não fecha a boca

/** Palavra que termina em som de "o"/"u" fecha em biquinho. */
function endsRound(text: string): boolean {
  return /[oóôõuú][.,!?;:…"”)]*$/i.test(text);
}

function push(segs: MouthSeg[], start: number, end: number, mouth: Mouth) {
  if (end - start < 1e-6) return;
  const last = segs[segs.length - 1];
  if (last && last.mouth === mouth && Math.abs(last.end - start) < 1e-6) last.end = end;
  else segs.push({ start, end, mouth });
}

/** Boca de 0 a `total`, sem buracos: fechada nas pausas, alternando aberta/meia dentro da palavra. */
export function mouthTrack(words: Word[], total: number): MouthSeg[] {
  const segs: MouthSeg[] = [];
  let at = 0;
  for (const w of [...words].sort((a, b) => a.start - b.start)) {
    const start = Math.max(at, Math.min(w.start, total));
    const end = Math.min(Math.max(w.end, start), total);
    if (end - start < 1e-6) continue;
    if (start - at >= JOIN) push(segs, at, start, 'fechada');
    const from = start - at >= JOIN ? start : at;
    const steps = Math.max(1, Math.round((end - from) / SYLLABLE));
    const step = (end - from) / steps;
    for (let i = 0; i < steps; i++) {
      const last = i === steps - 1;
      const mouth: Mouth = last && steps > 1 && endsRound(w.text) ? 'o' : i % 2 === 0 ? 'aberta' : 'meia';
      push(segs, from + i * step, last ? end : from + (i + 1) * step, mouth);
    }
    at = end;
  }
  push(segs, at, total, 'fechada');
  return segs;
}

/** Gerador determinístico (mulberry32): o mesmo vídeo sai sempre igual. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function blinkTrack(total: number, seed: number): Blink[] {
  const rand = rng(seed + 1);
  const [min, max] = BLINK_GAP;
  const out: Blink[] = [];
  let at = 0.8 + rand() * 1.2; // a primeira vem cedo, para a cena curta também piscar
  while (at + BLINK < total) {
    out.push({ start: at, end: at + BLINK });
    at += BLINK + min + rand() * (max - min);
  }
  return out;
}

/** Junta boca e piscadas em trechos contíguos de 0 a `total`. */
export function mascotTimeline(words: Word[], total: number, seed: number): MascotSeg[] {
  const mouths = mouthTrack(words, total);
  const blinks = blinkTrack(total, seed);
  const cuts = [...new Set([0, total, ...mouths.flatMap((m) => [m.start, m.end]), ...blinks.flatMap((b) => [b.start, b.end])])]
    .filter((t) => t >= 0 && t <= total)
    .sort((a, b) => a - b);
  const out: MascotSeg[] = [];
  for (let i = 0; i + 1 < cuts.length; i++) {
    const [start, end] = [cuts[i], cuts[i + 1]];
    if (end - start < 1e-6) continue;
    const mid = (start + end) / 2;
    const mouth = mouths.find((m) => mid >= m.start && mid < m.end)?.mouth ?? 'fechada';
    const blink = blinks.some((b) => mid >= b.start && mid < b.end);
    const last = out[out.length - 1];
    if (last && last.mouth === mouth && last.blink === blink) last.end = end;
    else out.push({ start, end, mouth, blink });
  }
  return out;
}
