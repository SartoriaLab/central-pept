'use client';

import { useState, useMemo } from 'react';
import type { Peptide } from '@/lib/peptides';
import { EVENTS, track } from '@/lib/track';

type Props = { peptides: Peptide[] };

type Frequency = 'daily' | '2x-day' | '3x-week' | 'weekly' | 'custom';

const FREQUENCY_LABELS: Record<Frequency, string> = {
  'daily': '1× por dia',
  '2x-day': '2× por dia',
  '3x-week': '3× por semana (seg/qua/sex)',
  'weekly': '1× por semana',
  'custom': 'Personalizado',
};

export default function ScheduleCalculator({ peptides }: Props) {
  const [slug, setSlug] = useState('');
  const [doseAmount, setDoseAmount] = useState<number | ''>('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [customDays, setCustomDays] = useState<number | ''>(7);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [durationWeeks, setDurationWeeks] = useState<number | ''>(4);
  const [timeOfDay, setTimeOfDay] = useState('08:00');

  const peptide = useMemo(() => peptides.find((p) => p.slug === slug), [peptides, slug]);

  // Pré-preencher dose quando peptídeo é selecionado
  function selectPeptide(newSlug: string) {
    setSlug(newSlug);
    const p = peptides.find((x) => x.slug === newSlug);
    if (p && doseAmount === '') setDoseAmount(p.typicalDose);
  }

  const schedule = useMemo(() => {
    if (!startDate || typeof durationWeeks !== 'number' || durationWeeks <= 0) return [];
    const start = new Date(startDate + 'T' + timeOfDay + ':00');
    if (Number.isNaN(start.getTime())) return [];

    const dates: Date[] = [];
    const totalDays = durationWeeks * 7;

    for (let d = 0; d < totalDays; d++) {
      const day = new Date(start);
      day.setDate(start.getDate() + d);

      switch (frequency) {
        case 'daily':
          dates.push(new Date(day));
          break;
        case '2x-day':
          dates.push(new Date(day));
          const evening = new Date(day);
          evening.setHours(evening.getHours() + 12);
          dates.push(evening);
          break;
        case '3x-week': {
          const dow = day.getDay();
          if (dow === 1 || dow === 3 || dow === 5) dates.push(new Date(day));
          break;
        }
        case 'weekly': {
          if (d % 7 === 0) dates.push(new Date(day));
          break;
        }
        case 'custom': {
          const interval = typeof customDays === 'number' ? customDays : 7;
          if (interval > 0 && d % interval === 0) dates.push(new Date(day));
          break;
        }
      }
    }

    return dates;
  }, [startDate, timeOfDay, durationWeeks, frequency, customDays]);

  function downloadIcs() {
    if (schedule.length === 0 || !peptide) return;

    const pad = (n: number) => String(n).padStart(2, '0');
    const toIcs = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

    const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}@centralpeptideos`;

    const events = schedule.map((d) => {
      const end = new Date(d);
      end.setMinutes(end.getMinutes() + 15);
      return [
        'BEGIN:VEVENT',
        `UID:${uid()}`,
        `DTSTAMP:${toIcs(new Date())}`,
        `DTSTART:${toIcs(d)}`,
        `DTEND:${toIcs(end)}`,
        `SUMMARY:${peptide.name} — ${doseAmount} ${peptide.doseUnit}`,
        `DESCRIPTION:Aplicação programada via Central Peptídeos`,
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        `DESCRIPTION:Hora de aplicar ${peptide.name}`,
        'END:VALARM',
        'END:VEVENT',
      ].join('\r\n');
    });

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Central Peptídeos//Cronograma//PT-BR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cronograma-${peptide.slug}.ics`;
    track(EVENTS.icsDownload, { ferramenta: 'cronograma', peptideo: peptide.slug });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const preview = schedule.slice(0, 6);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[460px_minmax(0,1fr)] items-start">
      {/* Inputs */}
      <div className="flex flex-col gap-5">
        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">
            <span className="inline-flex w-[22px] h-[22px] rounded-full bg-teal text-white text-xs font-bold items-center justify-center mr-2 align-middle">1</span>
            Peptídeo e dose
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Peptídeo</span>
              <select
                value={slug}
                onChange={(e) => selectPeptide(e.target.value)}
                className="h-11 px-3 border-[1.5px] border-border-2 rounded bg-surface text-ink outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50"
              >
                <option value="">— selecionar —</option>
                {peptides.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Dose por aplicação</span>
              <div className="flex items-center border-[1.5px] border-border-2 rounded bg-surface h-11 overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal-50">
                <input
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  value={doseAmount}
                  onChange={(e) => setDoseAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder={peptide?.typicalDose.toString() ?? '0'}
                  className="flex-1 min-w-0 h-full bg-transparent px-3 text-base font-bold tabular-nums outline-none"
                />
                <span className="px-3 text-xs font-bold text-ink-3 border-l border-border h-full flex items-center">
                  {peptide?.doseUnit ?? 'mg'}
                </span>
              </div>
            </label>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">
            <span className="inline-flex w-[22px] h-[22px] rounded-full bg-teal text-white text-xs font-bold items-center justify-center mr-2 align-middle">2</span>
            Frequência e duração
          </h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Frequência</span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="h-11 px-3 border-[1.5px] border-border-2 rounded bg-surface text-ink outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50"
              >
                {(Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => (
                  <option key={f} value={f}>{FREQUENCY_LABELS[f]}</option>
                ))}
              </select>
            </label>
            {frequency === 'custom' && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink-2">A cada X dias</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  inputMode="numeric"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="h-11 px-3 border-[1.5px] border-border-2 rounded bg-surface text-sm tabular-nums outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50"
                />
              </label>
            )}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink-2">Data de início</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-11 px-3 border-[1.5px] border-border-2 rounded bg-surface text-sm outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink-2">Horário</span>
                <input
                  type="time"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                  className="h-11 px-3 border-[1.5px] border-border-2 rounded bg-surface text-sm outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Duração (semanas)</span>
              <input
                type="number"
                min={1}
                max={52}
                inputMode="numeric"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="h-11 px-3 border-[1.5px] border-border-2 rounded bg-surface text-sm tabular-nums outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50"
              />
            </label>
          </div>
        </section>
      </div>

      {/* Resultado */}
      <div className="lg:sticky lg:top-24">
        {!peptide || schedule.length === 0 ? (
          <div className="bg-surface border-[1.5px] border-dashed border-border-2 rounded-xl p-8 text-center text-sm text-ink-3">
            Selecione um peptídeo e configure a frequência para ver o cronograma.
          </div>
        ) : (
          <div className="card p-6">
            <div className="flex items-baseline justify-between gap-2 mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">Total de aplicações</div>
                <div className="text-3xl font-extrabold tabular-nums text-teal">{schedule.length}</div>
              </div>
              <button
                type="button"
                onClick={downloadIcs}
                className="btn-teal"
              >
                Baixar .ics
                <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M10 3v10M6 9l4 4 4-4M3 17h14" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-ink-3 mb-4">
              Arquivo .ics pode ser importado no Google Calendar, Apple Calendar, Outlook — todas as aplicações já vêm com alerta 15 min antes.
            </p>

            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2">Próximas aplicações</h3>
            <ul className="space-y-2">
              {preview.map((d, i) => (
                <li key={i} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-bg text-sm">
                  <span className="font-semibold">
                    {d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                  </span>
                  <span className="text-ink-2 tabular-nums">
                    {d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </li>
              ))}
              {schedule.length > preview.length && (
                <li className="text-center text-xs text-ink-3 pt-1">
                  + {schedule.length - preview.length} aplicações
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
