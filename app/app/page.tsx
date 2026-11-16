import type { Metadata } from 'next';
import Link from 'next/link';
import InstallPanel from '@/components/pwa/InstallPanel';
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
            <h3 className="font-bold text-ink">iPhone e iPad (Safari)</h3>
            <ol className="mt-2 text-sm text-ink-2 list-decimal pl-5 space-y-1.5 leading-relaxed">
              <li>Abra este site no <strong className="text-ink">Safari</strong>.</li>
              <li>Toque em <strong className="text-ink">Compartilhar</strong> (quadrado com seta para cima).</li>
              <li>Role e toque em <strong className="text-ink">Adicionar à Tela de Início</strong>.</li>
              <li>Confirme em <strong className="text-ink">Adicionar</strong>.</li>
            </ol>
          </div>
          <div className="card p-5">
            <h3 className="font-bold text-ink">Android (Chrome)</h3>
            <ol className="mt-2 text-sm text-ink-2 list-decimal pl-5 space-y-1.5 leading-relaxed">
              <li>Abra este site no <strong className="text-ink">Chrome</strong>.</li>
              <li>Toque no botão <strong className="text-ink">Instalar</strong> acima ou nos três pontos do canto.</li>
              <li>Escolha <strong className="text-ink">Instalar app</strong> ou <strong className="text-ink">Adicionar à tela inicial</strong>.</li>
              <li>Confirme em <strong className="text-ink">Instalar</strong>.</li>
            </ol>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-3">
          Veio pelo Instagram, Facebook ou TikTok? Abra o link no navegador (menu de três pontos → Abrir no
          navegador) antes de instalar.
        </p>

        <FAQ items={FAQ_ITEMS} />

        <div className="mt-10 text-center">
          <Link href="/ferramentas/reconstituicao" className="btn-outline">Ir para a calculadora</Link>
        </div>
      </div>
    </>
  );
}
