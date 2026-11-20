/**
 * Meta description dentro do que o Google mostra no resultado (~160 caracteres). Texto maior é
 * cortado pelo Google no meio da palavra; aqui o corte fica no fim de uma frase quando ela
 * termina depois da metade do limite, senão na última palavra inteira, com reticências.
 */
export function clipDescription(text: string, max = 160): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;

  // Fim de frase: pontuação seguida de espaço (não pega "1.5" nem "0,25").
  const head = t.slice(0, max + 1);
  let sentenceEnd = -1;
  for (const m of head.matchAll(/[.!?](?=\s)/g)) sentenceEnd = m.index;
  if (sentenceEnd >= max / 2) return head.slice(0, sentenceEnd + 1);

  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const words = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${words.replace(/[\s,;:(–—-]+$/, '')}…`;
}
