'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Peptide } from '@/lib/peptides';
import { CATEGORY_LABELS } from '@/lib/peptides';
import { RegulatoryBadge, WadaBadge } from './StatusBadge';

type Props = { peptides: Peptide[]; initialSlugs?: string[] };

// Cor de acento por categoria (barra lateral)
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

type Metric = {
  key: string;
  label: string;
  render: (p: Peptide) => React.ReactNode;
  value: (p: Peptide) => string | number | null; // valor comparável (para diff detection)
  highlightDiff?: boolean; // se true, destaca quando valores diferem
  numeric?: boolean;
};

export default function Comparator({ peptides, initialSlugs = [] }: Props) {
  const [selected, setSelected] = useState<string[]>(initialSlugs.slice(0, 4));
  const [hydrated, setHydrated] = useState(false);

  // Ler URL ?p=slug1,slug2 na montagem
  useEffect(() => {
    if (typeof window === 'undefined') { setHydrated(true); return; }
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p) {
      const slugs = p.split(',').filter(Boolean).slice(0, 4);
      if (slugs.length > 0) setSelected(slugs);
    }
    setHydrated(true);
  }, []);

  // Atualizar URL quando seleção muda
  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (selected.length > 0) url.searchParams.set('p', selected.join(','));
    else url.searchParams.delete('p');
    window.history.replaceState(null, '', url.toString());
  }, [selected, hydrated]);

  const items = useMemo(
    () => selected.map((s) => peptides.find((p) => p.slug === s)).filter((p): p is Peptide => !!p),
    [selected, peptides]
  );

  function addPeptide(slug: string) {
    if (!selected.includes(slug) && selected.length < 4) {
      setSelected([...selected, slug]);
    }
  }
  function replacePeptide(idx: number, slug: string) {
    if (slug === selected[idx]) return;
    const next = [...selected];
    next[idx] = slug;
    setSelected(next);
  }
  function removeAt(idx: number) {
    setSelected(selected.filter((_, i) => i !== idx));
  }

  // ═══ Métricas comparadas ═══
  const metrics: Metric[] = [
    {
      key: 'desc',
      label: 'Resumo',
      render: (p) => <span className="text-sm leading-relaxed">{p.shortDescription}</span>,
      value: (p) => p.shortDescription,
    },
    {
      key: 'category',
      label: 'Categoria',
      render: (p) => p.category && (p.category in CATEGORY_LABELS)
        ? <span className="inline-flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${CATEGORY_ACCENT[p.category] || 'bg-teal-500'}`} />
            {CATEGORY_LABELS[p.category as keyof typeof CATEGORY_LABELS]}
          </span>
        : '—',
      value: (p) => p.category || null,
      highlightDiff: true,
    },
    {
      key: 'regulatory',
      label: 'Status regulatório',
      render: (p) => p.regulatoryStatus ? <RegulatoryBadge status={p.regulatoryStatus} size="sm" /> : '—',
      value: (p) => p.regulatoryStatus || null,
      highlightDiff: true,
    },
    {
      key: 'wada',
      label: 'WADA (proibido em esporte)',
      render: (p) => p.wadaProhibited
        ? <span className="inline-flex items-center gap-1 text-red-700 font-semibold text-sm">✓ Proibido</span>
        : <span className="text-ink-3 text-sm">— Não consta</span>,
      value: (p) => p.wadaProhibited ? 1 : 0,
      highlightDiff: true,
    },
    {
      key: 'dose',
      label: 'Dose típica',
      render: (p) => <span className="tabular-nums font-bold text-ink">{p.typicalDose} <span className="text-ink-3 font-normal text-sm">{p.doseUnit}</span></span>,
      value: (p) => `${p.typicalDose} ${p.doseUnit}`,
      numeric: true,
    },
    {
      key: 'range',
      label: 'Faixa de dose',
      render: (p) => p.doseRange || <span className="text-ink-3">—</span>,
      value: (p) => p.doseRange || null,
    },
    {
      key: 'freq',
      label: 'Frequência',
      render: (p) => p.frequency,
      value: (p) => p.frequency,
    },
    {
      key: 'halfLife',
      label: 'Meia-vida',
      render: (p) => p.halfLife || <span className="text-ink-3">—</span>,
      value: (p) => p.halfLife || null,
    },
    {
      key: 'vial',
      label: 'Frascos comuns',
      render: (p) => p.commonAmounts.length > 0
        ? <span className="inline-flex flex-wrap gap-1">
            {p.commonAmounts.map((a) => (
              <span key={a} className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100 tabular-nums">{a} mg</span>
            ))}
          </span>
        : <span className="text-ink-3">—</span>,
      value: (p) => p.commonAmounts.join(','),
    },
    {
      key: 'mechanism',
      label: 'Mecanismo',
      render: (p) => <span className="text-xs leading-relaxed block">
        {(p.mechanism?.split('\n')[0]?.slice(0, 180) || '—')}
        {p.mechanism && p.mechanism.length > 180 ? '…' : ''}
      </span>,
      value: (p) => p.mechanism?.slice(0, 50) || null,
    },
  ];

  // Quais métricas têm diferença entre os items?
  const diffKeys = useMemo(() => {
    const diffs = new Set<string>();
    if (items.length < 2) return diffs;
    metrics.forEach((m) => {
      const values = items.map(m.value);
      const unique = new Set(values.map((v) => String(v)));
      if (unique.size > 1) diffs.add(m.key);
    });
    return diffs;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <div>
      {/* ═══ Cards dos peptídeos selecionados + add ═══ */}
      <div className="flex flex-wrap gap-3 mb-6">
        {items.map((p, i) => (
          <SelectedCard
            key={p.slug}
            peptide={p}
            onRemove={() => removeAt(i)}
            onReplace={(newSlug) => replacePeptide(i, newSlug)}
            peptides={peptides}
            excludeSlugs={selected.filter((_, idx) => idx !== i)}
          />
        ))}
        {selected.length < 4 && (
          <AddCard
            onPick={addPeptide}
            peptides={peptides}
            excludeSlugs={selected}
            existingCount={items.length}
          />
        )}
      </div>

      {/* ═══ Empty state ═══ */}
      {items.length < 2 ? (
        <div className="card p-6 md:p-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" />
              <path d="M4 6v12M12 6v12M20 6v12" />
            </svg>
          </div>
          <p className="font-semibold text-ink text-lg mb-1">
            {items.length === 0 ? 'Escolha 2 ou mais peptídeos' : 'Adicione mais um peptídeo'}
          </p>
          <p className="text-sm text-ink-2 max-w-md mx-auto">
            Selecione no botão <strong>&quot;Adicionar&quot;</strong> acima ou use uma{' '}
            <strong>comparação popular</strong>:
          </p>
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {QUICK_COMPARISONS.map((qc) => (
              <button
                key={qc.slugs.join('-')}
                type="button"
                onClick={() => setSelected(qc.slugs)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border border-teal bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
              >
                {qc.label}
                <svg viewBox="0 0 20 20" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10h10M10 5l5 5-5 5" /></svg>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* ═══ Filtro de diferenças ═══ */}
          {diffKeys.size > 0 && (
            <p className="text-xs text-ink-3 mb-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden />
              Linhas destacadas = valores diferentes entre os peptídeos selecionados
            </p>
          )}

          {/* ═══ DESKTOP: Tabela sticky ═══ */}
          <div className="hidden md:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-20 bg-surface z-10">
                  <tr className="border-b border-border">
                    <th className="sticky left-0 bg-surface text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-ink-3 w-48 z-10">
                      Critério
                    </th>
                    {items.map((p) => (
                      <th key={p.slug} className="text-left py-3 px-4 font-bold min-w-[180px]">
                        <span className="flex items-center gap-1.5">
                          {p.category && (
                            <span className={`w-1.5 h-6 rounded ${CATEGORY_ACCENT[p.category] || 'bg-teal-500'}`} aria-hidden />
                          )}
                          <Link href={`/peptideos/${p.slug}`} className="hover:text-teal-700">
                            {p.name}
                          </Link>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {metrics.map((m) => {
                    const isDiff = diffKeys.has(m.key);
                    const bg = m.highlightDiff && isDiff ? 'bg-amber-50/40' : '';
                    return (
                      <tr key={m.key} className={bg}>
                        <th className={`sticky left-0 bg-surface ${bg} text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-ink-3 align-top`}>
                          {m.label}
                        </th>
                        {items.map((p) => (
                          <td key={p.slug} className="py-3 px-4 align-top text-ink-2">
                            {m.render(p)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  <tr>
                    <th className="sticky left-0 bg-surface"></th>
                    {items.map((p) => (
                      <td key={p.slug} className="py-3 px-4">
                        <Link
                          href={`/peptideos/${p.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
                        >
                          Ver ficha completa
                          <svg viewBox="0 0 20 20" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10h10M10 5l5 5-5 5" /></svg>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ═══ MOBILE: Accordion por métrica ═══ */}
          <div className="md:hidden space-y-2">
            {metrics.map((m) => {
              const isDiff = diffKeys.has(m.key);
              return (
                <details
                  key={m.key}
                  className={`card overflow-hidden ${m.highlightDiff && isDiff ? 'ring-1 ring-amber-200' : ''}`}
                  open={m.key === 'desc' || m.key === 'dose'}
                >
                  <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ink">{m.label}</span>
                      {m.highlightDiff && isDiff && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          ≠
                        </span>
                      )}
                    </div>
                    <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-ink-3 transition-transform group-open:rotate-180">
                      <path d="m5 8 5 5 5-5" />
                    </svg>
                  </summary>
                  <div className="divide-y divide-border">
                    {items.map((p) => (
                      <div key={p.slug} className="px-4 py-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-1.5 flex-shrink-0 min-w-[100px]">
                          {p.category && (
                            <span className={`w-1 h-5 rounded ${CATEGORY_ACCENT[p.category] || 'bg-teal-500'}`} aria-hidden />
                          )}
                          <span className="text-xs font-bold text-ink truncate">{p.name}</span>
                        </div>
                        <div className="text-right text-sm text-ink-2">{m.render(p)}</div>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}

            <div className="card p-4 flex flex-wrap gap-2">
              {items.map((p) => (
                <Link
                  key={p.slug}
                  href={`/peptideos/${p.slug}`}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded border border-border bg-surface text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50"
                >
                  {p.name}
                  <svg viewBox="0 0 20 20" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 10h10M10 5l5 5-5 5" /></svg>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ═════════ Sub-componentes ═════════

const QUICK_COMPARISONS: { label: string; slugs: string[] }[] = [
  { label: 'Semaglutida × Tirzepatida', slugs: ['semaglutida', 'tirzepatida'] },
  { label: 'BPC-157 × TB-500', slugs: ['bpc-157', 'tb-500'] },
  { label: 'CJC-1295 × Ipamorelina', slugs: ['cjc-1295', 'ipamorelina'] },
];

function SelectedCard({
  peptide,
  onRemove,
  onReplace,
  peptides,
  excludeSlugs,
}: {
  peptide: Peptide;
  onRemove: () => void;
  onReplace: (slug: string) => void;
  peptides: Peptide[];
  excludeSlugs: string[];
}) {
  const [picking, setPicking] = useState(false);
  const accent = (peptide.category && CATEGORY_ACCENT[peptide.category]) || 'bg-teal-500';

  return (
    <div className="relative flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl border-2 border-border bg-surface hover:border-teal transition-colors">
      <span className={`w-1 h-8 rounded ${accent}`} aria-hidden />
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-sm leading-none">{peptide.name}</span>
        <span className="text-[11px] text-ink-3 tabular-nums">{peptide.typicalDose} {peptide.doseUnit}</span>
      </div>
      <div className="flex items-center gap-0.5 ml-1">
        <button
          type="button"
          onClick={() => setPicking(!picking)}
          aria-label={`Trocar ${peptide.name}`}
          title="Trocar peptídeo"
          className="w-7 h-7 flex items-center justify-center rounded-md text-ink-3 hover:bg-teal-50 hover:text-teal-700"
        >
          <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 7h11M13 5l2 2-2 2M16 13H5M7 11l-2 2 2 2" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${peptide.name}`}
          className="w-7 h-7 flex items-center justify-center rounded-md text-ink-3 hover:bg-red-50 hover:text-red-600"
        >
          <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>
      {picking && (
        <PeptidePicker
          peptides={peptides}
          excludeSlugs={excludeSlugs}
          onPick={(slug) => { onReplace(slug); setPicking(false); }}
          onClose={() => setPicking(false)}
          anchor="bottom-left"
        />
      )}
    </div>
  );
}

function AddCard({
  onPick,
  peptides,
  excludeSlugs,
  existingCount,
}: {
  onPick: (slug: string) => void;
  peptides: Peptide[];
  excludeSlugs: string[];
  existingCount: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed transition-colors ${
          existingCount === 0
            ? 'border-teal bg-teal-50 text-teal-700 animate-pulse-subtle'
            : 'border-border-2 text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50'
        }`}
      >
        <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx={10} cy={10} r={8} />
          <path d="M10 6v8M6 10h8" />
        </svg>
        <span className="font-bold text-sm">
          {existingCount === 0 ? 'Escolher primeiro peptídeo' : 'Adicionar peptídeo'}
        </span>
      </button>
      {open && (
        <PeptidePicker
          peptides={peptides}
          excludeSlugs={excludeSlugs}
          onPick={(slug) => { onPick(slug); setOpen(false); }}
          onClose={() => setOpen(false)}
          anchor="bottom-left"
        />
      )}
    </div>
  );
}

function PeptidePicker({
  peptides,
  excludeSlugs,
  onPick,
  onClose,
  anchor = 'bottom-left',
}: {
  peptides: Peptide[];
  excludeSlugs: string[];
  onPick: (slug: string) => void;
  onClose: () => void;
  anchor?: 'bottom-left' | 'bottom-right';
}) {
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return peptides.filter((p) => {
      if (excludeSlugs.includes(p.slug)) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.shortDescription?.toLowerCase().includes(q);
    });
  }, [peptides, query, excludeSlugs]);

  useEffect(() => { setHighlight(0); }, [query]);
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.querySelector(`[data-idx="${highlight}"]`) as HTMLElement | null;
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlight]);

  const posClass = anchor === 'bottom-right' ? 'right-0' : 'left-0';

  return (
    <div
      ref={ref}
      className={`absolute ${posClass} top-full mt-2 z-40 w-[300px] max-w-[90vw] bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-slide-up`}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-ink-3">
          <circle cx={9} cy={9} r={6} /><path d="m16 16-3.5-3.5" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          placeholder="Buscar peptídeo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setHighlight((h) => Math.min(h + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setHighlight((h) => Math.max(h - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (filtered[highlight]) onPick(filtered[highlight].slug);
            }
          }}
          className="flex-1 bg-transparent outline-none text-sm text-ink"
        />
      </div>
      <ul ref={listRef} role="listbox" className="list-none m-0 p-1 max-h-72 overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="px-3 py-4 text-center text-sm text-ink-3">Nenhum peptídeo encontrado.</li>
        ) : (
          filtered.map((p, i) => {
            const accent = (p.category && CATEGORY_ACCENT[p.category]) || 'bg-teal-500';
            return (
              <li
                key={p.slug}
                role="option"
                aria-selected={highlight === i}
                data-idx={i}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => { e.preventDefault(); onPick(p.slug); }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer ${
                  highlight === i ? 'bg-teal-50' : 'hover:bg-teal-50'
                }`}
              >
                <span className={`w-1 h-8 rounded ${accent}`} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm truncate text-ink">{p.name}</div>
                  <div className="text-[11px] text-ink-3 truncate">{p.frequency}</div>
                </div>
                <span className="text-[10px] font-bold text-teal-700 tabular-nums flex-shrink-0">
                  {p.typicalDose} {p.doseUnit}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
