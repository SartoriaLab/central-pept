'use client';

// Botão "Instalar" do cabeçalho (fixo no topo, em todas as páginas). Some para quem já abriu
// pelo ícone instalado. No computador só aparece quando o navegador oferece a instalação;
// no celular aparece sempre: sem instalação em um toque, abre o passo a passo.

import { useInstall } from './useInstall';
import { PhoneIcon } from './icons';

export default function InstallButton() {
  const info = useInstall();
  const visible = info.ready && !info.standalone && !info.inIframe && (info.canPrompt || info.platform !== 'desktop');
  if (!visible) return null;
  return (
    <button
      type="button"
      onClick={() => info.start('cabecalho')}
      className="inline-flex items-center gap-1 h-9 px-2.5 rounded-lg border border-teal-100 bg-teal-50 text-teal-700 text-xs font-bold whitespace-nowrap hover:brightness-95 transition"
      aria-label="Instalar o app"
    >
      <PhoneIcon size={16} />
      {/* Em telas de 360 px o texto não cabe ao lado da busca, do tema e do menu: fica só o ícone. */}
      <span className="hidden min-[380px]:inline">Instalar</span>
    </button>
  );
}
