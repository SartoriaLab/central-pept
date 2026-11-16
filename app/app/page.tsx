import type { Metadata } from 'next';
import Link from 'next/link';
import InstallPanel from '@/components/pwa/InstallPanel';
import InstallSteps from '@/components/pwa/InstallSteps';
import FAQ from '@/components/ui/FAQ';

// Página de instalação da PWA ("app"). Todo link "Instalar o app" do site aponta para cá.
// Não é app de loja: é o próprio site instalado pelo navegador (manifest + service worker).

export const metadata: Metadata = {
  title: 'App da Central Peptídeos: calculadora na tela inicial',
  description:
    'Instale a calculadora de reconstituição no celular, grátis e sem loja: abre com um toque, funciona sem internet e guarda o último cálculo. Passo a passo para iPhone e Android.',
  alternates: { canonical: '/app' },
};

const BENEFITS = [
  { title: 'Abre com um toque', desc: 'Ícone na tela inicial, direto na calculadora de reconstituição.' },
  { title: 'Funciona sem internet', desc: 'As calculadoras ficam salvas no aparelho depois da primeira visita.' },
  { title: 'Lembra a última conta', desc: 'Frasco, água e dose voltam preenchidos na próxima aplicação.' },
  { title: 'Grátis e sem cadastro', desc: 'Nada de loja, conta ou permissão especial.' },
];

const FAQ_ITEMS = [
  {
    q: 'Precisa baixar na App Store ou no Google Play?',
    a: 'Não. O app é instalado direto pelo navegador (Safari no iPhone, Chrome no Android), sem passar pela loja.',
  },
  {
    q: 'O app pede alguma permissão ou acesso aos meus dados?',
    a: 'Não. Ele é o mesmo site, aberto em tela cheia. As contas ficam salvas só no seu aparelho.',
  },
  {
    q: 'Como desinstalar?',
    a: 'Como qualquer app: segure o ícone na tela inicial e escolha remover.',
  },
];

export default function AppPage() {
  return (
    <>
      <section className="bg-gradient-mesh border-b border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-8 md:pt-14 md:pb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-700">App</span>
          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            A calculadora na tela inicial do seu celular
          </h1>
          <p className="mt-3 text-lg text-ink-2 leading-relaxed max-w-2xl">
            Instale a Central Peptídeos como app: abre direto na calculadora de reconstituição, funciona sem
            internet e já traz a sua última conta.
          </p>
          <div className="mt-6">
            <InstallPanel />
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <h2 className="text-2xl font-extrabold tracking-tight">Por que instalar</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div key={b.title} className="card p-4">
              <div className="font-bold text-ink">{b.title}</div>
              <p className="mt-1 text-sm text-ink-2 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-extrabold tracking-tight">Passo a passo</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="font-bold text-ink">iPhone atualizado (iOS 26 ou mais novo)</h3>
            <p className="mt-1 mb-4 text-xs text-ink-3">No Safari, com a barra de endereço embaixo.</p>
            <InstallSteps kind="ios-safari26" />
          </div>
          <div className="card p-5">
            <h3 className="font-bold text-ink">iPhone mais antigo (até o iOS 18)</h3>
            <p className="mt-1 mb-4 text-xs text-ink-3">No Safari, com o botão de compartilhar na barra de baixo.</p>
            <InstallSteps kind="ios-safari" />
          </div>
          <div className="card p-5">
            <h3 className="font-bold text-ink">Android</h3>
            <p className="mt-1 mb-4 text-xs text-ink-3">No Chrome. O botão Instalar do topo do site faz isso em um toque.</p>
            <InstallSteps kind="android" />
          </div>
          <div className="card p-5">
            <h3 className="font-bold text-ink">Veio pelo Instagram, Facebook ou TikTok?</h3>
            <p className="mt-1 mb-4 text-xs text-ink-3">O navegador dessas redes não instala apps.</p>
            <InstallSteps kind="in-app" />
          </div>
        </div>

        <FAQ items={FAQ_ITEMS} />

        <div className="mt-10 text-center">
          <Link href="/ferramentas/reconstituicao" className="btn-outline">Ir para a calculadora</Link>
        </div>
      </div>
    </>
  );
}
