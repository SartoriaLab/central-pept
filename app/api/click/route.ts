import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { buildAffiliateMessage, getAffiliate } from '@/lib/affiliates';
import { getPeptideBySlug } from '@/lib/peptides';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const IP_SALT = process.env.IP_HASH_SALT ?? 'change-me-in-env';

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash('sha256').update(ip + IP_SALT).digest('hex').slice(0, 32);
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const productId = searchParams.get('p');
  const slot = searchParams.get('slot') ?? 'unknown';
  if (!productId) {
    return NextResponse.json({ error: 'missing p' }, { status: 400 });
  }

  const product = getAffiliate(productId);
  if (!product) {
    return NextResponse.json({ error: 'unknown product' }, { status: 404 });
  }

  const pepSlug = searchParams.get('pep');
  const peptide = pepSlug ? getPeptideBySlug(pepSlug) : undefined;

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    null;

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import('@/lib/db');
      const { affiliateClicks } = await import('@/drizzle/schema');
      await db.insert(affiliateClicks).values({
        productId: product.id,
        network: product.network,
        slot,
        utmSource: searchParams.get('utm_source'),
        utmMedium: searchParams.get('utm_medium'),
        utmCampaign: searchParams.get('utm_campaign'),
        utmContent: searchParams.get('utm_content') ?? peptide?.slug ?? null,
        referer: req.headers.get('referer'),
        ipHash: hashIp(ip),
        userAgent: req.headers.get('user-agent'),
      });
    } catch (err) {
      console.error('[affiliate click] insert failed', err);
    }
  }

  let redirectUrl = product.url;
  const message = buildAffiliateMessage(product, peptide?.name);
  if (message) {
    const sep = redirectUrl.includes('?') ? '&' : '?';
    redirectUrl += `${sep}text=${encodeURIComponent(message)}`;
  }

  return NextResponse.redirect(redirectUrl, { status: 302 });
}
