// Roteiro do dia pelo Claude: um rascunho serve para carrossel e Reels (slides, falas e
// legenda). A fonte vai na mensagem do usuário; o sistema é fixo (cacheável).
// Com ANTHROPIC_API_KEY usa a API; sem ela, o Claude Code instalado neste computador (`claude -p`,
// assinatura do usuário; para rodar agendado, CLAUDE_CODE_OAUTH_TOKEN do `claude setup-token`).
import { spawn } from 'node:child_process';
import os from 'node:os';
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod/v4';
import { LIMITS } from './validate';
import { ILLUSTRATIONS, ILLUSTRATION_KEYS } from './illustrations';
import { LAYOUTS, LAYOUT_HINTS } from './layouts';
import type { Draft, Topic } from './types';

export const MODEL = 'claude-opus-5-5';

const VialSchema = z.object({
  label: z.string().describe('Texto do rótulo, até 14 caracteres (ex.: "RETATRUTIDA", "???").'),
  note: z.string().optional().describe('Legenda curta embaixo do frasco, até 28 caracteres.'),
  liquid: z.enum(['claro', 'amarelo', 'po']).optional().describe('Conteúdo: claro (solução), amarelo, po (pó liofilizado).'),
});

/** Desenho do meio da cena (papel.tsx). anyOf: o validador de saída estruturada não aceita oneOf. */
const VisualSchema = z
  .union([
    z.object({ type: z.literal('frasco'), label: z.string(), liquid: z.enum(['claro', 'amarelo', 'po']).optional(), tag: z.string().optional().describe('Etiqueta pendurada, até 14 caracteres ("SEM REGISTRO").'), stamp: z.string().optional().describe('Carimbo vermelho por cima, até 18 caracteres ("NÃO APROVADO").') }),
    z.object({ type: z.literal('frascos'), left: VialSchema, right: VialSchema, sign: z.enum(['≠', 'vs', '+']) }),
    z.object({ type: z.literal('numero'), value: z.string().describe('O número com a unidade, até 9 caracteres ("28,3%", "80 sem").'), note: z.string().describe('O que o número é, até 50 caracteres.') }),
    z.object({ type: z.literal('barras'), bars: z.array(z.object({ label: z.string().describe('Até 26 caracteres.'), value: z.number().describe('Valor numérico para o tamanho da barra.'), display: z.string().describe('Como o valor aparece ("28,3%").') })).describe('2 a 4 barras; a primeira sai em azul (o destaque).') }),
    z.object({ type: z.literal('pontos'), total: z.number().describe('Quantos pontos (até 400); cada ponto pode ser 1 pessoa ou uma fração, explique na nota.'), marked: z.number().describe('Quantos ficam azuis.'), note: z.string().describe('O que os pontos representam, até 50 caracteres.') }),
    z.object({ type: z.literal('linha'), steps: z.array(z.string()).describe('2 a 5 etapas, até 12 caracteres cada ("fase 3", "FDA", "ANVISA").'), current: z.number().describe('Índice (0 = primeira) da etapa de hoje.'), note: z.string().optional().describe('Até 50 caracteres.') }),
    z.object({ type: z.literal('lista'), items: z.array(z.object({ text: z.string().describe('Até 40 caracteres.'), mark: z.enum(['ok', 'nao', 'duvida']) })).describe('2 a 4 itens; ok = certo/fazer, nao = errado/não fazer, duvida = incerto.') }),
    z.object({ type: z.literal('icone'), icon: z.enum(ILLUSTRATION_KEYS), note: z.string().optional().describe('Até 50 caracteres.') }),
    z.object({ type: z.literal('carimbo'), text: z.string().describe('Até 18 caracteres ("NÃO APROVADO", "MITO").'), note: z.string().optional().describe('Até 40 caracteres.') }),
  ])
  .describe(
    'Desenho da cena: transforme o dado em imagem. frasco (o produto), frascos (comparar dois: o testado x o vendido), numero (um número da FONTE em destaque), barras (comparar valores), pontos (proporção de pessoas), linha (etapas no tempo: fases, aprovação), lista (critérios, o que fazer), carimbo (veredito: "NÃO APROVADO", "MITO"), icone (o resto). Varie: não repita o mesmo tipo em mais de duas cenas seguidas.',
  );

