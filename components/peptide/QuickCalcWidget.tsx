'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Peptide } from '@/lib/peptides';
import { calcByVolume, doseToMg, fmt, fmtConcentration } from '@/components/calculator/calc';

type Props = { peptide: Peptide };

export default function QuickCalcWidget({ peptide }: Props) {
  const defaultMg = peptide.commonAmounts[0] ?? 5;
  const [mg, setMg] = useState<number>(defaultMg);
  const [waterMl, setWaterMl] = useState<number>(2);
  const [dose, setDose] = useState<number>(peptide.typicalDose);

  const result = useMemo(() => {
    const doseMg = doseToMg(dose, peptide.doseUnit);
    return calcByVolume(mg, waterMl, doseMg);
  }, [mg, waterMl, dose, peptide.doseUnit]);

  const shareHref = `/ferramentas/reconstituicao/${peptide.slug}?mg=${mg}&water=${waterMl}&dose=${dose}`;

  return (
    <section className="card p-5 md:p-6 mb-6 bg-gradient-to-br from-teal-50/50 to-transparent border-teal-100">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="flex items-center gap-2 font-bold text-ink">
          <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-teal-700">
            <path d="M8 2h4M9 2v3M11 2v3M8 5h4l1 3v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8z" />
            <path d="M7 10h6" />
          </svg>
          Cálculo rápido
        </h2>
        <Link
          href={shareHref}
          className="text-xs font-semibold text-teal-700 hover:underline"
        >
          Abrir calculadora completa →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <MiniInput label="Frasco" value={mg} onChange={setMg} unit="mg" />
        <MiniInput label="Água" value={waterMl} onChange={setWaterMl} unit="ml" />
        <MiniInput label="Dose" value={dose} onChange={setDose} unit={peptide.doseUnit} />
      </div>

      {result && (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-teal-100">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Puxar na seringa</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-teal tabular-nums leading-none">
                {fmt(result.unitsPerDose, 1)}
              </span>
              <span className="text-xs font-semibold text-ink-3">U</span>
            </div>
            <div className="text-[11px] text-ink-3 mt-0.5">
              = {fmt(result.unitsPerDose / 100, 2)} ml
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Doses por frasco</div>
            <div className="text-2xl font-extrabold text-ink tabular-nums leading-none">
              {fmt(result.dosesPerVial, 1)}
            </div>
            <div className="text-[11px] text-ink-3 mt-0.5">
              a {fmtConcentration(result.concentration)} mg/ml
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function MiniInput({
  label,
  value,
  onChange,
  unit,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  unit: string;
}) {
  return (
    <label className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-wider text-ink-3 mb-1">{label}</span>
      <div className="flex items-center border-[1.5px] border-border-2 rounded-DEFAULT bg-surface h-10 overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal-50">
        <input
          type="number"
          min={0}
          step="any"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            if (Number.isFinite(n) && n >= 0) onChange(n);
          }}
          className="flex-1 min-w-0 h-full bg-transparent px-2.5 text-sm font-bold tabular-nums outline-none"
        />
        <span className="px-2 text-[10px] font-bold text-ink-3 border-l border-border h-full flex items-center flex-shrink-0">
          {unit}
        </span>
      </div>
    </label>
  );
}
