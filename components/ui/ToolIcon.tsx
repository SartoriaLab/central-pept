// Ícone e cor de cada ferramenta, usados na home e em /ferramentas.
const PATHS: Record<string, string> = {
  reconstituicao: 'M9 2h6M10 2v4M14 2v4M9 6h6l2 5v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9zM7 13h10',
  mistura: 'M8 2h8M9 2v5l-4 10a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-4-10V2',
  conversor: 'M7 7h10M7 7l3-3M7 7l3 3M17 17H7M17 17l-3-3M17 17l-3 3',
  titulacao: 'M3 17l6-6 4 4 8-8M14 7h7v7',
  cronograma: 'M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
  'custo-glp1': 'M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  'tabela-doses-glp1': 'M4 5h16v14H4zM4 10h16M4 15h16M10 5v14',
  'duracao-frasco': 'M9 2h6M10 2v3M14 2v3M8 5h8l1 4v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9zM12 12v3l2 1',
  diario: 'M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 8h6M8 12h6M8 16h3',
};

const ORANGE = new Set(['mistura', 'titulacao', 'custo-glp1', 'diario']);

export function toolColor(slug: string): 'teal' | 'orange' {
  return ORANGE.has(slug) ? 'orange' : 'teal';
}

export default function ToolIcon({ slug, className = '' }: { slug: string; className?: string }) {
  const orange = toolColor(slug) === 'orange';
  return (
    <span
      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
        orange ? 'bg-orange-100 text-orange-600' : 'bg-teal-50 text-teal-700'
      } ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d={PATHS[slug] ?? PATHS.reconstituicao} />
      </svg>
    </span>
  );
}
