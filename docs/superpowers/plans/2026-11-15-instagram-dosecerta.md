# Instagram @dosecerta_br — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use `- [ ]`.
> Spec: `docs/superpowers/specs/2026-11-15-instagram-dosecerta-design.md`.

**Goal:** Carrossel (12h) e Reels (19h30) diários no `@dosecerta_br`, gerados a partir do conteúdo
do site, terminando sempre na oferta dos guias, mais a landing `/links` da bio.

**Architecture:** Scripts Node em `scripts/social/` rodados com `tsx` por GitHub Actions. Funções
puras (temas, escolha, validação, legenda, CTA) testadas no Vitest; efeitos (Claude, render,
ffmpeg, Blob, Graph API, banco) isolados em módulos finos. Orquestração em `run.ts`.

**Tech Stack:** Next 16, TypeScript, zod 4, `@anthropic-ai/sdk` (`claude-opus-5-5`, saída
estruturada + `fallbacks: "default"`), `satori` + `@resvg/resvg-js`, `@fontsource/inter`, ffmpeg,
`edge-tts` (pip), `@vercel/blob`, drizzle/Postgres, Instagram API com login do Instagram.

Ambiente local: Node 20 em `/c/Users/julia/AppData/Roaming/nvm/v20.14.0` (o shell padrão é 16).
`N=/c/Users/julia/AppData/Roaming/nvm/v20.14.0/node.exe`.

---

## Arquivos

| Arquivo | Responsabilidade |
|---|---|
| `lib/site.ts` (mod.) | `INSTAGRAM_HANDLE`, `INSTAGRAM_NAME`, `INSTAGRAM_URL` |
| `app/links/page.tsx` | Landing da bio |
| `lib/promocao/utm.ts` (mod.) | `bioUrl(path)` |
| `scripts/social/types.ts` | `Topic`, `Draft`, `Format`, `PostRecord` |
| `scripts/social/topics.ts` | `buildTopics()` a partir de posts, fichas e comparativos |
| `scripts/social/pick.ts` | `pickTopic(topics, history, format, now)` (puro) |
| `scripts/social/validate.ts` | `validateDraft(draft, source)` (puro) |
| `scripts/social/caption.ts` | `buildCaption(draft, topic, cta)` + hashtags por categoria (puro) |
| `scripts/social/ebook-cta.ts` | `ctaFor(topic, activeSlugs)` (puro) + `fetchActiveEbookSlugs()` |
| `scripts/social/write.ts` | Chamada ao Claude com zod |
| `scripts/social/slides.tsx` | JSX dos slides (capa, conteúdo, CTA) para satori |
| `scripts/social/render.ts` | PNG → JPEG; Reels: TTS + ffmpeg |
| `scripts/social/blob.ts` | upload/remoção no Vercel Blob |
| `scripts/social/instagram.ts` | Cliente Graph API (fetch injetável) |
| `scripts/social/state.ts` | Histórico e token no Postgres |
| `scripts/social/run.ts` | CLI `carrossel|reels [--dry]` |
| `drizzle/schema.ts` (mod.) | `social_posts`, `social_state` |
| `.github/workflows/social.yml` | Cron + disparo manual |
| `tests/social.test.ts` | Testes das funções puras e do cliente IG |

---

### Task 1: Marca e landing `/links`

- [ ] `lib/site.ts`: `INSTAGRAM_HANDLE = 'dosecerta_br'`, `INSTAGRAM_NAME = 'Dose Certa'`,
      `INSTAGRAM_URL = 'https://www.instagram.com/dosecerta_br/'`.
- [ ] `lib/promocao/utm.ts`: `bioUrl(path)` = caminho relativo + `utm_source=instagram&utm_medium=bio&utm_campaign=bio`.
- [ ] `app/links/page.tsx`: `robots: { index: false }`; cabeçalho "Dose Certa · um projeto Central
      Peptídeos"; kit em destaque; guias ativos (`getActiveEbooks`) com `EbookCover` xs, preço e
      `bioUrl('/ebooks/<slug>')`; botões calculadora de reconstituição, todas as ferramentas, blog.
- [ ] Teste em `tests/social.test.ts`: `bioUrl('/ebooks/x')` contém `utm_source=instagram`.
- [ ] `tests/content.test.ts` reconhece `/links` (rota existe no app).

### Task 2: Tipos, temas e escolha

`Topic = { id: string; kind: 'post'|'peptide'|'comparison'; title: string; category: string;
peptides: string[]; url: string; source: string }`.

- [ ] `buildTopics()`: posts (`getArticles` + `getArticleBody`, sem frontmatter; `source` = título,
      tldr, corpo, FAQ), fichas (campos de `Peptide` em texto), comparativos (as duas fichas).
      `category` = categoria do 1º peptídeo ou `geral`. Melanotan II fora (sem oferta e sensível).
- [ ] `pickTopic(topics, history, format, now)`: descarta temas usados há < 45 dias; entre os
      restantes, nunca usados primeiro, depois o uso mais antigo; evita a mesma `category` do último
      post; sem candidato → o de uso mais antigo. Determinístico (empate pela ordem da lista).
