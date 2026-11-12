'use client';

import { useEffect, useMemo, useState } from 'react';
import { getTitrationDoses } from '@/lib/titration';
import { EVENTS, trackOnce } from '@/lib/track';

type Med = { id: string; label: string; peptideSlug: string | null; packages: number[] };

// Embalagens (mg totais) mais comuns em frasco. Para caneta, o total é doses × mg por dose.
const MEDS: Med[] = [
  { id: 'tirzepatida', label: 'Tirzepatida (Mounjaro)', peptideSlug: 'tirzepatida', packages: [5, 10, 15, 20, 30] },
  { id: 'semaglutida', label: 'Semaglutida (Ozempic/Wegovy)', peptideSlug: 'semaglutida', packages: [2, 3, 4, 5, 10] },
  { id: 'retatrutida', label: 'Retatrutida', peptideSlug: 'retatrutida', packages: [5, 10, 12, 20] },
  { id: 'outro', label: 'Outro', peptideSlug: null, packages: [5, 10] },
];

const WEEKS_PER_MONTH = 52 / 12;
const MAX_WEEKS_OPEN = 4; // frasco reconstituído: uso em até 28 dias

const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const num = (n: number, dec = 2) => n.toLocaleString('pt-BR', { maximumFractionDigits: dec });

export default function GlpCostCalculator() {
  const [medId, setMedId] = useState(MEDS[0].id);
  const [price, setPrice] = useState<number | ''>('');
  const [totalMg, setTotalMg] = useState<number | ''>(10);
  const [dose, setDose] = useState<number | ''>(2.5);
  const [discard, setDiscard] = useState(true);

  const med = MEDS.find((m) => m.id === medId)!;
  const doses = useMemo(() => (med.peptideSlug ? getTitrationDoses(med.peptideSlug) : []), [med]);

  const result = useMemo(() => {
    if (!(typeof price === 'number' && price > 0)) return null;
    if (!(typeof totalMg === 'number' && totalMg > 0)) return null;
    if (!(typeof dose === 'number' && dose > 0)) return null;
    const perMg = price / totalMg;
    const dosesPerPack = totalMg / dose;
    const perDose = perMg * dose;
    // Doses realmente aproveitáveis se o frasco for descartado 28 dias após reconstituir.
    const usable = Math.min(Math.floor(dosesPerPack + 1e-9), MAX_WEEKS_OPEN);
    const wastes = discard && dosesPerPack > MAX_WEEKS_OPEN;
    const realPerDose = wastes && usable > 0 ? price / usable : perDose;
    return {
      perMg,
      dosesPerPack,
      perDose,
      wastes,
      realPerDose,
      monthly: realPerDose * WEEKS_PER_MONTH,
      yearly: realPerDose * 52,
      tooSmall: dosesPerPack < 1,
    };
  }, [price, totalMg, dose, discard]);

  // Métrica de uso: só o medicamento escolhido — preço e dose não são enviados.
  const hasResult = !!result && !result.tooSmall;
  useEffect(() => {
    if (hasResult) trackOnce(EVENTS.cost, { medicamento: medId });
  }, [hasResult, medId]);

  function selectMed(id: string) {
    const m = MEDS.find((x) => x.id === id)!;
    setMedId(id);
    const d = m.peptideSlug ? getTitrationDoses(m.peptideSlug) : [];
    if (d.length > 0) setDose(d[0]);
    setTotalMg(m.packages.includes(10) ? 10 : m.packages[0]);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="card p-5 md:p-6" aria-label="Dados do cálculo">
        <fieldset>
          <legend className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-2">Medicamento</legend>
          <div className="flex flex-wrap gap-2">
            {MEDS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => selectMed(m.id)}
                aria-pressed={m.id === medId}
                className={`px-3 py-1.5 text-sm font-semibold rounded-full border transition-colors ${
                  m.id === medId
                    ? 'border-teal bg-teal-50 text-teal-700'
                    : 'border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Field label="Preço pago" unit="R$" value={price} onChange={setPrice} placeholder="ex.: 800" />
          <Field label="Total na embalagem" unit="mg" value={totalMg} onChange={setTotalMg} />
          <Field label="Dose semanal" unit="mg" value={dose} onChange={setDose} />
        </div>

        <div className="mt-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">Embalagens comuns (mg)</div>
          <div className="flex flex-wrap gap-1.5">
            {med.packages.map((mg) => (
              <Chip key={mg} active={totalMg === mg} onClick={() => setTotalMg(mg)}>{num(mg)} mg</Chip>
            ))}
          </div>
        </div>

        {doses.length > 0 && (
          <div className="mt-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">Doses da titulação (mg/semana)</div>
            <div className="flex flex-wrap gap-1.5">
              {doses.map((d) => (
                <Chip key={d} active={dose === d} onClick={() => setDose(d)}>{num(d)}</Chip>
              ))}
            </div>
          </div>
        )}

        <label className="mt-5 flex items-start gap-2.5 text-sm text-ink-2 cursor-pointer">
          <input
            type="checkbox"
            checked={discard}
            onChange={(e) => setDiscard(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-teal-600"
          />
          <span>
            É frasco reconstituído: considerar descarte 28 dias após abrir
            <span className="block text-xs text-ink-3">Desmarque para caneta ou se não houver sobra.</span>
          </span>
        </label>

        <p className="mt-4 text-xs text-ink-3 leading-relaxed">
          Caneta com doses fixas: total em mg = número de doses × mg por dose
          (ex.: caneta com 4 doses de 5 mg = 20 mg).
        </p>
      </section>

      <section className="card p-5 md:p-6" aria-label="Resultado" aria-live="polite">
        {!result ? (
          <p className="text-ink-2">Informe o preço, o total em mg e a dose semanal para ver o custo.</p>
        ) : result.tooSmall ? (
          <p className="text-amber-700 font-semibold">
            A dose semanal é maior que o total da embalagem — uma embalagem não cobre nem uma aplicação.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Custo por dose" value={brl(result.realPerDose)} highlight />
              <Stat label="Custo por mês" value={brl(result.monthly)} highlight />
              <Stat label="Custo por mg" value={brl(result.perMg)} />
              <Stat label="Custo por ano" value={brl(result.yearly)} />
              <Stat label="Doses na embalagem" value={num(result.dosesPerPack, 1)} />
              <Stat label="Duração" value={`${num(result.dosesPerPack, 1)} semanas`} />
            </div>
            {result.wastes && (
              <p className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
                Nesta dose a embalagem duraria {num(result.dosesPerPack, 1)} semanas, mais que os 28 dias
                de uso do frasco reconstituído. O cálculo considera só {MAX_WEEKS_OPEN} doses aproveitadas —
                sem descarte, cada dose sairia por {brl(result.perDose)}. Um frasco menor desperdiça menos.
              </p>
            )}
            <p className="mt-4 text-xs text-ink-3 leading-relaxed">
              Mês calculado como 52 ÷ 12 ≈ 4,33 semanas. Valores estimados a partir do preço informado;
              não incluem seringas, água bacteriostática, consulta ou frete.
            </p>
          </>
        )}
      </section>

      {result && !result.tooSmall && doses.length > 0 && (
        <section className="card overflow-x-auto lg:col-span-2" aria-label="Custo em cada dose da titulação">
          <table className="w-full text-sm">
            <caption className="p-4 text-left text-sm text-ink-2">
              Custo em cada dose da subida, mantendo o mesmo preço por mg ({brl(result.perMg)}/mg).
              Vale para frasco; em caneta o preço costuma ser por caixa, independente da dose.
            </caption>
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-3 border-y border-border">
                <th scope="col" className="p-3 font-bold">Dose semanal</th>
                <th scope="col" className="p-3 font-bold">Por dose</th>
                <th scope="col" className="p-3 font-bold">Por mês</th>
              </tr>
            </thead>
            <tbody>
              {doses.map((d) => (
                <tr key={d} className="border-b border-border last:border-0">
                  <td className="p-3 font-semibold tabular-nums">{num(d)} mg</td>
                  <td className="p-3 tabular-nums">{brl(result.perMg * d)}</td>
                  <td className="p-3 tabular-nums">{brl(result.perMg * d * WEEKS_PER_MONTH)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  unit,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  unit: string;
  value: number | '';
  onChange: (n: number | '') => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col">
      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1">{label}</span>
      <div className="flex items-center border-[1.5px] border-border-2 rounded-DEFAULT bg-surface h-11 overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal-50">
        <input
          type="number"
          min={0}
          step="any"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            if (e.target.value === '') return onChange('');
            const n = parseFloat(e.target.value);
            if (Number.isFinite(n) && n >= 0) onChange(n);
          }}
          className="flex-1 min-w-0 h-full bg-transparent px-3 text-sm font-bold tabular-nums outline-none"
        />
        <span className="px-2.5 text-[11px] font-bold text-ink-3 border-l border-border h-full flex items-center flex-shrink-0">
          {unit}
        </span>
      </div>
    </label>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-2.5 py-1 text-xs font-semibold rounded-full border tabular-nums transition-colors ${
        active
          ? 'border-teal bg-teal-50 text-teal-700'
          : 'border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700'
      }`}
    >
      {children}
    </button>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-ink-3">{label}</div>
      <div className={`font-extrabold tabular-nums leading-tight ${highlight ? 'text-2xl text-teal' : 'text-lg text-ink'}`}>
        {value}
      </div>
    </div>
  );
}
