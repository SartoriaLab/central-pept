'use client';

// Oferta de ebook dentro das páginas. Recebe a oferta já resolvida no servidor
// (lib/ebooks.ts → offerFor/toOffer) e não renderiza nada quando ela é null.
//
// Variantes:
//   card   — painel escuro com capa, gancho, itens, preço e dois botões (ficha, marca, fim de artigo, índices)
//   line   — faixa escura curta com capa e botão (logo depois do resumo do artigo, calculadora vazia)
//   result — embaixo do resultado da calculadora; `lead` usa o dado calculado. No celular, quando
//            a pessoa rola para além do bloco, aparece uma barra fina no rodapé (OfferBar).
//            O guia de reconstituição (T1) tem copy própria: "um erro de interpretação pode custar caro".
//
// Todas: botão verde direto no checkout da Kiwify (Ebook Checkout) e botão secundário para a
// página do guia (Ebook Clique). `subject` (nome do peptídeo) entra na copy quando existe.
// Cores fixas nos dois temas; todo bg-white leva `keep-white` (o modo escuro troca bg-white
// pela superfície escura em app/globals.css).
//
// Toda variante registra a oferta para o pop-up de saída (offer-store → ExitOffer).
// Nunca aparece na impressão (no-print) nem nos embeds (a calculadora não recebe oferta).

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EbookCover from '@/components/ebook/EbookCover';
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
  /** Nome do peptídeo da página ou do cálculo: entra na copy da oferta. */
  subject?: string;
  className?: string;
  /** Conteúdo extra no topo do bloco do resultado (ex.: resposta da pergunta do frasco). */
  children?: ReactNode;
};

/** Link da landing com a origem (variante e página), lida pelo CheckoutButton para as UTMs. */
export function offerHref(offer: Offer, origem: string, pathname: string | null): string {
  return `/ebooks/${offer.slug}?origem=${origem}&de=${encodeURIComponent(pathname || '/')}`;
}

const PANEL = 'no-print overflow-hidden rounded-2xl bg-[#0b1220] text-white shadow-2xl ring-1 ring-black/20';
const GLOW = 'bg-[radial-gradient(120%_70%_at_50%_0%,#1e293b_0%,#0b1220_70%)]';
const GREEN =
  'flex w-full flex-col items-center justify-center rounded-xl bg-[#16a34a] px-4 text-center text-white shadow-[0_5px_0_#14532d,0_12px_24px_rgba(22,163,74,0.4)] transition hover:-translate-y-0.5 hover:bg-[#22c55e] active:translate-y-1 active:shadow-[0_2px_0_#14532d]';
const OUTLINE =
  'flex h-12 w-full items-center justify-center rounded-xl border-2 border-white/25 text-sm font-extrabold text-white transition hover:border-white/60 hover:bg-white/10';

function Check() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-xs font-black text-white" aria-hidden>
      ✓
    </span>
  );
}

