import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

// Componentes disponíveis dentro dos posts em content/blog/*.mdx.
// O MDX roda com JavaScript bloqueado (next-mdx-remote): só props em texto, sem {expressões}.

/** Links internos viram <Link> (navegação sem recarregar); externos abrem em nova aba. */
function A({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  if (href.startsWith('/') || href.startsWith('#')) {
    return <Link href={href} {...rest}>{children}</Link>;
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" {...rest}>
      {children}
    </a>
  );
}

/** Tabela rolável no celular (markdown com | colunas | gera <table>). */
function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="overflow-x-auto my-6">
      <table {...props} className="!my-0" />
    </div>
  );
}

const TONES = {
  warn: 'bg-amber-50 border-amber-200 text-amber-900',
  danger: 'bg-red-50 border-red-200 text-red-900',
  info: 'bg-teal-50 border-teal-100 text-ink-2',
} as const;

/**
 * Caixa de destaque.
 * Uso no .mdx:  <Callout tone="warn" title="A distinção que importa">Texto com **negrito**.</Callout>
 * tone: warn (âmbar, padrão) · danger (vermelho) · info (teal)
 */
function Callout({ tone = 'warn', title, children }: { tone?: keyof typeof TONES; title?: string; children: ReactNode }) {
  const icon = tone === 'info' ? 'ℹ️' : '⚠️';
  return (
    <div className={`not-prose p-4 rounded-xl border my-6 text-sm leading-relaxed [&_a]:underline [&_a]:font-semibold [&_p]:inline ${TONES[tone] ?? TONES.warn}`}>
      {title && <strong>{icon} {title}:</strong>} {children}
    </div>
  );
}

export const mdxComponents = { a: A, table: Table, Callout, Link };
