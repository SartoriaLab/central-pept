# Instagram @dosecerta_br — postagem diária automática

Data: 2026-11-15 · Status: aguardando revisão

## Objetivo

Publicar todo dia, sem revisão humana, um **carrossel** e um **Reels** no Instagram
`@dosecerta_br`, gerados por IA a partir do conteúdo do site, sempre terminando com a oferta
dos guias pagos e a chamada para o link da bio. A bio aponta para uma landing nova (`/links`)
com todos os produtos ativos.

Sucesso: 30 dias seguidos com 2 publicações/dia, nenhuma dose ou número que contradiga o
site, e cliques da bio medidos (UTM `instagram/bio`).

## Marca

- Perfil: **Dose Certa** (`@dosecerta_br`). Campo Nome: `Dose Certa | Peptídeos sem achismo`.
- Bio: `Conteúdo educativo sobre peptídeos • Calculadoras grátis • Não vendemos peptídeos` + link `/links`.
- O site continua Central Peptídeos. `/links` e o slide final fazem a ponte:
  "Dose Certa, um projeto Central Peptídeos".
- `lib/site.ts` ganha `INSTAGRAM_HANDLE = 'dosecerta_br'` e `INSTAGRAM_NAME = 'Dose Certa'` (fonte única).

## Arquitetura

```
GitHub Actions (cron)  ──►  scripts/social/*.ts (tsx)
   12:00 BRT carrossel          │ 1. escolhe tema (banco: histórico)
   19:30 BRT reels              │ 2. Claude escreve roteiro + legenda (JSON, zod)
                                │ 3. validador de números contra a fonte
                                │ 4. renderiza PNG (satori + resvg) / MP4 (ffmpeg + edge-tts)
                                │ 5. sobe mídia no Vercel Blob (URL pública)
                                │ 6. publica via Instagram Graph API
                                └ 7. grava histórico/log no Postgres
```

Por que GitHub Actions e não cron da Vercel: o Reels precisa de ffmpeg e de 2 a 5 minutos de
render; a função da Vercel não tem ffmpeg e tem limite de tempo curto. O runner `ubuntu-latest`
já traz ffmpeg e Python.

## Componentes

Todos em `scripts/social/`, executados com `tsx` (resolve o alias `@/` do `tsconfig`), para
reaproveitar `lib/peptides.ts`, `lib/comparisons.ts`, `lib/ebooks.ts` e os posts.

| Arquivo | Faz | Depende de |
|---|---|---|
| `topics.ts` | Banco de temas: cada post do blog, ficha de peptídeo e comparativo vira um `Topic { id, kind, title, source }`, onde `source` é o texto/dados do site que a IA pode usar. | `lib/*`, `content/blog` (leitura de arquivo, como `lib/articles.ts`) |
| `pick.ts` | Escolhe o próximo tema: o que não saiu há mais tempo, sem repetir em 60 dias, alternando GLP-1 com outras categorias. Carrossel e Reels do mesmo dia usam temas diferentes. | histórico do banco |
| `write.ts` | Chama a API do Claude (Sonnet, saída estruturada) com o `source` do tema e as regras de conteúdo. Devolve `{ slides[], narration[], caption, hashtags[] }`. | `@anthropic-ai/sdk`, `zod` |
| `validate.ts` | Extrai todo número com unidade (mg, mcg, mL, UI, unidades, %, semanas, dias, h) do texto gerado e exige que apareça no `source`. Checa palavras proibidas e tamanho (legenda ≤ 2.200 caracteres, ≤ 5 hashtags, texto do slide ≤ 220). Falhou → 1 nova tentativa; falhou de novo → próximo tema. | — |
| `ebook-cta.ts` | Escolhe o guia do slide final: `ebookFor*` do tema (mesma regra do site); sem guia ativo → kit. Lista de ativos vem de `/busca.json` de produção (só tem ebook com checkout). | `lib/ebooks.ts`, site no ar |
| `render-slide.tsx` | JSX → PNG com `satori` + `@resvg/resvg-js` (o motor do `next/og`). Visual do OG do site, cores de `lib/category-style.ts`, fonte Inter em `scripts/social/fonts/`. Carrossel 1080×1350; Reels 1080×1920. | `satori`, `@resvg/resvg-js` |
| `render-reel.ts` | Narração por cena com `edge-tts` (voz `pt-BR-FranciscaNeural`), duração da cena = duração do áudio; zoom leve (`zoompan`) e transição (`xfade`) no ffmpeg; MP4 H.264/AAC, 20–40 s. | ffmpeg, `edge-tts` (pip) |
| `instagram.ts` | Cliente da Graph API (Instagram API com login do Instagram, sem Página do Facebook): container por imagem → container de carrossel → `media_publish`; Reels: container `REELS` → espera `FINISHED` → `media_publish`. Renova o token de 60 dias quando faltar menos de 15. | `fetch` |
| `state.ts` | Tabela nova `social_posts` (tema, formato, data, id do post no IG, status, erro) e `social_state` (token atual + validade). | `drizzle/schema.ts` |
| `run.ts` | Orquestra: `tsx scripts/social/run.ts carrossel|reels [--dry]`. `--dry` grava em `social/out/` e não publica. | todos |

