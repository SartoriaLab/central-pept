'use client';

// Pergunta obrigatória antes do resultado da calculadora de reconstituição: a pessoa responde
// (1 toque, certo ou errado) e o resultado aparece. Usa os números que ela digitou. A resposta
// vira o primeiro bloco da oferta do guia (FrascoFeedback).

import type { FrascoQuiz as Quiz, QuizAnswer } from '@/lib/quiz-frasco';
import { fmtMg } from '@/lib/quiz-frasco';

type Props = {
  quiz: Quiz;
  peptideName?: string;
  onAnswer: (answer: QuizAnswer) => void;
};

function fmtMl(n: number): string {
  return `${(Math.round(n * 100) / 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ml`;
}

export default function FrascoQuiz({ quiz, peptideName, onAnswer }: Props) {
  return (
    <section
      className="no-print overflow-hidden rounded-2xl bg-[linear-gradient(140deg,#0f2f2d_0%,#134e4a_60%,#115e59_100%)] p-5 text-white shadow-xl ring-1 ring-black/10 animate-slide-up"
      aria-labelledby="quiz-frasco-titulo"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-100">
          <svg viewBox="0 0 20 20" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
            <rect x="4" y="9" width="12" height="8" rx="1.5" />
            <path d="M7 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          Seu cálculo está pronto
        </p>
        <span className="select-none text-2xl font-extrabold tracking-tight text-white/80 blur-[6px]" aria-hidden>
          88,8 U
        </span>
      </div>

      <h2 id="quiz-frasco-titulo" className="mt-4 text-xl font-extrabold leading-tight sm:text-2xl">
        Antes de ver: você entende o <span className="text-amber-300">seu</span> frasco?
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-white/85">
        Você colocou <strong className="text-white">{fmtMg(quiz.vialMg)}</strong> de {peptideName ?? 'peptídeo'} em{' '}
        <strong className="text-white">{fmtMl(quiz.waterMl)}</strong> de água. Quanto de peptídeo tem em{' '}
        <strong className="text-white">10 unidades</strong> da seringa (0,1 ml)?
      </p>

      <div className="mt-4 grid gap-2.5" role="group" aria-label="Respostas">
        {quiz.options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onAnswer(o.correct ? 'certa' : 'errada')}
            className="flex h-14 w-full items-center justify-between rounded-xl bg-white px-4 text-left text-lg font-extrabold text-slate-900 shadow-md transition hover:-translate-y-0.5 hover:bg-amber-50 active:translate-y-0"
          >
            {o.label}
            <span className="text-sm font-bold text-slate-400" aria-hidden>→</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => onAnswer('nao-sei')}
          className="h-12 w-full rounded-xl border border-white/30 text-base font-bold text-white/90 transition hover:bg-white/10"
        >
          Não sei
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-white/65">
        Toque numa resposta para liberar o resultado. Ele aparece na hora.
      </p>
    </section>
  );
}

/** Resposta da pergunta, no topo da oferta do guia. */
export function FrascoFeedback({ quiz, answer }: { quiz: Quiz; answer: QuizAnswer }) {
  const correct = answer === 'certa';
  const conc = `${(Math.round(quiz.concentration * 1000) / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 3 })} mg/ml`;
  return (
    <div
      className={`mb-5 rounded-xl border-l-4 px-4 py-3 text-sm leading-relaxed ${
        correct ? 'border-emerald-400 bg-emerald-400/15 text-emerald-50' : answer === 'nao-sei'
            ? 'border-amber-400 bg-amber-400/15 text-amber-50'
            : 'border-rose-400 bg-rose-400/15 text-rose-50'
      }`}
      role="status"
    >
      {correct ? (
        <>
          <strong className="block text-base text-white">✓ Acertou: {fmtMg(quiz.answerMg)}.</strong>
          10 unidades são 0,1 ml, e cada ml tem {conc}. A conta você domina. Os 7 erros do guia são os que a conta não pega:
          unidade lida como mg, vírgula entre mcg e mg, água esquecida no frasco seguinte, bolha, seringa errada…
        </>
      ) : (
        <>
          <strong className="block text-base text-white">
            {answer === 'nao-sei' ? `A resposta: ${fmtMg(quiz.answerMg)}.` : `✗ Seriam ${fmtMg(quiz.answerMg)}.`}
          </strong>
          10 unidades são 0,1 ml, e cada ml tem {conc} ({fmtMg(quiz.vialMg)} ÷ {fmtMl(quiz.waterMl)}). Confundir o que tem no
          frasco com o que tem em cada ml muda a dose sem nada parecer errado. O guia mostra essa e as outras armadilhas de
          leitura, cada uma com a conta do desvio.
        </>
      )}
    </div>
  );
}
