// Render: JSX → PNG (satori + resvg) → JPEG (ffmpeg; a API só aceita JPEG) e Reels
// (voz neural pelo edge-tts + ffmpeg). Precisa de ffmpeg/ffprobe no PATH e do pacote
// Python edge-tts (`pip install edge-tts`).
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { createElement } from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { CAROUSEL, CoverSlide, ContentSlide, CtaSlide, REEL, accentFor, type Size } from './slides';
import { ctaSpeech } from './caption';
import type { Cta, Draft, Topic } from './types';

const run = promisify(execFile);

export const VOICE = process.env.SOCIAL_VOICE || 'pt-BR-FranciscaNeural';
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

const FONT_DIR = path.join(process.cwd(), 'node_modules', '@fontsource', 'inter', 'files');
let fonts: Parameters<typeof satori>[1]['fonts'] | null = null;

async function loadFonts() {
  if (fonts) return fonts;
  const load = (w: number) => fs.readFile(path.join(FONT_DIR, `inter-latin-${w}-normal.woff`));
  const [r, s, b] = await Promise.all([load(400), load(600), load(800)]);
  fonts = [
    { name: 'Inter', data: r, weight: 400, style: 'normal' },
    { name: 'Inter', data: s, weight: 600, style: 'normal' },
    { name: 'Inter', data: b, weight: 800, style: 'normal' },
  ];
  return fonts;
}

export async function renderPng(el: React.ReactElement, size: Size): Promise<Buffer> {
  const svg = await satori(el, { ...size, fonts: await loadFonts() });
  return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: size.width } }).render().asPng());
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

const LABEL: Record<Topic['kind'], string> = { post: 'Sem achismo', peptide: 'Ficha rápida', comparison: 'Comparativo' };

/** Carrossel: capa + conteúdo + CTA, em JPEG. Devolve os caminhos na ordem. */
export async function renderCarousel(draft: Draft, topic: Topic, cta: Cta | null, outDir: string): Promise<string[]> {
  await fs.mkdir(outDir, { recursive: true });
  const accent = accentFor(topic.category);
  const total = draft.slides.length + 2;
  const els = [
    createElement(CoverSlide, { size: CAROUSEL, accent, hook: draft.hook, label: LABEL[topic.kind], swipe: true }),
    ...draft.slides.map((s, i) =>
      createElement(ContentSlide, { size: CAROUSEL, accent, title: s.title, body: s.body, page: `${i + 2}/${total}` }),
    ),
    createElement(CtaSlide, { size: CAROUSEL, accent, cta, page: `${total}/${total}` }),
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

/** Unidades por extenso para a voz não soletrar ("mg" → "miligramas"). */
export function toSpeech(text: string): string {
  const units: [RegExp, string][] = [
    [/(\d)\s*mcg\b/gi, '$1 microgramas'],
    [/(\d)\s*µg\b/gi, '$1 microgramas'],
    [/(\d)\s*mg\b/gi, '$1 miligramas'],
    [/(\d)\s*ml\b/gi, '$1 mililitros'],
    [/(\d)\s*UI\b/g, '$1 unidades internacionais'],
    [/(\d)\s*U\b/g, '$1 unidades'],
    [/(\d)\s*kg\b/gi, '$1 quilos'],
    [/(\d)\s*%/g, '$1 por cento'],
    [/\bGLP-1\b/g, 'GLP 1'],
  ];
  return units.reduce((t, [re, to]) => t.replace(re, to), text);
}

export async function tts(text: string, out: string): Promise<void> {
  await run(PYTHON, ['-m', 'edge_tts', '--voice', VOICE, '--rate', '+8%', '--text', toSpeech(text), '--write-media', out], {
    maxBuffer: 1 << 24,
  });
}

/**
 * Reels: cena 1 = capa com a primeira fala; cenas seguintes = slides com as demais falas
 * (fala sem slide correspondente vira o próprio texto na tela); última = CTA falada.
 * Cada cena dura o áudio + 0,5 s, com zoom lento. MP4 H.264/AAC 1080×1920 30 fps.
 */
export async function renderReel(draft: Draft, topic: Topic, cta: Cta | null, outDir: string): Promise<string> {
  await fs.mkdir(outDir, { recursive: true });
  const accent = accentFor(topic.category);
  const scenes: { el: React.ReactElement; speech: string }[] = [
    {
      el: createElement(CoverSlide, { size: REEL, accent, hook: draft.hook, label: LABEL[topic.kind], swipe: false }),
      speech: draft.narration[0],
    },
    ...draft.narration.slice(1).map((speech, i) => {
      const s = draft.slides[i];
      return {
        el: createElement(ContentSlide, { size: REEL, accent, title: s?.title ?? topic.title, body: s?.body ?? speech }),
        speech,
      };
    }),
    { el: createElement(CtaSlide, { size: REEL, accent, cta }), speech: ctaSpeech(cta) },
  ];

  const list: string[] = [];
  for (const [i, scene] of scenes.entries()) {
    const png = path.join(outDir, `cena-${i + 1}.png`);
    const mp3 = path.join(outDir, `cena-${i + 1}.mp3`);
    const mp4 = path.join(outDir, `cena-${i + 1}.mp4`);
    await fs.writeFile(png, await renderPng(scene.el, REEL));
    await tts(scene.speech, mp3);
    const d = (await duration(mp3)) + 0.5;
    const frames = Math.ceil(d * 30);
    await ffmpeg([
      '-i', png, '-i', mp3,
      '-filter_complex',
      `[0:v]scale=2160:3840,zoompan=z='min(zoom+0.0004,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1080x1920:fps=30,format=yuv420p[v];[1:a]aresample=48000,apad[a]`,
      '-map', '[v]', '-map', '[a]', '-t', d.toFixed(2),
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-c:a', 'aac', '-b:a', '128k', '-ac', '2',
      mp4,
    ]);
    list.push(`file '${path.basename(mp4)}'`);
  }

  const listFile = path.join(outDir, 'cenas.txt');
  await fs.writeFile(listFile, list.join('\n'));
  const out = path.join(outDir, 'reel.mp4');
  await ffmpeg(['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', '-movflags', '+faststart', out]);
  return out;
}
