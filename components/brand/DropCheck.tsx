// Marca do Dose Certa (@dosecerta_br): gota amarela com check ("dose" + "certa").
// SVG puro: serve na página /links e no satori dos slides e da foto de perfil
// (scripts/social). `id` evita colisão do gradiente quando há mais de uma na página.

export const DROP_NAVY = '#0b1220';

export default function DropCheck({ size, id = 'dc-drop' }: { size: number; id?: string }) {
  return (
    <svg width={size} height={Math.round(size * 1.3)} viewBox="0 0 100 130" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#facc15" />
        </linearGradient>
      </defs>
      <path d="M50 2 C50 2 4 58 4 84 A46 46 0 0 0 96 84 C96 58 50 2 50 2 Z" fill={`url(#${id})`} />
      <path d="M30 86 L45 101 L72 69" fill="none" stroke={DROP_NAVY} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="34" cy="62" rx="7" ry="13" fill="#ffffff" opacity="0.55" transform="rotate(25 34 62)" />
    </svg>
  );
}
