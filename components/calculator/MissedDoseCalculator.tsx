'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { hhmm, isoDate, oneOf } from '@/lib/url-state';
import { useUrlState } from './useUrlState';
import ToolActions from './ToolActions';
import { MIN_GAP_DAYS, MISSED_MEDS, missedDose, type MissedResult } from '@/lib/missed-dose';
import { todayLocalISO } from '@/lib/dates';
import { EVENTS, trackOnce } from '@/lib/track';
import EbookOffer from '@/components/ebook/EbookOffer';
import type { EbookOffer as Offer } from '@/lib/ebooks';

const DEFAULTS = { med: MISSED_MEDS[0].id, data: '', hora: '08:00' };
const CODECS = { med: oneOf(MISSED_MEDS.map((m) => m.id)), data: isoDate, hora: hhmm };

// Atalhos para a data prevista: quem esqueceu sabe "era segunda", raramente a data.
const DAYS_AGO = [0, 1, 2, 3, 4, 5, 6, 7];
const WEEKDAY = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

const pad = (n: number) => String(n).padStart(2, '0');
function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const dayLabel = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
const timeLabel = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

type Tone = 'ok' | 'warn' | 'danger' | 'neutral';
const TONES: Record<Tone, string> = {
  ok: 'bg-teal-50 border-teal text-teal-700',
  warn: 'bg-amber-50 border-amber-300 text-amber-900',
  danger: 'bg-red-50 border-red-300 text-red-800',
  neutral: 'bg-bg border-border text-ink',
};

/**
 * Dose esquecida de GLP-1: marca + dia em que a dose deveria ter sido aplicada → o que a bula
 * manda fazer. Sem `storageKey`: guardar a data no aparelho mostraria um atraso antigo na volta.
 */
