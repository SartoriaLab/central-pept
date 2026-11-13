'use client';

import { useMemo, useState } from 'react';
import { TITRATION_SCHEMES, durationLabel, stepPeriodLabel } from '@/lib/titration';
import { EVENTS, track } from '@/lib/track';
import { parseLocalDate, todayLocalISO } from '@/lib/dates';
import { buildIcs, downloadIcs } from '@/lib/ics';

const SCHEMES = TITRATION_SCHEMES;

export default function TitrationCalculator() {
  const [schemeId, setSchemeId] = useState<string>(SCHEMES[1].id);
  const [startDate, setStartDate] = useState(() => todayLocalISO());
  const [stepChoice, setStepChoice] = useState<number>(SCHEMES[1].stepDays);

  const scheme = useMemo(() => SCHEMES.find((s) => s.id === schemeId)!, [schemeId]);
  // Duração de cada etapa em dias: semanais 28/42/56, liraglutida 7/14, Rybelsus 30/60.
  const stepDays = scheme.stepOptionsDays.includes(stepChoice) ? stepChoice : scheme.stepDays;

  const schedule = useMemo(
    () => scheme.steps.map((step, i) => ({ ...step, dayOffset: i * stepDays })),
    [scheme, stepDays],
  );

  const dateFor = (dayOffset: number): string => {
    const start = parseLocalDate(startDate);
    if (Number.isNaN(start.getTime())) return '—';
    const d = new Date(start);
    d.setDate(start.getDate() + dayOffset);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const daysToMaintenance = (schedule.length - 1) * stepDays;
  const maintenanceDose = schedule[schedule.length - 1]?.dose;

  function selectScheme(id: string) {
    setSchemeId(id);
    const next = SCHEMES.find((s) => s.id === id);
    if (next) setStepChoice(next.stepDays);
  }

  function exportIcs() {
    // 9h no horário local (antes ficava fixo em 09:00 UTC = 6h em Brasília).
    const start = parseLocalDate(startDate, 9);
    const name = scheme.name.split(' — ')[0];
    const events = schedule.map((step) => {
      const d = new Date(start);
      d.setDate(start.getDate() + step.dayOffset);
      return {
        start: d,
        minutes: 60,
        summary: `${name} — Subir para ${step.dose} ${scheme.unit}`,
        description: `Início da etapa ${step.dose} ${scheme.unit}. Próxima etapa em ${durationLabel(stepDays)}.`,
      };
    });
    downloadIcs(`titulacao-${scheme.id}.ics`, buildIcs(events, 'Titulação'));
    track(EVENTS.icsDownload, { ferramenta: 'titulacao', esquema: scheme.id });
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:grid-cols-[460px_minmax(0,1fr)] items-start">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">
            <span className="inline-flex w-[22px] h-[22px] rounded-full bg-teal text-white text-xs font-bold items-center justify-center mr-2 align-middle">1</span>
            Esquema
          </h2>
          <div className="flex flex-col gap-2">
            {SCHEMES.map((s) => (
              <label
                key={s.id}
                className={`relative flex items-start gap-3 p-3 rounded-lg border-[1.5px] cursor-pointer transition-all has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal ${
                  schemeId === s.id
                    ? 'border-teal bg-teal-50'
                    : 'border-border-2 bg-surface hover:border-teal'
                }`}
              >
                <input
                  type="radio"
                  name="scheme"
                  value={s.id}
                  checked={schemeId === s.id}
                  onChange={() => selectScheme(s.id)}
                  className="sr-only"
                />
                <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  schemeId === s.id ? 'border-teal bg-teal' : 'border-border-2'
                }`}>
                  {schemeId === s.id && <span className="w-1.5 h-1.5 rounded-full bg-white keep-white" />}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-ink">{s.name}</div>
                  <div className="text-xs text-ink-3 mt-0.5">{s.steps.length} etapas · até {s.steps[s.steps.length - 1].dose} {s.unit}</div>
                </div>
              </label>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">
            <span className="inline-flex w-[22px] h-[22px] rounded-full bg-teal text-white text-xs font-bold items-center justify-center mr-2 align-middle">2</span>
            Início e ritmo
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Data da primeira dose</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input"
              />
            </label>
            <div className="flex flex-col gap-1.5">
              <span id="semanas-etapa" className="text-xs font-semibold text-ink-2">Duração de cada etapa</span>
              <div className="flex gap-2" role="group" aria-labelledby="semanas-etapa">
                {scheme.stepOptionsDays.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setStepChoice(d)}
                    aria-pressed={stepDays === d}
                    className={`flex-1 h-11 rounded border-[1.5px] font-bold text-sm tabular-nums transition-all ${
                      stepDays === d
                        ? 'border-teal bg-teal-50 text-teal-700'
                        : 'border-border-2 bg-surface text-ink-2 hover:border-teal'
                    }`}
                  >
                    {d % 7 === 0 ? `${d / 7} sem` : `${d} dias`}
                  </button>
                ))}
              </div>
              <span className="text-xs text-ink-3">
                Bula: {durationLabel(scheme.stepDays)} por etapa, no mínimo. Ficar mais tempo numa etapa ajuda a reduzir a náusea.
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Resultado */}
      <div>
        <div className="lg:sticky lg:top-24 card p-6 overflow-hidden">
          <div className="flex items-baseline justify-between gap-3 mb-5">
            <div>
              <h3 className="font-bold text-ink">Seu plano de titulação</h3>
              <p className="text-xs text-ink-3 mt-0.5">
                {schedule.length} etapas · {durationLabel(daysToMaintenance)} até a dose final ({maintenanceDose} {scheme.unit})
              </p>
            </div>
            <button
              type="button"
              onClick={exportIcs}
              className="btn-teal !h-9 !px-3 text-xs"
            >
              .ics
              <svg viewBox="0 0 20 20" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M10 3v10M6 9l4 4 4-4M3 17h14" />
              </svg>
            </button>
          </div>

          {/* Timeline visual */}
          {/* Linha da timeline como pseudo-elemento: <ol> só pode ter <li> como filhos */}
          <ol className="relative before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {schedule.map((step, i) => {
              const isLast = i === schedule.length - 1;
              return (
                <li key={i} className="relative flex items-start gap-4 pl-0 pb-4 last:pb-0">
                  <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${
                    isLast
                      ? 'bg-gradient-teal text-white shadow-glow'
                      : 'bg-surface border-2 border-teal text-teal-700'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 pt-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-bold text-ink tabular-nums">
                        {step.dose} <span className="text-ink-3 font-normal text-sm">{scheme.unit}</span>
                      </span>
                      <span className="text-xs text-ink-3 tabular-nums whitespace-nowrap">{dateFor(step.dayOffset)}</span>
                    </div>
                    <div className="text-xs text-ink-3 mt-0.5">
                      {stepPeriodLabel(i, stepDays, isLast)} {isLast && '(manutenção)'}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 pt-5 border-t border-border text-xs text-ink-3 leading-relaxed">
            <p className="font-semibold text-ink-2 mb-1">Observações do protocolo:</p>
            <p>{scheme.notes}</p>
            <p className="mt-2">
              💡 Se aparecerem efeitos intensos (náusea, vômito), não avance para a próxima dose — repita a etapa atual por mais algumas semanas antes de subir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
