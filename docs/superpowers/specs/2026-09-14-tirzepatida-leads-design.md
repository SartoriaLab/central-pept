# Cluster Tirzepatida — mais leads pro Fornecedor Oficial

Data: 2026-09-14
Status: aprovado

## Objetivo

Aumentar cliques qualificados no card "Fornecedor Oficial" (WhatsApp) vindos de visitantes interessados em tirzepatida. Duas alavancas: (1) conversão on-site com CTA contextual por peptídeo e mensagem de WhatsApp que já diz o que o lead quer; (2) conteúdo novo de intenção comercial ("quanto custa", "onde comprar", "como reconstituir", "Mounjaro falso").

O fornecedor entrega produto não especificado, então a copy é neutra: "tirzepatida com procedência", nunca "Mounjaro original" ou "manipulada".

## Fora de escopo

- Landing page paga `/tirzepatida`.
- Troca do número/fornecedor.
- Migration no banco (o peptídeo do clique vai em coluna existente).
- Alterar o card em páginas que não falam de tirzepatida (comportamento atual preservado quando `peptide` não é passado).

## Parte 1 — Conversão

### 1.1 `lib/affiliates.ts`

- `AffiliateProduct.message` vira template. Novo campo opcional `messageWithPeptide?: string` com placeholder `{peptide}`.
  - `message`: "Olá! Vim do site Central Peptídeos e gostaria de mais informações."
  - `messageWithPeptide`: "Olá! Vim do site Central Peptídeos e quero informações sobre {peptide}."
- Novo `PEPTIDE_COPY: Record<string, { title: string; blurb: string; cta: string }>` com entrada para `tirzepatida`:
  - title: "Tirzepatida com procedência"
  - blurb: "Fornecedor verificado. Tire dúvidas e receba orçamento direto no WhatsApp."
  - cta: "Quero tirzepatida"
- Novo helper `getAffiliateCopy(productId, peptideSlug?)` → copy do peptídeo se existir, senão copy padrão do produto.
- Novo helper `buildAffiliateMessage(product, peptideName?)` → usa `messageWithPeptide` quando há nome, senão `message`.

### 1.2 `components/affiliate/AffiliateBox.tsx`

- Nova prop `peptide?: string` (slug).
- Quando presente: usa `getAffiliateCopy` para título/blurb/CTA (props explícitas `title/blurb/cta` continuam com precedência) e anexa `&pep=<slug>` ao href de `/api/click`.
- Sem `peptide`: comportamento idêntico ao atual.

### 1.3 `app/api/click/route.ts`

- Lê `pep`. Se corresponder a um peptídeo em `lib/peptides.ts`, usa o `name` do peptídeo em `buildAffiliateMessage`. Slug desconhecido é ignorado (mensagem padrão).
- Salva `pep` em `utmContent` quando `utm_content` não foi informado (sem migration). Slot continua identificando a página.

### 1.4 `components/affiliate/WhatsAppStickyBar.tsx` (novo, client)

- Barra fixa inferior, só mobile (`lg:hidden`), aparece após scroll ≥ 40% da página, some ao clicar no "×" (guarda em `sessionStorage` chave `wa-sticky-dismissed`).
- Props: `productId`, `slot`, `peptide`. Texto: copy de `getAffiliateCopy`. Link = mesmo href de `/api/click` com `pep`.
- Não renderiza se `sessionStorage` marcado ou se o produto não existe.
- Montada em:
  - `app/peptideos/[slug]/page.tsx` quando `p.slug === 'tirzepatida'` (slot `sticky-peptide-tirzepatida`).
  - Posts cujo `relatedPeptides` inclui `tirzepatida`: via `ArticleLayout` (slot `sticky-blog-<slug>`). Assim os 4 posts novos e os 2 existentes ganham a barra sem código repetido.
- Evita conflito com a barra fixa da calculadora de reconstituição: não é montada em `/ferramentas/*`.

### 1.5 Pontos de contato existentes

- `app/peptideos/[slug]/page.tsx`: `AffiliateBox` recebe `peptide={p.slug}`. Efeito imediato: só tirzepatida muda copy; os outros ficam iguais (sem entrada em `PEPTIDE_COPY`).
- `app/comparar/[slug]/page.tsx`: `peptide` = primeiro slug da comparação que tenha entrada em `PEPTIDE_COPY` (hoje só tirzepatida), senão sem prop.
- Posts `tirzepatida-manipulada-seguranca` e `semaglutida-vs-tirzepatida`: box de rodapé recebe `peptide="tirzepatida"`; box adicional no meio (após a 2ª ou 3ª `<h2>`), slot `blog-<slug>-mid`.
- `components/calculator/ReconstitutionCalculator.tsx`: quando `peptide?.slug === 'tirzepatida'` e há resultado, renderiza `AffiliateBox` variant compact abaixo do painel de resultado (desktop e mobile), slot `reconstituicao-result-tirzepatida`, `peptide="tirzepatida"`.
- `components/calculator/TitrationCalculator.tsx`: quando `schemeId` começa com `tirzepatida-`, renderiza `AffiliateBox` abaixo da tabela de titulação, slot `titulacao-result-tirzepatida`, `peptide="tirzepatida"`. O box de rodapé da página (`titulacao-bottom`) fica.

