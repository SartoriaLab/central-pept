// Render no visual "papel" (papel.tsx): JSX → PNG (satori + resvg) → JPEG (ffmpeg; a API só
// aceita JPEG) e Reels (voz em voice.ts + legenda palavra a palavra + ffmpeg). Precisa de
// ffmpeg/ffprobe no PATH e, sem ELEVENLABS_API_KEY, do pacote Python edge-tts (`pip install edge-tts`).
import { execFile, spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { createElement } from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { CAROUSEL, CaptionPill, PaperCover, PaperCta, PaperSlide, REEL, ReelCta, ReelScene, type Size } from './papel';
import { ctaSpeech, shortsSpeech } from './caption';
import { beatsFor, chunkWords } from './captions';
import { KIND_CHIP, scenesFor, splitTitle, visualForSlide } from './scenes';
import { speakCached, voiceLabel } from './voice';
import { LAYOUT_TAG } from './layouts';
import type { Clock } from './motion';
import { relabel, speechPlan } from './pronuncia';
import type { Cta, Draft, Platform, Scene, SceneVisual, Topic } from './types';

const run = promisify(execFile);

const FONT = (pkg: string, file: string) => path.join(process.cwd(), 'node_modules', '@fontsource', pkg, 'files', file);
let fonts: Parameters<typeof satori>[1]['fonts'] | null = null;

async function loadFonts() {
  if (fonts) return fonts;
  const inter = (w: number) => fs.readFile(FONT('inter', `inter-latin-${w}-normal.woff`));
  const [r, s, b, x, anton] = await Promise.all([inter(400), inter(600), inter(700), inter(800), fs.readFile(FONT('anton', 'anton-latin-400-normal.woff'))]);
  fonts = [
    { name: 'Inter', data: r, weight: 400, style: 'normal' },
    { name: 'Inter', data: s, weight: 600, style: 'normal' },
    { name: 'Inter', data: b, weight: 700, style: 'normal' },
    { name: 'Inter', data: x, weight: 800, style: 'normal' },
    { name: 'Anton', data: anton, weight: 400, style: 'normal' },
  ];
  return fonts;
}

// O satori já transforma o texto em caminhos: sem as fontes do sistema, o resvg não gasta
// ~130 ms por quadro carregando a pasta de fontes do Windows.
const rasterize = (svg: string, size: Size) => new Resvg(svg, { font: { loadSystemFonts: false }, fitTo: { mode: 'width', value: size.width } }).render();

export async function renderPng(el: React.ReactElement, size: Size): Promise<Buffer> {
  const svg = await satori(el, { ...size, fonts: await loadFonts() });
  return Buffer.from(rasterize(svg, size).asPng());
}

/** Quadro em RGBA cru (para o pipe do ffmpeg no Reels). */
async function renderRaw(el: React.ReactElement, size: Size): Promise<Buffer> {
  const svg = await satori(el, { ...size, fonts: await loadFonts() });
  return Buffer.from(rasterize(svg, size).pixels);
}

async function ffmpeg(args: string[]) {
  await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { maxBuffer: 1 << 24 });
}

async function duration(file: string): Promise<number> {
  const { stdout } = await run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]);
  const d = Number(stdout.trim());
  if (!Number.isFinite(d) || d <= 0) throw new Error(`duração inválida: ${file}`);
  return d;
}

/** Slide do carrossel montado do slide do rascunho: título em duas linhas, desenho e texto. */
export function carouselSlide(s: Draft['slides'][number], i: number, chip: string): {
  chip: string; title: string; accent: string; tone: Scene['tone']; visual?: SceneVisual; body?: string;
} {
  const layout = s.layout ?? 'padrao';
  const tag = (LAYOUT_TAG[layout] ?? chip).toLowerCase();
  const tone: Scene['tone'] = layout === 'mito' ? 'vermelho' : i % 2 ? 'vermelho' : 'azul';
  const visual = visualForSlide(s);
  switch (layout) {
    case 'numero':
      return { chip: tag, title: 'Guarda esse', accent: 'número', tone, visual, body: s.body };
    case 'mito':
      return { chip: tag, title: 'Mito ou', accent: 'verdade?', tone, visual: { type: 'carimbo', text: 'Mito', note: s.title.length <= 60 ? `“${s.title}”` : undefined }, body: `Verdade: ${s.body}` };
    case 'passos':
    case 'lado':
      return { chip: tag, ...titled(s.title), tone, visual };
    default:
      return { chip: tag, ...titled(s.title), tone, visual, body: s.body };
  }
}

function titled(t: string) {
  const [title, accent] = splitTitle(t);
  return { title, accent };
}

