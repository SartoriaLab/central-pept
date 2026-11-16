'use client';

// Bloco do topo da página /app: troca conforme o aparelho. Antes da hidratação mostra a
// versão neutra (link para os passos), que também serve para quem está sem JavaScript.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EVENTS, trackOnce } from '@/lib/track';
import { useInstall } from './useInstall';
import { PhoneIcon } from './icons';

export default function InstallPanel() {
  const info = useInstall();
  const [done, setDone] = useState(false);

  const kind = !info.ready
    ? 'neutral'
    : info.standalone || done
      ? 'installed'
      : info.inApp
        ? 'in-app'
        : info.canPrompt
          ? 'prompt'
          : info.platform === 'ios'
            ? 'ios'
            : info.platform === 'android'
              ? 'android'
              : 'neutral';

  useEffect(() => {
    if (info.ready) trackOnce(EVENTS.installView, { so: info.platform, posicao: 'pagina', caso: kind });
  }, [info.ready, info.platform, kind]);

  return (
    <div className="card p-5 md:p-6 border-teal-100">
      <div className="flex items-start gap-4">
        <span className="w-12 h-12 flex-shrink-0 rounded-xl bg-teal-700/10 text-teal-700 flex items-center justify-center" aria-hidden>
          <PhoneIcon size={24} />
        </span>
        <div className="min-w-0 flex-1">
          {kind === 'installed' && (
            <>
              <p className="font-bold text-ink text-lg leading-snug">Você já está usando o app</p>
              <p className="mt-1 text-sm text-ink-2">Ele abre direto na calculadora, mesmo sem internet.</p>
              <Link href="/ferramentas/reconstituicao" className="btn-teal mt-4">Abrir a calculadora</Link>
            </>
          )}
          {kind === 'prompt' && (
            <>
              <p className="font-bold text-ink text-lg leading-snug">Instale em um toque</p>
              <p className="mt-1 text-sm text-ink-2">Grátis, sem loja e sem cadastro.</p>
              <button
                type="button"
                onClick={async () => setDone(await info.install('pagina'))}
                className="btn-teal mt-4"
              >
                Instalar agora
              </button>
            </>
          )}
          {kind === 'ios' && (
            <>
              <p className="font-bold text-ink text-lg leading-snug">No iPhone, são dois toques no Safari</p>
              <ol className="mt-2 text-sm text-ink-2 list-decimal pl-5 space-y-1">
                <li>Toque em <strong className="text-ink">Compartilhar</strong> (o quadrado com a seta, na barra de baixo).</li>
                <li>Role e toque em <strong className="text-ink">Adicionar à Tela de Início</strong>.</li>
              </ol>
              <p className="mt-2 text-xs text-ink-3">Só funciona no Safari. Em outro navegador, abra este endereço no Safari.</p>
            </>
          )}
          {kind === 'android' && (
            <>
              <p className="font-bold text-ink text-lg leading-snug">No Android, pelo menu do Chrome</p>
              <ol className="mt-2 text-sm text-ink-2 list-decimal pl-5 space-y-1">
                <li>Toque nos <strong className="text-ink">três pontos</strong> no canto de cima.</li>
                <li>Toque em <strong className="text-ink">Instalar app</strong> ou <strong className="text-ink">Adicionar à tela inicial</strong>.</li>
              </ol>
            </>
          )}
          {kind === 'in-app' && (
            <>
              <p className="font-bold text-ink text-lg leading-snug">Abra no navegador para instalar</p>
              <p className="mt-1 text-sm text-ink-2">
                O navegador do Instagram (e do Facebook e TikTok) não instala apps. Toque nos{' '}
                <strong className="text-ink">três pontos</strong> no canto de cima e escolha{' '}
                <strong className="text-ink">Abrir no navegador</strong>; depois volte a esta página.
              </p>
            </>
          )}
          {kind === 'neutral' && (
            <>
              <p className="font-bold text-ink text-lg leading-snug">Instale no seu celular</p>
              <p className="mt-1 text-sm text-ink-2">
                Grátis, sem loja e sem cadastro. Veja abaixo o passo a passo do iPhone e do Android.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
