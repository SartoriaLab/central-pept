'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Peptide } from '@/lib/peptides';
import DecimalInput from '@/components/ui/DecimalInput';
import {
  SITES,
  daysSinceBySite,
  nextSite,
  parseEntries,
  siteLabel,
  sortEntries,
  toCsv,
  type LogEntry,
  type SiteId,
} from '@/lib/injection-log';
import { FREQ_LABELS, intervalDays, type Freq } from '@/lib/vial-plan';
import { buildIcs, downloadIcs } from '@/lib/ics';
import { EVENTS, track } from '@/lib/track';

const KEY = 'cp:diario:v1';
const PREFS_KEY = 'cp:diario:prefs';

const pad = (n: number) => String(n).padStart(2, '0');
function nowLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
const fmtWhen = (at: string) =>
  new Date(at).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

type Prefs = { slug: string; dose: number | ''; unit: string; freq: Freq; every: number | ''; sites: SiteId[] };
const DEFAULT_PREFS: Prefs = { slug: '', dose: '', unit: 'mcg', freq: 'diaria', every: 3, sites: SITES.map((s) => s.id) };

export default function InjectionDiary({ peptides }: { peptides: Peptide[] }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [at, setAt] = useState('');
  const [site, setSite] = useState<SiteId | null>(null);
  const [note, setNote] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      setEntries(parseEntries(JSON.parse(localStorage.getItem(KEY) ?? '[]')));
      const p = JSON.parse(localStorage.getItem(PREFS_KEY) ?? 'null');
      if (p && typeof p === 'object') setPrefs({ ...DEFAULT_PREFS, ...p });
    } catch {
      /* armazenamento bloqueado ou corrompido */
    }
    setAt(nowLocal());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(entries));
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* armazenamento bloqueado */
    }
  }, [entries, prefs, hydrated]);

  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(null), 2500);
    return () => window.clearTimeout(t);
  }, [msg]);

  const sorted = useMemo(() => sortEntries(entries), [entries]);
  const suggested = useMemo(() => nextSite(entries, prefs.sites), [entries, prefs.sites]);
  const chosen = site ?? suggested;
  const since = useMemo(() => (hydrated ? daysSinceBySite(entries, new Date()) : {}), [entries, hydrated]);
  const peptide = peptides.find((p) => p.slug === prefs.slug);
  const step = intervalDays(prefs.freq, typeof prefs.every === 'number' ? prefs.every : 1);
  const nextDue = sorted[0] ? new Date(new Date(sorted[0].at).getTime() + step * 86_400_000) : null;

  function pickPeptide(slug: string) {
    const p = peptides.find((x) => x.slug === slug);
    setPrefs((s) => ({ ...s, slug, ...(p ? { dose: p.typicalDose, unit: p.doseUnit } : {}) }));
  }

  function toggleSite(id: SiteId) {
    setPrefs((s) => {
      const has = s.sites.includes(id);
      if (has && s.sites.length === 1) return s;
      return { ...s, sites: has ? s.sites.filter((x) => x !== id) : SITES.map((x) => x.id).filter((x) => x === id || s.sites.includes(x)) };
    });
  }

  function add() {
    if (!chosen || !at) return;
    const entry: LogEntry = {
      id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      at,
      slug: prefs.slug,
      name: peptide?.name ?? 'Aplicação',
      dose: prefs.dose,
      unit: prefs.unit,
      site: chosen,
      ...(note.trim() ? { note: note.trim().slice(0, 200) } : {}),
    };
    setEntries((list) => [...list, entry]);
    setSite(null);
    setNote('');
    setAt(nowLocal());
    setMsg(`Registrado: ${siteLabel(chosen)}.`);
  }

  function remove(id: string) {
    setEntries((list) => list.filter((e) => e.id !== id));
  }

  function clearAll() {
    if (!window.confirm('Apagar todo o diário deste navegador? Não dá para desfazer.')) return;
    setEntries([]);
  }

  function exportCsv() {
    const url = URL.createObjectURL(new Blob([toCsv(entries)], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diario-aplicacoes.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    track(EVENTS.icsDownload, { ferramenta: 'diario', formato: 'csv' });
  }

  function exportNext() {
    if (!nextDue) return;
    const where = suggested ? siteLabel(suggested) : '';
    const name = peptide?.name ?? 'Aplicação';
    downloadIcs(
      'proxima-aplicacao.ics',
      buildIcs(
        [{
          start: nextDue,
          minutes: 15,
          summary: `${name}${prefs.dose !== '' ? ` — ${prefs.dose} ${prefs.unit}` : ''}`,
          description: where ? `Local sugerido pelo rodízio: ${where}.` : undefined,
          alarmMinutes: 15,
          alarmText: `Hora de aplicar ${name}`,
        }],
        'Diário',
      ),
    );
    track(EVENTS.icsDownload, { ferramenta: 'diario', formato: 'ics' });
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:grid-cols-[460px_minmax(0,1fr)] items-start">
      <div className="flex flex-col gap-5">
        <section className="card p-6" aria-labelledby="diario-nova">
          <h2 id="diario-nova" className="text-sm font-bold uppercase tracking-wider text-ink-2 mb-4">Nova aplicação</h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Peptídeo</span>
              <select value={prefs.slug} onChange={(e) => pickPeptide(e.target.value)} className="input">
                <option value="">— sem peptídeo específico —</option>
                {peptides.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-1 min-[440px]:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink-2">Dose</span>
                <div className="flex items-center border-[1.5px] border-border-2 rounded bg-surface h-11 overflow-hidden focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal/25">
                  <DecimalInput
                    value={prefs.dose}
                    onChange={(v) => setPrefs((s) => ({ ...s, dose: v }))}
                    className="flex-1 min-w-0 h-full bg-transparent px-3 text-base font-bold tabular-nums outline-none"
                  />
                  <select
                    aria-label="Unidade da dose"
                    value={prefs.unit}
                    onChange={(e) => setPrefs((s) => ({ ...s, unit: e.target.value }))}
                    className="h-full px-2 text-xs font-bold text-ink-2 bg-surface border-l border-border outline-none"
                  >
                    <option value="mcg">mcg</option>
                    <option value="mg">mg</option>
                    <option value="UI">UI</option>
                    <option value="U">U</option>
                  </select>
                </div>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink-2">Quando</span>
                <input type="datetime-local" value={at} onChange={(e) => setAt(e.target.value)} className="input !px-2 text-sm" />
              </label>
            </div>

            <fieldset>
              <legend className="text-xs font-semibold text-ink-2 mb-1.5">
                Local {suggested && <span className="font-normal text-ink-3">· sugerido: {siteLabel(suggested)}</span>}
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {SITES.filter((s) => prefs.sites.includes(s.id)).map((s) => {
                  const active = chosen === s.id;
                  const d = since[s.id];
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSite(s.id)}
                      aria-pressed={active}
                      className={`flex flex-col items-start min-h-12 px-3 py-2 rounded-lg border-[1.5px] text-left transition-colors ${
                        active ? 'border-teal bg-teal-50' : 'border-border-2 bg-surface hover:border-teal'
                      }`}
                    >
                      <span className={`text-sm font-bold ${active ? 'text-teal-700' : 'text-ink'}`}>
                        {s.short}
                        {s.id === suggested && <span className="ml-1 text-xs font-semibold text-teal-700">★</span>}
                      </span>
                      <span className="text-xs text-ink-3">
                        {d === undefined ? 'ainda não usado' : d === 0 ? 'usado hoje' : `há ${d} ${d === 1 ? 'dia' : 'dias'}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Observação (opcional)</span>
              <input
                type="text"
                value={note}
                maxLength={200}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex.: leve vermelhidão"
                className="input"
              />
            </label>

            <button type="button" onClick={add} disabled={!hydrated || !chosen || !at} className="btn-teal w-full justify-center disabled:opacity-50">
              Registrar aplicação
            </button>
            <p aria-live="polite" className="min-h-5 text-sm font-semibold text-teal-700">{msg}</p>
          </div>
        </section>

        <details className="card p-6 group">
          <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-bold uppercase tracking-wider text-ink-2">
            Ajustes do rodízio
            <span aria-hidden className="transition-transform group-open:rotate-180">▾</span>
          </summary>
          <div className="mt-4 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-ink-2">Frequência (para lembrar a próxima)</span>
              <select value={prefs.freq} onChange={(e) => setPrefs((s) => ({ ...s, freq: e.target.value as Freq }))} className="input">
                {(Object.keys(FREQ_LABELS) as Freq[]).map((f) => (
                  <option key={f} value={f}>{FREQ_LABELS[f]}</option>
                ))}
              </select>
            </label>
            {prefs.freq === 'cada' && (
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-ink-2">A cada X dias</span>
                <DecimalInput integer value={prefs.every} onChange={(v) => setPrefs((s) => ({ ...s, every: v }))} className="input tabular-nums" />
              </label>
            )}
            <fieldset>
              <legend className="text-xs font-semibold text-ink-2 mb-1.5">Locais que você usa</legend>
              <div className="grid grid-cols-2 gap-1.5">
                {SITES.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 min-h-10 text-sm text-ink-2 cursor-pointer">
                    <input type="checkbox" checked={prefs.sites.includes(s.id)} onChange={() => toggleSite(s.id)} className="w-4 h-4 accent-teal-600" />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </details>
      </div>

      <div className="flex flex-col gap-5">
        <section className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-3">Próxima aplicação</div>
              {nextDue ? (
                <>
                  <div className="mt-1 text-2xl font-extrabold text-teal">{fmtWhen(nextDue.toISOString())}</div>
                  {suggested && <div className="text-sm text-ink-2 mt-0.5">Local: <strong>{siteLabel(suggested)}</strong></div>}
                </>
              ) : (
                <div className="mt-1 text-sm text-ink-3">Registre a primeira aplicação para ver a próxima.</div>
              )}
            </div>
            {nextDue && (
              <button type="button" onClick={exportNext} className="btn-teal !h-10 !px-3 text-sm">
                Lembrete .ics
              </button>
            )}
          </div>
        </section>

        <section className="card overflow-hidden" aria-labelledby="diario-hist">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 border-b border-border">
            <h2 id="diario-hist" className="font-bold text-ink">
              Histórico <span className="text-ink-3 font-normal">({entries.length})</span>
            </h2>
            {entries.length > 0 && (
              <div className="flex gap-2">
                <button type="button" onClick={exportCsv} className="min-h-10 px-3 rounded-lg border border-border text-sm font-semibold text-ink-2 hover:border-teal hover:text-teal-700">
                  Exportar CSV
                </button>
                <button type="button" onClick={clearAll} className="min-h-10 px-3 rounded-lg border border-border text-sm font-semibold text-ink-3 hover:border-red-300 hover:text-red-600">
                  Apagar tudo
                </button>
              </div>
            )}
          </div>
          {sorted.length === 0 ? (
            <p className="p-6 text-sm text-ink-3">
              Nada registrado ainda. Os dados ficam só neste navegador: não são enviados para nenhum servidor.
            </p>
          ) : (
            <ul className="divide-y divide-border max-h-[560px] overflow-y-auto">
              {sorted.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink">
                      {e.name}
                      {e.dose !== '' && <span className="font-normal text-ink-2"> · {String(e.dose).replace('.', ',')} {e.unit}</span>}
                    </div>
                    <div className="text-xs text-ink-3">
                      {fmtWhen(e.at)} · {siteLabel(e.site)}
                      {e.note && <> · {e.note}</>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(e.id)}
                    aria-label={`Apagar aplicação de ${fmtWhen(e.at)}`}
                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md text-ink-3 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
                      <path d="M5 5l10 10M15 5L5 15" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