/** Carrossel: capa + conteúdo + guia, em JPEG. Devolve os caminhos na ordem. */
export async function renderCarousel(draft: Draft, topic: Topic, cta: Cta | null, outDir: string): Promise<string[]> {
  await fs.mkdir(outDir, { recursive: true });
  const chip = KIND_CHIP[topic.kind];
  const total = draft.slides.length + 2;
  const coverIcon = draft.hookIcon ?? draft.slides[0]?.icon;
  const coverVisual: SceneVisual = draft.scenes?.[0]?.visual ?? (coverIcon ? { type: 'icone', icon: coverIcon } : { type: 'carimbo', text: 'Sem achismo' });
  const els = [
    createElement(PaperCover, { chip, hook: draft.hook, visual: coverVisual }),
    ...draft.slides.map((s, i) => createElement(PaperSlide, { ...carouselSlide(s, i, chip), page: `${i + 2}/${total}` })),
    createElement(PaperCta, { cta, page: `${total}/${total}` }),
  ];
  const files: string[] = [];
  for (const [i, el] of els.entries()) {
    const png = path.join(outDir, `slide-${i + 1}.png`);
    const jpg = path.join(outDir, `slide-${i + 1}.jpg`);
    await fs.writeFile(png, await renderPng(el, CAROUSEL));
    // O satori/resvg só gera PNG e a API do Instagram só aceita JPEG: o PNG é intermediário.
    await ffmpeg(['-i', png, '-q:v', '2', jpg]);
    await fs.rm(png);
    files.push(jpg);
  }
  return files;
}

/** Texto que a voz fala (marcas, estudos, siglas e unidades: pronuncia.ts). */
export { toSpeech } from './pronuncia';

const FPS = 30;
const SCENE_PAD = 0.2; // respiro depois da última palavra da cena (a saída animada cabe aqui)
const MUSIC_DIR = path.join(process.cwd(), 'scripts', 'social', 'music');
const MUSIC_VOLUME = 0.1;
/** Legenda em blocos de até 6 palavras (uma linha e meia na pílula). */
const CAPTION_WORDS = 6;
const CAPTION_CHARS = 32;

type Part = {
  speech: string;
  /** Desenho da cena: igual ao da vizinha = continua na tela sem sair e entrar de novo. */
  visualKey?: string;
  frame: (caption: React.ReactNode, clock: Clock) => React.ReactElement;
};
type Timed = { part: Part; audio: string; dur: number; chunks: ReturnType<typeof chunkWords>; beats: ReturnType<typeof beatsFor> };

/** Voz da cena e os blocos da legenda no tempo dela. */
async function voice(part: Part, i: number, outDir: string): Promise<Timed> {
  const audio = path.join(outDir, `cena-${String(i + 1).padStart(2, '0')}.mp3`);
  const { spoken, segments } = speechPlan(part.speech);
  const words = relabel(await speakCached(spoken, audio), spoken, segments);
  const dur = (await duration(audio)) + SCENE_PAD;
  const chunks = chunkWords(words, CAPTION_WORDS, CAPTION_CHARS);
  return { part, audio, dur, chunks, beats: beatsFor(chunks, dur) };
}

/** Legenda no instante t da cena: o bloco, a palavra falada e há quanto tempo o bloco entrou. Puro. */
export function captionAt(beats: { chunk: number; active: number; start: number; end: number }[], t: number) {
  const beat = beats.find((b) => b.start <= t + 1e-6 && t < b.end - 1e-6);
  if (!beat) return null;
  const chunkStart = Math.min(...beats.filter((b) => b.chunk === beat.chunk).map((b) => b.start));
  return { chunk: beat.chunk, active: beat.active, age: t - chunkStart };
}

/** Escreve no stdin do ffmpeg respeitando o buffer. */
function writer(stream: NodeJS.WritableStream) {
  return (buf: Buffer) => new Promise<void>((resolve, reject) => {
    const ok = stream.write(buf, (err) => err && reject(err));
    if (ok) resolve();
    else stream.once('drain', () => resolve());
  });
}

