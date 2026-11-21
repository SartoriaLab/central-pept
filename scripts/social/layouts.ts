// Tipos de slide: quem escreve escolhe o que combina com o conteúdo, e o carrossel ganha ritmo
// (nem todo slide é título + parágrafo). Convenções de título/corpo por tipo em LAYOUT_HINTS.

export const LAYOUTS = ['padrao', 'mito', 'passos', 'lado', 'numero', 'pergunta'] as const;
export type SlideLayout = (typeof LAYOUTS)[number];

export const LAYOUT_HINTS: Record<SlideLayout, string> = {
  padrao: 'título + uma ideia no corpo',
  mito: 'título = a frase errada que todo mundo repete (sem "Mito:"); corpo = a verdade',
  passos: 'título = o que fazer; corpo = 2 a 4 passos curtos, um por linha (separados por \\n), sem numerar',
  lado: 'título = o que se compara; corpo = exatamente 2 linhas (separadas por \\n), cada uma "Nome: texto curto"',
  numero: 'título = só o número com a unidade ou expressão curta, até 14 caracteres (ex.: "28 dias"); corpo = o que ele significa',
  pergunta: 'título = a pergunta que a pessoa faz (terminando em "?"); corpo = a resposta direta',
};

export const NUMBER_TITLE_MAX = 14;

/** Selo do topo do slide, por tipo (o padrão usa o do tema). */
export const LAYOUT_TAG: Partial<Record<SlideLayout, string>> = {
  mito: 'mito ou verdade', passos: 'passo a passo', lado: 'lado a lado', numero: 'o número', pergunta: 'a pergunta',
};

/** Linhas não vazias do corpo (passos e lado a lado). */
export function lines(body: string): string[] {
  return body.split('\n').map((l) => l.trim()).filter(Boolean);
}

/** "Nome: texto" → { label, text }. */
export function sides(body: string): { label: string; text: string }[] {
  return lines(body).map((l) => {
    const i = l.indexOf(':');
    return i > 0 ? { label: l.slice(0, i).trim(), text: l.slice(i + 1).trim() } : { label: '', text: l };
  });
}

/** Problemas de forma de um slide para o tipo escolhido (vazio = ok). */
export function layoutProblems(n: number, s: { title: string; body: string; layout?: SlideLayout }): string[] {
  const p: string[] = [];
  const at = `slide ${n} (${s.layout})`;
  switch (s.layout) {
    case 'passos': {
      const k = lines(s.body).length;
      if (k < 2 || k > 4) p.push(`${at}: corpo com ${k} linha(s); use 2 a 4 passos separados por \\n`);
      break;
    }
    case 'lado': {
      const sd = sides(s.body);
      if (sd.length !== 2 || sd.some((x) => !x.label || !x.text)) p.push(`${at}: corpo precisa de 2 linhas no formato "Nome: texto"`);
      break;
    }
    case 'numero':
      if (s.title.length > NUMBER_TITLE_MAX) p.push(`${at}: título com ${s.title.length} caracteres (até ${NUMBER_TITLE_MAX}: só o número)`);
      break;
    case 'pergunta':
      if (!s.title.trim().endsWith('?')) p.push(`${at}: título precisa terminar em "?"`);
      break;
    case 'mito':
      if (/^mito\b/i.test(s.title.trim())) p.push(`${at}: tire o "Mito" do título (o selo já diz)`);
      break;
  }
  return p;
}
