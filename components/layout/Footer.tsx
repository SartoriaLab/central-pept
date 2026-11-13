import Link from 'next/link';
import Image from 'next/image';
import { TOOLS } from '@/lib/tools';

export default function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-border bg-surface mt-16 no-print">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] text-sm">
        <div>
          <Image
            src="/logo.webp"
            alt="Central Peptídeos"
            width={400}
            height={128}
            unoptimized
            sizes="180px"
            loading="lazy"
            className="h-10 w-auto dark:[filter:brightness(1.45)_saturate(1.1)] mb-3"
          />
          <p className="text-ink-2 leading-relaxed max-w-md">
            Central brasileira de informação sobre peptídeos. Calculadoras,
            enciclopédia e guias — gratuito, sem cadastro, com fontes.
          </p>
        </div>

        <div>
          <div className="font-bold text-ink mb-1.5 uppercase text-xs tracking-wider">Ferramentas</div>
          <ul className="text-ink-2">
            {TOOLS.map((t) => (
              <li key={t.slug}><Link href={`/ferramentas/${t.slug}`} className="inline-block py-1.5 hover:text-teal-700">{t.shortTitle}</Link></li>
            ))}
            <li><Link href="/seringas" className="inline-block py-1.5 hover:text-teal-700">Como ler a seringa</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-ink mb-1.5 uppercase text-xs tracking-wider">Conteúdo</div>
          <ul className="text-ink-2">
            <li><Link href="/peptideos" className="inline-block py-1.5 hover:text-teal-700">Enciclopédia</Link></li>
            <li><Link href="/medicamentos" className="inline-block py-1.5 hover:text-teal-700">Mounjaro, Ozempic e Wegovy</Link></li>
            <li><Link href="/peptideos/categoria/emagrecimento" className="inline-block py-1.5 hover:text-teal-700">Peptídeos para emagrecer</Link></li>
            <li><Link href="/peptideos/categoria/meia-vida" className="inline-block py-1.5 hover:text-teal-700">Meia-vida dos peptídeos</Link></li>
            <li><Link href="/peptideos/categoria/proibidos-no-esporte" className="inline-block py-1.5 hover:text-teal-700">Proibidos no esporte</Link></li>
            <li><Link href="/comparar" className="inline-block py-1.5 hover:text-teal-700">Comparador</Link></li>
            <li><Link href="/blog" className="inline-block py-1.5 hover:text-teal-700">Blog</Link></li>
            <li><Link href="/glossario" className="inline-block py-1.5 hover:text-teal-700">Glossário</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-ink mb-1.5 uppercase text-xs tracking-wider">Tirzepatida</div>
          <ul className="text-ink-2">
            <li><Link href="/peptideos/tirzepatida" className="inline-block py-1.5 hover:text-teal-700">Ficha completa</Link></li>
            <li><Link href="/medicamentos/mounjaro" className="inline-block py-1.5 hover:text-teal-700">Mounjaro</Link></li>
            <li><Link href="/blog/efeitos-colaterais-tirzepatida" className="inline-block py-1.5 hover:text-teal-700">Efeitos colaterais</Link></li>
            <li><Link href="/blog/onde-comprar-tirzepatida" className="inline-block py-1.5 hover:text-teal-700">Onde comprar</Link></li>
            <li><Link href="/blog/tirzepatida-preco-quanto-custa" className="inline-block py-1.5 hover:text-teal-700">Quanto custa</Link></li>
            <li><Link href="/blog/como-reconstituir-tirzepatida" className="inline-block py-1.5 hover:text-teal-700">Como reconstituir</Link></li>
            <li><Link href="/blog/mounjaro-falso-como-identificar" className="inline-block py-1.5 hover:text-teal-700">Mounjaro falso</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-ink mb-1.5 uppercase text-xs tracking-wider">Institucional</div>
          <ul className="text-ink-2">
            <li><Link href="/sobre" className="inline-block py-1.5 hover:text-teal-700">Sobre</Link></li>
            <li><Link href="/metodologia" className="inline-block py-1.5 hover:text-teal-700">Metodologia</Link></li>
            <li><Link href="/contato" className="inline-block py-1.5 hover:text-teal-700">Contato</Link></li>
            <li><Link href="/privacidade" className="inline-block py-1.5 hover:text-teal-700">Privacidade</Link></li>
            <li><Link href="/termos" className="inline-block py-1.5 hover:text-teal-700">Termos</Link></li>
            <li>
              <a href="/feed.xml" className="py-1.5 hover:text-teal-700 inline-flex items-center gap-1">
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