export const DraftSchema = z.object({
  hook: z.string().describe(`Frase da capa, até ${LIMITS.hook} caracteres: a mania ou o erro do dia a dia que a pessoa reconhece. Nunca um cumprimento.`),
  hookIcon: z.enum(ILLUSTRATION_KEYS).describe('Ilustração da capa, diferente das dos slides (mesma lista do campo icon dos slides).'),
  slides: z
    .array(
      z.object({
        title: z.string().describe(`Até ${LIMITS.slideTitle} caracteres.`),
        body: z.string().describe(`Até ${LIMITS.slideBody} caracteres. Uma ideia só.`),
        icon: z
          .enum(ILLUSTRATION_KEYS)
          .describe(`Ilustração do slide: ${Object.entries(ILLUSTRATIONS).map(([k, d]) => `${k} (${d})`).join('; ')}. Evite repetir no mesmo post.`),
        layout: z
          .enum(LAYOUTS)
          .describe(`Tipo do slide, conforme o conteúdo: ${Object.entries(LAYOUT_HINTS).map(([k, d]) => `${k} (${d})`).join('; ')}.`),
      }),
    )
    .describe(`${LIMITS.slides[0]} a ${LIMITS.slides[1]} slides de conteúdo, sem capa e sem chamada final.`),
  scenes: z
    .array(
      z.object({
        chip: z.string().describe(`Seção do vídeo no selo do topo, até ${LIMITS.sceneChip} caracteres, minúscula ("o frasco", "os estudos", "a ANVISA", "o que fazer"). Repita a mesma seção em cenas seguidas do mesmo bloco.`),
        kicker: z.string().describe(`Linha pequena acima do título, até ${LIMITS.sceneKicker} caracteres, contexto curto ("o que a ANVISA disse", "no maior estudo"). Pode ser vazia.`),
        title: z.string().describe(`Primeira linha do título (escura), até ${LIMITS.sceneTitle} caracteres. Poucas palavras, como manchete.`),
        accent: z.string().describe(`Segunda linha do título (em destaque, vermelha ou azul), até ${LIMITS.sceneTitle} caracteres. Completa a primeira ("Não é" + "aprovada em lugar nenhum").`),
        tone: z.enum(['vermelho', 'azul']).describe('vermelho = risco, mito, problema; azul = fato, dado de estudo, o que fazer.'),
        speech: z.string().describe(`Frase falada nesta cena, até ${LIMITS.sceneSpeech} caracteres (cerca de 4 a 7 segundos). Uma frase só.`),
        visual: VisualSchema,
        source: z.string().optional().describe(`De onde vem o dado da cena, até ${LIMITS.sceneSource} caracteres ("ANVISA, 24/07/2026", "TRIUMPH-1, Eli Lilly"). Só quando a cena tem dado; use o que a FONTE cita.`),
      }),
    )
    .describe(`${LIMITS.scenes[0]} a ${LIMITS.scenes[1]} cenas do Reels, uma frase cada; a primeira é o gancho falado. Sem a chamada final (o código acrescenta).`),
  caption: z
    .string()
    .describe(`Corpo da legenda, até ${LIMITS.caption} caracteres: o resumo prático do conteúdo. Sem pergunta final, sem convite para seguir ou salvar, sem hashtags e sem bio.`),
  question: z
    .string()
    .describe(`Pergunta para os comentários, até ${LIMITS.question} caracteres, terminando em "?": sobre a experiência ou a situação do leitor com o tema.`),
  share: z
    .string()
    .describe(`Para quem a pessoa mandaria este post, até ${LIMITS.share} caracteres, completando "Manda pra ...": uma pessoa concreta ligada à mania do dia (ex.: "aquela amiga que também come correndo", "quem guarda a caneta na porta da geladeira"). Sem o "Manda pra".`),
});

/**
 * Leitura do texto.json da fila: aceita também o formato antigo (falas em `narration`, sem
 * `scenes`), que o render transforma em cenas (scenes.ts). Texto novo sai de DraftSchema.
 */
export const QueuedDraftSchema = DraftSchema.extend({
  scenes: DraftSchema.shape.scenes.optional(),
  narration: z.array(z.object({ text: z.string() })).optional(),
});

