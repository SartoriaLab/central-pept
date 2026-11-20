// Capa gerada em CSS enquanto não há arte própria: gradiente do ebook + título, com cara de
// livro (lombada à esquerda e folhas aparecendo à direita e embaixo, feitas com sombra).
// As classes de cor vêm de lib/ebooks.ts (escritas por extenso, o Tailwind lê lib/).

type Props = {
  title: string;
  cover: string;
  size?: 'xs' | 'sm' | 'lg';
  label?: string;
};

const BOX = {
  xs: 'w-14 h-20 rounded-[3px] p-1.5 pl-2 shadow-[2px_2px_0_#e2e8f0,0_4px_10px_rgba(15,23,42,.18)]',
  sm: 'w-20 h-28 sm:w-24 sm:h-32 rounded-[4px] p-2 pl-3 shadow-[2px_2px_0_#f1f5f9,4px_4px_0_#cbd5e1,0_8px_18px_rgba(15,23,42,.2)]',
  lg: 'w-36 h-52 sm:w-44 sm:h-60 md:w-52 md:h-72 rounded-md p-4 pl-6 sm:p-5 sm:pl-7 shadow-[3px_3px_0_#f1f5f9,6px_6px_0_#cbd5e1,0_22px_40px_rgba(15,23,42,.28)]',
} as const;

export default function EbookCover({ title, cover, size = 'sm', label = 'Guia em PDF' }: Props) {
  const lg = size === 'lg';
  const xs = size === 'xs';
  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden bg-gradient-to-br ${cover} ${BOX[size]} text-white flex flex-col justify-between`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-dots opacity-20" />
      {/* Lombada */}
      <div className="absolute inset-y-0 left-0 w-[9%] bg-gradient-to-r from-black/30 to-black/5" />
      <div className="absolute inset-y-0 left-[9%] w-px bg-white/25" />
      <span className={`relative font-bold uppercase tracking-widest opacity-80 ${lg ? 'text-[9px] sm:text-[11px]' : 'text-[6px]'}`}>
        Central Peptídeos
      </span>
      <span
        className={`relative font-extrabold leading-tight ${
          lg ? 'text-base sm:text-xl md:text-2xl' : xs ? 'text-[7px] line-clamp-4' : 'text-[9px] sm:text-[10px] line-clamp-5'
        }`}
      >
        {title}
      </span>
      <span className={`relative font-semibold opacity-80 ${lg ? 'text-[10px] sm:text-xs' : 'text-[6px]'}`}>{label}</span>
    </div>
  );
}