Workflow `.github/workflows/social.yml`: dois `schedule` (`0 15 * * *` e `30 22 * * *`, UTC),
`workflow_dispatch` com escolha de formato e `dry`. Sai sem fazer nada se a variável do repo
`SOCIAL_PAUSED` for `1`.

## Conteúdo

**Carrossel (5–7 slides)**
1. Capa: gancho em forma de pergunta ou erro comum ("Você está diluindo a tirzepatida errado?").
2–5. Uma ideia por slide, texto grande, dado do site.
6. Resumo/salve este post.
7. Fixo: capa do guia do tema + preço + "e mais N guias" + "Link na bio · @dosecerta_br".

**Reels (4–6 cenas, 20–40 s)**: mesma lógica, roteiro falado curto; última cena e última frase
da narração: "O passo a passo completo está no guia <título>, link na bio."

**Legenda**: gancho, 3–5 linhas de valor, CTA para a bio, `Conteúdo educativo. Não substitui
orientação médica.`, 3–5 hashtags de um conjunto fixo por categoria.

**Regras dadas à IA e checadas no validador**
- Só fatos presentes no `source`. Meia-vida sem dado: não mencionar.
- Proibido: "compre", "vendemos", "onde comprar", preço de peptídeo, promessa de resultado
  ("perca X kg"), "cura", menção a seringa/agulha em close, nome de vendedor.
- Permitido: preço do guia, calculadora grátis, dose de bula com a fonte.
- Português do Brasil com acentuação correta.

## Landing `/links`

`app/links/page.tsx`, estática, `noindex`, mobile primeiro: cabeçalho Dose Certa + "um projeto
Central Peptídeos"; kit em destaque; demais guias ativos (`getActiveEbooks`); calculadora de
reconstituição; blog; newsletter. Todo link com `utm_source=instagram&utm_medium=bio`
(`buildUtmUrl`). Evento `pagina: 'bio'` em `lib/track.ts`. Sem guia ativo: mostra só ferramentas
e blog (não dá 404, porque a bio sempre aponta para ela).

## Segredos (GitHub Actions)

`ANTHROPIC_API_KEY`, `IG_USER_ID`, `IG_ACCESS_TOKEN` (inicial; depois o banco guarda o
renovado), `BLOB_READ_WRITE_TOKEN`, `DATABASE_URL`.

## Erros

- Nada é publicado pela metade: carrossel só sai se todas as imagens e o container estiverem
  prontos; Reels só se o status for `FINISHED` em até 10 minutos.
- Falha em qualquer etapa → linha `status=erro` no banco, job falha, GitHub manda email.
- Tema que falhou na validação fica marcado e só volta em 60 dias.
- Limite da API (25 publicações por dia) não é problema com 2/dia.

## Testes

Vitest, sem rede: `validate` (número fora da fonte, palavra proibida, limites), `pick` (sem
repetição, carrossel ≠ reels no dia), `ebook-cta` (tema → guia, fallback kit), `instagram`
com `fetch` simulado (ordem das chamadas, espera do Reels, renovação do token), legenda.
Teste de render gera 1 PNG e confere o tamanho. `/links` entra no teste de links internos.
Antes de ligar o cron: 3 execuções `--dry` revisadas por você.

## Fora do escopo

Stories, resposta a comentários/DM, música no Reels, TikTok, impulsionamento, ajuste de horário
por insights (fica para depois de 30 dias). A API não informa se a conta está "recomendável":
isso se confere à mão em Configurações → Status da conta.

## Custos

Claude: centavos por dia. Vercel Blob e Actions: dentro do grátis (≈ 5 min por execução).
