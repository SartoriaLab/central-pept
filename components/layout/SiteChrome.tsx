'use client';

import { usePathname } from 'next/navigation';

/**
 * Esconde cabeçalho, rodapé e afins nas rotas /embed/*, que rodam dentro de iframe
 * em sites de terceiros e devem mostrar só a ferramenta.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/embed')) return null;
  return <>{children}</>;
}
