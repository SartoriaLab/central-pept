'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string };

// Menu do celular/tablet: fecha ao navegar, ao tocar fora e com Esc.
export default function MobileMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); }
    }
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="menu-celular"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        className="w-10 h-10 flex items-center justify-center rounded-md text-ink-2 hover:bg-teal-50 hover:text-teal-700"
      >
        <svg viewBox="0 0 20 20" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
          {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
      </button>
      {open && (
        <nav
          id="menu-celular"
          aria-label="Navegação principal"
          className="absolute right-0 top-full mt-2 w-64 bg-surface border border-border rounded-xl shadow-xl p-1.5 animate-slide-up"
        >
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center min-h-11 px-3 text-base font-medium rounded-lg hover:bg-teal-50 hover:text-teal-700 ${
                  active ? 'text-teal-700 bg-teal-50' : 'text-ink'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="my-1 border-t border-border" />
          <Link
            href="/ferramentas/reconstituicao"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 min-h-11 px-3 text-sm font-bold text-white bg-teal-700 hover:bg-teal rounded-lg dark:text-bg"
          >
            Abrir calculadora
            <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 10h12M10 4l6 6-6 6" /></svg>
          </Link>
        </nav>
      )}
    </div>
  );
}
