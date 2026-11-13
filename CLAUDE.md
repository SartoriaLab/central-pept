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
   `<Callout tone="warn|danger|info" title="...">texto</Callout>` e `<Link href="/rota">`.
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

## Páginas geradas a partir dos dados

- Frasco (`/ferramentas/reconstituicao/<peptideo>/<mg>`): um por `commonAmounts`. Peptídeo com
  um frasco só tem canonical para a calculadora e fica fora do sitemap (`isCanonicalVial`).
- Dose (`.../<peptideo>/dose/<mg>`): doses dos esquemas injetáveis semanais de `lib/titration.ts`
  (`lib/dose-pages.ts`).
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
- Eventos de analytics: `lib/track.ts`.

## Cuidados

- Tailwind só gera classes escritas por extenso no código (nada de `bg-${cor}`).
- Modo escuro usa tokens CSS em `app/globals.css`; prefira `text-ink`, `bg-surface` etc.
  a cores fixas.
- `lib/articles.ts` lê arquivos (`fs`): não importe em componentes client.
  A busca global carrega `/busca.json`.
- Banco só em newsletter e `/admin`. Mudou `drizzle/schema.ts` → `npm run db:push`.