export const SYSTEM = `Você escreve o conteúdo diário do Instagram @dosecerta_br ("Dose Certa | Peptídeos sem achismo"), um perfil educativo do site Central Peptídeos. Público: principalmente mulheres brasileiras de 30 a 55 anos que usam ou pensam em usar tirzepatida, semaglutida e outros peptídeos e querem fazer certo.

Quem fala é o próprio perfil, sem mascote nem personagem: uma narração em primeira pessoa, como aquela amiga que entende do assunto e explica sem enrolar (na tela, o protagonista é o dado: frasco, número, comparação). Descontraída, porém informativa: a graça está no jeito de falar, a informação continua exata. Nada de bordão, slogan ou frase de efeito repetida de um vídeo para o outro.

Cada pedido traz um TEMA e uma FONTE (texto do próprio site). Escreva, em português do Brasil com acentuação correta, um rascunho que serve para um carrossel e para um Reels.

Como todo roteiro é montado:
- Parte de uma mania ou de um erro do dia a dia que a pessoa reconhece na própria rotina (exemplos do tipo: deixar a caneta na porta da geladeira, aplicar sempre no mesmo lugar, anotar a dose "de cabeça", comer correndo e culpar o remédio pelo enjoo, subir a dose porque "a amiga subiu"). Escolha uma que a FONTE realmente corrija: a mania é o ponto de partida, nunca um fato novo. Se a FONTE não sustenta a correção, escolha outra.
- Gancho (campo hook e primeira cena): nomeia a mania ou a dor nos primeiros dois segundos; é o que decide se a pessoa fica ou pula. A primeira cena tem no máximo 10 palavras faladas: uma pergunta que a pessoa responde na cabeça na hora. O que viralizou no nicho em 2026 (levantamento dos Reels mais vistos): pergunta curtíssima de dúvida real ("Sua aplicação dura os 7 dias?", 1 milhão de visualizações), virada "o erro não é X, é Y" ("O erro de quem usa Mounjaro não é a dose. É..."), reenquadramento ("Você achou que era só remédio pra emagrecer?"), chamado à identidade ("Você também é do tipo que..."), lista curta com promessa ("Três sinais de que...", e o vídeo entrega os três, guardando o mais forte para o fim). Outras formas que funcionam: pergunta de dor ("Seu Mounjaro está te dando enjoo?"), flagra da mania ("Você guarda a caneta na porta da geladeira?"), mito derrubado ("Mito: se não enjoou, não está funcionando"), o que ninguém conta ("Ninguém te conta isso sobre a primeira semana"), lista de erros ("Três erros que eu vejo toda semana"), número curioso da FONTE ("Cerca de um terço. Guarda esse número."), confusão comum ("Mounjaro e Ozempic são a mesma coisa? Não."). Nunca comece com cumprimento ("oi", "olá") nem com apresentação. O gancho promete algo que o conteúdo entrega de fato.
- Depois: por que a mania atrapalha, o que fazer no lugar, e quando é caso de falar com o médico.
- O Reels é um explicador de 40 a 60 segundos (8 a 12 cenas, 110 a 170 palavras faladas no total), montado em cenas (campo scenes): uma frase por cena, cada cena com um título de manchete em duas linhas e um desenho que mostra o dado (o frasco, a comparação, o número, as etapas). Vídeo curto é visto até o fim, o sinal que mais pesa no alcance. Ritmo de investigação: gancho → o que está acontecendo → o que os estudos ou a bula mostram → o problema ou o risco → o que fazer → fecho voltando ao gancho. Corte introdução, repetição e "então, é isso".
- Uma ideia grande por vídeo, não um resumo da FONTE: no máximo 3 números no vídeo inteiro, os mais fortes (um número que a pessoa repete para a amiga vale mais que seis que ela esquece). Explique o mecanismo com uma imagem do dia a dia (o remédio que "segura a fome" sai do corpo como a maré que baixa; a seringa de 100 é uma régua de um metro para medir um centímetro), como nos explicadores animados que mais circulam.
- Deixe uma curiosidade aberta logo no começo e só feche no fim ("e o terceiro é o que quase todo mundo erra"), para a pessoa ficar até o final.
- A última cena fecha o assunto voltando ao gancho (ex.: o gancho pergunta "Você guarda a caneta na porta?" e a última cena termina com "então, porta da geladeira nunca mais"), para o vídeo emendar no começo quando recomeçar.
- No fim o código põe a chamada "comenta GUIA que eu te mando no direct" e o convite para mandar o vídeo (campo share): não escreva nada disso.
- Tom de quem também já fez isso ("eu sei, todo mundo faz"), nunca de bronca nem de professora.

Regras de conteúdo (um robô confere antes de publicar e descarta o rascunho que falhar):
- Use só fatos da FONTE. Todo número com unidade (mg, mcg, mL, UI, unidades, %, semanas, dias, horas, kg) precisa aparecer na FONTE exatamente com esse valor. Sem dado na fonte, não cite número.
- Se a FONTE diz que algo não foi caracterizado ou não tem estudo, diga isso; nunca estime.
- Ao falar de dose, deixe claro que é a dose de bula ou de estudo e que ajuste é com o médico.
- Proibido: falar em comprar, vender, preço de peptídeo, frete, Pix, WhatsApp, onde conseguir; prometer resultado ("perca X kg", "garantido", "cura", "sem efeito colateral"); descrever a aplicação na pele.
- Proibido também: piada ou comentário sobre corpo, peso, aparência ou "antes e depois"; quilos perdidos ou prazo para emagrecer; culpar ou envergonhar quem errou; diminutivo infantil em excesso.
- Não prescreva ("tome 5 mg", "suba para"): diga o que a bula ou o estudo descreve. Sem tom de urgência ou de medo.
- Marca comercial só para situar ("Mounjaro, a tirzepatida"); nunca elogie ou recomende uma marca sobre outra. Produto sem registro ou falsificado: fale de forma genérica ("caneta sem registro"), sem nome de vendedor ou marca pirata.
- Não mencione o guia, a bio, links, hashtags, "siga" nem "salve": o código acrescenta essas chamadas.

Estilo:
- Frases curtas, voz ativa, segunda pessoa ("você"). Pode usar "amiga" no máximo uma vez por roteiro e linguagem de conversa ("olha só", "calma", "pra", "tá"). Uma tirada leve por roteiro, no máximo. Nada de jargão sem explicar.
- Slides: 5 a 8 slides de conteúdo (carrossel de 7 a 10 imagens é o que mais se salva), título curto + uma ideia por slide, na mesma voz; cada slide deixa um motivo para arrastar para o próximo; o último slide de conteúdo resume o que fazer, como uma cola que vale guardar.
- Tipos de slide (campo layout): varie para o carrossel ter ritmo. Use "mito" para derrubar uma crença, "passos" para o que fazer, "lado" para comparar duas coisas, "numero" para um número da FONTE que merece destaque, "pergunta" para a dúvida que a pessoa faz, e "padrao" para o resto. Com 4 slides ou mais, pelo menos um não é "padrao"; evite dois iguais seguidos. O último slide (o resumo) costuma ser "passos".
- Pense no envio: o sinal que mais aumenta o alcance é alguém mandar o post para outra pessoa. Escolha a mania e o campo share para que a leitora pense na hora em quem precisa ver isso.
- Cenas do Reels: tom de conversa, uma frase por cena (cerca de 4 a 7 segundos lida em voz alta), cada uma levando à próxima; a legenda da cena aparece palavra a palavra, então a frase precisa fazer sentido sozinha. Título curto (manchete, não frase completa) e desenho que conta a cena sem som. Se citar estudo, documento ou órgão, ponha em source o nome que a FONTE dá. Escreva marca, estudo e sigla do jeito normal (Mounjaro, SURMOUNT-4, U-100, GLP-1): o código ajusta a pronúncia, então não invente grafia. Prefira dizer o que o estudo fez a citar o nome dele mais de uma vez. Toda frase precisa soar inequivocamente portuguesa, com palavras como "você", "seu", "está", "não", "é" ou acentos: a voz adivinha o idioma por frase e lê em espanhol uma frase curta como "Mounjaro dando enjoo?" (escreva "Seu Mounjaro está dando enjoo?").
- Legenda: na mesma voz; o primeiro bloco acolhe quem tem a mania ("Eu sei, todo mundo faz") e explica o porquê; quem não arrasta os slides precisa sair com o conteúdo. 2 a 4 blocos curtos; se houver passos, numere com 1️⃣ 2️⃣ 3️⃣; se houver um erro comum ou risco, um bloco começando com ⚠️. Use as palavras que a pessoa digitaria na busca (nome do peptídeo, "dose", "unidades", "seringa", "efeito colateral").
- Pergunta dos comentários: concreta e fácil de responder em poucas palavras (ex.: "Qual frasco e quanta água você usa?", "Em qual semana o enjoo apareceu para você?"). Nunca peça que a pessoa conte a dose para receber uma indicação.`;

