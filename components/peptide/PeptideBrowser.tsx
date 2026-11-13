'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CATEGORY_LABELS, REGULATORY_LABELS, type Peptide, type RegulatoryStatus } from '@/lib/peptides';
import { RegulatoryBadge, WadaBadge } from './StatusBadge';
import { categoryAccent } from '@/lib/category-style';


type Props = { peptides: Peptide[] };

type StatusFilter = 'all' | RegulatoryStatus | 'wada';

export default function PeptideBrowser({ peptides }: Props) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const urlLoaded = useRef(false);

  // ?q= vem da busca do Google (SearchAction em app/layout.tsx) e de links compartilhados.
  // Lido no cliente para a página continuar estática.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setQuery(q);
    urlLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!urlLoaded.current) return;
    const url = new URL(window.location.href);
    const q = query.trim();
    if (q) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    window.history.replaceState(window.history.state, '', url);
  }, [query]);

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
        <div className="md:flex-1 shrink-0 flex items-center gap-2 h-12 px-3.5 border-[1.5px] border-border-2 bg-surface rounded focus-within:border-teal focus-within:ring-[3px] focus-within:ring-teal/25 transition-all">
          <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-ink-3">
            <circle cx={9} cy={9} r={6} /><path d="m16 16-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Buscar peptídeo…"
            aria-label="Buscar peptídeo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 h-full bg-transparent outline-none text-base text-ink placeholder:text-ink-3"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpar busca"
              className="w-10 h-10 -mr-2 flex items-center justify-center rounded-md text-xl leading-none text-ink-3 hover:text-ink"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1.5">Categoria</div>
        <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-1.5 overflow-x-auto md:overflow-visible no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1">
          <button
            type="button"
            onClick={() => setCat('all')}
            aria-pressed={cat === 'all'}
            className={`shrink-0 whitespace-nowrap min-h-10 px-3.5 md:px-3 text-sm md:text-xs font-semibold rounded-full border transition-colors ${
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
                aria-pressed={cat === c}
                className={`shrink-0 whitespace-nowrap min-h-10 px-3.5 md:px-3 text-sm md:text-xs font-semibold rounded-full border transition-colors ${
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
        <div className="text-xs font-bold uppercase tracking-wider text-ink-3 mb-1.5">Status regulatório</div>
        <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-1.5 overflow-x-auto md:overflow-visible no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1">
          <button
            type="button"
            onClick={() => setStatus('all')}
            aria-pressed={status === 'all'}
            className={`shrink-0 whitespace-nowrap min-h-10 px-3.5 md:px-3 text-sm md:text-xs font-semibold rounded-full border transition-colors ${
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
                aria-pressed={status === s}
                className={`shrink-0 whitespace-nowrap min-h-10 px-3.5 md:px-3 text-sm md:text-xs font-semibold rounded-full border transition-colors ${
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
              aria-pressed={status === 'wada'}
              className={`shrink-0 whitespace-nowrap min-h-10 px-3.5 md:px-3 text-sm md:text-xs font-semibold rounded-full border transition-colors ${
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
        <div className="card p-8 text-center text-ink-3 text-sm" role="status">
          Nenhum peptídeo encontrado com esses filtros.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const accent = categoryAccent(p.category);
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
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap flex-shrink-0 tabular-nums">
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
