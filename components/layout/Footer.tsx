import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-border bg-surface mt-16 no-print">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] text-sm">
        <div>
          <Image
            src="/logo.png"
            alt="Central Peptídeos"
            width={384}
            height={256}
            sizes="180px"
            loading="lazy"
            className="h-10 w-auto dark:bg-white keep-white dark:rounded-md dark:p-1 mb-3"
          />
          <p className="text-ink-2 leading-relaxed max-w-md">
            Central brasileira de informação sobre peptídeos. Calculadoras,
            enciclopédia e guias — gratuito, sem cadastro, código aberto.
          </p>
        </div>

        <div>
          <div className="font-bold text-ink mb-3 uppercase text-xs tracking-wider">Ferramentas</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/ferramentas/reconstituicao" className="hover:text-teal-700">Reconstituição</Link></li>
            <li><Link href="/ferramentas/mistura" className="hover:text-teal-700">Mistura</Link></li>
            <li><Link href="/ferramentas/conversor" className="hover:text-teal-700">Conversor</Link></li>
            <li><Link href="/ferramentas/cronograma" className="hover:text-teal-700">Cronograma</Link></li>
            <li><Link href="/ferramentas/titulacao" className="hover:text-teal-700">Subida de Dose GLP-1</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-ink mb-3 uppercase text-xs tracking-wider">Conteúdo</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/peptideos" className="hover:text-teal-700">Enciclopédia</Link></li>
            <li><Link href="/comparar" className="hover:text-teal-700">Comparador</Link></li>
            <li><Link href="/blog" className="hover:text-teal-700">Blog</Link></li>
            <li><Link href="/glossario" className="hover:text-teal-700">Glossário</Link></li>
            <li>
              <Link href="/ebook/retatrutida-estrategias" className="hover:text-teal-700">
                Ebook Retatrutida
              </Link>
            </li>
            <li>
              <Link href="/ebook/ghk-cu-pele" className="hover:text-teal-700 inline-flex items-center gap-1">
                Ebook GHK-Cu
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">novo</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-ink mb-3 uppercase text-xs tracking-wider">Tirzepatida</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/peptideos/tirzepatida" className="hover:text-teal-700">Ficha completa</Link></li>
            <li><Link href="/blog/onde-comprar-tirzepatida" className="hover:text-teal-700">Onde comprar</Link></li>
            <li><Link href="/blog/tirzepatida-preco-quanto-custa" className="hover:text-teal-700">Quanto custa</Link></li>
            <li><Link href="/blog/como-reconstituir-tirzepatida" className="hover:text-teal-700">Como reconstituir</Link></li>
            <li><Link href="/blog/mounjaro-falso-como-identificar" className="hover:text-teal-700">Mounjaro falso</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-ink mb-3 uppercase text-xs tracking-wider">Institucional</div>
          <ul className="space-y-2 text-ink-2">
            <li><Link href="/sobre" className="hover:text-teal-700">Sobre</Link></li>
            <li><Link href="/metodologia" className="hover:text-teal-700">Metodologia</Link></li>
            <li><Link href="/contato" className="hover:text-teal-700">Contato</Link></li>
            <li><Link href="/privacidade" className="hover:text-teal-700">Privacidade</Link></li>
            <li><Link href="/termos" className="hover:text-teal-700">Termos</Link></li>
            <li>
              <a href="/feed.xml" className="hover:text-teal-700 inline-flex items-center gap-1">
                RSS
                <svg viewBox="0 0 20 20" width={11} height={11} fill="currentColor" aria-hidden>
                  <path d="M3.5 3.5v3A10 10 0 0 1 13.5 16.5h3A13 13 0 0 0 3.5 3.5zm0 5v3a5 5 0 0 1 5 5h3a8 8 0 0 0-8-8zm2 6.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-3">
          <p className="text-center md:text-left leading-relaxed">
            Conteúdo informativo — não substitui orientação médica.
            Uso sob responsabilidade do usuário.
          </p>
          <p className="tabular-nums">© {new Date().getFullYear()} Central Peptídeos</p>
        </div>
      </div>
    </footer>
  );
}
