// Ícones dos convites de instalação (decorativos: aria-hidden). Os de "passo" imitam os
// símbolos que a pessoa vai procurar na tela do celular.

type P = { size?: number };
const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export function PhoneIcon({ size = 18 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} strokeWidth={1.8} {...base}>
      <rect x="5.5" y="2" width="9" height="16" rx="2" />
      <path d="M10 6v6M7.5 9.5 10 12l2.5-2.5" />
    </svg>
  );
}

export function CloseIcon({ size = 16 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} strokeWidth={2.2} {...base}>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}

/** Compartilhar do iPhone: quadrado com seta para cima. */
export function ShareIcon({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} strokeWidth={1.7} {...base}>
      <path d="M10 12.5V2.5M6.5 5.5 10 2l3.5 3.5" />
      <path d="M6.5 8.5H5a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 5 17.5h10a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 15 8.5h-1.5" />
    </svg>
  );
}

/** "Adicionar à Tela de Início": quadrado com +. */
export function AddSquareIcon({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} strokeWidth={1.7} {...base}>
      <rect x="3" y="3" width="14" height="14" rx="3.5" />
      <path d="M10 6.5v7M6.5 10h7" />
    </svg>
  );
}

/** Menu "•••" do Safari novo (horizontal). */
export function DotsIcon({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" aria-hidden>
      <circle cx="4.5" cy="10" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="15.5" cy="10" r="1.6" />
    </svg>
  );
}

/** Menu da página do Safari (iOS 26): as linhas à esquerda do endereço. */
export function PageMenuIcon({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} strokeWidth={1.9} {...base}>
      <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h8" />
    </svg>
  );
}

/** Botão de abas do Safari: dois quadrados sobrepostos. */
export function TabsIcon({ size = 18 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} strokeWidth={1.7} {...base}>
      <rect x="6.5" y="6.5" width="10.5" height="10.5" rx="2.5" />
      <path d="M13.5 6.5v-1A2.5 2.5 0 0 0 11 3H5.5A2.5 2.5 0 0 0 3 5.500V11a2.5 2.5 0 0 0 2.500 2.500h1" />
    </svg>
  );
}

/** Menu "⋮" do Chrome no Android (vertical). */
export function DotsVerticalIcon({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" aria-hidden>
      <circle cx="10" cy="4.5" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="10" cy="15.5" r="1.6" />
    </svg>
  );
}

export function CheckIcon({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} strokeWidth={2} {...base}>
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  );
}

/** Seta do lembrete "toque aqui" (para baixo; gire com rotate-180 para apontar para cima). */
export function ArrowDownIcon({ size = 28 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} strokeWidth={2.6} {...base}>
      <path d="M10 3v13M4.5 10.5 10 16l5.5-5.5" />
    </svg>
  );
}

/** Abrir no navegador (bússola do Safari). */
export function CompassIcon({ size = 20 }: P) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} strokeWidth={1.7} {...base}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="m12.8 7.2-1.6 4-4 1.6 1.6-4z" />
    </svg>
  );
}
