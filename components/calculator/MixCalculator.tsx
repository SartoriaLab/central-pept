'use client';

import { useMemo, useState } from 'react';
import type { Peptide } from '@/lib/peptides';
import DecimalInput from '@/components/ui/DecimalInput';

type Row = {
  id: string;
  slug: string;      // vazio = peptídeo não selecionado ainda
  mg: number | '';   // quantidade no frasco
};

type SyringeSize = 30 | 50 | 100;

type Props = { peptides: Peptide[] };

function rid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export default function MixCalculator({ peptides }: Props) {
  const [rows, setRows] = useState<Row[]>([
    { id: rid(), slug: '', mg: '' },
    { id: rid(), slug: '', mg: '' },
  ]);
  const [waterMl, setWaterMl] = useState<number | ''>(2);
  const [units, setUnits] = useState<number | ''>(20);
  const [syringe, setSyringe] = useState<SyringeSize>(50);

  function updateRow(id: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((rs) => (rs.length >= 4 ? rs : [...rs, { id: rid(), slug: '', mg: '' }]));
  }
  function removeRow(id: string) {
    setRows((rs) => (rs.length <= 2 ? rs : rs.filter((r) => r.id !== id)));
  }

  // Linhas válidas: com peptídeo + mg > 0
  const valid = useMemo(() => {
    return rows
      .map((r) => {
        const p = peptides.find((x) => x.slug === r.slug);
        const mgNum = typeof r.mg === 'number' ? r.mg : NaN;
        if (!p || !(mgNum > 0)) return null;
        return { row: r, peptide: p, mg: mgNum };
      })
      .filter((x): x is { row: Row; peptide: Peptide; mg: number } => x != null);
  }, [rows, peptides]);

  const canCompute = valid.length >= 2 && typeof waterMl === 'number' && waterMl > 0 && typeof units === 'number' && units > 0;

  // Cálculo: para cada peptídeo na mistura, concentração = mg / waterMl.
  // Dose entregue ao puxar `units` unidades: dose = units × mg / (waterMl × 100)
  // Porque 1 ml = 100 U na seringa de insulina.
  const results = useMemo(() => {
    if (!canCompute) return [];
    return valid.map(({ peptide, mg }) => {
      const w = waterMl as number;
      const u = units as number;
      const concMg = mg / w; // mg/ml
      const doseMg = (u * mg) / (w * 100); // mg entregues
      // Converter dose para unidade nativa do peptídeo
      const doseNative =
        peptide.doseUnit === 'mcg' ? doseMg * 1000 : peptide.doseUnit === 'mg' ? doseMg : doseMg;
      const dosesPerVial = mg / doseMg;
      // Comparar com dose típica
      const typicalMg =
        peptide.doseUnit === 'mcg' ? peptide.typicalDose / 1000 : peptide.typicalDose;
      const ratio = typicalMg > 0 ? doseMg / typicalMg : 0;
      return {
        peptide,
        mg,
        concMg,
        doseMg,
        doseNative,
        dosesPerVial,
        ratio,
      };
    });
  }, [valid, waterMl, units, canCompute]);

  const tooFew = valid.length < 2;
  const drawExceeds = typeof units === 'number' && units > syringe;

  const fmt = (n: number, dec = 2): string =>
    n.toLocaleString('pt-BR', { maximumFractionDigits: dec, minimumFractionDigits: 0 });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:grid-cols-[500px_minmax(0,1fr)] items-start">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">
            <span className="inline-flex w-[22px] h-[22px] rounded-full bg-teal text-white text-xs font-bold items-center justify-center mr-2 align-middle">1</span>
            Peptídeos no frasco
          </h2>
          <div className="flex flex-col gap-2.5">
            {rows.map((r, i) => {
              const selected = peptides.find((p) => p.slug === r.slug);
              // Evita duplicar peptídeos já selecionados em outras linhas
              const otherSlugs = rows.filter((x) => x.id !== r.id).map((x) => x.slug);
              return (
                <div key={r.id} className="flex gap-2 items-center">
                  <div className="flex-1 min-w-0 grid grid-cols-[minmax(0,1fr)_100px] sm:grid-cols-[minmax(0,1fr)_120px] gap-2">
                    <select
                      value={r.slug}
                      onChange={(e) => updateRow(r.id, { slug: e.target.value })}
                      className="input min-w-0 w-full"
                      aria-label={`Peptídeo ${i + 1}`}
                    >
                      <option value="">— selecionar —</option>
                      {peptides
                        .filter((p) => !otherSlugs.includes(p.slug))
                        .map((p) => (
                          <option key={p.slug} value={p.slug}>{p.name}</option>
                        ))}
                    </select>
                    <div className="flex items-center border-[1.5px] border-border-2 rounded bg-surface h-11 overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal/25">
                      <DecimalInput
                        value={r.mg}
                        onChange={(n) => updateRow(r.id, { mg: n })}
                        placeholder={selected?.commonAmounts[0]?.toString() ?? '5'}
                        className="flex-1 min-w-0 h-full border-none bg-transparent px-2.5 text-base font-bold text-ink outline-none tabular-nums"
                        aria-label={`Miligramas do peptídeo ${i + 1}`}
                      />
                      <span className="px-2 text-xs font-bold text-ink-3 border-l border-border h-full flex items-center flex-shrink-0">
                        mg
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(r.id)}
                    disabled={rows.length <= 2}
                    aria-label={`Remover peptídeo ${i + 1}`}
                    className="w-10 h-10 flex items-center justify-center rounded-md text-ink-3 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
                      <path d="M5 5l10 10M15 5L5 15" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
          {rows.length < 4 && (
            <button
              type="button"
              onClick={addRow}
              className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:underline"
            >
              <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
                <path d="M10 5v10M5 10h10" />
              </svg>
              Adicionar peptídeo ({rows.length}/4)
            </button>
          )}
        </section>

        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">
            <span className="inline-flex w-[22px] h-[22px] rounded-full bg-teal text-white text-xs font-bold items-center justify-center mr-2 align-middle">2</span>
            Água e seringa
          </h2>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Água bacteriostática</span>
              <div className="flex items-center border-[1.5px] border-border-2 rounded bg-surface h-[52px] overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal/25">
                <DecimalInput
                  value={waterMl}
                  onChange={setWaterMl}
                  placeholder="2"
                  className="flex-1 min-w-0 h-full border-none bg-transparent px-4 text-[22px] font-bold text-ink outline-none tabular-nums"
                />
                <span className="px-4 text-[13px] font-bold text-ink-3 border-l border-border h-full flex items-center flex-shrink-0">
                  ml
                </span>
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Unidades a puxar na seringa</span>
              <div className="flex items-center border-[1.5px] border-border-2 rounded bg-surface h-[52px] overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal/25">
                <DecimalInput
                  integer
                  value={units}
                  onChange={setUnits}
                  placeholder="20"
                  className="flex-1 min-w-0 h-full border-none bg-transparent px-4 text-[22px] font-bold text-ink outline-none tabular-nums"
                />
                <span className="px-4 text-[13px] font-bold text-ink-3 border-l border-border h-full flex items-center flex-shrink-0">
                  U
                </span>
              </div>
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-ink-2">Seringa</span>
              <div role="radiogroup" className="grid grid-cols-3 gap-2" aria-label="Tamanho da seringa">
                {[30, 50, 100].map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={syringe === s}
                    onClick={() => setSyringe(s as SyringeSize)}
                    className={`flex flex-col items-center gap-0.5 py-2.5 border-[1.5px] rounded cursor-pointer transition-all ${
                      syringe === s
                        ? 'border-teal bg-teal-50 ring-1 ring-teal'
                        : 'border-border-2 bg-surface hover:border-teal'
                    }`}
                  >
                    <strong className={`text-[15px] ${syringe === s ? 'text-teal-700' : 'text-ink'}`}>{s} U</strong>
                    <small className="text-xs text-ink-3">{s / 100} ml</small>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Resultado */}
      <div>
        <div className="md:sticky md:top-24">
          {tooFew ? (
            <div className="bg-surface border-[1.5px] border-dashed border-border-2 rounded-xl p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width={26} height={26} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M8 2h8M9 2v5l-4 10a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-4-10V2" />
                </svg>
              </div>
              <p className="font-semibold text-ink text-base">Como funciona</p>
              <ol className="mt-3 text-sm text-ink-2 text-left max-w-sm mx-auto space-y-1.5 list-decimal list-inside">
                <li>Selecione 2 ou mais peptídeos que vão no mesmo frasco</li>
                <li>Informe os mg de cada um e a água em comum</li>
                <li>Veja a dose que cada peptídeo entrega quando você puxa N unidades</li>
              </ol>
            </div>
          ) : !canCompute ? (
            <div className="bg-surface border-[1.5px] border-dashed border-border-2 rounded-xl p-12 text-center text-sm text-ink-3">
              Informe a água e quantas unidades você vai puxar para ver a dose entregue de cada peptídeo.
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl shadow overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-border">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Ao puxar</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-[48px] min-[380px]:text-[56px] font-extrabold text-teal leading-none tabular-nums">
                    {fmt(units as number, 0)}
                  </span>
                  <span className="text-xl font-semibold text-ink-3 pb-1.5">U</span>
                  <span className="text-sm text-ink-3 pb-2 ml-1">
                    ({fmt((units as number) / 100, 2)} ml)
                  </span>
                </div>
                <div className="text-xs text-ink-3 mt-1">
                  você entrega, em cada aplicação, as seguintes doses:
                </div>
              </div>

              <ul className="divide-y divide-border">
                {results.map((r) => {
                  const nativeDose =
                    r.peptide.doseUnit === 'mcg'
                      ? r.doseNative
                      : r.peptide.doseUnit === 'mg'
                      ? r.doseNative
                      : r.doseNative;
                  const ratioBadge =
                    r.ratio >= 3
                      ? { tone: 'danger', label: `${fmt(r.ratio, 1)}× acima da típica` }
                      : r.ratio <= 0.34 && r.ratio > 0
                      ? { tone: 'warn', label: `${fmt(r.ratio * 100, 0)}% da típica` }
                      : r.ratio > 0
                      ? { tone: 'ok', label: `${fmt(r.ratio, 2)}× a dose típica` }
                      : null;

                  return (
                    <li key={r.peptide.slug} className="px-5 py-4">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <strong className="text-ink">{r.peptide.name}</strong>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap">
                          {fmt(r.concMg, 3)} mg/ml
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold tabular-nums text-teal">
                          {fmt(nativeDose, 2)}
                        </span>
                        <span className="text-sm font-semibold text-ink-3">
                          {r.peptide.doseUnit}
                        </span>
                        <span className="text-xs text-ink-3 ml-2">
                          · {fmt(r.dosesPerVial, 1)} doses/frasco
                        </span>
                      </div>
                      {ratioBadge && (
                        <div
                          className={`mt-1.5 text-xs font-semibold ${
                            ratioBadge.tone === 'danger'
                              ? 'text-red-700'
                              : ratioBadge.tone === 'warn'
                              ? 'text-amber-800'
                              : 'text-ink-2'
                          }`}
                        >
                          {ratioBadge.label}
                          {' · típica: '}{r.peptide.typicalDose} {r.peptide.doseUnit}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              {drawExceeds && (
                <div className="px-5 py-3 bg-red-50 border-t border-red-200 text-sm text-red-800">
                  ⚠️ Volume puxado ({units} U) excede a capacidade da seringa de {syringe} U.
                </div>
              )}

              <div className="px-5 py-3 bg-bg border-t border-border text-xs text-ink-3 leading-relaxed">
                💡 Peptídeos no mesmo frasco compartilham a água. Cada unidade puxada
                na seringa leva um pouco de cada um, na proporção dos mg que você colocou.
                Por isso não dá pra escolher doses independentes — você escolhe as quantidades
                de mg, e as razões entre as doses ficam fixas.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
