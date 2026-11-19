// Narração do Reels com o tempo de cada palavra (para a legenda palavra a palavra).
// Com ELEVENLABS_API_KEY usa a ElevenLabs (voz natural; ELEVENLABS_VOICE_ID escolhe a voz);
// sem ela, cai para o edge-tts grátis (tts_words.py). Precisa de rede.
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export type Word = { text: string; start: number; end: number };

const ELEVEN_URL = 'https://api.elevenlabs.io/v1/text-to-speech';
// Voz padrão da biblioteca da ElevenLabs; troque por uma brasileira em ELEVENLABS_VOICE_ID.
const ELEVEN_DEFAULT_VOICE = '21m00Tcm4TlvDq8ikWAM';
export const FREE_VOICE = process.env.SOCIAL_VOICE || 'pt-BR-ThalitaMultilingualNeural';
const PYTHON = process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

/** Agrupa a linha do tempo por caractere (ElevenLabs) em palavras. Puro. */
export function wordsFromChars(chars: string[], starts: number[], ends: number[]): Word[] {
  const words: Word[] = [];
  let cur: Word | null = null;
  chars.forEach((c, i) => {
    if (/\s/.test(c)) {
      if (cur) words.push(cur);
      cur = null;
      return;
    }
    if (!cur) cur = { text: c, start: starts[i], end: ends[i] };
    else {
      cur.text += c;
      cur.end = ends[i];
    }
  });
  if (cur) words.push(cur);
  return words;
}

async function eleven(text: string, out: string, key: string): Promise<Word[]> {
  const voice = process.env.ELEVENLABS_VOICE_ID?.trim() || ELEVEN_DEFAULT_VOICE;
  const res = await fetch(`${ELEVEN_URL}/${voice}/with-timestamps?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2',
      language_code: 'pt',
      voice_settings: { stability: 0.35, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const json = (await res.json()) as {
    audio_base64: string;
    alignment?: { characters: string[]; character_start_times_seconds: number[]; character_end_times_seconds: number[] } | null;
  };
  await fs.writeFile(out, Buffer.from(json.audio_base64, 'base64'));
  const a = json.alignment;
  if (!a) throw new Error('ElevenLabs sem alinhamento');
  return wordsFromChars(a.characters, a.character_start_times_seconds, a.character_end_times_seconds);
}

function edge(text: string, out: string): Promise<Word[]> {
  const script = path.join(process.cwd(), 'scripts', 'social', 'tts_words.py');
  return new Promise((resolve, reject) => {
    const p = spawn(PYTHON, [script, FREE_VOICE, '+12%', out], { env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
    let stdout = '';
    let stderr = '';
    p.stdout.on('data', (d) => (stdout += d));
    p.stderr.on('data', (d) => (stderr += d));
    p.on('error', reject);
    p.on('close', (code) => {
      if (code !== 0) return reject(new Error(`edge-tts falhou (${code}): ${stderr.slice(-300)}`));
      try {
        resolve(JSON.parse(stdout) as Word[]);
      } catch (e) {
        reject(e);
      }
    });
    p.stdin.end(text, 'utf-8');
  });
}

/** O serviço grátis às vezes não devolve áudio (NoAudioReceived): tenta de novo com espera crescente. */
async function edgeRetry(text: string, out: string, tries = 4): Promise<Word[]> {
  for (let i = 1; ; i++) {
    try {
      return await edge(text, out);
    } catch (e) {
      if (i >= tries) throw e;
      await new Promise((r) => setTimeout(r, 4000 * i));
    }
  }
}

/** Gera `out` (mp3) e devolve as palavras com início e fim em segundos. */
export async function speak(text: string, out: string): Promise<Word[]> {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  return key ? eleven(text, out, key) : edgeRetry(text, out);
}

/** Cache da voz (social/out/_voz): renderizar de novo (prévia, troca de visual) não paga a fala duas vezes. */
const CACHE_DIR = path.join(process.cwd(), 'social', 'out', '_voz');

export async function speakCached(text: string, out: string): Promise<Word[]> {
  const voice = `${voiceLabel()}|${process.env.ELEVENLABS_VOICE_ID ?? ''}|${process.env.ELEVENLABS_MODEL ?? ''}`;
  const key = createHash('sha1').update(`${voice}\n${text}`).digest('hex').slice(0, 20);
  const mp3 = path.join(CACHE_DIR, `${key}.mp3`);
  const json = path.join(CACHE_DIR, `${key}.json`);
  try {
    const words = JSON.parse(await fs.readFile(json, 'utf8')) as Word[];
    await fs.copyFile(mp3, out);
    return words;
  } catch {
    const words = await speak(text, out);
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.copyFile(out, mp3);
    await fs.writeFile(json, JSON.stringify(words));
    return words;
  }
}

export function voiceLabel(): string {
  return process.env.ELEVENLABS_API_KEY?.trim() ? 'ElevenLabs' : `edge-tts ${FREE_VOICE}`;
}
