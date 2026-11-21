// Pergunta "você entende seu frasco?" mostrada antes do resultado da calculadora de
// reconstituição. Usa os números da própria pessoa: quanto peptídeo há em 10 unidades
// (0,1 ml) da seringa U-100. As opções erradas são os erros reais de leitura do frasco.

/** Resposta da pessoa: acertou, errou ou tocou em "Não sei". */
export type QuizAnswer = 'certa' | 'errada' | 'nao-sei';

export type QuizOption = { mg: number; label: string; correct: boolean };

export type FrascoQuiz = {
  vialMg: number;
  waterMl: number;
  concentration: number;
  /** mg em 0,1 ml (10 unidades). */
  answerMg: number;
  options: QuizOption[];
};

/** mg com até 3 casas, sem zeros à direita, vírgula decimal ("0,25 mg"). */
export function fmtMg(n: number): string {
  const v = Math.round(n * 1000) / 1000;
  return `${v.toLocaleString('pt-BR', { maximumFractionDigits: 3 })} mg`;
}

/** Hash simples e estável para embaralhar sempre igual para a mesma entrada. */
function seed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function buildFrascoQuiz(vialMg: number, waterMl: number): FrascoQuiz | null {
  if (!(vialMg > 0) || !(waterMl > 0) || !Number.isFinite(vialMg) || !Number.isFinite(waterMl)) return null;
  const concentration = vialMg / waterMl;
  const answerMg = concentration * 0.1;

  // Erros de leitura, na ordem de quão comuns são:
  //  - tratar os mg do frasco como se fossem mg por ml (ignora a água);
  //  - ler a concentração (por ml) como se fosse o que há em 10 unidades;
  //  - errar a vírgula para baixo (10 unidades = 0,01 ml);
  //  - achar que 10 unidades são o frasco inteiro.
  const wrong = [vialMg * 0.1, concentration, concentration * 0.01, vialMg];

  const correctLabel = fmtMg(answerMg);
  const options: QuizOption[] = [{ mg: answerMg, label: correctLabel, correct: true }];
  for (const mg of wrong) {
    const label = fmtMg(mg);
    if (mg <= 0 || options.some((o) => o.label === label)) continue;
    options.push({ mg, label, correct: false });
    if (options.length === 3) break;
  }
  if (options.length < 3) return null;

  // Posição da certa muda com a entrada, mas é estável (não pula a cada render).
  const k = seed(`${vialMg}|${waterMl}`) % 3;
  const [c, ...rest] = options;
  rest.splice(k > rest.length ? rest.length : k, 0, c);

  return { vialMg, waterMl, concentration, answerMg, options: rest };
}

/** Pergunta do frasco (opcional, abaixo do resultado) na reconstituição. false desliga no site todo. */
export const QUIZ_GATE_ENABLED = true;

/** sessionStorage: respondeu nesta visita, não pergunta de novo. */
export const QUIZ_KEY = 'cp:quiz-frasco';
