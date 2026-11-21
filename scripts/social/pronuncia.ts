// Pronúncia da voz do Reels. A voz (Thalita, multilíngue) lê errado marca, nome de estudo em
// inglês, sigla e unidade ("Mounjaro" sai "Mojaro", "SURMOUNT-4" sai "surmão 4", "U-100" sai
// "zoos 100"). Aqui cada palavra da fala ganha a grafia que a voz pronuncia certo; a legenda
// continua com a palavra original (`relabel` junta de volta as palavras faladas de cada trecho).
// Puro. Conferido com transcrição (faster-whisper medium) da voz: mudou a voz → confira de novo.
// "Ozempic" e "tirzepatida" a voz já lê certo; grafia inventada para eles piora.
import type { Word } from './voice';

/** Palavra inteira (sem a pontuação das pontas) → como falar. Ordem importa: a primeira que casa vale. */
const LEXICON: [RegExp, string | ((m: RegExpMatchArray) => string)][] = [
  // Marcas
  [/^Mounjaro$/i, 'Munjáro'],
  [/^Wegovy$/i, 'Uigôvi'],
  [/^Zepbound$/i, 'Zépi báund'],
  [/^Rybelsus$/i, 'Ribélsus'],
  [/^CagriSema$/i, 'Cágri Sêma'],
  [/^Glifage$/i, 'Glifáge'],
  // Estudos (nome em inglês + número)
  [/^SURMOUNT(?:-(\d+))?$/i, (m) => `Sarmáunt${m[1] ? ` ${m[1]}` : ''}`],
  [/^SURPASS(?:-(\d+))?$/i, (m) => `Sarpás${m[1] ? ` ${m[1]}` : ''}`],
  [/^TRIUMPH(?:-(\d+))?$/i, (m) => `Tráiamf${m[1] ? ` ${m[1]}` : ''}`],
  [/^STEP(?:-(\d+))?$/, (m) => `Stép${m[1] ? ` ${m[1]}` : ''}`],
  [/^SELECT$/, 'Silékt'],
  [/^REDEFINE(?:-(\d+))?$/i, (m) => `Ridifáin${m[1] ? ` ${m[1]}` : ''}`],
  [/^SYNCHRONIZE(?:-(\d+))?$/i, (m) => `Sincronáiz${m[1] ? ` ${m[1]}` : ''}`],
  [/^GLORY(?:-(\d+))?$/i, (m) => `Glóri${m[1] ? ` ${m[1]}` : ''}`],
  [/^SUMMIT$/i, 'Sâmit'],
  // Órgãos e siglas
  [/^ANVISA$/i, 'Anvisa'],
  [/^FDA$/, 'éfe dê á'],
  [/^EMA$/, 'Ema'],
  [/^WADA$/, 'Uáda'],
  [/^GLP-1$/i, 'gê éle pê um'],
  [/^GIP$/, 'gê i pê'],
  // Peptídeos com sigla
  [/^BPC-?157$/i, 'bê pê cê cento e cinquenta e sete'],
  [/^TB-?500$/i, 'tê bê quinhentos'],
  [/^GHK-?Cu$/i, 'gê agá cá cobre'],
  [/^CJC-?1295$/i, 'cê jota cê mil duzentos e noventa e cinco'],
  [/^MOTS-?c$/i, 'móts cê'],
  [/^AOD-?9604$/i, 'á ó dê noventa e seis zero quatro'],
  [/^PT-?141$/i, 'pê tê cento e quarenta e um'],
  [/^GHRP-?(\d)$/i, (m) => `gê agá érre pê ${m[1]}`],
  [/^LL-?37$/i, 'éle éle trinta e sete'],
  [/^KPV$/i, 'cá pê vê'],
  [/^DSIP$/i, 'dê ésse i pê'],
  // Seringa U-100 / U-40
  [/^U-?(\d+)$/, (m) => `u ${m[1]}`],
  [/^vs\.?$/i, 'versus'],
];

/** Siglas que se leem letra a letra mesmo: ficam em maiúsculas. As outras em caixa alta viram palavra. */
const SPELLED = new Set(['CNPJ', 'SUS', 'IMC', 'UTI', 'DNA', 'RNA', 'PDF', 'SMS']);

const UNITS: [RegExp, string, string][] = [
  [/^(mcg|µg)$/i, 'micrograma', 'microgramas'],
  [/^mg$/i, 'miligrama', 'miligramas'],
  [/^ml$/i, 'mililitro', 'mililitros'],
  [/^UI$/, 'unidade internacional', 'unidades internacionais'],
  [/^U$/, 'unidade', 'unidades'],
  [/^kg$/i, 'quilo', 'quilos'],
];

