'use client';

// Pergunta do frasco na calculadora de reconstituição, com os números que a pessoa digitou.
// Opcional: o resultado aparece antes. A resposta vira o primeiro bloco da oferta (FrascoFeedback).

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

// Teste opcional no topo da oferta do resultado (painel escuro). O número já está na tela acima;
// a pergunta não trava nada. Respondida, vira o FrascoFeedback no mesmo lugar.
export default function FrascoQuiz({ quiz, peptideName, onAnswer }: Props) {
  const of = peptideName ? ` de ${peptideName}` : '';
  return (
    <section className="no-print mb-5 rounded-xl border border-white/15 bg-white/5 p-4" aria-labelledby="quiz-frasco-titulo">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#facc15]">Teste rápido · 1 toque</p>
      <h2 id="quiz-frasco-titulo" className="mt-1.5 text-lg font-black leading-tight text-white sm:text-xl">
        Você entende o <span className="text-[#facc15]">seu</span> frasco{of}?
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/85">
        <strong className="text-white">{fmtMg(quiz.vialMg)}</strong> em <strong className="text-white">{fmtMl(quiz.waterMl)}</strong> de
        água. Quanto de peptídeo tem em <strong className="text-white">10 unidades</strong> da seringa (0,1 ml)?
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Respostas">
        {quiz.options.map((o) => (
          <button
            key={o.label}
            type="button"
            onClick={() => onAnswer(o.correct ? 'certa' : 'errada')}
            className="keep-white h-12 rounded-lg bg-white px-3 text-base font-extrabold text-slate-900 shadow-md transition hover:-translate-y-0.5 hover:bg-[#fef9c3] active:translate-y-0"
          >
            {o.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onAnswer('nao-sei')}
          className="h-12 rounded-lg border border-white/30 px-3 text-base font-bold text-white/90 transition hover:bg-white/10"
        >
          Não sei
        </button>
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
