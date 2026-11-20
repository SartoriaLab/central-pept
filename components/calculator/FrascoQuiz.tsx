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

function LockIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
      <rect x="4" y="9" width="12" height="8" rx="1.5" />
      <path d="M7 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  );
}

// O cartão diz três coisas, nesta ordem: o resultado já está pronto, falta 1 toque, a pergunta.
export default function FrascoQuiz({ quiz, peptideName, onAnswer }: Props) {
  const of = peptideName ? ` de ${peptideName}` : '';
  return (
    <section
      className="no-print overflow-hidden rounded-2xl bg-[#0b1220] text-white shadow-2xl ring-1 ring-black/20 animate-slide-up"
      aria-labelledby="quiz-frasco-titulo"
    >
      {/* 1. O resultado já existe */}
      <div className="flex items-center gap-2.5 bg-[#16a34a] px-4 py-3" role="status">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center keep-white rounded-full bg-white text-base font-black text-[#16a34a]" aria-hidden>
          ✓
        </span>
        <p className="text-base font-black leading-tight sm:text-lg">Seu resultado{of} está pronto</p>
      </div>

      <div className="bg-[radial-gradient(120%_70%_at_50%_0%,#1e293b_0%,#0b1220_70%)] p-5">
        {/* Prévia borrada do cartão de resultado (número de enfeite, não é o da pessoa) */}
        <div className="keep-white relative overflow-hidden rounded-xl bg-white px-4 py-4 text-center" aria-hidden>
          <div className="select-none blur-[7px]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Puxe até</div>
            <div className="mt-1 text-5xl font-extrabold leading-none tracking-tight text-[#0f766e]">
              88,8 <span className="text-lg font-semibold text-slate-500">unidades</span>
            </div>
            <div className="mx-auto mt-3 h-4 w-4/5 rounded-full bg-slate-200">
              <div className="h-4 w-1/2 rounded-full bg-[#14b8a6]" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0b1220] px-4 py-2 text-sm font-black text-white shadow-lg">
              <LockIcon /> Responda abaixo para ver
            </span>
          </div>
        </div>

        {/* 2. Falta 1 toque */}
        <p className="mt-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#facc15]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#facc15] text-[11px] text-[#0b1220]" aria-hidden>
            1
          </span>
          Só 1 pergunta · 1 toque
        </p>

        {/* 3. A pergunta */}
        <h2 id="quiz-frasco-titulo" className="mt-2 text-xl font-black leading-tight sm:text-2xl">
          Você entende o <span className="text-[#facc15]">seu</span> frasco{of}?
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
              className="keep-white flex h-14 w-full items-center justify-between rounded-xl bg-white px-4 text-left text-lg font-extrabold text-slate-900 shadow-md transition hover:-translate-y-0.5 hover:bg-[#fef9c3] active:translate-y-0"
            >
              {o.label}
              <span className="text-xs font-bold text-slate-500" aria-hidden>ver resultado →</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => onAnswer('nao-sei')}
            className="flex h-12 w-full items-center justify-between rounded-xl border border-white/30 px-4 text-base font-bold text-white/90 transition hover:bg-white/10"
          >
            Não sei
            <span className="text-xs font-bold text-white/60" aria-hidden>ver resultado →</span>
          </button>
        </div>

        <p className="mt-3 text-center text-xs font-semibold text-white/75">
          Qualquer resposta libera o resultado na hora. Sem cadastro.
        </p>
      </div>
    </section>
  );
}

/**
 * Resposta da pergunta, no topo da oferta. `next` diz o que vem logo abaixo: o guia do frasco
 * ou a tabela com os números da pessoa (a frase final faz a ponte para a oferta certa).
 */
export function FrascoFeedback({ quiz, answer, next = 'guia' }: { quiz: Quiz; answer: QuizAnswer; next?: 'guia' | 'tabela' }) {
  const table = next === 'tabela';
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
          10 unidades são 0,1 ml, e cada ml tem {conc}. A conta você domina.{' '}
          {table
            ? 'O que costuma falhar é refazê-la de cabeça a cada aplicação e lembrar o dia de descartar o frasco.'
            : 'Os 7 erros do guia são os que a conta não pega: unidade lida como mg, vírgula entre mcg e mg, água esquecida no frasco seguinte, bolha, seringa errada…'}
        </>
      ) : (
        <>
          <strong className="block text-base text-white">
            {answer === 'nao-sei' ? `A resposta: ${fmtMg(quiz.answerMg)}.` : `✗ Seriam ${fmtMg(quiz.answerMg)}.`}
          </strong>
          10 unidades são 0,1 ml, e cada ml tem {conc} ({fmtMg(quiz.vialMg)} ÷ {fmtMl(quiz.waterMl)}). Confundir o que tem no
          frasco com o que tem em cada ml muda a dose sem nada parecer errado.{' '}
          {table
            ? 'Com os seus números numa folha, você confere em vez de refazer a conta a cada aplicação.'
            : 'O guia mostra essa e as outras armadilhas de leitura, cada uma com a conta do desvio.'}
        </>
      )}
    </div>
  );
}
