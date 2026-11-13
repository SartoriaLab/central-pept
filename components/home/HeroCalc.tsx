'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { DoseUnit } from '@/lib/peptides';
import { calcByVolume, doseToMg, fmt, fmtConcentration } from '@/components/calculator/calc';
import Syringe from '@/components/calculator/Syringe';
import DecimalInput from '@/components/ui/DecimalInput';

export type HeroPeptide = {
  slug: string;
  name: string;
  typicalDose: number;
  doseUnit: DoseUnit;
  vialMg: number;
};

/** Calculadora de verdade no topo da home: escolhe o peptídeo e já vê as unidades. */
export default function HeroCalc({ peptides, initialSlug }: { peptides: HeroPeptide[]; initialSlug: string }) {
  const first = peptides.find((p) => p.slug === initialSlug) ?? peptides[0];
  const [slug, setSlug] = useState(first.slug);
  const [mg, setMg] = useState<number | ''>(first.vialMg);
  const [waterMl, setWaterMl] = useState<number | ''>(2);
  const [dose, setDose] = useState<number | ''>(first.typicalDose);

  const peptide = peptides.find((p) => p.slug === slug) ?? first;

  function pick(next: string) {
    const p = peptides.find((x) => x.slug === next);
    if (!p) return;
    setSlug(p.slug);
    setMg(p.vialMg);
    setWaterMl(2);
    setDose(p.typicalDose);
  }

  const result = useMemo(() => {
    if (!mg || !waterMl || !dose) return null;
    return calcByVolume(mg, waterMl, doseToMg(dose, peptide.doseUnit));
  }, [mg, waterMl, dose, peptide.doseUnit]);

  const units = result?.unitsPerDose ?? 0;
  const syringe: 30 | 50 | 100 = units <= 30 ? 30 : units <= 50 ? 50 : 100;
  const tooBig = units > 100;
  const href = `/ferramentas/reconstituicao/${peptide.slug}?mg=${mg || peptide.vialMg}&water=${waterMl || 2}&dose=${dose || peptide.typicalDose}`;

  return (
    <div className="relative card p-5 md:p-6 shadow-xl text-left">
      <label htmlFor="hero-peptideo" className="block text-xs font-bold uppercase tracking-wider text-ink-3 mb-1.5">
        Calcule agora
      </label>
      <select
        id="hero-peptideo"
        value={slug}
        onChange={(e) => pick(e.target.value)}
        className="input w-full font-semibold"
      >
        {peptides.map((p) => (
          <option key={p.slug} value={p.slug}>{p.name}</option>
        ))}
      </select>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Mini label="Frasco" unit="mg" value={mg} onChange={setMg} />
        <Mini label="Água" unit="ml" value={waterMl} onChange={setWaterMl} />
        <Mini label="Dose" unit={peptide.doseUnit} value={dose} onChange={setDose} />
      </div>

      <div className="mt-4 pt-4 border-t border-border" role="status">
        {result ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight text-teal tabular-nums leading-none">
                {fmt(units, 1)}
              </span>
              <span className="text-lg font-semibold text-ink-3">U</span>
              <span className="text-sm text-ink-3">= {fmt(units / 100, 2)} ml na seringa</span>
            </div>
            <div className="mt-2">
              <Syringe units={units} maxUnits={syringe} />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-bg">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Concentração</div>
                <div className="font-bold tabular-nums">{fmtConcentration(result.concentration)} mg/ml</div>
              </div>
              <div className="p-3 rounded-lg bg-bg">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Doses/frasco</div>
                <div className="font-bold tabular-nums">{fmt(result.dosesPerVial, 1)}</div>
              </div>
            </div>
            {tooBig && (
              <p className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                Passa de 100 U: não cabe numa seringa de 1 ml. Use menos água ou divida a aplicação.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-ink-3 py-6 text-center">Preencha frasco, água e dose para ver o resultado.</p>
        )}
      </div>

      <Link href={href} className="mt-4 btn-outline w-full">
        Abrir calculadora completa
        <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M10 4l6 6-6 6" /></svg>
      </Link>
    </div>
  );
}

function Mini({
  label, unit, value, onChange,
}: { label: string; unit: string; value: number | ''; onChange: (n: number | '') => void }) {
  return (
    <label className="flex flex-col min-w-0">
      <span className="text-xs font-semibold text-ink-2 mb-1">{label}</span>
      <span className="flex items-center border-[1.5px] border-border-2 rounded bg-surface h-11 overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal/25">
        <DecimalInput
          value={value}
          onChange={onChange}
          className="flex-1 min-w-0 h-full bg-transparent px-2.5 text-base font-bold tabular-nums outline-none"
        />
        <span className="px-2 text-xs font-bold text-ink-3 border-l border-border h-full flex items-center flex-shrink-0">{unit}</span>
      </span>
    </label>
  );
}
