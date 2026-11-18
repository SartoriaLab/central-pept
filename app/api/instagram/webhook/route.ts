import { after, type NextRequest } from 'next/server';
import { dmText, ebookFromCaption, fallbackEbook, guideRequests, publicReply, validSignature, type GuideRequest } from '@/lib/instagram-dm';

// Webhook do Instagram (@dosecerta_br): quem comenta GUIA recebe o guia do post no direct, com o
// cupom, e uma resposta pública no comentário. Regras em lib/instagram-dm.ts; setup na Meta e
// variáveis (IG_APP_SECRET, IG_WEBHOOK_VERIFY_TOKEN) em docs/instagram-setup.md (Parte 6).
// Responde 200 na hora e envia depois (`after`): a Meta reenvia o que demora a ser confirmado.

export const dynamic = 'force-dynamic';

/** Verificação da assinatura do webhook no painel da Meta. */
export function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const token = process.env.IG_WEBHOOK_VERIFY_TOKEN?.trim();
  if (token && q.get('hub.mode') === 'subscribe' && q.get('hub.verify_token') === token) {
    return new Response(q.get('hub.challenge') ?? '', { headers: { 'Content-Type': 'text/plain' } });
  }
  return new Response('forbidden', { status: 403 });
}

export async function POST(req: NextRequest) {
  const secret = process.env.IG_APP_SECRET?.trim();
  const raw = await req.text();
  if (!secret || !validSignature(raw, req.headers.get('x-hub-signature-256'), secret)) {
    return new Response('forbidden', { status: 403 });
  }
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response('ok');
  }
  const requests = guideRequests(payload);
  if (requests.length > 0) after(() => Promise.all(requests.map(handle)));
  return new Response('ok');
}

async function handle(r: GuideRequest): Promise<void> {
  const state = await import('@/scripts/social/state');
  const { InstagramClient } = await import('@/scripts/social/instagram');
  try {
    await state.ensureDmTable();
    if (!(await state.claimDm(r))) return;
  } catch (e) {
    console.error(`[instagram-dm] banco: ${(e as Error).message}`);
    return;
  }
  try {
    const { token } = await state.getToken();
    const ig = new InstagramClient({ userId: r.accountId, token });
    const caption = await ig.mediaCaption(r.mediaId).catch(() => '');
    const ebook = ebookFromCaption(caption) ?? fallbackEbook();
    await ig.privateReply(r.commentId, dmText(ebook));
    await ig.replyComment(r.commentId, publicReply(r.commentId)).catch((e) => {
      console.warn(`[instagram-dm] resposta pública ${r.commentId}: ${(e as Error).message}`);
    });
    await state.finishDm(r.commentId, ebook?.id ?? null);
  } catch (e) {
    console.error(`[instagram-dm] direct ${r.commentId} (post ${r.mediaId}): ${(e as Error).message}`);
    await state.releaseDm(r.commentId).catch(() => {});
  }
}
