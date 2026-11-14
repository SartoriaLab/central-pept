import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EbookCover from '@/components/ebook/EbookCover';
import { IndexLink } from '@/components/ebook/LandingTrack';
import FAQ from '@/components/ui/FAQ';
import {
  EBOOK_FAQ,
  KIND_LABELS,
  formatPrice,
  getActiveEbooks,
  getEbookById,
  kitFullPrice,
  stripChapter,
  type Ebook,
  type EbookKind,
} from '@/lib/ebooks';
import { socialImage } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Guias em PDF sobre peptídeos e GLP-1',
  description:
    'Guias práticos em PDF: semaglutida e tirzepatida semana a semana, reconstituição sem erro, checagens antes de comprar e comparativos de peptídeos, com fontes.',
  alternates: { canonical: '/ebooks' },
  ...socialImage('pagina', 'home', '/ebooks'),
};

const ORDER: EbookKind[] = ['individual', 'transversal', 'categoria'];

/** Dois itens do que o guia responde, sem a referência ao capítulo. */
const bullets = (e: Ebook) => (e.reveals?.length ? e.reveals : e.toc).slice(0, 2).map(stripChapter);

export default function EbooksPage() {
  const active = getActiveEbooks();
  // Sem nenhum checkout configurado a página não existe.
  if (active.length === 0) notFound();

  const kit = active.find((e) => e.kind === 'kit');
  const guides = active
    .filter((e) => e.kind !== 'kit')
    .sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
  const included = (kit?.includes ?? []).map((id) => getEbookById(id)).filter((x): x is Ebook => !!x);
  const kitSum = kit ? kitFullPrice(kit) : 0;
  const saving = kit ? kitSum - kit.price : 0;

  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Guias em PDF</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            O passo a passo que a bula não detalha
          </h1>
          <p className="mt-3 text-lg text-ink-2 max-w-2xl">
            Cada guia junta, na ordem em que você vai precisar, o que as páginas do site explicam
            soltas: a fonte de cada número, os erros mais comuns e as tabelas prontas para imprimir.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-2">
            {['Acesso imediato por email', 'Fonte em cada número', '7 dias de garantia incondicional'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <span className="text-teal-700" aria-hidden>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
        {kit && (
          <section className="card p-5 md:p-8 border-teal" aria-labelledby="kit-titulo">
            <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-start">
              <EbookCover title={kit.title} cover={kit.cover} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  {KIND_LABELS.kit} · {included.length} guias
                </p>
                <h2 id="kit-titulo" className="mt-1 text-2xl md:text-3xl font-extrabold text-ink leading-tight">
                  {kit.title}
                </h2>
                <p className="mt-2 text-ink-2 leading-relaxed max-w-2xl">{kit.subtitle}</p>
                <ul className="mt-4 grid gap-1.5 sm:grid-cols-2 text-sm text-ink-2">
                  {included.map((g) => (
                    <li key={g.id} className="flex gap-2">
                      <span className="text-teal-700" aria-hidden>✓</span>
                      <span>
                        {g.title} <span className="text-ink-3 tabular-nums">({formatPrice(g.price)} avulso)</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <IndexLink ebookId={kit.id} href={`/ebooks/${kit.slug}?origem=indice`} className="btn-teal">
                    Ver o pacote · {formatPrice(kit.price)}
                  </IndexLink>
                  {saving > 0 && (
                    <p className="text-sm text-ink-2">
                      Avulsos, os {included.length} guias somam{' '}
                      <span className="tabular-nums">{formatPrice(kitSum)}</span>. No pacote você paga{' '}
                      <strong className="text-ink tabular-nums">{formatPrice(saving)} a menos</strong>.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <h2 className="mt-12 text-xl md:text-2xl font-extrabold text-ink">
          {kit ? 'Ou escolha só o guia de que você precisa' : 'Escolha o seu guia'}
        </h2>
        <div className="mt-5 grid gap-4 md:gap-6 sm:grid-cols-2">
          {guides.map((e) => (
            <IndexLink key={e.id} ebookId={e.id} href={`/ebooks/${e.slug}?origem=indice`} className="card-hover p-5 flex gap-4 items-start group">
              <EbookCover title={e.title} cover={e.cover} />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold uppercase tracking-wider text-teal-700">{KIND_LABELS[e.kind]}</span>
                <span className="block mt-1 font-bold text-ink leading-snug group-hover:text-teal-700 transition-colors">{e.title}</span>
                <span className="block mt-2 text-sm text-ink-2 leading-snug">{e.hook}</span>
                {bullets(e).map((b) => (
                  <span key={b} className="mt-1.5 flex gap-2 text-sm text-ink-2 leading-snug">
                    <span className="text-teal-700" aria-hidden>✓</span>
                    <span>{b}</span>
                  </span>
                ))}
                <span className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-base font-extrabold text-ink tabular-nums">{formatPrice(e.price)}</span>
                  <span className="text-xs text-ink-3">{e.pages} páginas · 7 dias de garantia</span>
                </span>
              </span>
            </IndexLink>
          ))}
        </div>

        <section className="mt-10 flex gap-4 items-start rounded-xl border border-border bg-surface p-5 max-w-3xl" aria-labelledby="garantia">
          <span className="flex-shrink-0 w-14 h-14 rounded-full border-2 border-teal text-teal-700 flex flex-col items-center justify-center leading-none" aria-hidden>
            <span className="text-xl font-extrabold">7</span>
            <span className="text-[10px] font-bold uppercase">dias</span>
          </span>
          <div>
            <h2 id="garantia" className="font-bold text-ink">Garantia incondicional de 7 dias</h2>
            <p className="mt-1 text-sm text-ink-2 leading-relaxed">
              Compre, leia o guia inteiro e use os bônus. Se achar que não valeu, peça o reembolso total
              pela Kiwify em até 7 dias, sem precisar explicar.
            </p>
          </div>
        </section>

        <div className="max-w-3xl">
          <FAQ items={EBOOK_FAQ} title="Perguntas sobre os guias" />
        </div>
      </div>
    </>
  );
}
