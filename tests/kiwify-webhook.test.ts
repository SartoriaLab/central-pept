import { createHmac } from 'crypto';
import { describe, expect, it } from 'vitest';
import { EBOOKS } from '@/lib/ebooks';
import { parseKiwifySale, verifyKiwifySignature } from '@/lib/kiwify-webhook';

const TOKEN = 'kiwify-token-de-teste';
const sign = (body: string) => createHmac('sha1', TOKEN).update(body).digest('hex');

const approved = {
  order_id: 'ord-1',
  order_status: 'paid',
  webhook_event_type: 'order_approved',
  Product: { product_id: '6fad40e0-dfc6-11f1-af23-a9366f1cb294', product_name: 'Kit Começo Seguro GLP-1' },
  Commissions: { charge_amount: 6990 },
  TrackingParameters: { utm_source: 'site', utm_medium: 'card', utm_campaign: 'ebook-kit-comeco-seguro', utm_content: null },
};

describe('assinatura do webhook da Kiwify', () => {
  const body = JSON.stringify(approved);

  it('aceita HMAC-SHA1 do corpo bruto', () => {
    expect(verifyKiwifySignature(body, sign(body), TOKEN)).toBe(true);
    expect(verifyKiwifySignature(body, sign(body).toUpperCase(), TOKEN)).toBe(true);
  });

  it('bate com o vetor de teste da documentação da Kiwify', () => {
    const doc = '{"order_id":"9b1c2d3e-0000-4000-8000-000000000001","order_status":"paid","webhook_event_type":"order_approved"}';
    expect(verifyKiwifySignature(doc, 'bf18f352a4f981b91dfa3f6d8742a81080ab8c86', TOKEN)).toBe(true);
  });

  it('recusa assinatura errada, ausente ou de outro corpo', () => {
    expect(verifyKiwifySignature(body, null, TOKEN)).toBe(false);
    expect(verifyKiwifySignature(body, 'abc', TOKEN)).toBe(false);
    expect(verifyKiwifySignature(body, sign(body + ' '), TOKEN)).toBe(false);
    expect(verifyKiwifySignature(body, sign(body), '')).toBe(false);
  });
});

describe('leitura do pedido da Kiwify', () => {
  it('compra aprovada: slug do catálogo, centavos e UTMs', () => {
    expect(parseKiwifySale(approved)).toEqual({
      action: 'approved',
      event: 'order_approved',
      orderId: 'ord-1',
      productSlug: 'kit-comeco-seguro',
      amount: 6990,
      utm: { source: 'site', medium: 'card', campaign: 'ebook-kit-comeco-seguro', content: null },
    });
  });

  it('valor em texto ou em reais vira centavos', () => {
    expect(parseKiwifySale({ ...approved, Commissions: { charge_amount: '2990' } }).amount).toBe(2990);
    expect(parseKiwifySale({ ...approved, Commissions: { charge_amount: '29.90' } }).amount).toBe(2990);
  });

  it('reembolso e chargeback desfazem; pix e boleto gerados são ignorados', () => {
    expect(parseKiwifySale({ ...approved, webhook_event_type: 'order_refunded', order_status: 'refunded' }).action).toBe('reversed');
    expect(parseKiwifySale({ ...approved, webhook_event_type: 'chargeback', order_status: 'chargedback' }).action).toBe('reversed');
    expect(parseKiwifySale({ ...approved, webhook_event_type: 'pix_created', order_status: 'waiting_payment' }).action).toBe('ignore');
    expect(parseKiwifySale({ ...approved, webhook_event_type: 'order_rejected', order_status: 'refused' }).action).toBe('ignore');
  });

  it('produto fora do catálogo guarda o nome; payload vazio não quebra', () => {
    expect(parseKiwifySale({ ...approved, Product: { product_id: 'x', product_name: 'GHK-Cu' } }).productSlug).toBe('GHK-Cu');
    expect(parseKiwifySale(null)).toMatchObject({ action: 'ignore', orderId: null, productSlug: null, amount: null });
  });

  it('todo ebook com checkout ativo na Kiwify tem id de produto único', () => {
    const ids = EBOOKS.map((e) => e.kiwifyProductId).filter(Boolean);
    expect(ids.length).toBeGreaterThanOrEqual(6);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
