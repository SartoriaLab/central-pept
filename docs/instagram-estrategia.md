# Estratégia de crescimento do @dosecerta_br (21/11/2026)

Ponto de partida: 5 seguidores, 1 Reels publicado. A API não devolve insights (falta permissão,
ver "Medir"). As decisões abaixo saem de três fontes de dados:

1. **Nicho (coleta de 21/11/2026, `social/fila/REGRAS.md`):** 85 Reels de 17 perfis brasileiros de
   GLP-1 com views, e 257 posts de busca com curtidas.
2. **Site (Vercel, 22/10 a 21/11):** cerca de 2 mil visitantes por semana. 9,2 mil pessoas no mês
   passaram por `/ferramentas/reconstituicao`.
3. **Plataforma (Buffer, Socialinsider, declarações do Mosseri, diretrizes de recomendação do
   Instagram):** fontes em "Referências".

## O que os dados dizem

O sucesso de cada Reels foi medido em views divididas pela mediana da própria conta.

| Padrão no gancho | Com o padrão | Sem o padrão | Amostra |
|---|---|---|---|
| Marca (Mounjaro/Ozempic) | **38x** | 0,7x | 5 |
| Moldura de erro ("não é", "erro") | 3,1x | 0,7x | 4 |
| Pergunta | 1,5x | 0,7x | 17 |

- Na busca por palavra-chave, a mediana de curtidas foi:
  - "mounjaro efeitos": 11 mil;
  - "mounjaro": 6.952;
  - "tirzepatida": 2.699;
  - "peptideos": 1.045;
  - "retatrutida": 701.
- Conta pequena também viraliza: @biosintetiza tinha 1.557 seguidores e fez um Reels de 380 mil
  views, 84 vezes a mediana dela.
- Sinais que mais pesam para quem não segue (Mosseri, jan/2025): envios por alcance, tempo
  assistido e curtidas por alcance.
- Frequência (Buffer, 2,1 milhões de posts): com 10 ou mais posts por semana, a conta cresce
  0,66% por semana. Com 1 ou 2 posts, 0,12%.
- Contas de 1 a 5 mil seguidores têm mediana de 993 views no carrossel contra 580 no Reels
  (Socialinsider).
- O Instagram **não recomenda a quem não segue** post que vende produto com alegação de saúde ou
  promove medicamento. Preço e cupom na legenda põem o alcance em risco.

## Decisões (aplicadas)

| # | Decisão | Onde |
|---|---|---|
| 1 | Legenda sem preço e sem desconto: o guia é citado pelo título, e preço e cupom vão só no direct | `caption.ts` (`ctaLine`) |
| 2 | Marca no gancho quando o remédio é o de marca; nunca em frasco manipulado | `write.ts` (regras) e fila de 26/11 e 28/11 |
| 3 | Nota de viralidade do gancho (0 a 100) com os pesos da tabela acima, impressa no `--check` | `viral.ts` (`hookScore`) |
| 4 | O site manda gente para o perfil: rodapé, fim dos posts e resultado da calculadora | `InstagramFollow` e evento `Seguir Instagram` |
| 5 | 1 Reels por dia no pico, mais o carrossel das 12h: 14 posts por semana, a faixa de maior crescimento | Agendador (já ligado). Falta pôr carrossel na fila |
| 6 | Métricas por post, assim que a permissão existir | `scripts/social/metricas.ts` |

## O que depende do dono

1. **Nome do perfil (campo pesquisável):** "Dose Certa | Mounjaro e Ozempic". O nome entra na
   busca do Instagram, e a @ não muda.
2. **Permissão de insights:** no app da Meta, gere o token de novo com `instagram_manage_insights`
   (token EAA) e salve em `IG_ACCESS_TOKEN`. Depois, `tsx scripts/social/metricas.ts saida.json`
   mostra alcance, envios e tempo assistido por Reels.
3. **Status da conta toda semana** (Configurações > Status da conta): conferir se a conta continua
   elegível para recomendação.
4. **Responder os comentários na 1ª hora** depois das 19h. O robô só responde quem comenta GUIA.
5. **Collab:** convidar nutricionistas e farmacêuticos pequenos (5 a 50 mil seguidores) para posts
   em colaboração, que aparecem nos dois perfis.

## Próximas alavancas (com gatilho)

- **Por volta de 200 seguidores: Trial Reels.** A API aceita
  `trial_params: { graduation_strategy: "SS_PERFORMANCE" }` em `publishReel`. O Reels vai primeiro
  só para quem não segue e é promovido aos seguidores se for bem.
- **Com 2 semanas de métricas:**
  - Tema com envios por alcance acima da mediana ganha outro Reels (repetir ângulo, não texto).
  - Tema abaixo sai de `VIRAL_RANK`.
- **Duração:** testar 75 a 90 s em 1 de cada 4 Reels quando houver tempo médio assistido para
  comparar. O Buffer vê mais alcance de 90 s a 3 min, mas os virais do nicho ficam em 40 a 60 s.

## Meta e acompanhamento

- **Semana 1–2:** 100 seguidores. Os cliques em `Seguir Instagram` aparecem em
  `/admin/assistente/eventos`.
- **Mês 1:** 1.000 seguidores e um Reels acima de 10 mil views.
- **Toda semana, comparar:** seguidores (perfil), cliques do site, envios por alcance por tema
  e nota do gancho contra views reais. Se a nota não acompanhar as views, recalibrar os pesos de
  `viral.ts`.

## Referências

- Mosseri, sinais de ranqueamento: https://www.socialmediatoday.com/news/instagram-shares-algorithm-2025/738034/
- Buffer, frequência: https://buffer.com/resources/how-often-to-post-on-instagram/
- Socialinsider, benchmarks: https://www.socialinsider.io/blog/instagram-benchmarks/
- Diretrizes de recomendação: https://help.instagram.com/313829416281232
- Trial Reels via API (`trial_params`): https://developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/media.md
- Limite de 5 hashtags (dez/2025): https://www.businesstoday.in/technology/news/story/no-more-hashtag-stuffing-instagram-limits-hashtag-usage-to-just-5-per-reel-and-post-507444-2025-12-19
