// Capa gerada em CSS enquanto não há arte própria: gradiente do ebook + título.
// As classes de cor vêm de lib/ebooks.ts (escritas por extenso, o Tailwind lê lib/).

type Props = {
  title: string;
  cover: string;
  size?: 'sm' | 'lg';
};

export default function EbookCover({ title, cover, size = 'sm' }: Props) {
  const box =
    size === 'lg'
      ? 'w-44 h-60 md:w-52 md:h-72 rounded-xl p-5 shadow-2xl'
      : 'w-20 h-28 rounded-lg p-2 shadow-md';
  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden bg-gradient-to-br ${cover} ${box} text-white flex flex-col justify-between`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-dots opacity-20" />
      <span className={`relative font-bold uppercase tracking-widest opacity-80 ${size === 'lg' ? 'text-[11px]' : 'text-[7px]'}`}>
        Central Peptídeos
      </span>
      <span
        className={`relative font-extrabold leading-tight ${size === 'lg' ? 'text-xl md:text-2xl' : 'text-[9px] line-clamp-5'}`}
      >
        {title}
      </span>
      <span className={`relative font-semibold opacity-80 ${size === 'lg' ? 'text-xs' : 'text-[7px]'}`}>Guia em PDF</span>
    </div>
  );
}
