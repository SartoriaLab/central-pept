# Central Peptídeos

Calculadoras, enciclopédia e guias sobre peptídeos e medicamentos GLP-1, em português.
Produção: https://centralpeptideos.com.br (Vercel).

**Stack**: Next.js 16 (App Router, páginas estáticas) · TypeScript · Tailwind CSS 3 ·
MDX (`next-mdx-remote`) · Drizzle + Postgres (só newsletter e área admin) · Vitest.

## Rodar localmente

Requer Node 20 (`.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:3000
```

O build funciona sem banco: `DATABASE_URL` só é necessária para a newsletter e o `/admin`.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` / `npm start` | build de produção e servidor |
| `npm test` | testes (fórmulas, integridade do conteúdo, links internos, .ics) |
| `npm run lint` / `npm run typecheck` | ESLint e TypeScript |
| `npm run check` | typecheck + lint + test (o CI roda isso e o build) |
| `npm run db:push` | aplica `drizzle/schema.ts` no banco de `DATABASE_URL` |

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `SITE_URL` | URL canônica (padrão: produção) |
| `DATABASE_URL` | Postgres: newsletter e admin |
| `ASSISTENTE_USER` / `ASSISTENTE_PASS` | Basic Auth de `/admin` e `/api/assistente` |
| `CRON_SECRET` | autoriza o cron da Vercel (`/api/assistente/cron/*`) |
| `KIWIFY_WEBHOOK_SECRET` | assinatura HMAC do webhook da Kiwify |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | ativa o Plausible |
| `NEXT_PUBLIC_GSC_VERIFICATION` | verificação do Google Search Console |

## Estrutura

```
app/                    rotas (App Router)
  blog/[slug]/          página única que renderiza content/blog/*.mdx
  ferramentas/<slug>/   uma pasta por calculadora
  peptideos/, comparar/, medicamentos/, glossario/ ...
  busca.json/           índice da busca global (gerado no build)
  api/newsletter/       inscrição e descadastro
content/blog/           posts em MDX (frontmatter validado em lib/articles.ts)
components/             UI; calculator/ tem as calculadoras (client)
lib/                    dados e regras: peptides, brands, comparisons, titration,
                        glossary, articles, tools, site, og, ics, category-style
drizzle/schema.ts       tabelas do Postgres
tests/                  Vitest
proxy.ts                Basic Auth das rotas protegidas
```

Como adicionar conteúdo (post, peptídeo, ferramenta): ver [CLAUDE.md](CLAUDE.md).

## Fórmulas (referência)

```
concentração = mg_frasco / água_ml
unidades     = dose_mg × água_ml × 100 / mg_frasco      (seringa de insulina U-100)
doses        = mg_frasco / dose_mg
água_ml      = unidades × mg_frasco / (dose_mg × 100)    (modo "tenho as unidades")
```

Implementação e testes: `components/calculator/calc.ts`, `tests/calc.test.ts`.
