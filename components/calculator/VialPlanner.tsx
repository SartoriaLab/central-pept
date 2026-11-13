'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { Peptide } from '@/lib/peptides';
import DecimalInput from '@/components/ui/DecimalInput';
import { num, oneOf, str } from '@/lib/url-state';
import { FREQ_LABELS, planVials, type Freq } from '@/lib/vial-plan';
import { useUrlState } from './useUrlState';
import ToolActions from './ToolActions';

type Unit = 'mg' | 'mcg';

const DEFAULTS = {
  slug: '',
  frasco: 5 as number | '',
  dose: 250 as number | '',
  unidade: 'mcg' as Unit,
  freq: 'diaria' as Freq,
  cada: 3 as number | '',
  semanas: 8 as number | '',
  validade: 28 as number | '',
  preco: '' as number | '',
};
const CODECS = {
  slug: str,
  frasco: num,
  dose: num,
  unidade: oneOf<Unit>(['mg', 'mcg']),
  freq: oneOf<Freq>(['diaria', '2x-dia', '3x-semana', '2x-semana', 'semanal', 'cada']),
  cada: num,
  semanas: num,
  validade: num,
  preco: num,
};

const fmt = (n: number, dec = 1) => n.toLocaleString('pt-BR', { maximumFractionDigits: dec });
const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pos = (v: number | '') => (typeof v === 'number' && v > 0 ? v : 0);

