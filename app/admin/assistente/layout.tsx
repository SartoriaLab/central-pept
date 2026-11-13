import Link from 'next/link';
import type { ReactNode } from 'react';

const NAV = [
  { href: '/admin/assistente', label: 'Grupos' },
  { href: '/admin/assistente/templates', label: 'Templates' },
  { href: '/admin/assistente/duvidas', label: 'Dúvidas' },
  { href: '/admin/assistente/metricas', label: 'Métricas' },
  { href: '/admin/utm', label: 'UTM Builder' },
];

export default function AssistenteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-6">
        <span className="font-semibold text-sm text-gray-900">Assistente</span>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
