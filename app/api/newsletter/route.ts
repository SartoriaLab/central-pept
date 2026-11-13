import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/drizzle/schema';
import { NEWSLETTER_CONSENT, normalizeEmail } from '@/lib/newsletter';

// Limite simples por IP, em memória: vale por instância serverless, o bastante para
// barrar envio em massa de um mesmo cliente. Para algo rígido, use o Firewall da Vercel.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; start: number }>();

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

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Muitas tentativas. Tente de novo mais tarde.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 });
  }

  // Honeypot: campo invisível que só robô preenche. Responde ok para não dar pista.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: 'É preciso aceitar receber os emails.' }, { status: 400 });
  }

  const source = typeof body.source === 'string' ? body.source.slice(0, 200) : null;

  try {
    await db
      .insert(newsletterSubscribers)
      .values({
        email,
        source,
        consentText: NEWSLETTER_CONSENT,
        unsubscribeToken: randomBytes(24).toString('hex'),
      })
      .onConflictDoNothing({ target: newsletterSubscribers.email });
    // Mesmo retorno para email novo ou já inscrito: não revela quem está na lista.
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('newsletter: falha ao gravar', e);
    return NextResponse.json({ error: 'Não conseguimos registrar agora.' }, { status: 500 });
  }
}
