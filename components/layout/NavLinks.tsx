'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { href: string; label: string };

// Links do cabeçalho no desktop, com a seção atual destacada (aria-current).
export default function NavLinks({ items }: { items: Item[] }) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={`px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors hover:text-teal-700 hover:bg-teal-50 ${
              active ? 'text-teal-700 bg-teal-50' : 'text-ink-2'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
