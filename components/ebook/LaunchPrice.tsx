// Etiqueta do preço de lançamento: preço de agora em destaque e o preço cheio riscado.
// Só aparece enquanto o ebook tem `launch` em lib/ebooks.ts (o aumento vai acontecer de verdade).
// Cores fixas: fica igual nos dois temas.

type Props = {
  priceLabel: string;
  afterLabel: string;
  units: number;
  className?: string;
};

export default function LaunchPrice({ priceLabel, afterLabel, units, className = '' }: Props) {
  return (
    <div className={`rounded-2xl bg-[#facc15] p-1 shadow-[0_0_0_4px_rgba(250,204,21,0.22)] ${className}`}>
      <div className="rounded-xl border-2 border-dashed border-black/35 px-3 py-4 text-center text-[#0b1220]">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] sm:text-xs">
          <span aria-hidden>🔥 </span>Condição especial de lançamento
        </p>
        <p className="mt-1.5 flex flex-wrap items-baseline justify-center gap-x-3">
          <span className="text-5xl font-black leading-none tracking-tight">{priceLabel}</span>
          <span className="text-xl font-extrabold text-black/55 line-through decoration-[#dc2626] decoration-[3px]">
            <span className="sr-only">preço depois do lançamento: </span>
            {afterLabel}
          </span>
        </p>
        <p className="mt-2 text-sm font-extrabold leading-snug">
          Preço especial para as primeiras {units} compras.
          <span className="block text-xs font-bold text-black/65">Depois, {afterLabel}.</span>
        </p>
      </div>
    </div>
  );
}
