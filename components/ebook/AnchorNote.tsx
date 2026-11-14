// Âncora de preço do guia: compara os R$ 29,90 com o custo real de errar (dose, frasco,
// compra). Texto em lib/ebooks.ts (`anchor`), sempre com valor verificável.

export default function AnchorNote({ text, className = '' }: { text?: string; className?: string }) {
  if (!text) return null;
  return (
    <p
      className={`rounded-lg border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-sm font-semibold leading-snug text-amber-900 dark:bg-amber-400/10 dark:text-amber-200 ${className}`}
    >
      {text}
    </p>
  );
}
