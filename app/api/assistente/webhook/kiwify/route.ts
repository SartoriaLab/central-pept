import { db } from '@/lib/db';
import { conversions } from '@/drizzle/schema';
import { parseKiwifySale, verifyKiwifySignature } from '@/lib/kiwify-webhook';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

// Webhook de vendas da Kiwify. Cadastro na Kiwify: Apps → Webhooks, URL
// https://centralpeptideos.com.br/api/assistente/webhook/kiwify, eventos "Compra aprovada",
// "Reembolso" e "Chargeback", e o mesmo token na variável KIWIFY_WEBHOOK_SECRET da Vercel.
//
// Fora do Basic Auth (proxy.ts): a Kiwify assina o corpo com HMAC-SHA1 e manda em ?signature=.
// Sem segredo configurado, nada é gravado.
export async function POST(req: NextRequest) {
  const secret = process.env.KIWIFY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Configure KIWIFY_WEBHOOK_SECRET' }, { status: 503 });
  }

  const body = await req.text();
  if (!verifyKiwifySignature(body, req.nextUrl.searchParams.get('signature'), secret)) {
    return NextResponse.json({ error: 'Assinatura inválida' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const sale = parseKiwifySale(payload);
  if (sale.action === 'ignore' || !sale.orderId) {
    return NextResponse.json({ ignored: sale.event || true });
  }

  try {
    const sameOrder = and(
      eq(conversions.kiwifyOrderId, sale.orderId),
      sale.productSlug ? eq(conversions.productSlug, sale.productSlug) : undefined,
    );

    if (sale.action === 'reversed') {
      // Reembolso ou chargeback: a venda sai das métricas.
      const removed = await db.delete(conversions).where(sameOrder).returning({ id: conversions.id });
      return NextResponse.json({ ok: true, removed: removed.length });
    }

    // A Kiwify pode reenviar o mesmo evento: grava uma vez só.
    const [existing] = await db.select({ id: conversions.id }).from(conversions).where(sameOrder).limit(1);
    if (existing) return NextResponse.json({ ok: true, duplicate: true, id: existing.id });

    const [row] = await db
      .insert(conversions)
      .values({
        utmSource: sale.utm.source,
        utmMedium: sale.utm.medium,
        utmCampaign: sale.utm.campaign,
        utmContent: sale.utm.content,
        kiwifyOrderId: sale.orderId,
        productSlug: sale.productSlug,
        amount: sale.amount,
      })
      .returning({ id: conversions.id });
    return NextResponse.json({ ok: true, id: row.id });
  } catch (e) {
    // 500 faz a Kiwify tentar de novo mais tarde.
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
