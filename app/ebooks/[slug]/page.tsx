import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import FAQ from '@/components/ui/FAQ';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import EbookCover from '@/components/ebook/EbookCover';
import CheckoutButton from '@/components/ebook/CheckoutButton';
import {
  BUMP_PRICE,
  EBOOK_FAQ,
  KIND_LABELS,
  checkoutUrl,
  formatPrice,
  getActiveEbooks,
  getEbookById,
  getEbookBySlug,
  kitFullPrice,
} from '@/lib/ebooks';
import { socialImage } from '@/lib/og';
import { SITE_URL } from '@/lib/site';

type Params = { slug: string };

// Só ebooks com checkout configurado viram página; o resto é 404.
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getActiveEbooks().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getEbookBySlug(slug);
  if (!e) return { title: 'Guia não encontrado', robots: { index: false, follow: true } };
  const description = e.subtitle.length > 158 ? `${e.subtitle.slice(0, 155).trimEnd()}…` : e.subtitle;
  return {
    title: `${e.title} (guia em PDF)`,
    description,
    alternates: { canonical: `/ebooks/${e.slug}` },
    ...socialImage('pagina', 'home', `/ebooks/${e.slug}`, e.title),
  };
}

export default async function EbookPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const e = getEbookBySlug(slug);
  const url = e && checkoutUrl(e);
  if (!e || !url) notFound();

  const price = formatPrice(e.price);
  const noun = e.kind === 'kit' ? 'pacote' : 'guia';
  const included = (e.includes ?? []).map((id) => getEbookById(id)).filter((x): x is NonNullable<typeof x> => !!x);
  const bumps = (e.bumps ?? []).map((id) => getEbookById(id)).filter((x): x is NonNullable<typeof x> => !!x);
  const fullPrice = e.kind === 'kit' ? kitFullPrice(e) : 0;
  const buy = (position: string, className?: string) => (
    <CheckoutButton
      ebookId={e.id}
      slug={e.slug}
      checkoutUrl={url}
      label={`Quero o ${noun} por ${price}`}
      position={position}
      className={className}
    />
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: e.title,
    description: e.subtitle,
    brand: { '@type': 'Brand', name: 'Central Peptídeos' },
    category: 'Ebook',
    url: `${SITE_URL}/ebooks/${e.slug}`,
    offers: {
      '@type': 'Offer',
      price: e.price.toFixed(2),
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/ebooks/${e.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-10 md:pt-12 md:pb-14">
          <div className="mb-6">
            <Breadcrumb items={[{ label: 'Guias em PDF', href: '/ebooks' }, { label: e.title }]} siteUrl={SITE_URL} />
          </div>
          <div className="grid gap-8 md:grid-cols-[auto_1fr] items-center">
            <div className="flex justify-center">
              <EbookCover title={e.title} cover={e.cover} size="lg" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-700">{KIND_LABELS[e.kind]}</p>
              <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink leading-[1.1]">
                {e.title}
              </h1>
              <p className="mt-4 text-lg text-ink-2 leading-relaxed">{e.subtitle}</p>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-3xl font-extrabold text-ink tabular-nums">{price}</span>
                {fullPrice > e.price && (
                  <span className="text-sm text-ink-3">
                    os {included.length} guias avulsos somam {formatPrice(fullPrice)}
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                {buy('hero')}
                <span className="text-sm text-ink-3">{e.pages} páginas · PDF · Pix, cartão ou boleto</span>
              </div>
              <p className="mt-3 text-sm text-ink-2">
                <strong>7 dias de garantia:</strong> não gostou, pede o reembolso total pela Kiwify.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14 pb-28 md:pb-14">
        {/* Para quem */}
        <section aria-labelledby="para-quem">
          <h2 id="para-quem" className="text-xl md:text-2xl font-bold mb-4">Este {noun} é para você se…</h2>
          <ul className="space-y-2">
            {e.forWho.map((x) => (
              <li key={x} className="flex gap-3 text-ink-2 leading-relaxed">
                <span className="text-teal-700 font-bold" aria-hidden>✓</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Sumário ou guias do kit */}
        <section className="mt-12" aria-labelledby="sumario">
          <h2 id="sumario" className="text-xl md:text-2xl font-bold mb-4">
            {included.length > 0 ? 'O que vem no pacote' : 'O que tem dentro'}
          </h2>
          {included.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {included.map((x) => (
                <div key={x.id} className="card p-4 flex gap-3 items-start">
                  <EbookCover title={x.title} cover={x.cover} />
                  <span className="min-w-0">
                    <span className="block font-semibold text-ink leading-snug">{x.title}</span>
                    <span className="block mt-1 text-xs text-ink-3">
                      {x.pages} páginas · {formatPrice(x.price)} avulso
                    </span>
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <ol className="card divide-y divide-border">
              {e.toc.map((x, i) => (
                <li key={x} className="flex gap-4 p-4">
                  <span className="text-sm font-extrabold text-teal-700 tabular-nums w-6 flex-shrink-0">{i + 1}</span>
                  <span className="text-ink-2 leading-relaxed">{x}</span>
                </li>
              ))}
            </ol>
          )}
        </section>

        {e.sample && e.sample.length > 0 && (
          <section className="mt-12" aria-labelledby="amostra">
            <h2 id="amostra" className="text-xl md:text-2xl font-bold mb-4">Veja duas páginas</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {e.sample.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt={`Página de amostra ${i + 1} de ${e.title}`} className="card w-full h-auto" loading="lazy" />
              ))}
            </div>
          </section>
        )}

        {e.bonuses.length > 0 && (
          <section className="mt-12" aria-labelledby="bonus">
            <h2 id="bonus" className="text-xl md:text-2xl font-bold mb-4">Junto com o PDF</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {e.bonuses.map((b) => (
                <li key={b} className="card p-4 text-ink-2">{b}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12" aria-labelledby="fontes">
          <h2 id="fontes" className="text-xl md:text-2xl font-bold mb-4">De onde vêm os dados</h2>
          <ul className="space-y-1.5 list-disc pl-5 text-ink-2">
            {e.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-ink-3 leading-relaxed">
            Escrito com a mesma{' '}
            <Link href="/metodologia" className="text-teal-700 font-semibold hover:underline">metodologia editorial</Link>{' '}
            do site: dado sem estudo publicado aparece como &quot;não caracterizado&quot;, nunca como estimativa.
          </p>
        </section>

        <section className="mt-12 p-5 rounded-xl border border-border bg-surface" aria-labelledby="nao-e">
          <h2 id="nao-e" className="text-base font-bold mb-2 text-ink">Não é para você se…</h2>
          <ul className="space-y-1.5 text-sm text-ink-2">
            {e.notFor.map((x) => (
              <li key={x} className="flex gap-2">
                <span aria-hidden>✕</span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </section>

        {bumps.length > 0 && (
          <p className="mt-8 text-sm text-ink-2 leading-relaxed">
            No checkout, você pode adicionar{' '}
            {bumps.map((b, i) => (
              <span key={b.id}>
                {i > 0 && (i === bumps.length - 1 ? ' ou ' : ', ')}
                {checkoutUrl(b) ? (
                  <Link href={`/ebooks/${b.slug}`} className="font-semibold text-teal-700 hover:underline">{b.title}</Link>
                ) : (
                  <strong className="text-ink">{b.title}</strong>
                )}
              </span>
            ))}{' '}
            por {formatPrice(BUMP_PRICE)}.
          </p>
        )}

        <FAQ items={[...(e.faq ?? []), ...EBOOK_FAQ]} title={`Perguntas sobre o ${noun}`} />

        <section className="mt-12 card p-6 md:p-8 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-ink">{e.title}</h2>
          <p className="mt-2 text-ink-2">{e.pages} páginas · PDF · entrega por email</p>
          <div className="mt-5 flex justify-center">{buy('final')}</div>
          <p className="mt-3 text-sm text-ink-3">7 dias de garantia pela Kiwify</p>
        </section>

        <MedicalDisclaimer variant="prominent" />
      </div>

      {/* Barra fixa no celular */}
      <div className="md:hidden no-print fixed left-0 right-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
        <span className="text-sm">
          <span className="block font-extrabold text-ink tabular-nums">{price}</span>
          <span className="block text-xs text-ink-3">7 dias de garantia</span>
        </span>
        <CheckoutButton
          ebookId={e.id}
          slug={e.slug}
          checkoutUrl={url}
          label="Comprar"
          position="barra"
          className="btn-teal"
        />
      </div>
    </>
  );
}