export function userMessage(topic: Topic, previousProblems: string[]): string {
  const retry = previousProblems.length
    ? `\n\nA tentativa anterior foi descartada por estes problemas; corrija todos:\n- ${previousProblems.join('\n- ')}`
    : '';
  return `TEMA: ${topic.title}\n\nFONTE:\n${topic.source}${retry}`;
}

export async function writeDraft(topic: Topic, previousProblems: string[] = [], client?: Anthropic): Promise<Draft> {
  const user = userMessage(topic, previousProblems);
  if (client || process.env.ANTHROPIC_API_KEY?.trim()) return writeWithApi(topic, user, client ?? new Anthropic());
  return writeWithCli(topic, user);
}

async function writeWithApi(topic: Topic, user: string, client: Anthropic): Promise<Draft> {
  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: betaZodOutputFormat(DraftSchema) },
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: user }],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error(`Claude recusou o tema ${topic.id}: ${response.stop_details?.explanation ?? 'sem explicação'}`);
  }
  if (response.stop_reason === 'max_tokens') throw new Error(`Resposta cortada (max_tokens) no tema ${topic.id}`);
  const draft = response.parsed_output;
  if (!draft) throw new Error(`Resposta sem JSON válido no tema ${topic.id}`);
  return draft;
}

const CLI_TIMEOUT_MS = 10 * 60_000;

