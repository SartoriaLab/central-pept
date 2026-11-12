'use client';

import { useMemo, useState } from 'react';
import { TITRATION_SCHEMES } from '@/lib/titration';
import { EVENTS, track } from '@/lib/track';

const SCHEMES = TITRATION_SCHEMES;

export default function TitrationCalculator() {
  const [schemeId, setSchemeId] = useState<string>(SCHEMES[1].id);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weeksPerStep, setWeeksPerStep] = useState(4);

  const scheme = useMemo(() => SCHEMES.find((s) => s.id === schemeId)!, [schemeId]);

  const schedule = useMemo(() => {
    // Ajusta os steps conforme weeksPerStep definido pelo usuário
    return scheme.steps.map((step, i) => ({
      ...step,
      week: 1 + i * weeksPerStep,
    }));
  }, [scheme, weeksPerStep]);

  const dateFor = (weekNumber: number): string => {
    const start = new Date(startDate);
    const d = new Date(start);
    d.setDate(start.getDate() + (weekNumber - 1) * 7);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const totalWeeks = schedule.length * weeksPerStep;
  const maintenanceDose = schedule[schedule.length - 1]?.dose;

  function downloadIcs() {
    const pad = (n: number) => String(n).padStart(2, '0');
    const toIcs = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T090000Z`;
    const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}@centralpeptideos`;

    const start = new Date(startDate + 'T09:00:00');
    const events = schedule.map((step) => {
      const startDt = new Date(start);
      startDt.setDate(start.getDate() + (step.week - 1) * 7);
      const endDt = new Date(startDt);
      endDt.setHours(endDt.getHours() + 1);
      return [
        'BEGIN:VEVENT',
        `UID:${uid()}`,
        `DTSTAMP:${toIcs(new Date())}`,
        `DTSTART:${toIcs(startDt)}`,
        `DTEND:${toIcs(endDt)}`,
        `SUMMARY:${scheme.name.split(' — ')[0]} — Subir para ${step.dose} ${scheme.unit}`,
        `DESCRIPTION:Início da etapa ${step.dose} ${scheme.unit}. Próxima etapa em ${weeksPerStep} semanas.`,
        'END:VEVENT',
      ].join('\r\n');
    });

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Central Peptídeos//Titulação//PT-BR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `titulacao-${scheme.id}.ics`;
    track(EVENTS.icsDownload, { ferramenta: 'titulacao', esquema: scheme.id });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[460px_minmax(0,1fr)] items-start">
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
                className={`flex items-start gap-3 p-3 rounded-lg border-[1.5px] cursor-pointer transition-all ${
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
                  onChange={() => setSchemeId(s.id)}
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
              <span className="text-xs font-semibold text-ink-2">Data da primeira aplicação</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 px-3 border-[1.5px] border-border-2 rounded bg-surface text-sm outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Semanas em cada etapa</span>
              <div className="flex gap-2">
                {[4, 6, 8].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setWeeksPerStep(w)}
                    className={`flex-1 h-11 rounded border-[1.5px] font-bold text-sm tabular-nums transition-all ${
                      weeksPerStep === w
                        ? 'border-teal bg-teal-50 text-teal-700'
                        : 'border-border-2 bg-surface text-ink-2 hover:border-teal'
                    }`}
                  >
                    {w} sem
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-ink-3">
                Bula padrão: 4 semanas por etapa. Para minimizar náusea, considere 6-8.
              </span>
            </label>
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
                {schedule.length} etapas · {totalWeeks} semanas até dose de manutenção ({maintenanceDose} {scheme.unit})
              </p>
            </div>
            <button
              type="button"
              onClick={downloadIcs}
              className="btn-teal !h-9 !px-3 text-xs"
            >
              .ics
              <svg viewBox="0 0 20 20" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M10 3v10M6 9l4 4 4-4M3 17h14" />
              </svg>
            </button>
          </div>

          {/* Timeline visual */}
          <ol className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" aria-hidden />
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
                      <span className="text-xs text-ink-3 tabular-nums whitespace-nowrap">{dateFor(step.week)}</span>
                    </div>
                    <div className="text-xs text-ink-3 mt-0.5">
                      Semana {step.week}{!isLast && ` → ${schedule[i + 1].week - 1}`} {isLast && '(manutenção)'}
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