export default function VialPlanner({ peptides }: { peptides: Peptide[] }) {
  const { state, set, patch, reset, shareUrl } = useUrlState(DEFAULTS, CODECS, { storageKey: 'cp:frascos' });
  const peptide = useMemo(() => peptides.find((p) => p.slug === state.slug), [peptides, state.slug]);
  const vialSizes = peptide?.commonAmounts.length ? peptide.commonAmounts : [2, 5, 10, 15, 20];

  function pickPeptide(slug: string) {
    const p = peptides.find((x) => x.slug === slug);
    if (!p || p.doseUnit === 'UI') { patch({ slug }); return; }
    patch({ slug, dose: p.typicalDose, unidade: p.doseUnit, frasco: p.commonAmounts[0] ?? state.frasco });
  }

  const doseMg = state.unidade === 'mcg' ? pos(state.dose) / 1000 : pos(state.dose);
  const plan = planVials({
    vialMg: pos(state.frasco),
    doseMg,
    freq: state.freq,
    everyDays: pos(state.cada) || 1,
    cycleWeeks: pos(state.semanas),
    shelfDays: pos(state.validade),
  });
  const price = pos(state.preco);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:grid-cols-[460px_minmax(0,1fr)] items-start">
      <div className="flex flex-col gap-5">
        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">Frasco e dose</h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Peptídeo (opcional)</span>
              <select value={state.slug} onChange={(e) => pickPeptide(e.target.value)} className="input">
                <option value="">— qualquer —</option>
                {peptides.filter((p) => p.doseUnit !== 'UI').map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Frasco" unit="mg" value={state.frasco} onChange={(v) => set('frasco', v)} />
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink-2">Dose por aplicação</span>
                <div className="flex items-center border-[1.5px] border-border-2 rounded bg-surface h-11 overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal/25">
                  <DecimalInput
                    value={state.dose}
                    onChange={(v) => set('dose', v)}
                    className="flex-1 min-w-0 h-full bg-transparent px-3 text-base font-bold tabular-nums outline-none"
                  />
                  <select
                    aria-label="Unidade da dose"
                    value={state.unidade}
                    onChange={(e) => set('unidade', e.target.value as Unit)}
                    className="h-full px-2 text-xs font-bold text-ink-2 bg-surface border-l border-border outline-none"
                  >
                    <option value="mcg">mcg</option>
                    <option value="mg">mg</option>
                  </select>
                </div>
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tamanhos de frasco comuns">
              {vialSizes.map((mg) => (
                <button
                  key={mg}
                  type="button"
                  onClick={() => set('frasco', mg)}
                  aria-pressed={state.frasco === mg}
                  className={`min-h-10 px-3 text-xs font-semibold rounded-full border tabular-nums transition-colors ${
                    state.frasco === mg ? 'border-teal bg-teal-50 text-teal-700' : 'border-border bg-surface text-ink-2 hover:border-teal'
                  }`}
                >
                  {fmt(mg, 2)} mg
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">Ritmo e ciclo</h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Frequência</span>
              <select value={state.freq} onChange={(e) => set('freq', e.target.value as Freq)} className="input">
                {(Object.keys(FREQ_LABELS) as Freq[]).map((f) => (
                  <option key={f} value={f}>{FREQ_LABELS[f]}</option>
                ))}
              </select>
            </label>
            {state.freq === 'cada' && <Field label="A cada" unit="dias" value={state.cada} onChange={(v) => set('cada', v)} integer />}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duração do ciclo" unit="sem" value={state.semanas} onChange={(v) => set('semanas', v === '' ? '' : Math.min(104, v))} integer />
              <Field label="Validade aberto" unit="dias" value={state.validade} onChange={(v) => set('validade', v)} integer />
            </div>
            <Field label="Preço por frasco (opcional)" unit="R$" value={state.preco} onChange={(v) => set('preco', v)} />
            <p className="text-xs text-ink-3 leading-relaxed">
              Depois de reconstituído, o frasco costuma valer 28 dias na geladeira. Confira a bula ou a
              orientação de quem forneceu.
            </p>
          </div>
        </section>

        <ToolActions tool="duracao-frasco" title="Quantos frascos preciso" shareUrl={shareUrl} onReset={reset} />
      </div>

      <div className="md:sticky md:top-24" aria-live="polite">
        {!plan ? (
          <div className="bg-surface border-[1.5px] border-dashed border-border-2 rounded-xl p-10 text-center text-sm text-ink-3">
            Informe o frasco, a dose, a frequência e a duração do ciclo.
          </div>
        ) : plan.dosesPerVial === 0 ? (
          <div role="alert" className="card p-6 text-amber-800 font-semibold">
            A dose é maior que o conteúdo do frasco: um frasco não cobre nem uma aplicação.
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Um frasco dura</div>
                <div className="mt-1 text-4xl font-extrabold text-teal tabular-nums leading-none">{fmt(plan.daysPerVial)}</div>
                <div className="text-sm text-ink-3 mt-1">dias · {plan.usablePerVial} aplicações</div>
              </div>
              <div className="p-5">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Frascos no ciclo</div>
                <div className="mt-1 text-4xl font-extrabold text-teal tabular-nums leading-none">{plan.vialsNeeded}</div>
                <div className="text-sm text-ink-3 mt-1">para {fmt(pos(state.semanas), 0)} semanas</div>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-5 text-sm">
              <Stat label="Doses que cabem no frasco" value={String(plan.dosesPerVial)} />
              <Stat label="Aplicações no ciclo" value={String(plan.totalDoses)} />
              <Stat label="Total de peptídeo" value={`${fmt(plan.totalMg, 2)} mg`} />
              <Stat label="Sobra por frasco" value={`${fmt(plan.wastedMgPerVial, 2)} mg`} />
              {price > 0 && (
                <>
                  <Stat label="Custo do ciclo" value={brl(price * plan.vialsNeeded)} />
                  <Stat label="Custo por aplicação" value={brl((price * plan.vialsNeeded) / Math.max(1, plan.totalDoses))} />
                </>
              )}
            </dl>
            {plan.limitedByShelf && (
              <p role="alert" className="mx-5 mb-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
                O frasco vence antes de acabar: cabem {plan.dosesPerVial} doses, mas só {plan.usablePerVial} são
                aplicadas em {fmt(pos(state.validade), 0)} dias. Sobram cerca de {fmt(plan.wastedMgPerVial, 2)} mg por
                frasco — um frasco menor desperdiça menos.
              </p>
            )}
            <div className="px-5 py-3.5 bg-bg border-t border-border text-xs text-ink-3 leading-relaxed">
              Para saber quantas unidades puxar na seringa, use a{' '}
              <Link
                href={peptide ? `/ferramentas/reconstituicao/${peptide.slug}` : '/ferramentas/reconstituicao'}
                className="font-semibold text-teal-700 underline"
              >
                calculadora de reconstituição
              </Link>
              .
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label, unit, value, onChange, integer,
}: { label: string; unit: string; value: number | ''; onChange: (v: number | '') => void; integer?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-ink-2">{label}</span>
      <div className="flex items-center border-[1.5px] border-border-2 rounded bg-surface h-11 overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal/25">
        <DecimalInput
          integer={integer}
          value={value}
          onChange={onChange}
          className="flex-1 min-w-0 h-full bg-transparent px-3 text-base font-bold tabular-nums outline-none"
        />
        <span className="px-2.5 text-xs font-bold text-ink-3 border-l border-border h-full flex items-center flex-shrink-0">{unit}</span>
      </div>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd className="font-bold tabular-nums text-ink">{value}</dd>
    </div>
  );
}
