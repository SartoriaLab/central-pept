// Passo a passo de instalação por aparelho/navegador (ver guideKind em lib/install.ts).
// Cada passo mostra o símbolo que a pessoa precisa achar na tela. Usado na janela
// (InstallGuide) e na página /app. Sem estado: pode rodar no servidor.

import type { ReactNode } from 'react';
import type { InstallGuideKind } from '@/lib/install';
import { SITE_HOST } from '@/lib/site';
import { AddSquareIcon, CheckIcon, CompassIcon, DotsIcon, DotsVerticalIcon, PhoneIcon, ShareIcon } from './icons';

type Step = { icon: ReactNode; text: ReactNode };

const B = ({ children }: { children: ReactNode }) => <strong className="text-ink">{children}</strong>;

const ADD: Step = {
  icon: <AddSquareIcon />,
  text: <>Role a lista para baixo e toque em <B>Adicionar à Tela de Início</B>.</>,
};
const CONFIRM: Step = {
  icon: <CheckIcon />,
  text: <>Toque em <B>Adicionar</B>, no canto de cima. Pronto: o ícone aparece na tela inicial.</>,
};

const STEPS: Record<InstallGuideKind, Step[]> = {
  'ios-safari26': [
    {
      icon: <DotsIcon />,
      text: <>Toque nos <B>três pontinhos</B> ao lado do endereço do site, na barra de baixo.</>,
    },
    { icon: <ShareIcon />, text: <>Toque em <B>Compartilhar</B>.</> },
    ADD,
    {
      icon: <CheckIcon />,
      text: <>Deixe <B>Abrir como App</B> ligado e toque em <B>Adicionar</B>. Pronto: o ícone aparece na tela inicial.</>,
    },
  ],
  'ios-safari': [
    {
      icon: <ShareIcon />,
      text: <>Toque em <B>Compartilhar</B>: o quadrado com a seta para cima, no meio da barra de baixo.</>,
    },
    ADD,
    CONFIRM,
  ],
  'ios-chrome': [
    {
      icon: <ShareIcon />,
      text: <>Toque em <B>Compartilhar</B>: o quadrado com a seta, no canto de cima, ao lado do endereço.</>,
    },
    ADD,
    CONFIRM,
  ],
  'ios-outro': [
    { icon: <ShareIcon />, text: <>Abra o menu do navegador e toque em <B>Compartilhar</B>.</> },
    ADD,
    CONFIRM,
  ],
  android: [
    { icon: <DotsVerticalIcon />, text: <>Toque nos <B>três pontinhos</B>, no canto de cima do Chrome.</> },
    {
      icon: <PhoneIcon size={20} />,
      text: <>Toque em <B>Adicionar à tela inicial</B> (em alguns aparelhos aparece <B>Instalar app</B>).</>,
    },
    { icon: <CheckIcon />, text: <>Confirme em <B>Instalar</B>. Pronto: o ícone aparece junto dos seus apps.</> },
  ],
  'in-app': [
    { icon: <DotsIcon />, text: <>Toque nos <B>três pontinhos</B>, no canto de cima desta tela.</> },
    {
      icon: <CompassIcon />,
      text: <>Escolha <B>Abrir no navegador</B> (ou &quot;Abrir no Safari&quot; / &quot;Abrir no Chrome&quot;).</>,
    },
    { icon: <PhoneIcon size={20} />, text: <>Lá, toque em <B>Instalar</B> no topo do site e siga os passos.</> },
  ],
  desktop: [
    { icon: <PhoneIcon size={20} />, text: <>Abra <B>{SITE_HOST}</B> no celular.</> },
    { icon: <CheckIcon />, text: <>Toque em <B>Instalar</B>, no topo do site, e siga os passos do seu aparelho.</> },
  ],
};

export const GUIDE_TITLES: Record<InstallGuideKind, string> = {
  'ios-safari26': 'No iPhone, pelo Safari',
  'ios-safari': 'No iPhone, pelo Safari',
  'ios-chrome': 'No iPhone, pelo Chrome',
  'ios-outro': 'No iPhone',
  android: 'No Android, pelo Chrome',
  'in-app': 'Primeiro, abra no navegador',
  desktop: 'Instale pelo celular',
};

export default function InstallSteps({ kind, className = '' }: { kind: InstallGuideKind; className?: string }) {
  return (
    <ol className={`space-y-3 ${className}`}>
      {STEPS[kind].map((s, i) => (
        <li key={i} className="flex items-center gap-3">
          <span className="relative w-11 h-11 flex-shrink-0 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center">
            {s.icon}
            <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-teal-700 text-white dark:text-bg text-[11px] font-bold flex items-center justify-center">
              {i + 1}
            </span>
          </span>
          <span className="min-w-0 flex-1 text-sm text-ink-2 leading-snug">{s.text}</span>
        </li>
      ))}
    </ol>
  );
}
