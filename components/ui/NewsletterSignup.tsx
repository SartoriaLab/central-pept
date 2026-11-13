'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { NEWSLETTER_CONSENT } from '@/lib/newsletter';
import { EVENTS, track } from '@/lib/track';

export default function NewsletterSignup() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website, source: window.location.pathname }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error);
      setStatus('ok');
      setMessage('Pronto! Você vai receber os próximos artigos no seu email.');
      setEmail('');
      setConsent(false);
      track(EVENTS.newsletterSignup, { page: window.location.pathname });
    } catch (err) {
      setStatus('error');
      setMessage(
        err instanceof Error && err.message
          ? err.message
          : 'Não conseguimos enviar agora. Tente de novo em alguns minutos.'
      );
    }
  }

  return (
    <section className="card p-6 md:p-8 bg-gradient-to-br from-teal-50 to-surface">
      <div className="flex items-start gap-4">
        <span className="hidden sm:flex w-12 h-12 rounded-xl bg-teal text-white items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 4h16c1 0 2 1 2 2v12c0 1-1 2-2 2H4c-1 0-2-1-2-2V6c0-1 1-2 2-2z" />
            <path d="m22 7-10 7L2 7" />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-lg text-ink">Novos artigos direto no seu email</h2>
          <p className="text-sm text-ink-2 mt-1 leading-relaxed">
            Um email a cada 2-3 semanas com novos guias, comparações e atualizações
            regulatórias sobre peptídeos. <strong>Sem spam</strong> — cancele a
            qualquer momento.
          </p>
          <form onSubmit={submit} className="mt-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <label htmlFor={`${id}-email`} className="sr-only">Seu email</label>
              <input
                id={`${id}-email`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={status === 'loading'}
                autoComplete="email"
                className="input sm:flex-1 shrink-0 !h-12"
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email || !consent}
                className="btn-teal !h-12 disabled:opacity-60 whitespace-nowrap"
              >
                {status === 'loading' ? 'Enviando...' : 'Inscrever-se'}
              </button>
            </div>
            {/* Honeypot: fora da tela, ignorado por leitores de tela e pelo teclado */}
            <div aria-hidden className="absolute -left-[10000px] w-px h-px overflow-hidden">
              <label>
                Site
                <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>
            <label className="mt-3 flex items-start gap-2.5 text-sm text-ink-2 leading-snug cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-5 h-5 flex-shrink-0 accent-teal-700"
              />
              <span>
                {NEWSLETTER_CONSENT}{' '}
                <Link href="/privacidade" className="text-teal-700 underline">Como usamos seu email</Link>.
              </span>
            </label>
          </form>
          <p
            role={status === 'error' ? 'alert' : 'status'}
            className={`text-sm mt-2 empty:hidden ${status === 'error' ? 'text-red-700' : 'text-teal-700'}`}
          >
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
