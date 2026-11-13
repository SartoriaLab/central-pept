import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { newsletterSubscribers } from '@/drizzle/schema';

// POST com o token. Aceita JSON ({ token }) vindo da página /newsletter/descadastrar
// e também o descadastro em um clique dos clientes de email (RFC 8058), que manda
// POST para a URL com ?token= no cabeçalho List-Unsubscribe.
export async function POST(req: NextRequest) {
  let token = req.nextUrl.searchParams.get('token');
  if (!token) {
    try {
      const body = await req.json();
      if (typeof body?.token === 'string') token = body.token;
    } catch {
      // corpo vazio ou form-urlencoded do RFC 8058: o token vem na URL
    }
  }

  if (!token || !/^[a-f0-9]{48}$/.test(token)) {
    return NextResponse.json({ error: 'Link de descadastro inválido.' }, { status: 400 });
  }

  try {
    await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.unsubscribeToken, token));
    // Sem distinção entre token existente ou não: a pessoa só quer estar fora da lista.
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('newsletter: falha ao descadastrar', e);
    return NextResponse.json({ error: 'Não conseguimos processar agora.' }, { status: 500 });
  }
}
