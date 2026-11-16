'use client';

// Bloco do topo da página /app: mostra o passo a passo do aparelho de quem está lendo (ou o
// botão de instalar em um toque, quando o navegador oferece). Antes da hidratação mostra a
// versão neutra, que também serve para quem está sem JavaScript.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { guideKind, type InstallGuideKind } from '@/lib/install';
import { EVENTS, trackOnce } from '@/lib/track';
import InstallSteps, { GUIDE_TITLES } from './InstallSteps';
import { useInstall } from './useInstall';
import { PhoneIcon } from './icons';

export default function InstallPanel() {
  const info = useInstall();
  const [done, setDone] = useState(false);
  const [kind, setKind] = useState<InstallGuideKind | null>(null);

  useEffect(() => {
    setKind(guideKind(navigator.userAgent, navigator.maxTouchPoints ?? 0));
  }, []);

  const view = !info.ready || !kind ? 'neutral' : info.standalone || done ? 'installed' : info.canPrompt ? 'prompt' : 'steps';

  useEffect(() => {
    if (info.ready && kind) trackOnce(EVENTS.installView, { so: info.platform, posicao: 'pagina', caso: view === 'steps' ? kind : view });
  }, [info.ready, info.platform, kind, view]);

  return (
    <div className="card p-5 md:p-6 border-teal-100">
      {view === 'steps' && kind ? (
        <>
          <p className="font-bold text-ink text-lg leading-snug">{GUIDE_TITLES[kind]}</p>
          <InstallSteps kind={kind} className="mt-4" />
        </>
      ) : (
        <div className="flex items-start gap-4">
          <span className="w-12 h-12 flex-shrink-0 rounded-xl bg-teal-700/10 text-teal-700 flex items-center justify-center" aria-hidden>
            <PhoneIcon size={24} />
          </span>
          <div className="min-w-0 flex-1">
            {view === 'installed' && (
              <>
                <p className="font-bold text-ink text-lg leading-snug">Você já está usando o app</p>
                <p className="mt-1 text-sm text-ink-2">Ele abre direto na calculadora, mesmo sem internet.</p>
                <Link href="/ferramentas/reconstituicao" className="btn-teal mt-4">Abrir a calculadora</Link>
              </>
            )}
            {view === 'prompt' && (
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
            {view === 'neutral' && (
              <>
                <p className="font-bold text-ink text-lg leading-snug">Instale no seu celular</p>
                <p className="mt-1 text-sm text-ink-2">
                  Grátis, sem loja e sem cadastro. Veja abaixo o passo a passo do iPhone e do Android.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