/** Vídeo sem som, quadro a quadro a 30 fps, no pipe do ffmpeg (sem PNG em disco). */
async function renderFrames(timed: Timed[], out: string): Promise<void> {
  const ff = spawn('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${REEL.width}x${REEL.height}`, '-r', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', out,
  ], { stdio: ['pipe', 'ignore', 'pipe'] });
  let err = '';
  ff.stderr.on('data', (d) => (err += d));
  const done = new Promise<void>((resolve, reject) => {
    ff.on('error', reject);
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg (quadros) saiu com ${code}: ${err.slice(-500)}`))));
  });
  const write = writer(ff.stdin);
  let start = 0;
  const t0 = Date.now();
  for (const [i, s] of timed.entries()) {
    const first = Math.round(start * FPS);
    const last = Math.round((start + s.dur) * FPS);
    const key = s.part.visualKey;
    const keepIn = !!key && timed[i - 1]?.part.visualKey === key;
    const keepOut = !!key && timed[i + 1]?.part.visualKey === key;
    for (let f = first; f < last; f++) {
      const t = f / FPS - start;
      const cap = captionAt(s.beats, t);
      const caption = cap ? createElement(CaptionPill, { words: s.chunks[cap.chunk].words, active: cap.active, age: cap.age }) : null;
      await write(await renderRaw(s.part.frame(caption, { t, dur: s.dur, keepIn, keepOut }), REEL));
    }
    start += s.dur;
    console.log(`  cena ${i + 1}/${timed.length}: ${last - first} quadros (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  }
  ff.stdin.end();
  await done;
}

/** Uma trilha de scripts/social/music (muda por dia); nenhuma = sem música. */
async function pickMusic(): Promise<string | null> {
  const files = (await fs.readdir(MUSIC_DIR).catch(() => [] as string[])).filter((f) => /\.(mp3|m4a|wav)$/i.test(f)).sort();
  if (files.length === 0) return null;
  const day = Math.floor(Date.now() / 86_400_000);
  return path.join(MUSIC_DIR, files[day % files.length]);
}

/**
 * Capa do Reels em JPEG (capa.jpg, a partir da capa.png do render): a API do Instagram só aceita
 * JPEG no cover_url. Sem ela, o Instagram usa um quadro qualquer do vídeo. Devolve o caminho ou null.
 */
export async function reelCover(outDir: string): Promise<string | null> {
  const png = path.join(outDir, 'capa.png');
  const jpg = path.join(outDir, 'capa.jpg');
  if (!(await fs.stat(png).then(() => true, () => false))) return null;
  await ffmpeg(['-i', png, '-q:v', '2', jpg]);
  return jpg;
}

/**
 * Reels explicador: uma cena por frase, animada quadro a quadro (motion.ts): título entra linha
 * a linha e sai subindo, desenho entra por partes no ritmo da fala e flutua, legenda em pílula
 * que pula a cada bloco. Fundo, selo e marca não cortam; desenho igual ao da cena vizinha
 * continua na tela. No fim, "comenta GUIA" + envio (no Shorts, "link no canal"). Capa em capa.png.
 * MP4 H.264/AAC 1080×1920 30 fps: reel.mp4 (Instagram) ou short.mp4 (YouTube). A voz das cenas sai
 * do cache (voice.ts): o Shorts só paga a fala final.
 */
export async function renderReel(
  draft: Draft, topic: Topic, cta: Cta | null, outDir: string, platform: Platform = 'instagram',
): Promise<string> {
  await fs.mkdir(outDir, { recursive: true });
  const scenes = scenesFor(draft, topic);
  if (scenes.length === 0) throw new Error('rascunho sem cenas nem falas para o Reels');
  await fs.writeFile(path.join(outDir, 'capa.png'), await renderPng(createElement(ReelScene, { scene: scenes[0] }), REEL));
  await reelCover(outDir);

  const parts: Part[] = [
    ...scenes.map((scene): Part => ({
      speech: scene.speech,
      visualKey: JSON.stringify(scene.visual),
      frame: (caption, clock) => createElement(ReelScene, { scene, caption, clock }),
    })),
    {
      speech: platform === 'youtube' ? shortsSpeech(cta, draft.share) : ctaSpeech(cta, draft.share),
      frame: (caption, clock) => createElement(ReelCta, { cta, caption, clock, platform }),
    },
  ];
  console.log(`Voz: ${voiceLabel()} · ${parts.length} cenas`);
  const timed: Timed[] = [];
  for (const [i, p] of parts.entries()) timed.push(await voice(p, i, outDir));
  const total = timed.reduce((s, d) => s + d.dur, 0);
  const video = path.join(outDir, 'quadros.mp4');
  await renderFrames(timed, video);

  const inputs = ['-i', video, ...timed.flatMap((d) => ['-i', d.audio])];
  const music = await pickMusic();
  if (music) inputs.push('-stream_loop', '-1', '-i', music);
  const n = timed.length;
  const f: string[] = [];
  timed.forEach((d, i) => f.push(`[${i + 1}:a]aresample=48000,apad,atrim=0:${d.dur.toFixed(3)},asetpts=N/SR/TB[a${i}]`));
  f.push(`${timed.map((_, i) => `[a${i}]`).join('')}concat=n=${n}:v=0:a=1[voz]`);
  if (music) {
    f.push(`[${n + 1}:a]aresample=48000,volume=${MUSIC_VOLUME},afade=t=in:d=0.6,afade=t=out:st=${(total - 1.5).toFixed(2)}:d=1.5[bgm]`);
    f.push('[voz][bgm]amix=inputs=2:normalize=0:duration=first[a]');
  } else {
    f.push('[voz]anull[a]');
  }

  const out = path.join(outDir, platform === 'youtube' ? 'short.mp4' : 'reel.mp4');
  await ffmpeg([
    ...inputs,
    '-filter_complex', f.join(';'),
    '-map', '0:v', '-map', '[a]', '-t', total.toFixed(3),
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-movflags', '+faststart', out,
  ]);
  await Promise.all([fs.rm(video), ...timed.map((d) => fs.rm(d.audio))]);
  return out;
}
