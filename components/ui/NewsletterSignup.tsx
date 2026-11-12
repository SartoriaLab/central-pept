'use client';

import { useState } from 'react';

type Props = {
  variant?: 'compact' | 'card';
  // Endpoint externo. Funciona com Formspree, Brevo, MailerLite, ConvertKit, etc.
  // Deixe vazio (usa env NEXT_PUBLIC_NEWSLETTER_ENDPOINT) para plug-and-play sem código.
  endpoint?: string;
};

export default function NewsletterSignup({ variant = 'card', endpoint }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const url = endpoint || process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);

    if (!url) {
      // Sem endpoint configurado — só simula para não quebrar UX em dev
      setStatus('ok');
      setMessage('Inscrição recebida! Configure NEXT_PUBLIC_NEWSLETTER_ENDPOINT para envio real.');
      setEmail('');
      return;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, source: 'central-peptideos' }),
      });
      if (!res.ok) throw new Error();
      setStatus('ok');
      setMessage('Pronto! Vamos mandar conteúdo novo quando publicarmos.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Não conseguimos enviar agora. Tente de novo em alguns minutos.');
    }
  }

  if (variant === 'compact') {
    return (
      <form onSubmit={submit} className="flex gap-2 flex-col sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          disabled={status === 'loading'}
          className="flex-1 h-11 px-3.5 border-[1.5px] border-border-2 rounded bg-surface text-sm outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !email}
          className="btn-teal !h-11 disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando...' : 'Inscrever-se'}
        </button>
        {message && (
          <p className={`text-xs mt-1 ${status === 'error' ? 'text-red-700' : 'text-teal-700'}`}>{message}</p>
        )}
      </form>
    );
  }

  return (
    <section className="card p-6 md:p-8 bg-gradient-to-br from-teal-50 to-surface">
      <div className="flex items-start gap-4">
        <span className="w-12 h-12 rounded-xl bg-teal text-white flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" />
            <path d="m22 7-10 7L2 7" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-ink">Novos artigos direto no seu email</h3>
          <p className="text-sm text-ink-2 mt-1 leading-relaxed">
            Um email a cada 2-3 semanas com novos guias, comparações e atualizações
            regulatórias sobre peptídeos. <strong>Sem spam, sem marketing</strong> —
            cancele a qualquer momento.
          </p>
          <form onSubmit={submit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              disabled={status === 'loading'}
              className="flex-1 h-11 px-3.5 border-[1.5px] border-border-2 rounded bg-surface text-sm outline-none focus:border-teal focus:ring-[3px] focus:ring-teal-50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="btn-teal !h-11 disabled:opacity-60 whitespace-nowrap"
            >
              {status === 'loading' ? 'Enviando...' : 'Inscrever-se'}
              {status !== 'loading' && (
                <svg viewBox="0 0 20 20" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M4 10h12M10 4l6 6-6 6" />
                </svg>
              )}
            </button>
          </form>
          {message && (
            <p className={`text-xs mt-2 ${status === 'error' ? 'text-red-700' : 'text-teal-700'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
