// Render: JSX → PNG (satori + resvg) → JPEG (ffmpeg; a API só aceita JPEG) e Reels
// (voz em voice.ts + legenda palavra a palavra + ffmpeg). Precisa de ffmpeg/ffprobe no PATH e,
// sem ELEVENLABS_API_KEY, do pacote Python edge-tts (`pip install edge-tts`).
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { createElement } from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { CAROUSEL, Caption, CoverSlide, ContentSlide, CtaSlide, REEL, REEL_MASCOT, ReelCta, ReelScene, accentFor, type MascotBox, type SceneSide, type Size } from './slides';
import { BORDAO_ABERTURA, ctaSpeech } from './caption';
import { beatsFor, chunkWords } from './captions';
import { mascotTimeline } from './lipsync';
import Gotinha, { GOTINHA_RATIO } from './mascot';
import type { Mouth, Pose } from './poses';
import { speakCached, voiceLabel } from './voice';
import { THEMES, type Theme, type ThemeId } from './themes';
import type { Cta, Draft, Topic } from './types';

/** Opções visuais do post: o cenário (themes.ts). Sem ele, o azul-escuro padrão. */
export type RenderOptions = { theme?: ThemeId };

const run = promisify(execFile);

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
export async function renderCarousel(draft: Draft, topic: Topic, cta: Cta | null, outDir: string, opts: RenderOptions = {}): Promise<string[]> {
  await fs.mkdir(outDir, { recursive: true });
  const accent = accentFor(topic.category);
  const theme = THEMES[opts.theme ?? 'noite'](accent);
  const total = draft.slides.length + 2;
  const els = [
    createElement(CoverSlide, { size: CAROUSEL, accent, theme, hook: draft.hook, label: LABEL[topic.kind], swipe: true, icon: draft.hookIcon ?? draft.slides[0]?.icon, pose: draft.hookPose }),
    ...draft.slides.map((s, i) =>
      createElement(ContentSlide, { size: CAROUSEL, accent, theme, title: s.title, body: s.body, page: `${i + 2}/${total}`, icon: s.icon, pose: s.pose, layout: s.layout }),
    ),
    createElement(CtaSlide, { size: CAROUSEL, accent, theme, cta, page: `${total}/${total}` }),
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

const FPS = 30;
const SCENE_PAD = 0.4; // respiro depois da última palavra da cena
const XFADE = 0.3; // transição entre cenas
const MUSIC_DIR = path.join(process.cwd(), 'scripts', 'social', 'music');
const MUSIC_VOLUME = 0.12;

/** Uma trilha de scripts/social/music (muda por dia); nenhuma = sem música. */
async function pickMusic(): Promise<string | null> {
  const files = (await fs.readdir(MUSIC_DIR).catch(() => [] as string[])).filter((f) => /\.(mp3|m4a|wav)$/i.test(f)).sort();
  if (files.length === 0) return null;
  const day = Math.floor(Date.now() / 86_400_000);
  return path.join(MUSIC_DIR, files[day % files.length]);
}

const BOUNCE_PX = 9; // quique da Gotinha (amplitude) e quantas vezes por segundo
const BOUNCE_HZ = 1.5;

type Scene = {
  speech: string;
  frame: (caption: React.ReactNode) => React.ReactElement;
  big?: boolean;
  /** Pose da Gotinha na cena e onde ela entra no quadro (REEL_MASCOT). */
  pose: Pose;
  mascot: MascotBox;
  /** Entrada da Gotinha deslizando de um lado (cenas do meio); sem ela, já está no lugar. */
  enter?: 'left' | 'right';
  theme: Theme;
};

const ENTER_PX = 320;
const ENTER_S = 0.35;

/** Desenhos da Gotinha já feitos neste Reels (pose + boca + olhos + tamanho → PNG transparente). */
type MascotCache = Map<string, string>;

async function mascotPng(cache: MascotCache, outDir: string, pose: Pose, mouth: Mouth, blink: boolean, w: number): Promise<string> {
  const key = `${pose}-${mouth}-${blink ? 'p' : 'a'}-${w}`;
  let file = cache.get(key);
  if (!file) {
    file = path.join(outDir, `gotinha-${key}.png`);
    const size = { width: w, height: Math.round(w * GOTINHA_RATIO) };
    const el = createElement('div', { style: { display: 'flex', ...size } }, createElement(Gotinha, { pose, mouth, blink, size: w }));
    await fs.writeFile(file, await renderPng(el, size));
    cache.set(key, file);
  }
  return file;
}

/**
 * Vídeo de uma cena: quadros da legenda no tempo da fala + zoom lento (entrando ou saindo) e,
 * por cima, a Gotinha falando (boca no ritmo das palavras, piscadas e quique).
 */
async function renderScene(scene: Scene, i: number, outDir: string, mascots: MascotCache): Promise<{ video: string; audio: string; dur: number }> {
  const base = path.join(outDir, `cena-${i + 1}`);
  const audio = `${base}.mp3`;
  const words = await speakCached(toSpeech(scene.speech), audio);
  const dur = (await duration(audio)) + SCENE_PAD;
  const chunks = chunkWords(words);
  const beats = beatsFor(chunks, dur);

  const mlist: string[] = [];
  for (const s of mascotTimeline(words, dur, i)) {
    const file = await mascotPng(mascots, outDir, scene.pose, s.mouth, s.blink, scene.mascot.w);
    mlist.push(`file '${path.basename(file)}'`, `duration ${(s.end - s.start).toFixed(3)}`);
  }
  mlist.push(mlist[mlist.length - 2]);
  const mlistFile = `${base}-gotinha.txt`;
  await fs.writeFile(mlistFile, mlist.join('\n'));

  const cache = new Map<string, string>();
  const list: string[] = [];
  const frame = async (key: string, caption: React.ReactNode) => {
    let file = cache.get(key);
    if (!file) {
      file = `${base}-${cache.size + 1}.png`;
      await fs.writeFile(file, await renderPng(scene.frame(caption), REEL));
      cache.set(key, file);
    }
    return file;
  };
  if (beats.length === 0) {
    list.push(`file '${path.basename(await frame('vazio', null))}'`, `duration ${dur.toFixed(3)}`);
  }
  for (const b of beats) {
    const c = chunks[b.chunk];
    const file = await frame(`${b.chunk}-${b.active}-${b.pop}`, createElement(Caption, { words: c.words, active: b.active, pop: b.pop, big: scene.big, theme: scene.theme }));
    list.push(`file '${path.basename(file)}'`, `duration ${(b.end - b.start).toFixed(3)}`);
  }
  list.push(list[list.length - 2]); // o concat ignora a duração do último arquivo sem repeti-lo
  const listFile = `${base}.txt`;
  await fs.writeFile(listFile, list.join('\n'));

  const z = i % 2 === 0 ? `1+0.06*on/${Math.ceil(dur * FPS)}` : `1.06-0.06*on/${Math.ceil(dur * FPS)}`;
  const video = `${base}.mp4`;
  const { x, y } = scene.mascot;
  // Entrada: desliza ENTER_PX px do lado escolhido até o lugar em ENTER_S s (desaceleração quadrática).
  const dir = scene.enter === 'left' ? -1 : 1;
  const xExpr = scene.enter ? `'${Math.round(x)}+${dir * ENTER_PX}*pow(max(0,1-t/${ENTER_S}),2)'` : String(Math.round(x));
  await ffmpeg([
    '-f', 'concat', '-safe', '0', '-i', listFile,
    '-f', 'concat', '-safe', '0', '-i', mlistFile,
    '-filter_complex',
    `[0:v]fps=${FPS},scale=1242:2208,zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=${FPS}[bg];` +
      `[1:v]fps=${FPS},format=rgba[g];` +
      `[bg][g]overlay=x=${xExpr}:y='${Math.round(y)}+${BOUNCE_PX}*sin(2*PI*${BOUNCE_HZ}*t)':eval=frame,format=yuv420p[v]`,
    '-map', '[v]', '-t', dur.toFixed(3), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', video,
  ]);
  for (const f of cache.values()) await fs.rm(f);
  await Promise.all([fs.rm(listFile), fs.rm(mlistFile)]);
  return { video, audio, dur };
}

/**
 * Reels com a Gotinha de protagonista, sempre nesta ordem: gancho (escrito na tela) e bordão de
 * abertura, uma cena por fala com o título do slide, e "comenta GUIA" + pedido de envio + bordão
 * de fechamento. Cada cena tem a
 * Gotinha falando (lipsync.ts), legenda palavra a palavra no ritmo da voz (voice.ts), zoom lento
 * alternado no fundo e transição deslizando para a próxima; música de fundo baixa se houver
 * trilha em scripts/social/music. Capa do Reels em capa.png. MP4 H.264/AAC 1080×1920 30 fps.
 */
/** Lado da Gotinha em cada cena do meio: alterna para o vídeo não ficar parado no mesmo quadro. */
export function sceneSides(n: number, flip: boolean): SceneSide[] {
  const cycle: SceneSide[] = flip ? ['right', 'left', 'center'] : ['left', 'right', 'center'];
  return Array.from({ length: n }, (_, i) => cycle[i % cycle.length]);
}

export async function renderReel(draft: Draft, topic: Topic, cta: Cta | null, outDir: string, opts: RenderOptions = {}): Promise<string> {
  await fs.mkdir(outDir, { recursive: true });
  const accent = accentFor(topic.category);
  const theme = THEMES[opts.theme ?? 'noite'](accent);
  await fs.writeFile(
    path.join(outDir, 'capa.png'),
    await renderPng(createElement(CoverSlide, { size: REEL, accent, theme, hook: draft.hook, label: LABEL[topic.kind], swipe: false, icon: draft.hookIcon ?? draft.slides[0]?.icon, pose: draft.hookPose }), REEL),
  );

  const hookIcon = draft.hookIcon ?? draft.slides[0]?.icon;
  const middle = draft.narration.slice(1);
  const sides = sceneSides(middle.length, theme.flip);
  // Bordões na mesma cena do gancho e da chamada final: cena a mais é segundo a mais, e o
  // começo do vídeo é onde mais gente desiste.
  const scenes: Scene[] = [
    {
      speech: `${draft.narration[0].text} ${BORDAO_ABERTURA}`, big: true, theme, pose: draft.narration[0].pose ?? draft.hookPose ?? 'ih', mascot: REEL_MASCOT.scene,
      // O gancho escrito inteiro já no primeiro quadro: quem rola sem som decide por ele.
      frame: (caption) => createElement(ReelScene, { size: REEL, accent, theme, headline: draft.hook, caption, icon: hookIcon }),
    },
    ...middle.map((line, i): Scene => {
      const side = sides[i];
      const slide = draft.slides[i];
      return {
        speech: line.text, theme, pose: line.pose ?? slide?.pose ?? 'explicando',
        mascot: side === 'center' ? REEL_MASCOT.scene : REEL_MASCOT[side],
        enter: side === 'right' ? 'right' : 'left',
        frame: (caption) => createElement(ReelScene, {
          size: REEL, accent, theme, side, layout: slide?.layout, title: slide?.title ?? topic.title, caption, icon: slide?.icon,
        }),
      };
    }),
    {
      speech: ctaSpeech(cta, draft.share), theme, pose: 'apontando', mascot: REEL_MASCOT.cta, enter: 'left',
      frame: (caption) => createElement(ReelCta, { size: REEL, accent, theme, cta, caption }),
    },
  ];
  console.log(`Voz: ${voiceLabel()}`);
  const mascots: MascotCache = new Map();
  const parts: Awaited<ReturnType<typeof renderScene>>[] = [];
  for (const [i, s] of scenes.entries()) parts.push(await renderScene(s, i, outDir, mascots));
  for (const f of mascots.values()) await fs.rm(f);

  // Início de cada cena na linha do tempo final (as transições sobrepõem XFADE segundos).
  const starts: number[] = [];
  parts.forEach((p, i) => starts.push(i === 0 ? 0 : starts[i - 1] + parts[i - 1].dur - XFADE));
  const total = starts[parts.length - 1] + parts[parts.length - 1].dur;

  const inputs = parts.flatMap((p) => ['-i', p.video]);
  parts.forEach((p) => inputs.push('-i', p.audio));
  const music = await pickMusic();
  if (music) inputs.push('-stream_loop', '-1', '-i', music);

  const n = parts.length;
  const f: string[] = [];
  let last = '[0:v]';
  for (let i = 1; i < n; i++) {
    const out = i === n - 1 ? '[v]' : `[x${i}]`;
    const t = ['slideleft', 'slideup', 'smoothleft'][i % 3];
    f.push(`${last}[${i}:v]xfade=transition=${t}:duration=${XFADE}:offset=${starts[i].toFixed(3)}${out}`);
    last = out;
  }
  if (n === 1) f.push('[0:v]null[v]');
  parts.forEach((_, i) => f.push(`[${n + i}:a]aresample=48000,adelay=${Math.round(starts[i] * 1000)}:all=1[a${i}]`));
  f.push(`${parts.map((_, i) => `[a${i}]`).join('')}amix=inputs=${n}:normalize=0[voz]`);
  if (music) {
    f.push(`[${2 * n}:a]aresample=48000,volume=${MUSIC_VOLUME},afade=t=in:d=0.6,afade=t=out:st=${(total - 1.5).toFixed(2)}:d=1.5[bgm]`);
    f.push('[voz][bgm]amix=inputs=2:normalize=0:duration=first[a]');
  } else {
    f.push('[voz]anull[a]');
  }

  const out = path.join(outDir, 'reel.mp4');
  await ffmpeg([
    ...inputs,
    '-filter_complex', f.join(';'),
    '-map', '[v]', '-map', '[a]', '-t', total.toFixed(3),
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-r', String(FPS), '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-movflags', '+faststart', out,
  ]);
  for (const p of parts) await Promise.all([fs.rm(p.video), fs.rm(p.audio)]);
  return out;
}
