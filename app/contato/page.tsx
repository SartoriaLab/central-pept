import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Canais de contato com a Central Peptídeos para correções, sugestões e questões editoriais.',
  alternates: { canonical: '/contato' },
};

export default function ContatoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Contato</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">
          Encontrou um erro, referência quebrada, quer sugerir um peptídeo para
          catalogar ou tem uma dúvida editorial? Use os canais abaixo.
        </p>
      </header>

      <section className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3a9 9 0 1 0 9 9M21 3v6h-6M3 9v6M12 7v5l3 3" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg text-ink">Correção de conteúdo</h2>
            <p className="text-sm text-ink-2 mt-1 leading-relaxed">
              Se alguma informação está incorreta ou desatualizada, o caminho mais
              rápido é abrir uma <em>issue</em> no repositório do projeto. Descreva
              o problema e, se possível, inclua a fonte que contradiz o conteúdo.
            </p>
            <p className="text-sm text-ink-3 mt-3">
              <em>Link do GitHub a definir quando o projeto for publicado.</em>
            </p>
          </div>
        </div>
      </section>

      <section className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" />
              <path d="m22 7-10 7L2 7" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg text-ink">Email editorial</h2>
            <p className="text-sm text-ink-2 mt-1 leading-relaxed">
              Para sugestões de novos peptídeos, propostas de parceria ou revisão
              médica, escreva para:
            </p>
            <p className="text-sm text-teal-700 font-semibold mt-2">
              contato@centralpeptideos.com.br <span className="text-ink-3 font-normal italic">(a configurar)</span>
            </p>
          </div>
        </div>
      </section>

      <section className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 9v4M12 17h.01M10.3 3.9 2.5 17.5A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg text-ink">Urgências médicas</h2>
            <p className="text-sm text-ink-2 mt-1 leading-relaxed">
              Este site <strong>não oferece atendimento médico</strong>. Em caso de
              reação adversa a peptídeo ou qualquer suspeita de dano à saúde,
              procure imediatamente um pronto-socorro ou ligue para a central
              SAMU (192). Reações graves podem ser reportadas à ANVISA pelo
              sistema Notivisa.
            </p>
          </div>
        </div>
      </section>

      <p className="text-xs text-ink-3 mt-8 leading-relaxed">
        Respondemos sugestões e correções dentro de alguns dias úteis. Por sermos um
        projeto mantido por voluntários, não garantimos resposta em prazo definido.
      </p>
    </div>
  );
}
