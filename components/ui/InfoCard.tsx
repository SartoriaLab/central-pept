import type { ReactNode } from 'react';

type Props = { label: string; value: string; icon: ReactNode; small?: boolean };

/** Cartão de dado rápido (dose, frequência, meia-vida). `icon` = paths de um SVG 24×24. */
export default function InfoCard({ label, value, icon, small }: Props) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 mb-1.5 text-ink-3">
        <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {icon}
        </svg>
        <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className={`font-bold text-ink tabular-nums ${small ? 'text-sm' : 'text-lg'}`}>{value}</div>
    </div>
  );
}
