'use client';

import type { Peptide } from '@/lib/peptides';

export type HistoryEntry = {
  slug: string;
  name: string;
  mg: number | '';
  water: number | '';
  units: number | '';
  dose: number | '';
  mode: 'volume' | 'units';
  syringe: 30 | 50 | 100;
  /** Resultado no momento: unidades por dose. */
  u: number;
  unit: string;
  at: number;
};

export const HISTORY_KEY = 'cp:recon:historico';
export const FAVORITES_KEY = 'cp:recon:favoritos';
export const HISTORY_MAX = 6;

/** Chave que identifica o mesmo cálculo (evita repetir no histórico). */
export function historyKey(e: Pick<HistoryEntry, 'slug' | 'mg' | 'water' | 'units' | 'dose' | 'mode'>): string {
  return [e.slug, e.mg, e.water, e.units, e.dose, e.mode].join('|');
}

/** Põe o cálculo no topo, sem duplicar, e corta no máximo. */
export function pushHistory(list: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  const k = historyKey(entry);
  return [entry, ...list.filter((e) => historyKey(e) !== k)].slice(0, HISTORY_MAX);
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const v = JSON.parse(raw);
    return Array.isArray(fallback) && !Array.isArray(v) ? fallback : (v as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* armazenamento bloqueado */
  }
}

const fmt = (n: number | '', dec = 2) => (n === '' ? '—' : n.toLocaleString('pt-BR', { maximumFractionDigits: dec }));

type Props = {
  favorites: Peptide[];
  history: HistoryEntry[];
  currentSlug?: string;
  onPick: (p: Peptide) => void;
  onRestore: (e: HistoryEntry) => void;
  onClearHistory: () => void;
};

/** Atalhos: peptídeos favoritos e últimos cálculos feitos neste navegador. */
export default function RecentCalcs({ favorites, history, currentSlug, onPick, onRestore, onClearHistory }: Props) {
  if (favorites.length === 0 && history.length === 0) return null;
  return (
    <div className="mt-4 flex flex-col gap-3">
      {favorites.length > 0 && (
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1.5">Favoritos</div>
          <div className="flex flex-wrap gap-1.5">
            {favorites.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => onPick(p)}
                aria-pressed={p.slug === currentSlug}
                className={`chip min-h-10 ${p.slug === currentSlug ? '!border-teal !bg-teal-50 !text-teal-700' : ''}`}
              >
                <span aria-hidden className="text-amber-500">★</span> {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {history.length > 0 && (
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none min-h-10 text-xs font-bold uppercase tracking-wider text-ink-3">
            <span>Últimos cálculos ({history.length})</span>
            <span aria-hidden className="transition-transform group-open:rotate-180">▾</span>
          </summary>
          <ul className="mt-1 flex flex-col gap-1.5">
            {history.map((e) => (
              <li key={historyKey(e)}>
                <button
                  type="button"
                  onClick={() => onRestore(e)}
                  className="w-full flex items-center justify-between gap-3 min-h-11 px-3 py-2 rounded-lg bg-bg border border-border text-left text-sm hover:border-teal"
                >
                  <span className="min-w-0">
                    <strong className="block truncate text-ink">{e.name}</strong>
                    <span className="text-xs text-ink-3">
                      {fmt(e.mg)} mg · {e.mode === 'volume' ? `${fmt(e.water)} ml` : `${fmt(e.units, 0)} U`} · dose {fmt(e.dose, 3)} {e.unit}
                    </span>
                  </span>
                  <span className="flex-shrink-0 font-bold tabular-nums text-teal-700">{fmt(e.u, 1)} U</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={onClearHistory} className="mt-2 min-h-10 text-xs font-semibold text-ink-3 hover:text-red-600">
            Apagar histórico
          </button>
        </details>
      )}
    </div>
  );
}
