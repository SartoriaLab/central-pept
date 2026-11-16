// Ilustrações 3D dos slides e do Reels: Fluent Emoji da Microsoft (licença MIT, sem crédito),
// em scripts/social/illustrations/<chave>.png. A IA escolhe uma chave por slide; a descrição
// ajuda na escolha. Nova ilustração = PNG na pasta + linha aqui.
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const ILLUSTRATIONS = {
  seringa: 'seringa, unidades, preparo, reconstituição',
  comprimido: 'comprimido, remédio oral',
  estetoscopio: 'médico, consulta, orientação',
  calendario: 'semanas, calendário, dia fixo, prazo',
  relogio: 'horário, lembrete, dose esquecida',
  ampulheta: 'tempo de efeito, espera, meia-vida',
  alerta: 'cuidado, erro comum, risco',
  certo: 'o que fazer, resumo, correto',
  errado: 'o que não fazer, mito',
  proibido: 'proibido, nunca faça',
  enjoo: 'náusea, enjoo',
  vomito: 'vômito, efeito gastrointestinal forte',
  termometro: 'febre, sintoma',
  gota: 'água, hidratação, líquido, diluição',
  frasco: 'frasco, ampola, pó liofilizado',
  microscopio: 'estudo, pesquisa, ciência',
  dna: 'genética, células, telômeros',
  cerebro: 'cérebro, foco, apetite, ansiedade',
  coracao: 'coração, cardiovascular',
  musculo: 'músculo, força, massa magra',
  prato: 'refeição, alimentação, porções',
  salada: 'dieta, comida leve',
  bebida: 'bebida, álcool, líquidos',
  gelo: 'conservação no frio',
  geladeira: 'geladeira, armazenamento, temperatura',
  balanca: 'comparação, equilíbrio, prós e contras',
  'grafico-sobe': 'aumento, subida de dose, resultado em estudo',
  'grafico-desce': 'queda, perda de peso em estudo, redução',
  lampada: 'dica, ideia',
  lupa: 'conferir, rótulo, identificar falsificação',
  prancheta: 'bula, protocolo, checklist',
  livros: 'explicação, guia, referência',
  escudo: 'segurança, proteção',
  hospital: 'atendimento, emergência, sinais de alerta',
  sono: 'sono, descanso',
  pensando: 'dúvida comum, reflexão',
  duvida: 'pergunta, mito ou verdade',
  fogo: 'metabolismo, gordura, queima',
  brilho: 'pele, colágeno, estética',
  alvo: 'objetivo, meta, dose certa',
  osso: 'osso, articulação, tendão, lesão',
  pulmao: 'respiração, pulmão',
  regua: 'medida, conta, concentração',
  pele: 'pele, creme, uso tópico',
  lua: 'noite, horário de dormir',
} as const;

export type Illustration = keyof typeof ILLUSTRATIONS;
export const ILLUSTRATION_KEYS = Object.keys(ILLUSTRATIONS) as [Illustration, ...Illustration[]];

const DIR = path.join(process.cwd(), 'scripts', 'social', 'illustrations');
const cache = new Map<Illustration, string>();

/** PNG como data URI para o <img> do satori. */
export function illustrationSrc(key: Illustration): string {
  let src = cache.get(key);
  if (!src) {
    src = `data:image/png;base64,${readFileSync(path.join(DIR, `${key}.png`)).toString('base64')}`;
    cache.set(key, src);
  }
  return src;
}

export function isIllustration(key: string | undefined): key is Illustration {
  return !!key && key in ILLUSTRATIONS;
}
