// Etiqueta do preço de lançamento: preço de agora em destaque e o preço cheio riscado.
// Só aparece enquanto o ebook tem `launch` em lib/ebooks.ts (o aumento vai acontecer de verdade).
// Âmbar claro do site (com versão de modo escuro em app/globals.css): informa, não grita.

type Props = {
  priceLabel: string;
  afterLabel: string;
  units: number;
  className?: string;
};

export default function LaunchPrice({ priceLabel, afterLabel, units, className = '' }: Props) {
  return (
    <div className={`rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 ${className}`}>
      <p className="mb-0 flex flex-wrap items-baseline gap-x-3">
        <span className="text-4xl font-extrabold leading-none tracking-tight text-ink tabular-nums">{priceLabel}</span>
        <span className="text-base font-semibold text-ink-3 line-through">
          <span className="sr-only">preço depois do lançamento: </span>
          {afterLabel}
        </span>
      </p>
      <p className="mb-0 mt-2 text-sm font-semibold leading-snug text-amber-800">
        Preço de lançamento, para as {units} primeiras compras. Depois, {afterLabel}.
      </p>
    </div>
  );
}