/** Preço: etiqueta de lançamento quando existe; senão o preço grande. */
function Price({ offer, className = '' }: { offer: Offer; className?: string }) {
  if (offer.launch) {
    return <LaunchPrice priceLabel={offer.priceLabel} afterLabel={offer.launch.afterLabel} units={offer.launch.units} className={className} />;
  }
  return (
    <div className={`rounded-2xl border-2 border-[#facc15]/60 bg-[#facc15]/10 px-4 py-3 text-center ${className}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#facc15]">
        {offer.coverLabel} · {offer.pages} páginas
      </p>
      <p className="mt-1 text-4xl font-black leading-none tracking-tight">{offer.priceLabel}</p>
      <p className="mt-1.5 text-xs font-bold text-white/70">pagamento único · Pix ou cartão</p>
    </div>
  );
}

/** Itens do guia num cartão branco, com a página de amostra quando houver. */
function Contents({ offer, extra }: { offer: Offer; extra?: string }) {
  const items = extra ? [...offer.bullets, extra] : offer.bullets;
  return (
    <div className="keep-white rounded-xl bg-white p-4 text-slate-900 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-wider text-[#dc2626]">
            {offer.coverLabel} · {offer.pages} páginas
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
            className="keep-white w-20 shrink-0 rotate-3 rounded-md bg-white shadow-xl ring-1 ring-black/15"
          />
        ) : null}
      </div>
      <ul className="mt-3 space-y-2 text-sm font-semibold">
        {items.map((b) => (
          <li key={b} className="flex gap-2">
            <Check />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
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

  const price = offer.priceLabel;
  const isTable = offer.cta === 'Ver a tabela';
  const href = offerHref(offer, variant, pathname);
  const buyHref = withUtm(offer.checkoutUrl, offer.slug, `${variant}-direto`, pathname);
  const onDetails = () => {
    markOfferClicked();
    track(EVENTS.ebookClick, { ebook: offer.id, posicao: variant, pagina: pathname });
  };
  const onBuy = () => {
    markOfferClicked();
    track(EVENTS.ebookCheckout, { ebook: offer.id, posicao: variant, origem: 'direto', pagina: pathname });
  };
  const isKit = offer.title.startsWith('Kit ');
  const buyLabel = isTable ? 'Quero a minha tabela' : isKit ? 'Quero o kit agora' : 'Quero o guia agora';

  const buttons = (big = true) => (
    <>
      <a href={buyHref} rel="noopener" onClick={onBuy} className={`${GREEN} ${big ? 'py-4' : 'py-3'}`}>
        <span className={`${big ? 'text-xl' : 'text-lg'} font-black uppercase leading-tight tracking-tight`}>{buyLabel} →</span>
        {subject ? <span className="mt-0.5 text-xs font-bold text-white/85">antes de aplicar {subject}</span> : null}
        <span className="mt-1 text-sm font-bold text-white/90">
          {price} · Pix ou cartão{big ? ' · acesso na hora' : ''}
        </span>
      </a>
      <p className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs font-semibold text-slate-300">
        <span>🔒 Compra segura pela Kiwify</span>
        <span>🛡️ 7 dias de garantia</span>
      </p>
      <Link href={href} onClick={onDetails} className={`${OUTLINE} mt-3`}>
        {isTable ? 'Entender melhor a tabela' : isKit ? 'Ver o que vem no kit' : 'Entender melhor o guia'}
      </Link>
    </>
  );

  if (variant === 'line') {
    return (
      <aside ref={ref} className={`not-prose my-6 ${PANEL} ${className}`} aria-label="Guia em PDF">
        <div className={`flex items-start gap-3 p-3 sm:p-4 ${GLOW}`}>
          <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} size="xs" />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug text-slate-200">
              <strong className="block text-[15px] font-black text-white">{lead ?? offer.title}</strong>
              {offer.line}
            </p>
            {offer.launch ? (
              <p className="mt-2 inline-flex flex-wrap items-baseline gap-x-2 rounded-md bg-[#facc15] px-2 py-1 text-xs font-black text-[#0b1220]">
                <span>🔥 Lançamento: {price}</span>
                <span className="text-black/55 line-through decoration-[#dc2626] decoration-2">{offer.launch.afterLabel}</span>
              </p>
            ) : null}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a
                href={buyHref}
                rel="noopener"
                onClick={onBuy}
                className="inline-flex h-10 items-center rounded-lg bg-[#16a34a] px-4 text-sm font-black uppercase text-white shadow-[0_3px_0_#14532d] transition hover:bg-[#22c55e]"
              >
                {isTable ? 'Quero a tabela' : 'Quero o guia'} · {price}
              </a>
              <Link href={href} onClick={onDetails} className="text-xs font-bold text-slate-300 underline underline-offset-2 hover:text-white">
                Ver detalhes
              </Link>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (variant === 'result' && offer.id === 'T1') {
    // Guia de reconstituição: oferta principal da calculadora mais usada do site, logo depois da
    // pergunta do frasco (o feedback dela chega como children).
    return (
      <>
        <aside ref={ref} className={`${PANEL} ${className}`} aria-label="Guia em PDF">
          <p className="flex items-center justify-center gap-2 bg-[#dc2626] px-4 py-2 text-center text-xs font-black uppercase tracking-[0.14em] text-white">
            <span aria-hidden>⚠️</span> Leia antes de aplicar
          </p>
          <div className={`p-5 sm:p-6 ${GLOW}`}>
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
                <li key={t} className="flex items-center gap-2 rounded-lg bg-[#dc2626]/15 px-3 py-2 text-[#fecaca] ring-1 ring-[#dc2626]/40">
                  <span className="text-[#f87171]" aria-hidden>✕</span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Contents offer={offer} extra="O que confirmar com um profissional antes de aplicar" />
            </div>
            <Price offer={offer} className="mt-5" />
            <div className="mt-4">{buttons()}</div>
            {offer.anchor ? <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">{offer.anchor}</p> : null}
            <p className="mt-4 border-t border-white/15 pt-4 text-center text-base font-black uppercase tracking-tight text-[#facc15]">
              Sua saúde não é lugar para achismo.
            </p>
          </div>
        </aside>
        <OfferBar offer={offer} show={passed} href={buyHref} direct />
      </>
    );
  }

  // card e result (das outras calculadoras): mesmo painel; result abre com o dado calculado.
  const kicker = variant === 'result' ? 'Próximo passo' : subject ? `Para quem usa ${subject}` : offer.coverLabel;
  return (
    <>
      <aside
        ref={ref}
        className={`${variant === 'card' ? 'not-prose my-10' : ''} ${PANEL} ${className}`}
        aria-label="Guia em PDF"
      >
        <p className="flex items-center justify-center gap-2 bg-[#facc15] px-4 py-2 text-center text-xs font-black uppercase tracking-[0.14em] text-[#0b1220]">
          <span aria-hidden>📘</span> {kicker}
        </p>
        <div className={`p-5 md:p-7 ${GLOW}`}>
          {children}
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_300px] md:gap-7">
            <div className="min-w-0">
              <div className="flex items-start gap-4">
                <div className="hidden shrink-0 min-[400px]:block">
                  <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black leading-tight tracking-tight md:text-2xl">{offer.title}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-300">
                    {lead ? <strong className="text-white">{lead} </strong> : null}
                    {offer.hook}
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-sm font-semibold text-slate-100">
                {offer.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {offer.anchor ? (
                <p className="mt-4 rounded-lg border-l-4 border-[#facc15] bg-white/5 px-3 py-2 text-sm font-semibold leading-snug text-slate-200">
                  {offer.anchor}
                </p>
              ) : null}
            </div>
            <div className="min-w-0">
              <Price offer={offer} />
              <div className="mt-4">{buttons(false)}</div>
            </div>
          </div>
        </div>
      </aside>
      {variant === 'result' ? <OfferBar offer={offer} show={passed} href={buyHref} direct /> : null}
    </>
  );
}
