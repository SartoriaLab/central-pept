'use client';

// Oferta de ebook dentro das páginas. Recebe a oferta já resolvida no servidor
// (lib/ebooks.ts → offerFor/toOffer) e não renderiza nada quando ela é null.
//
// Variantes:
//   card   — painel claro com capa, gancho, itens, preço e dois botões (ficha, marca, fim de artigo, índices)
//   line   — faixa curta com capa e botão (logo depois do resumo do artigo, calculadora vazia)
//   result — embaixo do resultado da calculadora; `lead` usa o dado calculado. No celular, quando
//            a pessoa rola para além do bloco, aparece uma barra fina no rodapé (OfferBar).
//            O guia de reconstituição (T1) tem copy própria, sobre a leitura do frasco.
//
// Todas: botão principal direto no checkout da Kiwify (Ebook Checkout) e botão secundário para a
// página do guia (Ebook Clique). `subject` (nome do peptídeo) entra na copy quando existe.
// Visual no tom do site (tokens de app/globals.css, valem nos dois temas): painel teal claro,
// botão teal, sem caixa alta nem urgência. A oferta é uma recomendação, não um anúncio.
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

const PANEL = 'no-print overflow-hidden rounded-xl border border-teal/30 bg-teal-50/70';
const BUY =
  'flex w-full flex-col items-center justify-center rounded bg-teal-700 px-4 text-center text-white transition hover:brightness-110';

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      width={18}
      height={18}
      className="mt-0.5 shrink-0 text-teal-700"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 10.5l4 4 8-9" />
    </svg>
  );
}

/** Preço: etiqueta de lançamento quando existe; senão o preço e o que ele compra. */
function Price({ offer, className = '' }: { offer: Offer; className?: string }) {
  if (offer.launch) {
    return <LaunchPrice priceLabel={offer.priceLabel} afterLabel={offer.launch.afterLabel} units={offer.launch.units} className={className} />;
  }
  return (
    <div className={className}>
      <p className="mb-0 text-3xl font-extrabold leading-none tracking-tight text-ink tabular-nums">{offer.priceLabel}</p>
      <p className="mb-0 mt-1.5 text-xs text-ink-3">
        {offer.coverLabel}, {offer.pages} páginas. Pagamento único.
      </p>
    </div>
  );
}

/** Itens do guia num cartão, com a página de amostra quando houver. */
function Contents({ offer, extra }: { offer: Offer; extra?: string }) {
  const items = extra ? [...offer.bullets, extra] : offer.bullets;
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-0 text-xs font-semibold text-ink-3">
            {offer.coverLabel}, {offer.pages} páginas
          </p>
          <p className="mb-0 mt-1 text-lg font-extrabold leading-snug text-ink">{offer.title}</p>
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
            className="keep-white w-20 shrink-0 rotate-2 rounded-md bg-white shadow-lg ring-1 ring-black/10"
          />
        ) : null}
      </div>
      <ul className="mb-0 mt-3 list-none space-y-2 pl-0 text-sm text-ink-2">
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
  const detailsLabel = isTable ? 'Entender melhor a tabela' : isKit ? 'Ver o que vem no kit' : 'Entender melhor o guia';

  const buttons = (big = true) => (
    <>
      <a href={buyHref} rel="noopener" onClick={onBuy} className={`${BUY} ${big ? 'py-3.5' : 'py-3'}`}>
        <span className={`${big ? 'text-lg' : 'text-base'} font-extrabold leading-tight`}>{buyLabel}</span>
        <span className="mt-0.5 text-sm font-semibold opacity-90">
          {price}, Pix ou cartão{big ? ', acesso na hora' : ''}
        </span>
      </a>
      <p className="mb-0 mt-2.5 text-center text-xs text-ink-3">Compra segura pela Kiwify, com 7 dias de garantia.</p>
      <Link href={href} onClick={onDetails} className="btn-outline mt-3 w-full">
        {detailsLabel}
      </Link>
    </>
  );

  if (variant === 'line') {
    return (
      <aside ref={ref} className={`not-prose my-6 ${PANEL} ${className}`} aria-label="Guia em PDF">
        <div className="flex items-start gap-3 p-3 sm:p-4">
          <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} size="xs" />
          <div className="min-w-0 flex-1">
            <p className="mb-0 text-sm leading-snug text-ink-2">
              <strong className="block text-[15px] font-bold text-ink">{lead ?? offer.title}</strong>
              {offer.line}
            </p>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a href={buyHref} rel="noopener" onClick={onBuy} className="btn-primary !h-10 !px-4">
                {isTable ? 'Quero a tabela' : 'Quero o guia'}, {price}
              </a>
              <Link href={href} onClick={onDetails} className="text-xs font-semibold text-teal-700 underline underline-offset-2 hover:text-teal">
                Ver detalhes
              </Link>
            </div>
            {offer.launch ? (
              <p className="mb-0 mt-2 text-xs text-ink-3">
                Preço de lançamento. Depois das {offer.launch.units} primeiras compras, {offer.launch.afterLabel}.
              </p>
            ) : null}
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
          <div className="p-5 sm:p-6">
            {children}
            <h2 className="text-xl font-extrabold leading-snug tracking-tight text-ink sm:text-2xl">
              A conta{subject ? ` de ${subject}` : ''} está certa. O erro costuma estar na leitura do frasco.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
              {lead ? <strong className="text-ink">{lead} </strong> : null}
              Quantidade do frasco (mg), concentração (mg/ml) e volume (ml) parecem a mesma coisa e não são. Trocar um
              pelo outro muda a dose sem nada parecer errado.
            </p>
            <div className="mt-5">
              <Contents offer={offer} extra="O que confirmar com um profissional antes de aplicar" />
            </div>
            <Price offer={offer} className="mt-5" />
            <div className="mt-4">{buttons()}</div>
            {offer.anchor ? <p className="mt-4 text-center text-xs leading-relaxed text-ink-3">{offer.anchor}</p> : null}
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
        <div className="p-5 md:p-6">
          {children}
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_280px] md:gap-7">
            <div className="min-w-0">
              <div className="flex items-start gap-4">
                <div className="hidden shrink-0 min-[400px]:block">
                  <EbookCover title={offer.title} cover={offer.cover} label={offer.coverLabel} />
                </div>
                <div className="min-w-0">
                  <p className="mb-0 text-xs font-semibold text-teal-700">{kicker}</p>
                  <h2 className="mb-0 mt-1 text-xl font-extrabold leading-tight tracking-tight text-ink md:text-2xl">{offer.title}</h2>
                  <p className="mb-0 mt-2 text-[15px] leading-relaxed text-ink-2">
                    {lead ? <strong className="text-ink">{lead} </strong> : null}
                    {offer.hook}
                  </p>
                </div>
              </div>
              <ul className="mb-0 mt-4 list-none space-y-2 pl-0 text-sm text-ink-2">
                {offer.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {offer.anchor ? (
                <p className="mb-0 mt-4 border-l-2 border-teal/50 pl-3 text-sm leading-snug text-ink-2">{offer.anchor}</p>
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
