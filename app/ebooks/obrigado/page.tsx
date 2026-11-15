import type { Metadata } from 'next';
import Link from 'next/link';
import EbookCover from '@/components/ebook/EbookCover';
import UpsellButton from '@/components/ebook/UpsellButton';
import { KIT_UPSELL, checkoutUrl, formatPrice, getEbookById, getEbookBySlug, kitFullPrice } from '@/lib/ebooks';

// Página de obrigado dos guias: a Kiwify redireciona para cá depois do pagamento aprovado
// (approved_url = /ebooks/obrigado?guia=<slug>). Mostra onde está o acesso e o upsell do kit.
export const metadata: Metadata = {
  title: 'Compra confirmada',
  robots: { index: false, follow: false },
};

export default async function ObrigadoPage({ searchParams }: { searchParams: Promise<{ guia?: string }> }) {
  const { guia } = await searchParams;
  const bought = guia ? getEbookBySlug(guia) : undefined;
  const kit = getEbookById('KIT');
  const showUpsell = !!kit && !!checkoutUrl(kit) && bought?.kind !== 'kit';
  const inKit = !!bought && !!kit?.includes?.includes(bought.id);
  const included = (kit?.includes ?? []).map((id) => getEbookById(id)).filter((x): x is NonNullable<typeof x> => !!x);
  const othersPrice = kit ? kitFullPrice(kit) - (inKit && bought ? bought.price : 0) : 0;

  const upsellUrl = (() => {
    const u = new URL(KIT_UPSELL.checkoutUrl);
    u.searchParams.set('utm_source', 'site');
    u.searchParams.set('utm_medium', 'upsell');
    u.searchParams.set('utm_campaign', 'ebook-kit-comeco-seguro');
    if (bought) u.searchParams.set('utm_content', bought.slug);
    return u.toString();
  })();

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <section className="card p-5 md:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Pagamento aprovado</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-ink">
          {bought ? `${bought.title}: o acesso está no seu e-mail` : 'O acesso está no seu e-mail'}
        </h1>
        <ol className="mt-4 space-y-2 text-ink-2 list-decimal list-inside">
          <li>Abra o e-mail da Kiwify enviado para o endereço da compra.</li>
          <li>Não chegou em 10 minutos? Procure por &quot;Kiwify&quot; no spam e em Promoções.</li>
          <li>Ainda nada? Responda o e-mail da compra que a gente reenvia o acesso.</li>
        </ol>
        <p className="mt-4 text-sm text-ink-3">
          Garantia de 7 dias: se não valer, peça o reembolso pela Kiwify, sem precisar explicar.
        </p>
      </section>

      {showUpsell && kit ? (
        <section className="mt-6 card p-5 md:p-8 border-2 border-teal-500" aria-labelledby="upsell-titulo">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Só nesta página, para quem acabou de comprar</p>
          <div className="mt-3 flex items-start gap-4">
            <EbookCover title={kit.title} cover={kit.cover} />
            <div className="min-w-0">
              <h2 id="upsell-titulo" className="text-xl md:text-2xl font-extrabold text-ink leading-tight">
                {kit.title} por {formatPrice(KIT_UPSELL.price)}
              </h2>
              <p className="mt-2 text-ink-2">
                {inKit
                  ? `O kit inclui o guia que você acabou de comprar. Os outros ${included.length - 1} guias, avulsos, custam ${formatPrice(othersPrice)}; aqui o kit inteiro sai por ${formatPrice(KIT_UPSELL.price)}.`
                  : `Os ${included.length} guias para começar com GLP-1 sem erro, da compra à aplicação. No site o kit custa ${formatPrice(kit.price)}; aqui, ${formatPrice(KIT_UPSELL.price)}.`}
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
            {included.map((e) => (
              <li key={e.id} className="flex gap-2">
                <span className="text-teal-700" aria-hidden>✓</span>
                <span>
                  {e.title}
                  {bought?.id === e.id ? ' (você já tem)' : ''}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <UpsellButton href={upsellUrl} label={`Quero o kit por ${formatPrice(KIT_UPSELL.price)}`} from={bought?.slug ?? 'desconhecido'} />
            <span className="text-xs text-ink-3">Pagamento novo na Kiwify · 7 dias de garantia</span>
          </div>
        </section>
      ) : null}

      <p className="mt-8 text-center text-sm">
        <Link href="/" className="text-teal-700 underline">Voltar para o site</Link>
      </p>
    </div>
  );
}
