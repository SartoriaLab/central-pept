# Central Peptídeos — guia de manutenção

Site estático em Next 16 (App Router). Conteúdo em português do Brasil, com acentuação correta.
Antes de commitar: `npm run check` e `npm run build` (Node 20).

## Adicionar um post

1. Crie `content/blog/<slug>.mdx`. O nome do arquivo é a URL (`/blog/<slug>`).
2. Frontmatter (validado em `lib/articles.ts`; campo desconhecido quebra o build):

   ```yaml
   ---
   title: "Título do post"
   excerpt: "Resumo de 1–2 frases (vira a description)."
   tldr: "Resposta direta em um parágrafo."
   publishedAt: "2026-11-13"
   updatedAt: "2026-11-20"        # opcional
   readMinutes: 6
   tags: [glp-1, dose]
   relatedPeptides: [tirzepatida] # slugs de lib/peptides.ts
   coverColor: from-teal-500/20 to-sky-500/10
   metaTitle: "..."               # opcional, título do Google
   metaDescription: "..."         # opcional
   faq:                           # opcional, gera FAQ + JSON-LD
     - q: "Pergunta?"
       a: "Resposta."
   ---
   ```

3. Corpo em Markdown (tabelas GFM funcionam). Componentes disponíveis:
   `<Callout tone="warn|danger|info" title="...">texto</Callout>`, `<Link href="/rota">` e `<Guia />`
   (oferta do guia do próprio post no meio do texto; com ele, o card do fim some).
   Não use expressões `{...}` nem outros componentes: o teste de conteúdo falha.
4. Links internos são conferidos pelos testes (`tests/content.test.ts`): rota inexistente falha.

Feed, sitemap, busca, páginas de tag e imagem de compartilhamento saem sozinhos.

## Adicionar um peptídeo

1. Nova entrada em `lib/peptides.ts` (`slug` único, `category` de `CATEGORY_LABELS`).
2. Se tiver frascos/apresentações, confira `lib/vials.ts`; marcas em `lib/brands.ts`;
   comparações em `lib/comparisons.ts`.
3. `npm test` confere slugs repetidos e referências quebradas entre esses arquivos.

## Adicionar uma ferramenta

1. Entrada em `lib/tools.ts` (título, descrições, OG, prioridade no sitemap).
   Home, `/ferramentas`, busca, sitemap e imagem OG leem daqui.
2. Página em `app/ferramentas/<slug>/page.tsx`; componente client em `components/calculator/`.
3. Ícone e cor em `components/ui/ToolIcon.tsx`.
4. Estado na URL + último uso salvo: `useUrlState(padrões, codecs, { storageKey })`
   (`components/calculator/useUrlState.ts`, codecs em `lib/url-state.ts`). Só o que difere
   do padrão vai para a URL. Botões copiar/compartilhar/imprimir/limpar: `ToolActions`.
5. Versão para iframe: `app/embed/<slug>/page.tsx` (noindex, canonical na ferramenta) com
   prop `embed` no componente (sem localStorage nem botões) e `<EmbedSnippet tool=...>` na página.
   O diário não tem embed (depende de localStorage).
6. O service worker (`app/sw.js/route.ts`) pré-carrega toda ferramenta de `lib/tools.ts`
   para uso offline; só registra em produção.

## Ebooks pagos

1. Catálogo em `lib/ebooks.ts` (fonte única); estratégia, títulos e preços em `docs/ebooks-estrategia.md`.
2. Cada página mostra no máximo uma oferta (`ebookFor*` + `toOffer`). Peptídeo, post, ferramenta,
   categoria ou seção entra em `places` de um único ebook; comparativo e marca seguem o peptídeo.
   Melanotan II não tem oferta (`NO_EBOOK_PEPTIDES`).
3. Ebook só aparece (oferta, `/ebooks/<slug>`, sitemap, busca) com a URL https da Kiwify na variável
   `checkoutEnv` (ex.: `KIWIFY_CHECKOUT_TIRZEPATIDA`). Sem ela fica oculto.
4. Componente `<EbookOffer offer=... variant="card|line|result">`; calculadora recebe a oferta por
   prop e não mostra nada no embed nem na impressão. Use `offerFor(ebookFor*(...))`: guia sem
   checkout cai para T1 (reconstituição) ou, com `{ pen: true }`, para o kit.
   `result` abre a barra fixa do celular (`OfferBar`) quando o bloco sai da tela; o pop-up de saída
   (`ExitOffer`, no layout) usa a oferta da página, 1 vez a cada 7 dias, e desliga em
   `EXIT_OFFER_ENABLED`. Eventos levam `pagina` (`lib/track.ts`).
5. `npm test` (`tests/ebooks.test.ts`) confere slugs, referências e uma oferta por página.

## Páginas geradas a partir dos dados

- Frasco (`/ferramentas/reconstituicao/<peptideo>/<mg>`): um por `commonAmounts`. Peptídeo com
  um frasco só tem canonical para a calculadora e fica fora do sitemap (`isCanonicalVial`).
- Dose (`.../<peptideo>/dose/<mg>`): doses dos esquemas injetáveis semanais de `lib/titration.ts`
  e doses de bula de `LABEL_DOSES` (`lib/dose-pages.ts`). Peptídeo sem dose aprovada não ganha página.
- Comparações de marca (`/comparar/<marca>-vs-<marca>`): `lib/brand-comparisons.ts`, com dados de
  `lib/brands.ts`; mesma rota das comparações de moléculas (`lib/comparisons.ts`).
- Listas por objetivo e transversais (`/peptideos/categoria/<slug>`): `lib/categories.ts`.
  Objetivo usa `categories`; lista (WADA, aprovados, meia-vida) usa `match`/`sort` e lê
  `wadaProhibited`, `regulatoryStatus` e `halfLife` das fichas.
- Meia-vida sem dado publicado: escreva "Não caracterizada…", nunca um número estimado.
- Tags com menos de 2 artigos ficam `noindex` e fora do sitemap (`MIN_TAG_ARTICLES`).
- Seringas (`/seringas/<tamanho>`): `lib/syringes.ts`.

## Fontes únicas (não duplique)

- URL, nome, host e email do site: `lib/site.ts`.
- Cores por categoria e selos de status: `lib/category-style.ts`.
- Exportar calendário: `lib/ics.ts`.
- Eventos de analytics: `lib/track.ts` (nomes em `lib/event-names.ts`). As ações de `STORED_EVENTS`
  (`lib/site-events.ts`) vão para a tabela `site_events` via `/api/evento`; relatório em
  `/admin/assistente/eventos`. "Visto" e "calculado" não vão ao banco (volume): visitas vêm da Vercel Analytics.

## Cuidados

- Tailwind só gera classes escritas por extenso no código (nada de `bg-${cor}`).
- Modo escuro usa tokens CSS em `app/globals.css`; prefira `text-ink`, `bg-surface` etc.
  a cores fixas.
- `lib/articles.ts` lê arquivos (`fs`): não importe em componentes client.
  A busca global carrega `/busca.json`.
- Banco só em newsletter e `/admin`. Mudou `drizzle/schema.ts` → `npm run db:push`.