- [ ] Testes: não repete em 45 dias; evita categoria do último; cai no mais antigo quando todos usados.

### Task 3: Validador e legenda

- [ ] `extractQuantities(text)`: regex de número + unidade (mg, mcg, µg, mL, ml, UI, U, unidades,
      %, semana(s), dia(s), hora(s), h, kg) → `"2.5 mg"` normalizado (vírgula → ponto, unidade minúscula,
      plural → singular).
- [ ] `validateDraft(draft, source)` → `string[]` de problemas: quantidade ausente da fonte; palavra
      proibida (`compre`, `comprar`, `vendemos`, `à venda`, `onde comprar`, `frete`, `pix`, `cura`,
      `garantido`, `perca \d+`, `emagreça \d+`, `sem efeito colateral`); slide > 220 caracteres;
      2–6 slides de conteúdo; 3–6 cenas.
- [ ] `buildCaption()`: gancho + corpo + CTA da bio + aviso educativo + hashtags (≤ 5, conjunto por
      categoria); corta corpo para ficar ≤ 2.200.
- [ ] Testes: número inventado reprovado; número da fonte aprovado (inclusive "2,5 mg" vs "2.5 mg");
      palavra proibida; legenda ≤ 2.200 e ≤ 5 hashtags.

### Task 4: CTA do guia

- [ ] `ctaFor(topic, activeSlugs)`: post → `ebookForPost`; ficha → `ebookForPeptide`; comparativo →
      `ebookForComparison`; se o escolhido não estiver ativo → kit; kit inativo → primeiro ativo; nada
      ativo → `null` (slide final só com calculadora + bio). Devolve `{ title, price, cover, others }`.
- [ ] `fetchActiveEbookSlugs()`: `GET ${SITE_URL}/busca.json`, ids `e-<slug>`.
- [ ] Teste com lista fixa de ativos.

### Task 5: Texto pelo Claude

- [ ] Instalar `@anthropic-ai/sdk`. `write.ts`: `client.beta.messages.parse` com `zodOutputFormat`,
      `model: 'claude-opus-5-5'`, `output_config.effort: 'medium'`, `betas: ['server-side-fallback-2026-07-01']`,
      `fallbacks: 'default'`. Schema: `{ hook, slides: {title, body}[], narration: string[], caption,
      coverQuestion }`. Prompt de sistema fixo (regras da spec, PT-BR, só fatos do `source`);
      a fonte vai na mensagem do usuário. `stop_reason === 'refusal'` → erro.
- [ ] Em `run.ts`: validar; com problemas, 1 nova chamada enviando a lista; falhou → próximo tema.

### Task 6: Render

- [ ] Instalar `satori`, `@resvg/resvg-js`, `@fontsource/inter`, `tsx`.
- [ ] `slides.tsx`: `CoverSlide`, `ContentSlide`, `CtaSlide`; marca Dose Certa, cor da categoria
      (`CATEGORY_HEX`), contador `n/total`, rodapé `@dosecerta_br`. Tamanho por formato.
- [ ] `render.ts`: `renderPng(el, w, h)`; `toJpeg(png)` via ffmpeg (`-q:v 2`);
      `tts(text, out)` via `edge-tts --voice pt-BR-FranciscaNeural`; `buildReel(scenes)` →
      cada cena = imagem + áudio (`-loop 1 -t <dur+0.4>`, `zoompan` leve), concat → MP4 H.264 + AAC,
      30 fps, 1080×1920.
- [ ] Verificação manual: `--dry` gera `social/out/<data>-<formato>/` e você olha os arquivos.

### Task 7: Publicação, banco e workflow

- [ ] `drizzle/schema.ts`: `socialPosts` (id, format, topicId, status, igMediaId, error, createdAt)
      e `socialState` (key PK, value text, updatedAt).
- [ ] `state.ts`: `getHistory()`, `record()`, `getToken()` (banco ou `IG_ACCESS_TOKEN`), `saveToken()`.
- [ ] `instagram.ts` com `fetch` injetável: `publishCarousel(urls, caption)`, `publishReel(url, caption)`
      (poll `status_code` a cada 30 s até `FINISHED`, máx. 10 min), `refreshToken()` (GET
      `/refresh_access_token?grant_type=ig_refresh_token`) quando faltam < 15 dias.
- [ ] `blob.ts`: `put('social/<data>/<arquivo>', buf, { access: 'public' })`; remove após publicar.
- [ ] `run.ts`: `SOCIAL_PAUSED=1` → sai; escolhe → escreve → valida → renderiza → (dry: salva e para)
      → sobe → publica → registra. Qualquer erro: registra `erro` e sai com código 1.
- [ ] Testes do cliente IG com `fetch` simulado: ordem das chamadas no carrossel; Reels espera
      `FINISHED`; `ERROR` vira exceção.
- [ ] `.github/workflows/social.yml`: `schedule` `0 15 * * *` (carrossel) e `30 22 * * *` (reels),
      `workflow_dispatch` (formato, dry); Node 20, `npm ci`, `apt-get install ffmpeg`, `pip install edge-tts`.
- [ ] `npm run check` + `npm run build` com Node 20.
