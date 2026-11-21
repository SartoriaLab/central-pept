// "Comenta GUIA que eu te mando no direct": regras da automação do @dosecerta_br. Puro (sem rede
// nem banco): o webhook (app/api/instagram/webhook) recebe o comentário, decide aqui o que fazer
// e chama a API. Setup na Meta e variáveis: docs/instagram-setup.md (Parte 6).
import crypto from 'node:crypto';
import { EXIT_COUPON, getActiveEbooks, getEbookById, type Ebook } from '@/lib/ebooks';
import { SITE_URL } from '@/lib/site';

/** Palavra que a pessoa comenta. O vídeo fala e a legenda escreve (scripts/social/caption.ts). */
export const DM_KEYWORD = 'GUIA';

/** O comentário pede o guia? "guia", "GUIA!!", "quero o guia 🙏", "Guía". Não: "guias", "guiar". */
export function wantsGuide(text: string): boolean {
  const t = text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
  return new RegExp(String.raw`(^|[^\p{L}\d])${DM_KEYWORD.toLowerCase()}([^\p{L}\d]|$)`, 'u').test(t);
}

/** Confere a assinatura X-Hub-Signature-256 da Meta (HMAC-SHA256 do corpo com o App Secret). */
export function validSignature(rawBody: string, header: string | null, appSecret: string): boolean {
  if (!header?.startsWith('sha256=')) return false;
  const expected = crypto.createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex');
  const got = header.slice('sha256='.length);
  if (got.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(got, 'hex'), Buffer.from(expected, 'hex'));
}

export type GuideRequest = {
  /** Conta do Instagram que recebeu o comentário (quem envia o direct). */
  accountId: string;
  commentId: string;
  mediaId: string;
  userId: string;
  username?: string;
};

type CommentValue = {
  id?: string;
  text?: string;
  from?: { id?: string; username?: string };
  media?: { id?: string };
};
type WebhookPayload = {
  object?: string;
  entry?: { id?: string; changes?: { field?: string; value?: CommentValue }[] }[];
};

/** Comentários do webhook que pedem o guia; ignora os da própria conta (nossas respostas). */
export function guideRequests(payload: unknown): GuideRequest[] {
  const p = payload as WebhookPayload;
  if (p?.object !== 'instagram' || !Array.isArray(p.entry)) return [];
  const out: GuideRequest[] = [];
  for (const entry of p.entry) {
    for (const change of entry.changes ?? []) {
      const v = change.value;
      if (change.field !== 'comments' || !v?.id || !v.media?.id || !v.from?.id || !entry.id) continue;
      if (v.from.id === entry.id) continue;
      if (!wantsGuide(v.text ?? '')) continue;
      out.push({ accountId: entry.id, commentId: v.id, mediaId: v.media.id, userId: v.from.id, username: v.from.username });
    }
  }
  return out;
}

/**
 * Guia do post: o título entre aspas da linha "📘" da legenda (scripts/social/caption.ts, e as
 * legendas escritas à mão no mesmo formato). Só guias com checkout ativo.
 */
export function ebookFromCaption(caption: string | undefined, active: Ebook[] = getActiveEbooks()): Ebook | null {
  const m = caption?.match(/📘[^\n]*?["“]([^"”\n]+)["”]/u);
  if (!m) return null;
  const title = m[1].trim().toLowerCase();
  return active.find((e) => e.title.toLowerCase() === title) ?? null;
}

/** Sem guia na legenda: o kit (cobre o começo de GLP-1); sem kit ativo, nenhum. */
export function fallbackEbook(active: Ebook[] = getActiveEbooks()): Ebook | null {
  const kit = getEbookById('KIT');
  return kit && active.some((e) => e.id === kit.id) ? kit : null;
}

/** Página do guia com o cupom já aplicado (CheckoutButton lê ?cupom=) e a origem para os relatórios. */
export function guideUrl(e: Ebook): string {
  const qs = new URLSearchParams({ origem: 'direct' });
  if (EXIT_COUPON) qs.set('cupom', EXIT_COUPON.code);
  qs.set('utm_source', 'instagram');
  qs.set('utm_medium', 'direct');
  qs.set('utm_campaign', 'comenta-guia');
  return `${SITE_URL}/ebooks/${e.slug}?${qs.toString()}`;
}

export function toolsUrl(): string {
  return `${SITE_URL}/ferramentas?utm_source=instagram&utm_medium=direct&utm_campaign=comenta-guia`;
}

/** Texto do direct (uma mensagem só: a API permite uma resposta privada por comentário). */
export function dmText(e: Ebook | null): string {
  const end = 'Qualquer dúvida, é só responder aqui. 💛';
  if (!e) return `Oi! Aqui estão as calculadoras grátis que você pediu:\n${toolsUrl()}\n\n${end}`;
  const off = EXIT_COUPON ? `, com ${EXIT_COUPON.percent}% de desconto (o cupom ${EXIT_COUPON.code} já vai aplicado no link)` : '';
  return `Oi! Aqui está o guia "${e.title}" que você pediu${off}:\n${guideUrl(e)}\n\n${end}`;
}

/** Resposta pública no comentário: varia para não parecer robô repetindo (e o Instagram não barrar). */
export const PUBLIC_REPLIES = [
  'Te mandei no direct! 💧',
  'Já foi pro seu direct, amiga! 💧',
  'Corre no direct que eu te mandei 💛',
  'Mandei no seu direct! 💧',
] as const;

export function publicReply(commentId: string): string {
  let h = 0;
  for (const c of commentId) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PUBLIC_REPLIES[h % PUBLIC_REPLIES.length];
}