export default function MissedDoseCalculator({ offers, embed = false }: { offers?: Record<string, Offer | null>; embed?: boolean }) {
  const { state, set, reset, shareUrl, hydrated } = useUrlState(DEFAULTS, CODECS);
  const { med: medId, data, hora } = state;
  const med = MISSED_MEDS.find((m) => m.id === medId)!;

  // "Agora" só existe no navegador: antes de hidratar não há resultado (igual ao HTML estático).
  const result = useMemo<MissedResult | null>(
    () => (hydrated && data ? missedDose(medId, data, hora, new Date()) : null),
    [hydrated, medId, data, hora],
  );
  const shortcuts = useMemo(
    () =>
      hydrated
        ? DAYS_AGO.map((n) => {
            const iso = isoDaysAgo(n);
            const [y, m, d] = iso.split('-').map(Number);
            const wd = WEEKDAY.format(new Date(y, m - 1, d)).replace('.', '');
            return { iso, day: n === 0 ? 'Hoje' : n === 1 ? 'Ontem' : wd, ago: n === 0 ? 'no dia' : n === 1 ? 'há 1 dia' : `há ${n} dias` };
          })
        : [],
    [hydrated],
  );

  useEffect(() => {
    if (result) trackOnce(EVENTS.missedDose, { medicamento: medId, resultado: result.status });
  }, [result, medId]);

  const offer = offers?.[med.peptideSlug] ?? null;
  const view = result ? describe(result, med.label, med.windowText) : null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="card p-5 md:p-6" aria-label="Dados da dose esquecida">
        <fieldset>
          <legend className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2">Medicamento</legend>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MISSED_MEDS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => set('med', m.id)}
                aria-pressed={m.id === medId}
                className={`min-h-12 px-3 py-1.5 text-left rounded-lg border transition-colors ${
                  m.id === medId
                    ? 'border-teal bg-teal-50 text-teal-700'
                    : 'border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700'
                }`}
              >
                <span className="block text-sm font-bold leading-tight">{m.label}</span>
                <span className="block text-xs text-ink-3 leading-tight">{m.active}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <div className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-2">
            {med.kind === 'daily' ? 'Dia do comprimido esquecido' : 'Dia em que a dose deveria ter sido aplicada'}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {shortcuts.map((s) => (
              <button
                key={s.iso}
                type="button"
                onClick={() => set('data', s.iso)}
                aria-pressed={data === s.iso}
                className={`min-h-12 px-1 py-1.5 rounded-lg border text-center transition-colors ${
                  data === s.iso
                    ? 'border-teal bg-teal-50 text-teal-700'
                    : 'border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700'
                }`}
              >
                <span className="block text-sm font-bold leading-tight capitalize">{s.day}</span>
                <span className="block text-[11px] text-ink-3 leading-tight">{s.ago}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-4 grid-cols-2">
            <label className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">Data prevista</span>
              <input
                type="date"
                value={data}
                max={hydrated ? todayLocalISO() : undefined}
                onChange={(e) => set('data', e.target.value)}
                className="input !h-11"
              />
            </label>
            {med.kind === 'weekly' && (
              <label className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1">Horário de costume</span>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => set('hora', e.target.value || DEFAULTS.hora)}
                  className="input !h-11"
                />
              </label>
            )}
          </div>
          {med.window?.unit === 'hours' && (
            <p className="mt-2 text-xs text-ink-3 leading-relaxed">
              No {med.label} o prazo é contado em horas: o horário de costume muda o resultado no último dia.
            </p>
          )}
        </div>

        <p className="mt-5 text-xs text-ink-3 leading-relaxed">
          Regras das bulas de canetas e comprimidos registrados. Produto manipulado ou em frasco não tem
          bula própria: nesse caso, siga quem prescreveu.
        </p>

        <div className="mt-5">
          {!embed && <ToolActions tool="dose-esquecida" title={`Esqueci a dose do ${med.label}`} shareUrl={shareUrl} onReset={reset} />}
        </div>
      </section>

      <section className="card p-5 md:p-6" aria-label="O que fazer" aria-live="polite">
        {!view ? (
          <>
            <p className="text-ink-2">
              Escolha o medicamento e o dia em que a dose deveria ter sido {med.kind === 'daily' ? 'tomada' : 'aplicada'}.
              A resposta sai na hora, com o prazo da bula e a data da próxima dose.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-2">
              <li><strong className="text-ink">Ozempic e Wegovy:</strong> até 5 dias depois da data prevista.</li>
              <li><strong className="text-ink">Mounjaro e Zepbound:</strong> até 4 dias (96 horas).</li>
              <li><strong className="text-ink">Rybelsus:</strong> não se recupera o comprimido esquecido.</li>
            </ul>
            {!embed && <EbookOffer variant="line" offer={offer} className="mt-5" />}
          </>
        ) : (
          <>
            <div className={`rounded-xl border p-4 ${TONES[view.tone]}`}>
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">{med.label}</div>
              <p className="mt-1 text-2xl font-extrabold leading-tight">{view.title}</p>
              <p className="mt-2 text-sm leading-relaxed">{view.text}</p>
            </div>

            {view.rows.length > 0 && (
              <dl className="mt-4 divide-y divide-border border border-border rounded-xl overflow-hidden">
                {view.rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-3">
                    <dt className="text-xs font-bold uppercase tracking-wider text-ink-3">{r.label}</dt>
                    <dd className="text-sm font-bold text-ink text-right">{r.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <p className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
              <strong>Não dobre a dose.</strong> Nenhuma bula manda aplicar dose extra ou maior para compensar a
              esquecida: isso aumenta o risco de náusea, vômito e diarreia.
            </p>

            {med.kind === 'weekly' && (result?.status === 'take-now' || result?.status === 'skip') && (
              <p className="mt-3 text-xs text-ink-3 leading-relaxed">
                Quer mudar o dia da semana? As bulas permitem, desde que tenham passado pelo menos {MIN_GAP_DAYS} dias
                (72 horas) desde a última injeção.
              </p>
            )}
            <p className="mt-3 text-xs text-ink-3 leading-relaxed">
              Fonte: {med.source}.{' '}
              {!embed && (
                <Link href="/blog/dose-esquecida-semaglutida-tirzepatida" className="text-teal-700 font-semibold hover:underline">
                  Ver o texto de cada bula
                </Link>
              )}
            </p>
            {!embed && <EbookOffer variant="result" offer={offer} lead={view.lead} className="mt-5" />}
          </>
        )}
      </section>
    </div>
  );
}

type View = { tone: Tone; title: string; text: string; rows: { label: string; value: string }[]; lead: string };

function late(days: number): string {
  return days === 0 ? 'hoje' : days === 1 ? '1 dia' : `${days} dias`;
}

function describe(r: MissedResult, brand: string, windowText?: string): View {
  switch (r.status) {
    case 'not-late':
      return {
        tone: 'neutral',
        title: 'Ainda não está atrasada',
        text: `A dose está prevista para ${dayLabel(r.due)}. Aplique no dia e horário de costume.`,
        rows: [],
        lead: 'Dose em dia.',
      };
    case 'take-now':
      return {
        tone: 'ok',
        title: 'Aplique assim que lembrar',
        text: `Você está dentro do prazo da bula do ${brand} (${windowText}). Aplique a dose esquecida e mantenha a próxima no dia de sempre.`,
        rows: [
          { label: 'Atraso', value: r.lateDays === 0 ? 'algumas horas' : late(r.lateDays) },
          { label: 'Prazo para aplicar', value: `${dayLabel(r.deadline)}${r.deadline.getHours() === 23 && r.deadline.getMinutes() === 59 ? '' : `, ${timeLabel(r.deadline)}`}` },
          { label: 'Próxima dose', value: dayLabel(r.next) },
        ],
        lead: 'Dá tempo: aplique hoje.',
      };
    case 'skip':
      return {
        tone: 'warn',
        title: 'Pule a dose esquecida',
        text: `Já passou do prazo da bula do ${brand} (${windowText}). Não aplique a dose atrasada: espere o dia de sempre e aplique só a dose normal.`,
        rows: [
          { label: 'Atraso', value: late(r.lateDays) },
          { label: 'Próxima dose', value: dayLabel(r.next) },
        ],
        lead: 'Pule esta e siga no dia de sempre.',
      };
    case 'next-due':
      return {
        tone: 'warn',
        title: 'Hoje é dia da dose seguinte',
        text: 'Já se passou uma semana: a dose esquecida ficou para trás. Aplique apenas a dose de hoje, na quantidade de sempre, sem somar a que faltou.',
        rows: [{ label: 'Atraso', value: '7 dias (uma dose pulada)' }],
        lead: 'Aplique só a dose de hoje.',
      };
    case 'several':
      return {
        tone: 'danger',
        title: 'Fale com o médico antes de retomar',
        text: `Foram ${r.lateDays} dias: mais de uma dose ficou para trás. A bula do Wegovy manda procurar o médico para avaliar se a subida de dose precisa recomeçar; as do Ozempic e do Mounjaro não trazem regra para esse caso. Não volte direto para a dose alta por conta própria: depois de uma pausa, náusea e vômito costumam ser mais fortes.`,
        rows: [{ label: 'Sem aplicar há', value: late(r.lateDays) }],
        lead: 'Mais de uma dose pulada.',
      };
    case 'daily':
      return {
        tone: 'warn',
        title: 'Pule o comprimido esquecido',
        text: `A bula do ${brand} manda não recuperar a dose: tome apenas um comprimido na manhã seguinte, em jejum, como de costume. Não tome mais tarde no mesmo dia nem dois de uma vez.`,
        rows: [{ label: 'Próxima dose', value: 'amanhã cedo, em jejum' }],
        lead: 'Um comprimido só, amanhã cedo.',
      };
  }
}
