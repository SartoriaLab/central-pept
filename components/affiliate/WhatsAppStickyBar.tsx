'use client';
import { useEffect, useState } from 'react';
import { affiliateHref, getAffiliate, getAffiliateCopy } from '@/lib/affiliates';

const DISMISS_KEY = 'wa-sticky-dismissed';
const SHOW_AFTER = 0.4; // fração da página rolada

type Props = {
  productId: string;
  slot: string;
  peptide?: string;
};

/**
 * Barra fixa inferior, só mobile. Aparece após rolar 40% da página,
 * some ao fechar (por sessão). Não usar em /ferramentas/* (conflita com
 * o mini-resultado flutuante da calculadora).
 */
export default function WhatsAppStickyBar({ productId, slot, peptide }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // true até hidratar → nunca pisca no SSR

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= SHOW_AFTER) setVisible(true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  const product = getAffiliate(productId);
  if (!product || dismissed || !visible) return null;

  const copy = getAffiliateCopy(product, peptide);
  const href = affiliateHref(product.id, slot, peptide);

  const close = () => {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    setDismissed(true);
  };

  return (
    <div
      role="complementary"
      aria-label={copy.title}
      className="lg:hidden no-print fixed bottom-0 inset-x-0 z-40 animate-slide-up"
    >
      <div className="mx-3 mb-3 rounded-2xl border-2 border-green-500 bg-white dark:bg-green-950 shadow-xl flex items-center gap-3 p-3">
        <a
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="flex-1 min-w-0 flex items-center gap-3"
        >
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block font-extrabold text-sm text-green-800 dark:text-green-200 leading-tight truncate">{copy.title}</span>
            <span className="block text-xs text-green-700 dark:text-green-300 leading-snug truncate">{copy.cta} →</span>
          </span>
        </a>
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="flex-shrink-0 w-8 h-8 rounded-full text-ink-3 hover:bg-green-50 dark:hover:bg-green-900 flex items-center justify-center"
        >
          <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>
      </div>
    </div>
  );
}
