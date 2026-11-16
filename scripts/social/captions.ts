// Legenda palavra a palavra do Reels: agrupa as palavras faladas em blocos curtos e monta a
// linha do tempo de quadros (bloco na tela + palavra em destaque). Puro.
import type { Word } from './voice';

export type Chunk = { words: string[]; start: number; end: number; times: number[] };
/** Um quadro: bloco `chunk` com a palavra `active` em destaque; `pop` = entrada do bloco (maior). */
export type Beat = { chunk: number; active: number; pop: boolean; start: number; end: number };

export const MAX_WORDS = 3;
export const MAX_CHARS = 18;
const PAUSE = 0.25; // silêncio que encerra o bloco
export const POP = 0.1; // duração do "salto" na entrada de cada bloco

/** Tira a pontuação que só polui a legenda; mantém ? e !. */
export function cleanWord(w: string): string {
  return w.replace(/^[«"“(]+|[»"”),.;:…]+$/g, '').trim();
}

export function chunkWords(words: Word[], maxWords = MAX_WORDS, maxChars = MAX_CHARS): Chunk[] {
  const chunks: Chunk[] = [];
  let cur: Chunk | null = null;
  words.forEach((w, i) => {
    const text = cleanWord(w.text);
    if (!text) return;
    const len = cur ? cur.words.join(' ').length + 1 + text.length : text.length;
    if (cur && (cur.words.length >= maxWords || len > maxChars)) {
      chunks.push(cur);
      cur = null;
    }
    if (!cur) cur = { words: [], start: w.start, end: w.end, times: [] };
    cur.words.push(text);
    cur.times.push(w.start);
    cur.end = w.end;
    const next = words[i + 1];
    const endsPhrase = /[.,!?;:…]$/.test(w.text) || (next !== undefined && next.start - w.end > PAUSE);
    if (endsPhrase) {
      chunks.push(cur);
      cur = null;
    }
  });
  if (cur) chunks.push(cur);
  return chunks;
}

/** Quadros contínuos de 0 a `total` segundos (sem buracos), com o salto na entrada de cada bloco. */
export function beatsFor(chunks: Chunk[], total: number): Beat[] {
  const marks: { chunk: number; active: number; at: number }[] = [];
  chunks.forEach((c, ci) => c.times.forEach((t, wi) => marks.push({ chunk: ci, active: wi, at: t })));
  if (marks.length === 0) return [];
  marks[0].at = 0;
  const beats: Beat[] = [];
  marks.forEach((m, i) => {
    const end = Math.min(total, i + 1 < marks.length ? marks[i + 1].at : total);
    if (end <= m.at) return;
    if (m.active === 0 && end - m.at > POP * 2) {
      beats.push({ chunk: m.chunk, active: 0, pop: true, start: m.at, end: m.at + POP });
      beats.push({ chunk: m.chunk, active: 0, pop: false, start: m.at + POP, end });
    } else {
      beats.push({ chunk: m.chunk, active: m.active, pop: false, start: m.at, end });
    }
  });
  return beats;
}
