export type AffiliateNetwork = 'whatsapp' | 'direto';

export type AffiliateCopy = { title: string; blurb: string; cta: string };

export type AffiliateProduct = AffiliateCopy & {
  id: string;
  network: AffiliateNetwork;
  url: string;
  priceHint?: string;
  image?: { src: string; width: number; height: number; alt: string };
  /** Mensagem pré-preenchida no WhatsApp (anexada como ?text= no redirect). */
  message?: string;
  /** Variante da mensagem quando se sabe o peptídeo. `{peptide}` é substituído pelo nome. */
  messageWithPeptide?: string;
};

export const AFFILIATES: Record<string, AffiliateProduct> = {
  fornecedor_oficial: {
    id: 'fornecedor_oficial',
    network: 'whatsapp',
    url: 'https://wa.me/5511920904819',
    title: 'Fornecedor Oficial',
    blurb: 'Peptídeos com procedência. Fale direto no WhatsApp.',
    cta: 'Falar no WhatsApp',
    message:
      'Olá! Vim do site Central Peptídeos e gostaria de mais informações.',
    messageWithPeptide:
      'Olá! Vim do site Central Peptídeos e quero informações sobre {peptide}.',
  },
};

/** Copy específica por peptídeo (slug). Só peptídeos listados aqui mudam o card. */
export const PEPTIDE_COPY: Record<string, AffiliateCopy> = {
  tirzepatida: {
    title: 'Tirzepatida com procedência',
    blurb: 'Fornecedor verificado. Tire dúvidas e receba orçamento direto no WhatsApp.',
    cta: 'Quero tirzepatida',
  },
};

export function getAffiliate(id: string): AffiliateProduct | undefined {
  return AFFILIATES[id];
}

/** Copy do card: a do peptídeo se existir, senão a padrão do produto. */
export function getAffiliateCopy(product: AffiliateProduct, peptideSlug?: string): AffiliateCopy {
  const custom = peptideSlug ? PEPTIDE_COPY[peptideSlug] : undefined;
  return custom ?? { title: product.title, blurb: product.blurb, cta: product.cta };
}

/** Mensagem do WhatsApp: com nome do peptídeo quando houver, senão a genérica. */
export function buildAffiliateMessage(product: AffiliateProduct, peptideName?: string): string | undefined {
  if (peptideName && product.messageWithPeptide) {
    return product.messageWithPeptide.replace('{peptide}', peptideName);
  }
  return product.message;
}

/** Href interno de tracking. `peptide` (slug) vira `pep=` e é usado pelo /api/click. */
export function affiliateHref(productId: string, slot: string, peptide?: string): string {
  const q = new URLSearchParams({ p: productId, slot });
  if (peptide) q.set('pep', peptide);
  return `/api/click?${q.toString()}`;
}
