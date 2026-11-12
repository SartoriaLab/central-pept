import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';
import { getEbookBySlug, type Ebook } from '@/lib/ebooks';

export const metadata: Metadata = {
  title: 'Compra confirmada — Obrigado!',
  description: 'Seu ebook está a caminho do seu email. Confira os próximos passos.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/obrigado' },
};

type SearchParams = {
  ebook_slug?: string;
  bundle?: string;
  order_id?: string;
};

export default async function ObrigadoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const purchasedBundle = params.bundle === 'retatrutida-ghkcu';
  const purchasedEbook: Ebook | undefined = params.ebook_slug
    ? getEbookBySlug(params.ebook_slug)
    : undefined;

  const productName = purchasedBundle
    ? 'seu combo'
    : purchasedEbook
      ? `seu ebook "${purchasedEbook.shortTitle ?? purchasedEbook.title}"`
      : 'seu ebook';

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* Hero */}
      <header className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-teal-50 border-2 border-teal mb-5">
          <svg
            viewBox="0 0 24 24"
            width={36}
            height={36}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-teal-700"
            aria-hidden
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-ink">
          Compra confirmada!
        </h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">
          Obrigado pela confiança. {productName.charAt(0).toUpperCase() + productName.slice(1)} já está a caminho do seu email.
        </p>
        {params.order_id && (
          <p className="mt-2 text-xs text-ink-3">
            Pedido: <span className="font-mono tabular-nums">{params.order_id}</span>
          </p>
        )}
      </header>

      {/* Capa do ebook comprado */}
      {purchasedEbook?.coverImage && !purchasedBundle && (
        <div className="flex justify-center mb-10">
          <div className="w-40 md:w-48 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={purchasedEbook.coverImage}
              alt={purchasedEbook.title}
              width={400}
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      )}

      {/* Próximos passos */}
      <section className="card p-6 mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-4">
          Próximos passos
        </h2>
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-50 border border-teal text-teal-700 font-bold text-sm flex items-center justify-center">
              1
            </span>
            <div>
              <p className="font-semibold text-ink">Confira seu email</p>
              <p className="text-sm text-ink-2 mt-0.5">
                A entrega chega em até 2 minutos. Se não encontrar, verifique a caixa
                de spam ou promoções.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-50 border border-teal text-teal-700 font-bold text-sm flex items-center justify-center">
              2
            </span>
            <div>
              <p className="font-semibold text-ink">Abra e leia em qualquer dispositivo</p>
              <p className="text-sm text-ink-2 mt-0.5">
                O PDF é compatível com celular, tablet e computador. Guarde o email —
                você pode baixar novamente quando quiser.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-50 border border-teal text-teal-700 font-bold text-sm flex items-center justify-center">
              3
            </span>
            <div>
              <p className="font-semibold text-ink">Dúvidas? Estamos aqui</p>
              <p className="text-sm text-ink-2 mt-0.5">
                Problema com a entrega ou acesso? Responda o email da Kiwify ou entre em
                contato pela{' '}
                <Link href="/contato" className="text-teal-700 font-semibold hover:underline">
                  nossa página de contato
                </Link>
                .
              </p>
            </div>
          </li>
        </ol>
      </section>


      {/* Retenção: explore o site */}
      <section className="card p-6 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-3 mb-3">
          Enquanto o email chega, explore
        </h2>
        <ul className="space-y-2.5 text-ink-2">
          <li>
            <Link
              href="/ferramentas/reconstituicao"
              className="text-teal-700 font-semibold hover:underline"
            >
              Calculadora de reconstituição
            </Link>
            {' '}— puxe a dose certa na seringa em segundos.
          </li>
          <li>
            <Link
              href="/ferramentas/titulacao"
              className="text-teal-700 font-semibold hover:underline"
            >
              Titulação GLP-1
            </Link>
            {' '}— cronograma semana a semana de sema/tirze/reta.
          </li>
          <li>
            <Link
              href="/peptideos"
              className="text-teal-700 font-semibold hover:underline"
            >
              Enciclopédia de peptídeos
            </Link>
            {' '}— 21 fichas técnicas com dose, mecanismo e status regulatório.
          </li>
          <li>
            <Link
              href="/blog"
              className="text-teal-700 font-semibold hover:underline"
            >
              Blog
            </Link>
            {' '}— guias práticos, protocolos e comparações atualizadas.
          </li>
        </ul>
      </section>

      <MedicalDisclaimer variant="prominent" />

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="btn-ghost inline-flex items-center gap-1 text-sm"
        >
          <svg
            viewBox="0 0 20 20"
            width={14}
            height={14}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 10H5M10 5l-5 5 5 5" />
          </svg>
          Voltar para a home
        </Link>
      </div>
    </div>
  );
}
