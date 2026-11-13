import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/lib/site';

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
          catalogar ou tem uma dúvida editorial? Fale com a gente pelo email abaixo.
        </p>
      </header>

      <section className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" />
              <path d="m22 7-10 7L2 7" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-lg text-ink">Email editorial</h2>
            <p className="text-sm text-ink-2 mt-1 leading-relaxed">
              Correções de conteúdo, sugestões de novos peptídeos, propostas de
              parceria ou revisão médica:
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-block text-base text-teal-700 font-semibold mt-2 break-all hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </section>

      <section className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 3a9 9 0 1 0 9 9M21 3v6h-6M3 9v6M12 7v5l3 3" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg text-ink">Como pedir uma correção</h2>
            <p className="text-sm text-ink-2 mt-1 leading-relaxed">
              Diga qual página tem o problema (cole o link), o que está errado e,
              se possível, a fonte que contradiz o conteúdo (bula, artigo no
              PubMed, nota da ANVISA). Correções de dados incorretos são
              prioridade.
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
        Respondemos sugestões e correções dentro de alguns dias úteis, sem prazo
        garantido.
      </p>
    </div>
  );
}
