// Webhook de vendas da Kiwify (docs.kiwify.com.br/api-reference/webhooks/receiving).
//
// - POST com JSON; a Kiwify acrescenta `?signature=` na URL cadastrada.
// - signature = HMAC-SHA1 (hex minúsculo) do corpo bruto, com o token do webhook como chave.
// - `webhook_event_type`: order_approved (paid), order_refunded, chargeback, order_rejected,
//   billet_created, pix_created, subscription_*.
// - Pode chegar duplicado: deduplicar por order_id + evento.
//
// Funções puras (sem banco) para a rota e os testes.

import { createHmac, timingSafeEqual } from 'crypto';
import { EBOOKS } from './ebooks';

export function verifyKiwifySignature(rawBody: string, signature: string | null, token: string): boolean {
  if (!signature || !token) return false;
  const expected = createHmac('sha1', token).update(rawBody, 'utf8').digest('hex');
  const a = Buffer.from(signature.toLowerCase());
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export type KiwifySale = {
  /** 'approved' grava a venda; 'reversed' (reembolso ou chargeback) apaga; 'ignore' não faz nada. */
  action: 'approved' | 'reversed' | 'ignore';
  event: string;
  orderId: string | null;
  /** Slug do ebook (lib/ebooks) ou, se o produto não estiver no catálogo, o nome do produto. */
  productSlug: string | null;
  /** Valor cobrado em centavos. */
  amount: number | null;
  utm: { source: string | null; medium: string | null; campaign: string | null; content: string | null };
};

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === 'object' ? (v as Obj) : {});
const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : typeof v === 'number' ? String(v) : null);

/** Centavos a partir de número ou texto ("2990", 2990, "29.90"). */
function cents(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return Number.isInteger(v) ? v : Math.round(v * 100);
  if (typeof v === 'string' && v.trim()) {
    const t = v.trim();
    if (/^\d+$/.test(t)) return Number(t);
    const n = Number(t.replace(',', '.'));
    return Number.isFinite(n) ? Math.round(n * 100) : null;
  }
  return null;
}

export function slugForKiwifyProduct(productId: string | null, productName: string | null): string | null {
  if (productId) {
    const e = EBOOKS.find((x) => x.kiwifyProductId === productId);
    if (e) return e.slug;
  }
  return productName;
}

export function parseKiwifySale(payload: unknown): KiwifySale {
  const p = obj(payload);
  const event = str(p.webhook_event_type) ?? '';
  const status = str(p.order_status) ?? '';
  const product = obj(p.Product ?? p.product);
  const tracking = obj(p.TrackingParameters ?? p.tracking);
  const commissions = obj(p.Commissions ?? p.commissions);

  let action: KiwifySale['action'] = 'ignore';
  if (event === 'order_approved' || (!event && status === 'paid')) action = 'approved';
  else if (['order_refunded', 'chargeback'].includes(event) || ['refunded', 'chargedback'].includes(status)) action = 'reversed';

  return {
    action,
    event: event || status,
    orderId: str(p.order_id),
    productSlug: slugForKiwifyProduct(str(product.product_id), str(product.product_name)),
    amount: cents(commissions.charge_amount ?? commissions.product_base_price ?? p.order_value),
    utm: {
      source: str(tracking.utm_source),
      medium: str(tracking.utm_medium),
      campaign: str(tracking.utm_campaign),
      content: str(tracking.utm_content),
    },
  };
}