const NUMBER = /^\d+(?:[.,]\d+)*$/;
/** Valor numérico em português ("2,5" → 2,5; "2.339" → 2339). */
const value = (n: string) => Number(/^\d{1,3}(?:\.\d{3})+$/.test(n) ? n.replace(/\./g, '') : n.replace(/\./g, '').replace(',', '.'));
/** Menos de 2 é singular em português ("1 mililitro", "0,5 mililitro"). */
const unitWord = (n: string, one: string, many: string) => (value(n) < 2 ? one : many);

function unit(core: string, prev: string | undefined): string | null {
  for (const [re, one, many] of UNITS) {
    if (!re.test(core)) continue;
    if (prev && NUMBER.test(prev)) return unitWord(prev, one, many);
    // "mg" solto ("não é mg") também se fala por extenso; "U" solto não (é letra).
    return core === 'U' || core === 'UI' ? null : one;
  }
  return null;
}

/** Como falar uma palavra (núcleo, sem pontuação das pontas). `prev`: núcleo da palavra anterior. */
export function sayWord(core: string, prev?: string): string {
  // Número colado na unidade ou no por cento: "5mg", "14%".
  const glued = core.match(/^(\d+(?:[.,]\d+)*)(%|mcg|µg|mg|ml|UI|kg)$/i);
  if (glued) {
    const [, n, u] = glued;
    if (u === '%') return `${n} por cento`;
    return `${n} ${unit(u, n) ?? u}`;
  }
  for (const [re, to] of LEXICON) {
    const m = core.match(re);
    if (m) return typeof to === 'string' ? to : to(m);
  }
  const u = unit(core, prev);
  if (u) return u;
  if (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]{2,}$/.test(core) && !SPELLED.has(core)) return core.toLowerCase();
  // Nome com hífen e número ("ESTUDO-2"): o hífen vira espaço, senão a voz lê "menos".
  const dashed = core.match(/^([A-Za-zÀ-ú]+)-(\d+)$/);
  if (dashed) return `${dashed[1]} ${dashed[2]}`;
  return core;
}

/** Trecho da fala: a palavra como aparece (legenda) e o intervalo dela no texto falado. */
export type Segment = { display: string; from: number; to: number };

const EDGE = /^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}%]*)$/u;

/** Texto para a voz e, para cada palavra original, onde ela ficou no texto falado. */
export function speechPlan(text: string): { spoken: string; segments: Segment[] } {
  const tokens = text.split(/\s+/).filter(Boolean);
  const segments: Segment[] = [];
  let spoken = '';
  let prev: string | undefined;
  for (const token of tokens) {
    const [, lead, core, trail] = token.match(EDGE)!;
    const said = core ? sayWord(core, prev) : '';
    const piece = `${lead}${said}${trail}`;
    if (spoken) spoken += ' ';
    // A legenda mostra a palavra sem a pontuação das pontas, como a voz marca; pontuação solta não entra.
    if (core) segments.push({ display: core, from: spoken.length, to: spoken.length + piece.length });
    spoken += piece;
    prev = core || prev;
  }
  return { spoken, segments };
}

/** Só o texto falado. */
export function toSpeech(text: string): string {
  return speechPlan(text).spoken;
}

/**
 * Palavras que a voz devolveu (com tempo) → palavras da legenda: cada palavra falada é achada no
 * texto falado e somada ao trecho original dela; trecho com várias palavras faladas ("Sarmáunt 4",
 * "14 por cento") vira uma palavra só na legenda, do início da primeira ao fim da última.
 */
export function relabel(words: Word[], spoken: string, segments: Segment[]): Word[] {
  const out: Word[] = [];
  let cursor = 0;
  let last = -1;
  for (const w of words) {
    const at = spoken.indexOf(w.text, cursor);
    if (at < 0) continue;
    cursor = at + w.text.length;
    const seg = segments.findIndex((s) => at >= s.from && at < s.to);
    if (seg < 0) continue;
    if (seg === last) {
      out[out.length - 1].end = w.end;
      continue;
    }
    // Trechos que a voz não marcou (pontuação solta) entram junto com a próxima palavra.
    const skipped = segments.slice(last + 1, seg).map((s) => s.display);
    out.push({ text: [...skipped, segments[seg].display].join(' '), start: w.start, end: w.end });
    last = seg;
  }
  // Palavras do fim que a voz não marcou ficam na última da legenda.
  if (out.length && last < segments.length - 1) {
    out[out.length - 1].text += ` ${segments.slice(last + 1).map((s) => s.display).join(' ')}`;
  }
  return out;
}
