import { REGULATORY_LABELS, type RegulatoryStatus } from '@/lib/peptides';

const TONE_CLASS = {
  success: 'bg-green-50 border-green-200 text-green-800',
  neutral: 'bg-bg border-border-2 text-ink-2',
  warn:    'bg-amber-50 border-amber-200 text-amber-900',
  danger:  'bg-red-50 border-red-200 text-red-800',
} as const;

type Size = 'sm' | 'md';

export function RegulatoryBadge({
  status,
  size = 'md',
}: {
  status: RegulatoryStatus;
  size?: Size;
}) {
  const cfg = REGULATORY_LABELS[status];
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2 py-0.5';
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border whitespace-nowrap ${sz} ${TONE_CLASS[cfg.tone]}`}
      title={titleFor(status)}
    >
      {cfg.label}
    </span>
  );
}

export function WadaBadge({ size = 'md' }: { size?: Size }) {
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2 py-0.5';
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border whitespace-nowrap ${sz} bg-red-50 border-red-200 text-red-800`}
      title="Consta na Lista Proibida da WADA (Agência Mundial Antidoping) — banido em esporte"
    >
      <svg viewBox="0 0 16 16" width={10} height={10} fill="currentColor" aria-hidden>
        <path d="M8 1L1 13h14L8 1zm0 4v4m0 2v1" stroke="currentColor" strokeWidth={1.3} fill="none" strokeLinecap="round" />
      </svg>
      WADA
    </span>
  );
}

function titleFor(status: RegulatoryStatus): string {
  switch (status) {
    case 'fda-approved':
      return 'Aprovado pela FDA para pelo menos uma indicação';
    case 'discontinued':
      return 'Teve aprovação regulatória no passado, descontinuado comercialmente (não por segurança)';
    case 'regional-approved':
      return 'Aprovado em país específico (Japão ou Rússia), mas não pelo FDA, EMA ou ANVISA';
    case 'investigational':
      return 'Em ensaios clínicos — ainda não aprovado por nenhuma agência regulatória';
    case 'research-only':
      return 'Sem aprovação regulatória — uso humano fora de protocolos de pesquisa é off-label';
    case 'unapproved-warning':
      return 'Não aprovado e com alertas regulatórios explícitos contra o uso';
  }
}
