// Print da página do site em tamanho de celular, para o fechamento do Reels/Shorts (PhoneScreen em
// papel.tsx): imagem real no meio dos desenhos. Usa o chrome-headless-shell do Playwright
// (~/AppData/Local/ms-playwright, ou CHROME_SHELL) e o ffmpeg. Cache de 7 dias em social/out/_telas.
// Sem navegador ou sem rede, devolve null e o fechamento volta ao texto.
import { execFile } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { SITE_URL } from '@/lib/site';

const run = promisify(execFile);
const CACHE_DIR = path.join(process.cwd(), 'social', 'out', '_telas');
const CACHE_DAYS = 7;
/** Largura do celular (CSS) e escala: 390 × 2 = 780 px de largura no print. */
const PHONE_W = 390;
const PAGE_H = 2200;

/** chrome-headless-shell mais novo do Playwright, ou CHROME_SHELL. */
async function chromeShell(): Promise<string | null> {
  if (process.env.CHROME_SHELL) return process.env.CHROME_SHELL;
  const root = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright');
  const dirs = (await fs.readdir(root).catch(() => [] as string[])).filter((d) => d.startsWith('chromium_headless_shell-')).sort().reverse();
  for (const d of dirs) {
    for (const sub of await fs.readdir(path.join(root, d)).catch(() => [] as string[])) {
      const exe = path.join(root, d, sub, 'chrome-headless-shell.exe');
      if (await fs.stat(exe).then(() => true, () => false)) return exe;
    }
  }
  return null;
}

/** Arquivo do cache para o caminho (puro). */
export function screenFile(pathname: string): string {
  const hash = crypto.createHash('sha1').update(pathname).digest('hex').slice(0, 12);
  return path.join(CACHE_DIR, `${hash}.jpg`);
}

/** Altura ÷ largura de um JPEG (lê o cabeçalho SOF). */
export function jpegRatio(buf: Buffer): number {
  for (let i = 2; i < buf.length - 9; ) {
    if (buf[i] !== 0xff) return 0;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc2) return buf.readUInt16BE(i + 5) / buf.readUInt16BE(i + 7);
    i += 2 + len;
  }
  return 0;
}

/**
 * Print da página `pathname` do site (ex.: "/blog/dose-esquecida") como data URI JPEG + proporção.
 * null quando não dá (sem navegador, página fora do ar).
 */
export async function siteScreen(pathname: string): Promise<{ src: string; ratio: number } | null> {
  const file = screenFile(pathname);
  const fresh = await fs.stat(file).then((s) => Date.now() - s.mtimeMs < CACHE_DAYS * 86_400_000, () => false);
  if (!fresh) {
    const exe = await chromeShell();
    if (!exe) return null;
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const png = file.replace(/\.jpg$/, '.png');
    try {
      await run(exe, [
        '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=8000',
        `--window-size=${PHONE_W},${PAGE_H}`, '--force-device-scale-factor=2',
        `--screenshot=${png}`, `${SITE_URL}${pathname}`,
      ], { timeout: 60_000 });
      await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', png, '-q:v', '4', file], { timeout: 60_000 });
      await fs.rm(png, { force: true });
    } catch (e) {
      console.warn(`Print de ${pathname} falhou: ${(e as Error).message.split('\n')[0]}`);
      return null;
    }
  }
  const buf = await fs.readFile(file);
  const ratio = jpegRatio(buf);
  return ratio > 0 ? { src: `data:image/jpeg;base64,${buf.toString('base64')}`, ratio } : null;
}
