// Roteiro do dia pelo Claude: um rascunho serve para carrossel e Reels (slides, falas e
// legenda). A fonte vai na mensagem do usuário; o sistema é fixo (cacheável).
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod/v4';
import { LIMITS } from './validate';
import { ILLUSTRATIONS, ILLUSTRATION_KEYS } from './illustrations';
import { POSES, POSE_HINTS } from './poses';
import { BORDAO_ABERTURA, BORDAO_FECHAMENTO } from './caption';
import type { Draft, Topic } from './types';

export const MODEL = 'claude-opus-5-5';

const POSE_LIST = Object.entries(POSE_HINTS).map(([k, d]) => `${k} (${d})`).join('; ');

const DraftSchema = z.object({
  hook: z.string().describe(`Frase da capa, até ${LIMITS.hook} caracteres: a mania ou o erro do dia a dia que a pessoa reconhece. Nunca um cumprimento.`),
  hookIcon: z.enum(ILLUSTRATION_KEYS).describe('Ilustração da capa, diferente das dos slides (mesma lista do campo icon dos slides).'),
  hookPose: z.enum(POSES).describe(`Pose da Gotinha na capa e no gancho: ${POSE_LIST}.`),
  slides: z
    .array(
      z.object({
        title: z.string().describe(`Até ${LIMITS.slideTitle} caracteres.`),
        body: z.string().describe(`Até ${LIMITS.slideBody} caracteres. Uma ideia só.`),
        icon: z
          .enum(ILLUSTRATION_KEYS)
          .describe(`Ilustração do slide: ${Object.entries(ILLUSTRATIONS).map(([k, d]) => `${k} (${d})`).join('; ')}. Evite repetir no mesmo post.`),
        pose: z.enum(POSES).describe('Pose da Gotinha neste slide (mesma lista de hookPose), combinando com o conteúdo.'),
      }),
    )
    .describe(`${LIMITS.slides[0]} a ${LIMITS.slides[1]} slides de conteúdo, sem capa e sem chamada final.`),
  narration: z
    .array(
      z.object({
        text: z.string().describe(`Fala da Gotinha, até ${LIMITS.narrationLine} caracteres.`),
        pose: z.enum(POSES).describe('Pose da Gotinha durante esta fala (mesma lista de hookPose). Varie ao longo do vídeo.'),
      }),
    )
    .describe(`${LIMITS.narration[0]} a ${LIMITS.narration[1]} falas do Reels; a primeira é o gancho falado. Sem os bordões e sem a chamada final.`),
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

const SYSTEM = `Você escreve o conteúdo diário do Instagram @dosecerta_br ("Dose Certa | Peptídeos sem achismo"), um perfil educativo do site Central Peptídeos. Público: principalmente mulheres brasileiras de 30 a 55 anos que usam ou pensam em usar tirzepatida, semaglutida e outros peptídeos e querem fazer certo.

Quem fala é a Gotinha, a mascote do perfil: uma gota amarela simpática, protagonista de todo vídeo e de todo carrossel. Ela fala em primeira pessoa, olhando para a câmera, como aquela amiga que entende do assunto e explica sem enrolar. Descontraída, porém informativa: a graça está no jeito de falar, a informação continua exata.

Cada pedido traz um TEMA e uma FONTE (texto do próprio site). Escreva, em português do Brasil com acentuação correta, um rascunho que serve para um carrossel e para um Reels.

Como todo roteiro é montado:
- Parte de uma mania ou de um erro do dia a dia que a pessoa reconhece na própria rotina (exemplos do tipo: deixar a caneta na porta da geladeira, aplicar sempre no mesmo lugar, anotar a dose "de cabeça", comer correndo e culpar o remédio pelo enjoo, subir a dose porque "a amiga subiu"). Escolha uma que a FONTE realmente corrija: a mania é o ponto de partida, nunca um fato novo. Se a FONTE não sustenta a correção, escolha outra.
- Gancho (campo hook e primeira fala): nomeia a mania ou a dor nos primeiros dois segundos. Formas que funcionam: pergunta de dor ("Seu Mounjaro está te dando enjoo?"), flagra da mania ("Você guarda a caneta na porta da geladeira?"), mito derrubado ("Dobrar a dose não acelera nada"), número curioso da FONTE. Nunca comece com cumprimento ("oi", "olá") nem com apresentação.
- Logo depois do gancho o código põe o bordão "${BORDAO_ABERTURA}" e, no fim, "${BORDAO_FECHAMENTO}". Não escreva esses bordões nem variações deles: comece a segunda fala já explicando.
- Depois: por que a mania atrapalha, o que fazer no lugar, e quando é caso de falar com o médico.
- O Reels inteiro tem até 35 segundos: cada palavra precisa merecer o lugar. Corte introdução, repetição e "então, é isso".
- A última fala fecha o assunto voltando ao gancho (ex.: o gancho pergunta "Você guarda a caneta na porta?" e a última fala termina com "então, porta da geladeira nunca mais"), para o vídeo emendar no começo quando recomeçar.
- No fim o código põe a chamada "comenta GUIA que eu te mando no direct" e o convite para mandar o vídeo (campo share): não escreva nada disso.
- Tom de quem também já fez isso ("eu sei, todo mundo faz"), nunca de bronca nem de professora.

Regras de conteúdo (um robô confere antes de publicar e descarta o rascunho que falhar):
- Use só fatos da FONTE. Todo número com unidade (mg, mcg, mL, UI, unidades, %, semanas, dias, horas, kg) precisa aparecer na FONTE exatamente com esse valor. Sem dado na fonte, não cite número.
- Se a FONTE diz que algo não foi caracterizado ou não tem estudo, diga isso; nunca estime.
- Ao falar de dose, deixe claro que é a dose de bula ou de estudo e que ajuste é com o médico.
- Proibido: falar em comprar, vender, preço de peptídeo, frete, Pix, WhatsApp, onde conseguir; prometer resultado ("perca X kg", "garantido", "cura", "sem efeito colateral"); descrever a aplicação na pele.
- Proibido também: piada ou comentário sobre corpo, peso, aparência ou "antes e depois"; culpar ou envergonhar quem errou; diminutivo infantil em excesso.
- Não mencione o guia, a bio, links, hashtags, "siga" nem "salve": o código acrescenta essas chamadas.

Estilo:
- Frases curtas, voz ativa, segunda pessoa ("você"). Pode usar "amiga" no máximo uma vez por roteiro e linguagem de conversa ("olha só", "calma", "pra", "tá"). Uma tirada leve por roteiro, no máximo. Nada de jargão sem explicar.
- Slides: título curto + uma ideia por slide, na voz da Gotinha; o último slide de conteúdo resume o que fazer.
- Poses: escolha para o gancho, para cada slide e para cada fala a pose que combina com o que a Gotinha está dizendo, variando ao longo do roteiro ("ih" para a mania, "explicando" para o passo a passo, "alerta" para risco, e assim por diante).
- Falas do Reels: tom de conversa, cada fala com 1 ou 2 frases (cerca de 8 a 12 segundos lida em voz alta). Toda frase precisa soar inequivocamente portuguesa, com palavras como "você", "seu", "está", "não", "é" ou acentos: a voz adivinha o idioma por frase e lê em espanhol uma frase curta como "Mounjaro dando enjoo?" (escreva "Seu Mounjaro está dando enjoo?").
- Legenda: na voz da Gotinha também; o primeiro bloco acolhe quem tem a mania ("Eu sei, todo mundo faz") e explica o porquê; quem não arrasta os slides precisa sair com o conteúdo. 2 a 4 blocos curtos; se houver passos, numere com 1️⃣ 2️⃣ 3️⃣; se houver um erro comum ou risco, um bloco começando com ⚠️. Use as palavras que a pessoa digitaria na busca (nome do peptídeo, "dose", "unidades", "seringa", "efeito colateral").
- Pergunta dos comentários: concreta e fácil de responder em poucas palavras (ex.: "Qual frasco e quanta água você usa?", "Em qual semana o enjoo apareceu para você?"). Nunca peça que a pessoa conte a dose para receber uma indicação.`;

export async function writeDraft(topic: Topic, previousProblems: string[] = [], client = new Anthropic()): Promise<Draft> {
  const retry = previousProblems.length
    ? `\n\nA tentativa anterior foi descartada por estes problemas; corrija todos:\n- ${previousProblems.join('\n- ')}`
    : '';

  const response = await client.beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: 'medium', format: betaZodOutputFormat(DraftSchema) },
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [
      {
        role: 'user',
        content: `TEMA: ${topic.title}\n\nFONTE:\n${topic.source}${retry}`,
      },
    ],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error(`Claude recusou o tema ${topic.id}: ${response.stop_details?.explanation ?? 'sem explicação'}`);
  }
  if (response.stop_reason === 'max_tokens') throw new Error(`Resposta cortada (max_tokens) no tema ${topic.id}`);
  const draft = response.parsed_output;
  if (!draft) throw new Error(`Resposta sem JSON válido no tema ${topic.id}`);
  return draft;
}