## Parte 2 — Conteúdo

Padrão dos posts: mesmo formato dos existentes (página TSX em `app/blog/<slug>/page.tsx`, entrada em `lib/articles.ts` com `tldr`, `tags` incluindo `tirzepatida`, `relatedPeptides: ['tirzepatida']`, FAQ com 4-6 perguntas usando `components/ui/FAQ` com schema FAQPage se o componente já emitir, links internos para calculadora com `?peptide=tirzepatida`, para `/peptideos/tirzepatida`, para os outros posts do cluster e para `/comparar/semaglutida-vs-tirzepatida`). Tom informativo e neutro; nada de promessa de resultado ou preço fechado do fornecedor. Faixas de preço apresentadas como estimativas de mercado com data. Disclaimer médico já vem do layout.

### 2.1 `tirzepatida-preco-quanto-custa`

- Título: "Tirzepatida: quanto custa no Brasil em 2026 (Mounjaro, manipulada e frasco)"
- Seções: as 3 formas de comprar; tabela custo mensal por dose (2,5 / 5 / 10 / 15 mg) para cada forma; por que o preço varia (patente, importação, frio, dose); custo por mg; como não pagar caro por produto ruim; FAQ.
- CTAs: box meio (`blog-tirze-preco-mid`) após a tabela; rodapé (`blog-tirze-preco`).

### 2.2 `onde-comprar-tirzepatida`

- Título: "Onde comprar tirzepatida com segurança: guia de procedência (2026)"
- Seções: canais existentes (farmácia, manipulação, fornecedor especializado) e o que cada um exige; checklist de procedência (COA/HPLC, lote, cadeia de frio, nota/recibo, atendimento com farmacêutico, prescrição); red flags (marketplace, preço fora da curva, sem lote, pressão de venda); o que perguntar no primeiro contato; FAQ.
- CTAs: box meio após o checklist (`blog-onde-comprar-tirze-mid`); rodapé (`blog-onde-comprar-tirze`). É o post com CTA mais forte do cluster.

### 2.3 `como-reconstituir-tirzepatida`

- Título: "Como reconstituir tirzepatida 5, 10 e 15 mg: quantas unidades por dose"
- Seções: material; passo a passo; tabela pronta (frasco × água × dose → unidades) para 5/10/15 mg com 1 ml e 2 ml; erros comuns; armazenamento; FAQ.
- Links fortes para `/ferramentas/reconstituicao?peptide=tirzepatida` e `/ferramentas/titulacao`.
- CTAs: box meio após a tabela (`blog-reconstituir-tirze-mid`); rodapé (`blog-reconstituir-tirze`).

### 2.4 `mounjaro-falso-como-identificar`

- Título: "Mounjaro falso: como identificar caneta e frasco falsificados"
- Espelha a estrutura de `ozempic-falso-como-identificar`: onde o risco é maior; caixa; caneta (Mounjaro KwikPen no Brasil); frasco liofilizado (rótulo, lote, COA); consulta ANVISA; o que fazer se suspeitar; FAQ.
- CTAs: box meio (`blog-mounjaro-falso-mid`); rodapé (`blog-mounjaro-falso`).

### 2.5 Ajustes em conteúdo existente

- `lib/articles.ts`: adicionar tag `tirzepatida` em `semaglutida-vs-tirzepatida`; adicionar links cruzados nos dois posts existentes para os 4 novos (lista "Leia também" no fim, antes do box de rodapé).
- `components/ui/FAQ.tsx`: `FAQItem` ganha campo opcional `link?: { label: string; href: string }`, renderizado como link interno abaixo da resposta. O JSON-LD FAQPage continua usando só `a` (texto).
- `lib/peptide-faqs.ts`: para `p.slug === 'tirzepatida'`, adicionar 2 perguntas: "Quanto custa tirzepatida no Brasil?" e "Onde comprar tirzepatida com segurança?", cada uma com resposta curta (string) e `link` para o post correspondente.
- A sticky bar via `ArticleLayout` também aparece em `como-reconstituir-semaglutida`, cujo `relatedPeptides` já inclui tirzepatida. Aceitável: o post cita tirzepatida.
- Posts entram no sitemap e feed automaticamente via `getArticles()`.

## Medição

- Cliques por `slot` e `utm_content` (= peptídeo) na tabela `affiliate_clicks`. Comparar 30 dias antes/depois para slots com `tirze`.
- Mensagem do WhatsApp com nome do peptídeo permite ao fornecedor identificar a origem sem perguntar.

## Testes / verificação

- `npx tsc --noEmit` e `npm run build` limpos.
- `GET /api/click?p=fornecedor_oficial&slot=x&pep=tirzepatida` → 302 para `wa.me/...?text=` com "sobre Tirzepatida"; sem `pep` → mensagem antiga; `pep=inexistente` → mensagem antiga.
- Card em `/peptideos/semaglutida` inalterado; em `/peptideos/tirzepatida` com copy nova.
- Sticky bar aparece só em mobile, some ao fechar, não reaparece na mesma sessão.
- 4 posts renderizam, aparecem em `/blog`, `/blog/tag/tirzepatida`, sitemap e feed.
