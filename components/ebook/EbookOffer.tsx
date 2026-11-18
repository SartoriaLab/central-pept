'use client';

// Oferta de ebook dentro das páginas. Recebe a oferta já resolvida no servidor
// (lib/ebooks.ts → offerFor/toOffer) e não renderiza nada quando ela é null.
//
// Variantes:
//   card   — capa, gancho, 3 itens, âncora de preço e botão (ficha, marca, fim de artigo, índices)
//   line   — faixa curta com capa e botão (logo depois do resumo do artigo)
//   result — embaixo do resultado da calculadora; `lead` usa o dado calculado. No celular, quando
//            a pessoa rola para além do bloco, aparece uma barra fina no rodapé (OfferBar).
//
// Toda variante registra a oferta para o pop-up de saída (offer-store → ExitOffer).
// Nunca aparece na impressão (no-print) nem nos embeds (a calculadora não recebe oferta).

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EbookCover from '@/components/ebook/EbookCover';
import AnchorNote from './AnchorNote';
import { withUtm } from '@/components/ebook/CheckoutButton';
import LaunchPrice from '@/components/ebook/LaunchPrice';
import OfferBar from '@/components/ebook/OfferBar';
import { clearPageOffer, markOfferClicked, setPageOffer } from '@/components/ebook/offer-store';
import type { EbookOffer as Offer } from '@/lib/ebooks';
import { EVENTS, track, trackOnce } from '@/lib/track';

type Variant = 'card' | 'line' | 'result';

type Props = {
  offer: Offer | null | undefined;
  variant?: Variant;
  /** Frase com o dado da pessoa (variantes result e line). */
  lead?: string;
  /** Nome do peptídeo que a pessoa está calculando: entra na copy da oferta. */
  subject?: string;
  className?: string;
  /** Conteúdo extra no bloco do resultado (ex.: prévia da tabela). */
  children?: ReactNode;
};

/** Link da landing com a origem (variante e página), lida pelo CheckoutButton para as UTMs. */
export function offerHref(offer: Offer, origem: string, pathname: string | null): string {
  return `/ebooks/${offer.slug}?origem=${origem}&de=${encodeURIComponent(pathname || '/')}`;
}

