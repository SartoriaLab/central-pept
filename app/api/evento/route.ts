import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { siteEvents } from '@/drizzle/schema';
import { parseSiteEvent } from '@/lib/site-events';

// Recebe as ações enviadas por lib/track.ts (navigator.sendBeacon) e grava em site_events.
// Responde 204 sempre: métrica nunca mostra erro ao visitante nem dá pista a robô.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, { count: number; start: number }>();
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|whatsapp/i;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now - entry.start > WINDOW_MS) {
    hits.set(ip, { count: 1, start: now });
    if (hits.size > 5000) hits.clear();
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

const done = () => new Response(null, { status: 204 });

export async function POST(req: NextRequest) {
  if (BOT.test(req.headers.get('user-agent') ?? '')) return done();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) return done();

  let body: unknown;
  try {
    // sendBeacon manda text/plain; lê como texto e converte.
    const text = await req.text();
    if (text.length > 4000) return done();
    body = JSON.parse(text);
  } catch {
    return done();
  }

  const row = parseSiteEvent(body);
  if (!row) return done();
  try {
    await db.insert(siteEvents).values(row);
  } catch (err) {
    console.error('[evento] falha ao gravar', err);
  }
  return done();
}
