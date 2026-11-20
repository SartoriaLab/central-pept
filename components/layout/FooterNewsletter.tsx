'use client';

import { usePathname } from 'next/navigation';
import NewsletterSignup from '@/components/ui/NewsletterSignup';

// Fora de onde já existe o bloco grande (home, blog), do fim dos artigos (bloco próprio) e das
// páginas de venda e legais, onde o formulário só tiraria a atenção do que a pessoa veio fazer.
const HIDDEN = /^\/($|blog(\/|$)|ebooks(\/|$)|tabela-personalizada|links|newsletter|admin|termos|privacidade|contato)/;

/** Convite da newsletter no topo do rodapé: o formulário chega às calculadoras e fichas. */
export default function FooterNewsletter() {
  const pathname = usePathname() || '/';
  if (HIDDEN.test(pathname)) return null;
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-12">
      <div className="max-w-2xl">
        <NewsletterSignup
          variant="compact"
          via="rodape"
          title="Receba os próximos guias por email"
          text="Mudança de bula, regra nova da Anvisa e guias práticos, a cada 2-3 semanas. Sem spam; cancele quando quiser."
        />
      </div>
    </div>
  );
}