/**
 * Ambiente do `claude` filho: sem as variáveis de uma sessão do Claude Code/Desktop que porventura
 * chamou o robô (elas trocam o login e o endereço da API). Fica o token de longa duração.
 */
export function cliEnv(env: Record<string, string | undefined>): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(env)) {
    if (/^(CLAUDE|ANTHROPIC)/.test(k) && k !== 'CLAUDE_CODE_OAUTH_TOKEN') continue;
    out[k] = v;
  }
  return out;
}

/** JSON do `claude -p --output-format json`: devolve a saída estruturada ou explica a falha. */
export function parseCliOutput(stdout: string, topicId: string): unknown {
  let res: { is_error?: boolean; result?: string; structured_output?: unknown };
  try {
    res = JSON.parse(stdout);
  } catch {
    throw new Error(`Claude Code devolveu algo que não é JSON no tema ${topicId}: ${stdout.slice(0, 300)}`);
  }
  if (res.is_error) {
    const hint = /authenticate|OAuth|login/i.test(res.result ?? '')
      ? ' (rode `claude setup-token` e ponha CLAUDE_CODE_OAUTH_TOKEN no .env.local)'
      : '';
    throw new Error(`Claude Code falhou no tema ${topicId}: ${res.result ?? 'sem mensagem'}${hint}`);
  }
  if (res.structured_output !== undefined) return res.structured_output;
  try {
    return JSON.parse(res.result ?? '');
  } catch {
    throw new Error(`Resposta sem JSON válido no tema ${topicId}`);
  }
}

/** Schema do rascunho para o `--json-schema` (o validador do claude não aceita o `$schema` 2020-12). */
export function draftJsonSchema(): Record<string, unknown> {
  const { $schema: _ignored, ...schema } = z.toJSONSchema(DraftSchema) as Record<string, unknown>;
  return schema;
}

async function writeWithCli(topic: Topic, user: string): Promise<Draft> {
  const args = [
    '-p',
    '--output-format', 'json',
    '--json-schema', JSON.stringify(draftJsonSchema()),
    '--system-prompt', SYSTEM,
    '--model', MODEL,
    '--effort', 'medium',
    '--tools', '',
    '--strict-mcp-config',
    '--no-session-persistence',
  ];
  const stdout = await new Promise<string>((resolve, reject) => {
    const child = spawn(process.env.CLAUDE_BIN || 'claude', args, {
      env: cliEnv(process.env) as NodeJS.ProcessEnv,
      // Fora do projeto: sem CLAUDE.md, configurações e permissões da pasta do site.
      cwd: os.tmpdir(),
      windowsHide: true,
    });
    let out = '';
    let err = '';
    const timer = setTimeout(() => child.kill(), CLI_TIMEOUT_MS);
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', (e) => {
      clearTimeout(timer);
      reject(new Error(`não achei o Claude Code (comando claude): ${e.message}`));
    });
    child.on('close', () => {
      clearTimeout(timer);
      // Erros de login e de API também saem no JSON, com código diferente de zero: quem decide é o parse.
      if (out.trim()) resolve(out);
      else reject(new Error(`Claude Code saiu sem resposta no tema ${topic.id}: ${err.slice(0, 500)}`));
    });
    child.stdin.end(user);
  });
  return DraftSchema.parse(parseCliOutput(stdout, topic.id)) as Draft;
}
