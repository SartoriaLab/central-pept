// Nota de viralidade do gancho (0 a 100), pelos padrões dos Reels do nicho que mais passaram da
// mediana da própria conta (levantamento de 21/11/2026: 85 Reels de 17 perfis de GLP-1 com
// views, 257 posts de busca com curtidas). Puro. Não barra nada: ordena e avisa (`--check`).
//
// Views do Reels ÷ mediana da conta, com o padrão vs sem:
//   marca (Mounjaro/Ozempic) no gancho  38x vs 0,7x (n=5; busca "mounjaro": 6.952 curtidas
//                                       medianas vs 2.699 de "tirzepatida")
//   moldura de erro ("não é", "erro")   3,1x vs 0,7x (n=4)
//   pergunta                            1,5x vs 0,7x (n=17)
//   até 10 palavras                     0,9x vs 0,7x (n=51)
// Amostras pequenas: são pesos para ordenar, não previsão de views.

const BRAND = /\b(mounjaro|ozempic|wegovy|zepbound|saxenda)\b/i;
const MOLECULE = /\b(tirzepatida|semaglutida|retatrutida|liraglutida)\b/i;
// \b do JS não vê letra acentuada ("você", "é"): fronteira por \p{L}.
const ERROR_FRAME = /(?<!\p{L})(err(o|os|ando|ado)|n[ãa]o (é|faça|use|aplique|suba)|pare de|nunca|ningu[ée]m (confere|sabe|fala))(?!\p{L})|(?<!\p{L})n[ãa]o\.\s*$/iu;
const YOU = /(?<!\p{L})(voc[êe]|seu|sua|te)(?!\p{L})/iu;
const GREETING = /^(oi|ol[áa]|e a[íi]|bom dia|boa (tarde|noite)|gente)\b/i;

export type HookScore = { score: number; hits: string[]; tips: string[] };

export function hookScore(hook: string): HookScore {
  const h = hook.trim();
  const words = h.split(/\s+/).filter(Boolean).length;
  const hits: string[] = [];
  const tips: string[] = [];
  let score = 20;
  if (BRAND.test(h)) {
    score += 35;
    hits.push('marca');
  } else if (MOLECULE.test(h)) {
    score += 10;
    tips.push('troque a molécula pela marca que a pessoa busca (Mounjaro, Ozempic), se o assunto for o mesmo remédio');
  }
  if (/\?/.test(h)) {
    score += 15;
    hits.push('pergunta');
  } else tips.push('abra com pergunta que a pessoa faria');
  if (ERROR_FRAME.test(h)) {
    score += 15;
    hits.push('erro/não');
  }
  if (YOU.test(h)) {
    score += 5;
    hits.push('fala com a pessoa');
  }
  if (words <= 10) {
    score += 10;
    hits.push('curto');
  } else tips.push(`corte para até 10 palavras (tem ${words})`);
  if (GREETING.test(h)) {
    score -= 30;
    tips.push('nada de cumprimento no gancho');
  }
  return { score: Math.max(0, Math.min(100, score)), hits, tips };
}
