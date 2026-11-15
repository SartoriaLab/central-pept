// Capa gerada em CSS enquanto não há arte própria: gradiente do ebook + título.
// As classes de cor vêm de lib/ebooks.ts (escritas por extenso, o Tailwind lê lib/).

type Props = {
  title: string;
  cover: string;
  size?: 'xs' | 'sm' | 'lg';
  label?: string;
};

const BOX = {
  xs: 'w-14 h-20 rounded-md p-1.5 shadow-md',
  sm: 'w-20 h-28 sm:w-24 sm:h-32 rounded-lg p-2 shadow-md',
  lg: 'w-32 h-44 sm:w-44 sm:h-60 md:w-52 md:h-72 rounded-xl p-4 sm:p-5 shadow-2xl',
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
