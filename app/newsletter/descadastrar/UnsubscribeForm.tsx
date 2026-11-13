'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function UnsubscribeForm() {
  const token = useSearchParams().get('token');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  if (!token) {
    return (
      <p className="mt-6 text-ink-2" role="status">
        Link incompleto. Use o link de descadastro que veio no email.
      </p>
    );
  }

  async function confirm() {
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/descadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      setStatus(res.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return (
      <div className="mt-6 card p-5" role="status">
        <p className="font-semibold text-ink">Pronto, seu email saiu da lista.</p>
        <p className="mt-1 text-sm text-ink-2">
          As calculadoras continuam disponíveis.{' '}
          <Link href="/" className="text-teal-700 font-semibold hover:underline">Voltar ao início</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button type="button" onClick={confirm} disabled={status === 'loading'} className="btn-teal !h-12 disabled:opacity-60">
        {status === 'loading' ? 'Cancelando…' : 'Confirmar cancelamento'}
      </button>
      {status === 'error' && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          Não conseguimos cancelar agora. Tente de novo em alguns minutos.
        </p>
      )}
    </div>
  );
}
