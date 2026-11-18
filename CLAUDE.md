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
7. App (PWA): botão "Instalar" fixo no cabeçalho (`InstallButton`), banner flutuante em todas as páginas
   (`InstallFloat`, no layout; fecha no X por `FLOAT_SNOOZE_DAYS`; fora de `/ebooks`, admin e embed; sobe
   quando há outra barra fixa marcada com `data-bottom-bar`), cartão embaixo do resultado da
   reconstituição (`InstallPrompt`) e página `/app` (links no menu, rodapé e `/links`).
   Todo botão usa `start()` do hook `useInstall`: instala em um toque quando o navegador oferece; senão abre
   a janela `InstallGuide` (layout) com os passos do aparelho. Os passos ficam só em
   `components/pwa/InstallSteps.tsx`, escolhidos por `guideKind` (`lib/install.ts`): Safari do iOS 26 (ícone
   das linhas à esquerda do endereço; em algumas versões, "•••" à direita), Safari antigo, Chrome do iPhone, Android, navegador do Instagram. Mudou o Safari → mude lá.
   No iPhone a janela mostra o desenho da barra do navegador e o botão "Mostrar onde tocar", que troca a
   janela por um lembrete pequeno com seta apontando para o botão (`hintSpot` em `lib/install.ts`); o clique
   grava `Instalar Guia` e o tipo de guia vai em `guia` (relatório "Passo a passo de instalação por navegador").
   `app/manifest.ts` precisa de `scope: '/'` (sem ele o app instalado mostra a barra de endereço fora de
   `/ferramentas`). Instalações: `App Instalado`, uma vez por aparelho, contado só em
   `components/layout/ServiceWorker.tsx`; relatório em `/admin/assistente/eventos` ("App instalado").

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
6. Calculadora de reconstituição: oferta do guia T1 ("Você Tem Certeza de Que Entende Seu Frasco?"). No primeiro
   cálculo da visita o resultado fica travado por uma pergunta com os números da pessoa (`lib/quiz-frasco.ts`,
   `FrascoQuiz`; desliga em `QUIZ_GATE_ENABLED`); a resposta abre a oferta. Evento `Quiz Frasco`. Ordem da tela: número e seringa → oferta (copy com o nome do peptídeo, prop `subject`; botão verde direto no checkout, botão para a página) → detalhes do frasco.
   Preço de lançamento: `launch` no ebook gera a frase "R$ X nas N primeiras unidades. Depois, R$ Y". Só vale
   enquanto o aumento vai acontecer: ao subir o preço na Kiwify, apague `launch` e ponha `price: after` no mesmo dia.
   Tabela personalizada (`TAB`, R$ 9,90): oferta extra no checkout do T1.
   Produto "digital" na Kiwify que redireciona para `/tabela-personalizada?k=<chave>` (só o hash da chave fica
   em `components/tabela/TabelaGenerator.tsx`; trocou a chave na Kiwify → troque o hash). Cálculo em `lib/tabela.ts`.
   `checkoutDefault` serve de checkout quando a variável de ambiente não existe.
7. Depois da compra de um guia, a Kiwify manda para `/ebooks/obrigado?guia=<slug>`: acesso + upsell do kit
   (`KIT_UPSELL`, oferta própria do kit). Cupom do pop-up de saída: `EXIT_COUPON` (precisa existir na Kiwify).

## Instagram @dosecerta_br (automático)

1. GitHub Actions (`.github/workflows/social.yml`) publica carrossel às 12h e Reels às 19h30 (Brasília).
   Pausa: variável do repo `SOCIAL_PAUSED=1`. Setup da conta e segredos: `docs/instagram-setup.md`.
2. Código em `scripts/social/` (rodado com `tsx`): temas saem de posts, fichas e comparativos
   (`topics.ts`; posts de compra/preço e Melanotan II ficam fora), o Claude escreve (`write.ts`) e
   `validate.ts` barra número que não está na fonte e linguagem de venda. Slide e fala final do guia
   seguem `ebookFor*` (`ebook-cta.ts`).
3. `npm run social:preview` renderiza um exemplo sem API; `npm run social:carrossel -- --dry` gera de
   verdade em `social/out/` sem publicar. Precisa de ffmpeg e `pip install edge-tts`.
   Reels: voz com tempo por palavra em `voice.ts` (ElevenLabs com `ELEVENLABS_API_KEY` e a variável
   `ELEVENLABS_VOICE_ID`; sem chave, edge-tts via `tts_words.py`), legenda palavra a palavra em
   `captions.ts`, transições e música de `scripts/social/music/` (uma trilha por dia) em `render.ts`.
   Gotinha (mascote, gota amarela do logo) é a protagonista: desenho em `mascot.tsx`, poses em `poses.ts`
   (o Claude escolhe uma por fala e por slide), boca e piscadas em `lipsync.ts`. No Reels ela é uma camada
   à parte, sobreposta pelo ffmpeg na posição `REEL_MASCOT` (`slides.tsx`); no carrossel é desenhada no slide.
   Ordem fixa do Reels: gancho (mania ou erro do dia a dia, nunca cumprimento) → bordão de abertura → falas →
   chamada do guia → bordão de fechamento. Bordões em `caption.ts` (`BORDAO_*`), nunca no texto do Claude;
   mudou um bordão → confira se a voz gratuita não lê em espanhol. Folha de poses: `npm run social:gotinha`.
   Reels de até ~35 s (3 a 4 falas), gancho escrito na tela no primeiro quadro, bordões na cena do gancho
   e na da chamada final, que pede "comenta GUIA" e o envio do vídeo (`ctaSpeech`).
   "Comenta GUIA" → direct: webhook `app/api/instagram/webhook` (regras em `lib/instagram-dm.ts`) manda a
   página do guia do post com o cupom `EXIT_COUPON` e responde o comentário em público; o guia vem do título
   entre aspas da linha 📘 da legenda (`ctaLine`; mudou o formato dela → mude `ebookFromCaption`). Um
   direct por pessoa por post (`social_dms`). Setup na Meta: `docs/instagram-setup.md`, Parte 6.
4. Histórico e token renovado ficam em `social_posts`/`social_state`, criadas pelo próprio robô
   (`ensureTables` em `state.ts`, espelho de `drizzle/schema.ts`: mudou um, mude o outro). O webhook
   cria só `social_state` e `social_dms` (`ensureWebhookTables`), pois pode rodar antes do robô.
5. Bio do perfil aponta para `/links` (noindex), com UTM `instagram/bio` (`bioUrl`).

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
- Banco só em newsletter, `/admin` e o webhook do Instagram. Mudou `drizzle/schema.ts` → `npm run db:push`.
