'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { buildSearchIndex, searchIndex, type SearchResult } from '@/lib/search-index';

const TYPE_LABELS: Record<SearchResult['type'], string> = {
  peptide: 'Peptídeo',
  article: 'Artigo',
  tool: 'Ferramenta',
  page: 'Página',
};

const TYPE_COLORS: Record<SearchResult['type'], string> = {
  peptide: 'bg-teal-50 text-teal-700 border-teal-100',
  article: 'bg-blue-50 text-blue-700 border-blue-200',
  tool: 'bg-orange-50 text-orange-700 border-orange-200',
  page: 'bg-bg text-ink-2 border-border',
};

// Uma única instância por página (montada no Header). O modal vai para o <body>
// via portal: dentro do header com backdrop-blur ele ficaria preso ao header.
export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const index = useMemo(() => buildSearchIndex(), []);
  const results = useMemo(() => searchIndex(index, query), [index, query]);

  // Atalho teclado: "/" ou Cmd/Ctrl+K abre
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.key === '/' && !isEditable(e.target)) || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Ao abrir: foca o campo e trava a rolagem da página
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Reset highlight ao mudar query
  useEffect(() => { setHighlight(0); }, [query]);

  // Scroll item ativo
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${highlight}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest' });
  }, [highlight]);

  function close(returnFocus = true) {
    setOpen(false);
    setQuery('');
    setHighlight(0);
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function go(url: string) {
    close(false);
    router.push(url);
  }

  // Mantém o Tab dentro do modal
  function trapTab(e: React.KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    const items = dialogRef.current.querySelectorAll<HTMLElement>('input, button, [href]');
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  const activeId = results[highlight] ? `busca-opt-${highlight}` : undefined;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        aria-haspopup="dialog"
        title="Buscar (tecle / ou Ctrl+K)"
        className="inline-flex items-center justify-center gap-2 h-10 min-w-10 px-2.5 rounded-md text-ink-2 hover:bg-teal-50 hover:text-teal-700 transition-colors"
      >
        <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx={9} cy={9} r={6} /><path d="m16 16-3.5-3.5" />
        </svg>
        <kbd className="hidden lg:inline-flex items-center px-1.5 h-5 rounded border border-border text-xs font-mono text-ink-3 bg-bg">
          /
        </kbd>
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-[8vh] md:pt-[10vh] bg-ink/50 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => close()}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Busca no site"
            onKeyDown={trapTab}
            className="w-full max-w-xl bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <svg viewBox="0 0 20 20" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-ink-3">
                <circle cx={9} cy={9} r={6} /><path d="m16 16-3.5-3.5" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                inputMode="search"
                enterKeyHint="search"
                role="combobox"
                aria-label="Buscar no site"
                aria-expanded={results.length > 0}
                aria-controls="busca-lista"
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                autoComplete="off"
                placeholder="Buscar peptídeo, artigo, ferramenta…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setHighlight((h) => Math.min(h + 1, Math.max(results.length - 1, 0)));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setHighlight((h) => Math.max(h - 1, 0));
                  } else if (e.key === 'Enter' && results[highlight]) {
                    e.preventDefault();
                    go(results[highlight].url);
                  }
                }}
                className="flex-1 h-9 bg-transparent outline-none text-base text-ink placeholder:text-ink-3"
              />
              <button
                type="button"
                onClick={() => close()}
                aria-label="Fechar busca"
                className="inline-flex items-center justify-center h-8 min-w-8 px-2 rounded border border-border text-xs font-mono text-ink-3 bg-bg hover:text-ink hover:border-border-2"
              >
                <span className="hidden sm:inline">ESC</span>
                <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden className="sm:hidden">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {query.trim() === '' ? (
              <div className="p-6 text-center text-sm text-ink-3">
                <p className="mb-4">Busque entre peptídeos, artigos, ferramentas e páginas.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['semaglutida', 'bpc-157', 'reconstituição', 'tirzepatida', 'cronograma'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setQuery(s); inputRef.current?.focus(); }}
                      className="px-3 py-1.5 text-sm font-semibold rounded-full border border-border bg-bg text-ink-2 hover:border-teal hover:text-teal-700 hover:bg-teal-50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-sm text-ink-3" role="status">
                Nenhum resultado para <strong className="text-ink">&quot;{query}&quot;</strong>.
              </div>
            ) : (
              <ul ref={listRef} id="busca-lista" role="listbox" aria-label="Resultados" className="list-none m-0 p-2 max-h-[60vh] overflow-y-auto overscroll-contain">
                {results.map((r, i) => (
                  <li
                    key={r.id}
                    id={`busca-opt-${i}`}
                    data-idx={i}
                    role="option"
                    aria-selected={highlight === i}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => go(r.url)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${
                      highlight === i ? 'bg-teal-50' : 'hover:bg-teal-50'
                    }`}
                  >
                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border flex-shrink-0 ${TYPE_COLORS[r.type]}`}>
                      {TYPE_LABELS[r.type]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm text-ink truncate">{r.title}</div>
                      {r.subtitle && (
                        <div className="text-xs text-ink-3 truncate">{r.subtitle}</div>
                      )}
                    </div>
                    <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-ink-3 flex-shrink-0">
                      <path d="M5 10h10M10 5l5 5-5 5" />
                    </svg>
                  </li>
                ))}
              </ul>
            )}

            <div className="px-4 py-2.5 border-t border-border bg-bg flex items-center justify-between text-xs text-ink-3">
              <div className="hidden sm:flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="inline-flex items-center px-1.5 h-5 rounded border border-border font-mono bg-surface">↑↓</kbd>
                  navegar
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="inline-flex items-center px-1.5 h-5 rounded border border-border font-mono bg-surface">↵</kbd>
                  abrir
                </span>
              </div>
              <span role="status">{results.length > 0 ? `${results.length} resultado${results.length > 1 ? 's' : ''}` : ''}</span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
}