export default function EbookOffer({ offer, variant = 'card', lead, subject, className = '', children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname() || '/';
  // Para a barra do celular: o bloco já passou para cima da tela.
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (!offer) return;
    setPageOffer(offer);
    return () => clearPageOffer(offer);
  }, [offer]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !offer || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) trackOnce(EVENTS.ebookView, { ebook: offer.id, posicao: variant, pagina: pathname });
        setPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [offer, variant, pathname]);

  if (!offer) return null;

  const href = offerHref(offer, variant, pathname);
  const onClick = () => {
    markOfferClicked();
    track(EVENTS.ebookClick, { ebook: offer.id, posicao: variant, pagina: pathname });
  };
  const price = offer.priceLabel;
  const proof = `${offer.pages} páginas · acesso imediato · 7 dias de garantia`;

  if (variant === 'line') {
    return (
      <aside ref={ref} className={`not-prose no-print my-6 ${className}`} aria-label="Guia em PDF">
        <div className="flex items-center gap-3 px-3 py-3 sm:px-4 rounded-xl border border-teal-100 bg-teal-50">
          <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} size="xs" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ink leading-snug">
              {lead ? <strong>{lead} </strong> : null}
              {offer.line}
            </p>
            <Link href={href} onClick={onClick} className="btn-teal !h-9 !px-3 mt-2 text-xs">
              {offer.cta} · {price}
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  if (variant === 'result' && offer.id === 'T1') {
    // Guia de reconstituição: oferta principal da calculadora mais usada do site, logo depois da
    // pergunta do frasco (o feedback dela chega como children). Cores fixas nos dois temas.
    // Dois botões: compra direta (checkout da Kiwify, em destaque) e a página do guia.
    const buyHref = withUtm(offer.checkoutUrl, offer.slug, 'result-direto', pathname);
    const onBuy = () => {
      markOfferClicked();
      track(EVENTS.ebookCheckout, { ebook: offer.id, posicao: 'result', origem: 'direto', pagina: pathname });
    };
    return (
      <>
        <aside
          ref={ref}
          className={`no-print overflow-hidden rounded-2xl bg-[#0b1220] text-white shadow-2xl ring-1 ring-black/20 ${className}`}
          aria-label="Guia em PDF"
        >
          <p className="flex items-center justify-center gap-2 bg-[#dc2626] px-4 py-2 text-center text-xs font-black uppercase tracking-[0.14em] text-white">
            <span aria-hidden>⚠️</span> Leia antes de aplicar
          </p>

          <div className="bg-[radial-gradient(120%_70%_at_50%_0%,#1e293b_0%,#0b1220_70%)] p-5 sm:p-6">
            {children}
            <h2 className="text-[26px] font-black uppercase leading-[1.05] tracking-tight sm:text-3xl">
              {subject ? `Com ${subject}, um` : 'Um'} erro de interpretação pode{' '}
              <span className="text-[#facc15]">custar caro.</span>
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
              {lead ? <strong className="text-white">{lead} </strong> : null}
              {lead ? 'A conta está certa. Mas quantidade' : 'Quantidade'} do frasco, concentração e volume parecem a mesma
              coisa. <strong className="text-white">Não são.</strong> Confundir esses números{subject ? ` no frasco de ${subject}` : ''} é
              o erro mais comum:
            </p>
            <ul className="mt-3 grid gap-1.5 text-sm font-bold sm:grid-cols-3">
              {['Dose errada', 'Frasco desperdiçado', 'Resultado que não vem'].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 rounded-lg bg-[#dc2626]/15 px-3 py-2 text-[#fecaca] ring-1 ring-[#dc2626]/40"
                >
                  <span className="text-[#f87171]" aria-hidden>✕</span>
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl bg-white p-4 text-slate-900 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#dc2626]">
                    O guia em PDF · {offer.pages} páginas
                  </p>
                  <p className="mt-1 text-lg font-black leading-snug">{offer.title}</p>
                </div>
                {offer.sample ? (
                  // Página real do PDF: o produto antes do clique.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={offer.sample}
                    alt={`Página de amostra do guia ${offer.title}`}
                    width={80}
                    height={113}
                    loading="lazy"
                    className="w-20 shrink-0 rotate-3 rounded-md bg-white shadow-xl ring-1 ring-black/15"
                  />
                ) : null}
              </div>
              <ul className="mt-3 space-y-2 text-sm font-semibold">
                {[...offer.bullets, 'O que confirmar com um profissional antes de aplicar'].map((b) => (
                  <li key={b} className="flex gap-2">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-xs font-black text-white"
                      aria-hidden
                    >
                      ✓
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {offer.launch ? (
              <LaunchPrice priceLabel={price} afterLabel={offer.launch.afterLabel} units={offer.launch.units} className="mt-5" />
            ) : null}

            <a
              href={buyHref}
              rel="noopener"
              onClick={onBuy}
              className="mt-4 flex w-full flex-col items-center justify-center rounded-xl bg-[#16a34a] px-4 py-4 text-center text-white shadow-[0_6px_0_#14532d,0_14px_28px_rgba(22,163,74,0.45)] transition hover:-translate-y-0.5 hover:bg-[#22c55e] active:translate-y-1 active:shadow-[0_2px_0_#14532d]"
            >
              <span className="text-xl font-black uppercase leading-tight tracking-tight">Quero o guia agora →</span>
              {subject ? <span className="mt-0.5 text-xs font-bold text-white/85">antes de aplicar {subject}</span> : null}
              <span className="mt-1 text-sm font-bold text-white/90">{price} · Pix ou cartão · acesso na hora</span>
            </a>
            <p className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs font-semibold text-slate-300">
              <span>🔒 Compra segura pela Kiwify</span>
              <span>🛡️ 7 dias de garantia</span>
            </p>
            <Link
              href={href}
              onClick={onClick}
              className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border-2 border-white/25 text-sm font-extrabold text-white transition hover:border-white/60 hover:bg-white/10"
            >
              Entender melhor o guia
            </Link>
            {offer.anchor ? <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">{offer.anchor}</p> : null}
            <p className="mt-4 border-t border-white/15 pt-4 text-center text-base font-black uppercase tracking-tight text-[#facc15]">
              Sua saúde não é lugar para achismo.
            </p>
          </div>
        </aside>
        <OfferBar offer={offer} show={passed} href={withUtm(offer.checkoutUrl, offer.slug, 'barra-direto', pathname)} direct />
      </>
    );
  }

  if (variant === 'result') {
    return (
      <>
        <aside
          ref={ref}
          className={`no-print rounded-xl border border-teal-100 bg-teal-50 p-4 ${className}`}
          aria-label="Guia em PDF"
        >
          <div className="flex items-start gap-3">
            <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Próximo passo</p>
              <p className="mt-1 text-sm text-ink leading-snug">
                {lead ? <strong>{lead} </strong> : null}
                {offer.hook}
              </p>
            </div>
          </div>
          {children}
          <AnchorNote text={offer.anchor} className="mt-3" />
          <Link href={href} onClick={onClick} className="btn-teal w-full mt-3">
            {offer.cta} · {price}
          </Link>
          <p className="mt-2 text-center text-xs text-ink-3">{proof}</p>
        </aside>
        <OfferBar offer={offer} show={passed} href={offerHref(offer, 'barra', pathname)} />
      </>
    );
  }

  return (
    <aside ref={ref} className={`not-prose no-print my-10 card p-5 md:p-6 ${className}`} aria-label="Guia em PDF">
      <div className="flex items-start gap-4 md:gap-5">
        <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">{offer.coverLabel}</p>
          <h2 className="mt-1 text-lg md:text-xl font-extrabold text-ink leading-tight">{offer.title}</h2>
          <p className="mt-2 text-sm text-ink-2 leading-relaxed">{offer.hook}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <ul className="space-y-1.5 text-sm text-ink-2">
          {offer.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-teal-700" aria-hidden>✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        {offer.sample ? (
          // Página real do PDF: mostra o produto antes do clique.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={offer.sample}
            alt={`Página de amostra do guia ${offer.title}`}
            width={112}
            height={158}
            loading="lazy"
            className="hidden sm:block w-28 h-auto rounded-md border border-border shadow-sm bg-white"
          />
        ) : null}
      </div>
      {offer.launchNote ? (
        <p className="mt-4 rounded-lg bg-amber-400 px-3 py-2 text-sm font-extrabold leading-snug text-slate-900">{offer.launchNote}</p>
      ) : null}
      <AnchorNote text={offer.anchor} className="mt-4" />
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2">
        <Link href={href} onClick={onClick} className="btn-teal w-full sm:w-auto">
          {offer.cta === 'Ver a tabela' ? 'Quero a minha tabela' : 'Quero ver o guia'} · {price}
        </Link>
        <span className="text-xs text-ink-3 text-center sm:text-left">{proof}</span>
      </div>
    </aside>
  );
}
