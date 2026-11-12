'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Peptide, DoseUnit } from '@/lib/peptides';

type Props = { peptides: Peptide[] };

// Conversões universais
// 1 mg = 1000 mcg (sempre)
// 1 mL = 100 unidades de insulina (seringa U100)
// mg ↔ UI depende do composto — só é oferecido para peptídeos específicos conhecidos.
// A UI é uma unidade de atividade biológica, não de massa.

// Fatores mg↔UI conhecidos (por slug). Quando presente, é "quantas UI por 1 mg".
// Referências: HCG ~ 0.001 mg por UI; HMG similar; hGH 1 mg ≈ 3 UI (somatropina recombinante).
const UI_PER_MG: Record<string, { perMg: number; note: string }> = {
  // Placeholder: a maioria dos peptídeos catalogados não usa UI.
  // Somatropina (hGH) — 1 mg ≈ 3 UI. Não está no catálogo mas serve como referência.
};

export default function UnitConverter({ peptides }: Props) {
  const [slug, setSlug] = useState<string>('');
  const [qty, setQty] = useState<number | ''>('');
  const [unit, setUnit] = useState<DoseUnit>('mg');

  const peptide = useMemo(() => peptides.find((p) => p.slug === slug), [peptides, slug]);
  const uiFactor = peptide ? UI_PER_MG[peptide.slug] : undefined;

  // Converter input para mg (base interna)
  const mg = useMemo(() => {
    if (typeof qty !== 'number' || !(qty > 0)) return null;
    if (unit === 'mg') return qty;
    if (unit === 'mcg') return qty / 1000;
    if (unit === 'UI' && uiFactor) return qty / uiFactor.perMg;
    return null;
  }, [qty, unit, uiFactor]);

  // Pré-preencher com dose típica quando peptídeo é escolhido
  useEffect(() => {
    if (peptide && qty === '') {
      setQty(peptide.typicalDose);
      setUnit(peptide.doseUnit);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peptide]);

  const fmt = (n: number | null, dec = 3): string => {
    if (n == null) return '—';
    return n.toLocaleString('pt-BR', { maximumFractionDigits: dec, minimumFractionDigits: 0 });
  };

  // Quanto representa da dose típica (múltiplo)
  const typicalMultiple = useMemo(() => {
    if (!peptide || mg == null) return null;
    const typicalMg =
      peptide.doseUnit === 'mg'
        ? peptide.typicalDose
        : peptide.doseUnit === 'mcg'
        ? peptide.typicalDose / 1000
        : null;
    if (typicalMg == null || typicalMg === 0) return null;
    return mg / typicalMg;
  }, [peptide, mg]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[460px_minmax(0,1fr)] items-start">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">
            <span className="inline-flex w-[22px] h-[22px] rounded-full bg-teal text-white text-xs font-bold items-center justify-center mr-2 align-middle">1</span>
            Peptídeo (opcional)
          </h2>
          <select
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setQty(''); }}
            className="w-full h-[52px] px-4 border-[1.5px] border-border-2 rounded bg-surface text-ink outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50"
          >
            <option value="">— Converter sem peptídeo específico —</option>
            {peptides.map((p) => (
              <option key={p.slug} value={p.slug}>{p.name}</option>
            ))}
          </select>
          {peptide && (
            <div className="mt-3 flex items-center gap-2 px-3.5 py-2.5 bg-teal-50 border-[1.5px] border-teal-100 rounded text-sm">
              <strong className="text-teal-700">{peptide.name}</strong>
              <span className="text-ink-2">· dose típica: {peptide.typicalDose} {peptide.doseUnit} · {peptide.frequency}</span>
            </div>
          )}
        </section>

        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">
            <span className="inline-flex w-[22px] h-[22px] rounded-full bg-teal text-white text-xs font-bold items-center justify-center mr-2 align-middle">2</span>
            Quantidade e unidade
          </h2>
          <div className="flex items-center border-[1.5px] border-border-2 rounded bg-surface h-[52px] overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal-50 transition-all">
            <input
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={qty}
              onChange={(e) => setQty(e.target.value === '' ? '' : parseFloat(e.target.value))}
              placeholder="0"
              className="flex-1 min-w-0 h-full border-none bg-transparent px-4 text-[22px] font-bold text-ink outline-none tabular-nums placeholder:text-[20px] placeholder:font-normal placeholder:text-ink-3"
            />
            <div className="flex h-full border-l border-border">
              {(['mg', 'mcg', ...(uiFactor ? ['UI' as DoseUnit] : [])] as DoseUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`px-3 text-sm font-bold transition-colors h-full ${
                    unit === u
                      ? 'bg-teal text-white'
                      : 'bg-surface text-ink-2 hover:bg-teal-50 hover:text-teal-700'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Resultado */}
      <div>
        <div className="lg:sticky lg:top-20">
          {mg == null ? (
            <div className="bg-surface border-[1.5px] border-dashed border-border-2 rounded-xl p-12 text-center text-sm text-ink-3">
              <p>Digite uma quantidade válida para ver a conversão.</p>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl shadow overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-border">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">Você informou</div>
                <div className="text-2xl font-bold tabular-nums">
                  {fmt(typeof qty === 'number' ? qty : null)} <span className="text-ink-3 text-lg font-semibold">{unit}</span>
                </div>
                {peptide && typicalMultiple != null && (
                  <div className="mt-2 text-xs text-ink-2">
                    = <strong className="tabular-nums">{fmt(typicalMultiple, 2)}×</strong> a dose típica de {peptide.name}
                  </div>
                )}
              </div>

              <div className={`grid grid-cols-1 sm:grid-cols-${uiFactor ? '3' : '2'} divide-y sm:divide-y-0 sm:divide-x divide-border`}>
                <Result label="mg" value={fmt(mg, 4)} highlight={unit === 'mg'} />
                <Result label="mcg" value={fmt(mg * 1000, 1)} highlight={unit === 'mcg'} />
                {uiFactor && (
                  <Result
                    label="UI"
                    value={fmt(mg * uiFactor.perMg, 2)}
                    highlight={unit === 'UI'}
                    subtitle={uiFactor.note}
                  />
                )}
              </div>

              <div className="px-5 py-3.5 bg-bg border-t border-border text-xs text-ink-3 leading-relaxed">
                <strong className="text-ink-2">Lembrete:</strong> 1 mg = 1.000 mcg (sempre).
                {!uiFactor && ' A unidade UI (Unidade Internacional) é biológica, não de massa, e só existe para compostos com potência padronizada — por isso não aparece aqui.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Result({ label, value, highlight, subtitle }: { label: string; value: string; highlight?: boolean; subtitle?: string }) {
  return (
    <div className={`p-5 ${highlight ? 'bg-teal-50' : ''}`}>
      <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3">{label}</div>
      <div className={`text-2xl font-bold tabular-nums tracking-tight mt-1 ${highlight ? 'text-teal-700' : 'text-ink'}`}>
        {value}
      </div>
      {subtitle && <div className="text-[11px] text-ink-3 mt-1">{subtitle}</div>}
    </div>
  );
}
