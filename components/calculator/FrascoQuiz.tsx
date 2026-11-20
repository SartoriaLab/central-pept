'use client';

// Pergunta obrigatória antes do resultado da calculadora de reconstituição: a pessoa responde
// (1 toque, certo ou errado) e o resultado aparece. Usa os números que ela digitou. A resposta
// vira o primeiro bloco da oferta do guia (FrascoFeedback).
// Visual no tom do site (tokens de app/globals.css): cartão claro, mesmas cores da calculadora.

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

function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
      <rect x="4" y="9" width="12" height="8" rx="1.5" />
      <path d="M7 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

const OPTION =
  'flex w-full items-center justify-between rounded border-[1.5px] border-border-2 bg-surface px-4 text-left transition hover:border-teal hover:bg-teal-50';

// O cartão diz três coisas, nesta ordem: o resultado já está pronto, falta 1 toque, a pergunta.
export default function FrascoQuiz({ quiz, peptideName, onAnswer }: Props) {
  const of = peptideName ? ` de ${peptideName}` : '';
  return (
    <section
      className="no-print overflow-hidden rounded-xl border border-teal/30 bg-surface shadow-lg animate-slide-up"
      aria-labelledby="quiz-frasco-titulo"
    >
      {/* 1. O resultado já existe */}
      <div className="flex items-center gap-2.5 border-b border-teal/20 bg-teal-50 px-4 py-3" role="status">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white" aria-hidden>
          <svg viewBox="0 0 20 20" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10.5l4 4 8-9" />
          </svg>
        </span>
        <p className="text-base font-bold leading-tight text-ink">Seu resultado{of} está pronto</p>
      </div>

      <div className="p-5">
        {/* Prévia borrada do cartão de resultado (número de enfeite, não é o da pessoa) */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-bg px-4 py-4 text-center" aria-hidden>
          <div className="select-none blur-[7px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-3">Puxe até</div>
            <div className="mt-1 text-5xl font-extrabold leading-none tracking-tight text-teal">
              88,8 <span className="text-lg font-semibold text-ink-3">unidades</span>
            </div>
            <div className="mx-auto mt-3 h-4 w-4/5 rounded-full bg-border">
              <div className="h-4 w-1/2 rounded-full bg-teal" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-bold text-bg shadow-lg">
              <LockIcon /> Responda abaixo para ver
            </span>
          </div>
        </div>

        {/* 2. Falta 1 toque */}
        <p className="mt-5 text-xs font-semibold text-teal-700">Falta uma pergunta, um toque.</p>

        {/* 3. A pergunta */}
        <h2 id="quiz-frasco-titulo" className="mt-1 text-xl font-extrabold leading-tight text-ink sm:text-2xl">
          Você entende o seu frasco{of}?
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
          Você colocou <strong className="text-ink">{fmtMg(quiz.vialMg)}</strong> de {peptideName ?? 'peptídeo'} em{' '}
          <strong className="text-ink">{fmtMl(quiz.waterMl)}</strong> de água. Quanto de peptídeo tem em{' '}
          <strong className="text-ink">10 unidades</strong> da seringa (0,1 ml)?
        </p>

        <div className="mt-4 grid gap-2.5" role="group" aria-label="Respostas">
          {quiz.options.map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => onAnswer(o.correct ? 'certa' : 'errada')}
              className={`${OPTION} h-14 text-lg font-bold text-ink`}
            >
              {o.label}
              <span className="text-xs font-semibold text-ink-3" aria-hidden>ver resultado</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => onAnswer('nao-sei')}
            className={`${OPTION} h-12 text-base font-semibold text-ink-2`}
          >
            Não sei
            <span className="text-xs font-semibold text-ink-3" aria-hidden>ver resultado</span>
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-ink-3">
          Qualquer resposta libera o resultado na hora. Sem cadastro.
        </p>
      </div>
    </section>
  );
}

/** Resposta da pergunta, no topo da oferta do guia. */
export function FrascoFeedback({ quiz, answer }: { quiz: Quiz; answer: QuizAnswer }) {
  const correct = answer === 'certa';
  const conc = `${(Math.round(quiz.concentration * 1000) / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 3 })} mg/ml`;
  return (
    <div
      className={`mb-5 rounded-lg border px-4 py-3 text-sm leading-relaxed ${
        correct ? 'border-green-200 bg-green-50 text-green-800' : answer === 'nao-sei'
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-red-200 bg-red-50 text-red-800'
      }`}
      role="status"
    >
      {correct ? (
        <>
          <strong className="block text-base text-ink">Acertou: {fmtMg(quiz.answerMg)}.</strong>
          10 unidades são 0,1 ml, e cada ml tem {conc}. A conta você domina. Os 7 erros do guia são os que a conta não pega:
          unidade lida como mg, vírgula entre mcg e mg, água esquecida no frasco seguinte, bolha, seringa errada…
        </>
      ) : (
        <>
          <strong className="block text-base text-ink">
            {answer === 'nao-sei' ? `A resposta: ${fmtMg(quiz.answerMg)}.` : `Seriam ${fmtMg(quiz.answerMg)}.`}
          </strong>
          10 unidades são 0,1 ml, e cada ml tem {conc} ({fmtMg(quiz.vialMg)} ÷ {fmtMl(quiz.waterMl)}). Confundir o que tem no
          frasco com o que tem em cada ml muda a dose sem nada parecer errado. O guia mostra essa e as outras armadilhas de
          leitura, cada uma com a conta do desvio.
        </>
      )}
    </div>
  );
}
