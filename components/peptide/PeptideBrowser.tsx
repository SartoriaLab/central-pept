'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CATEGORY_LABELS, REGULATORY_LABELS, type Peptide, type RegulatoryStatus } from '@/lib/peptides';
import { RegulatoryBadge, WadaBadge } from './StatusBadge';

// Cor de acento por categoria (para barra lateral do card)
const CATEGORY_ACCENT: Record<string, string> = {
  'healing':     'bg-green-500',
  'glp-1':       'bg-blue-500',
  'gh':          'bg-violet-500',
  'sexual':      'bg-pink-500',
  'cosmetic':    'bg-amber-500',
  'longevity':   'bg-teal-500',
  'weight-loss': 'bg-orange-500',
  'cognitive':   'bg-indigo-500',
  'hormone':     'bg-rose-500',
};

type Props = { peptides: Peptide[] };

type StatusFilter = 'all' | RegulatoryStatus | 'wada';

export default function PeptideBrowser({ peptides }: Props) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  // Categorias que realmente aparecem nos peptídeos (mantém ordem de CATEGORY_LABELS)
  const cats = useMemo(() => {
    const present = new Set(
      peptides.map((p) => p.category).filter(Boolean) as string[]
    );
    return (Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).filter(
      (c) => present.has(c) && c !== 'custom'
    );
  }, [peptides]);

  // Status que realmente aparecem
  const statuses = useMemo(() => {
    const present = new Set(peptides.map((p) => p.regulatoryStatus).filter(Boolean) as RegulatoryStatus[]);
    return (Object.keys(REGULATORY_LABELS) as RegulatoryStatus[]).filter((s) => present.has(s));
  }, [peptides]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return peptides.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false;
      if (status === 'wada' && !p.wadaProhibited) return false;
      if (status !== 'all' && status !== 'wada' && p.regulatoryStatus !== status) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.shortDescription?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [peptides, query, cat, status]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2 h-11 px-3.5 border-[1.5px] border-border-2 bg-surface rounded focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal-50 transition-all">
          <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-ink-3">
            <circle cx={9} cy={9} r={6} /><path d="m16 16-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Buscar peptídeo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-ink"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpar busca"
              className="text-ink-3 hover:text-ink-2"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">Categoria</div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCat('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
              cat === 'all'
                ? 'bg-teal-50 border-teal text-teal-700'
                : 'bg-surface border-border text-ink-2 hover:border-teal'
            }`}
          >
            Todas ({peptides.length})
          </button>
          {cats.map((c) => {
            const count = peptides.filter((p) => p.category === c).length;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                  cat === c
                    ? 'bg-teal-50 border-teal text-teal-700'
                    : 'bg-surface border-border text-ink-2 hover:border-teal'
                }`}
              >
                {CATEGORY_LABELS[c]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1.5">Status regulatório</div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setStatus('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
              status === 'all'
                ? 'bg-teal-50 border-teal text-teal-700'
                : 'bg-surface border-border text-ink-2 hover:border-teal'
            }`}
          >
            Todos
          </button>
          {statuses.map((s) => {
            const count = peptides.filter((p) => p.regulatoryStatus === s).length;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                  status === s
                    ? 'bg-teal-50 border-teal text-teal-700'
                    : 'bg-surface border-border text-ink-2 hover:border-teal'
                }`}
              >
                {REGULATORY_LABELS[s].label} ({count})
              </button>
            );
          })}
          {peptides.some((p) => p.wadaProhibited) && (
            <button
              type="button"
              onClick={() => setStatus('wada')}
              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${
                status === 'wada'
                  ? 'bg-red-50 border-red-400 text-red-800'
                  : 'bg-surface border-border text-ink-2 hover:border-red-300'
              }`}
            >
              Proibidos WADA ({peptides.filter((p) => p.wadaProhibited).length})
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-ink-3 text-sm">
          Nenhum peptídeo encontrado com esses filtros.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const accent = (p.category && CATEGORY_ACCENT[p.category]) || 'bg-teal';
            return (
              <Link
                key={p.slug}
                href={`/peptideos/${p.slug}`}
                className="group card-hover relative p-5 pl-6 block overflow-hidden"
              >
                {/* Barra lateral colorida por categoria */}
                <span
                  className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`}
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="font-bold leading-tight text-ink group-hover:text-teal-700 transition-colors">{p.name}</h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap flex-shrink-0 tabular-nums">
                    {p.typicalDose} {p.doseUnit}
                  </span>
                </div>
                {(p.regulatoryStatus || p.wadaProhibited) && (
                  <div className="mb-2 flex flex-wrap gap-1">
                    {p.regulatoryStatus && <RegulatoryBadge status={p.regulatoryStatus} size="sm" />}
                    {p.wadaProhibited && <WadaBadge size="sm" />}
                  </div>
                )}
                <p className="text-sm text-ink-2 leading-relaxed line-clamp-2">
                  {p.shortDescription}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-ink-3">
                  <span className="truncate">{p.frequency}</span>
                  <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-teal-700">
                    <path d="M5 10h10M10 5l5 5-5 5" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
