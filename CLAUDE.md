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
4. Todo peptídeo entra em `places.peptides` de um ebook (`lib/ebooks.ts`), senão o teste falha.
5. Componente client recebe lista enxuta, nunca `getPeptides()`: `getCalcPeptides()` (calculadoras),
   `getCardPeptides()` (enciclopédia) e `getComparePeptides()` (comparador). A lista inteira como prop vai
   para o HTML de cada página. Campo novo usado no client → inclua em `CALC_FIELDS`/`CARD_FIELDS`.

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

8. Dose esquecida (`/ferramentas/dose-esquecida`): prazos de bula em `MISSED_MEDS` (`lib/missed-dose.ts`), os
   mesmos do post `dose-esquecida-semaglutida-tirzepatida`; mudou a bula → mude os dois. Sem `storageKey`
   de propósito (data guardada mostraria atraso antigo). Oferta segue o medicamento escolhido.

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
   Visual: oferta, pergunta do frasco, faixa, barra e pop-up são chamativos de propósito (painel escuro, amarelo,
   botão verde, caixa alta). Decisão do dono em 20/11/2026: uma versão no tom calmo do site foi publicada e
   desfeita no mesmo dia. Não suavize a oferta sem ele pedir.
   Capa (`EbookCover`) tem cara de livro; a landing mostra a página de amostra atrás dela.
5. `npm test` (`tests/ebooks.test.ts`) confere slugs, referências e uma oferta por página.
6. Calculadora de reconstituição: oferta do guia T1 ("Você Tem Certeza de Que Entende Seu Frasco?"). No primeiro
   cálculo da visita o número aparece na hora e o topo da oferta traz uma pergunta opcional com os números da pessoa
   (`lib/quiz-frasco.ts`, `FrascoQuiz`; desliga em `QUIZ_GATE_ENABLED`); a resposta vira a explicação no lugar dela.
   Não trave o resultado atrás da pergunta (testado e desfeito em 21/11/2026). Evento `Quiz Frasco`. Ordem da tela: número e seringa → oferta (copy com o nome do peptídeo, prop `subject`; botão verde direto no checkout, botão para a página) → detalhes do frasco.
   Preço de lançamento: `launch` no ebook gera a frase "R$ X nas N primeiras unidades. Depois, R$ Y". Só vale
   enquanto o aumento vai acontecer: ao subir o preço na Kiwify, apague `launch` e ponha `price: after` no mesmo dia.
   Tabela personalizada (`TAB`, R$ 9,90): é a oferta do **resultado** (`tableOffer()` → prop `tableOffer`), com o
   guia como oferta extra no checkout dela (frase `addon`, preço `BUMP_PRICE`; mudou o bump na Kiwify → mude lá).
   O guia T1 segue na calculadora vazia, na home e como reserva (peptídeo personalizado ou de `NO_EBOOK_PEPTIDES`,
   que a página da tabela não lista). No checkout do T1 a tabela continua como oferta extra.
   Produto "digital" na Kiwify que redireciona para `/tabela-personalizada?k=<chave>` (só o hash da chave fica
   em `components/tabela/TabelaGenerator.tsx`; trocou a chave na Kiwify → troque o hash). Cálculo em `lib/tabela.ts`.
   `checkoutDefault` serve de checkout quando a variável de ambiente não existe.
7. Depois da compra de um guia, a Kiwify manda para `/ebooks/obrigado?guia=<slug>`: acesso + upsell do kit
   (`KIT_UPSELL`, oferta própria do kit). Cupom do pop-up de saída: `EXIT_COUPON` (precisa existir na Kiwify).

## Instagram @dosecerta_br (automático)

1. Roda no computador do dono **sem IA**, pelo Agendador do Windows (pasta `\DoseCerta\`, criada por
   `npm run social:agendar`): carrossel todo dia às 12h; Reels todo dia no pico de cada dia (19h de
   domingo a quinta, 18h na sexta, 10h no sábado; `REELS_HOURS` em `queue.ts` = gatilhos do `agendar.ps1`).
   Os temas de `VIRAL_RANK` (`pick.ts`, levantamento dos Reels mais vistos do nicho) saem primeiro, nessa
   ordem, e o Reels escolhe antes do carrossel no mesmo dia. A tarefa chama `agendado.ps1`, que roda `run.ts <formato> --fila`:
   publica o `texto.json` pronto de `social/fila/<data>-<formato>/` (reaproveita a prévia de
   `social/out/`). Sem texto para o dia, não publica e sai com código 3 (log em `social/logs/`): a
   fila acabou, hora de o Claude gerar mais (`run.ts plano` + textos). `agendado.ps1 -ComIA` escreve
   na hora com `claude -p`. PC ligado e usuário logado; desligado no horário → roda ao entrar.
   Um post por formato por dia (`publishedOn`; `--force` passa por cima); sem as variáveis de
   publicação no `.env.local` para logo no começo. O workflow do GitHub ficou só manual (precisa de
   `ANTHROPIC_API_KEY`): não volte o `schedule` lá, seriam dois robôs. As tarefas do app Claude
   (`dosecerta-carrossel`, `dosecerta-reels`; `--brief` + `--draft`, a conversa escreve) ficaram
   desativadas: ligar as duas junto com o Agendador = dois robôs.
   Pausa: `npm run social:agendar -- -Remover` ou `SOCIAL_PAUSED=1`. Setup: `docs/instagram-setup.md` (Parte 7).
   Fila (Parte 8): `run.ts <formato> --fila` (código 3 = sem texto válido). `run.ts plano --dias 30`
   monta a fila (`queue.ts`, mesma escolha de tema do robô) e `--check <pasta>` só valida.
   `topicPriority` (`pick.ts`) põe primeiro as dúvidas práticas de GLP-1. `run.ts previa` gera a
   fila em `social/out/` e a publicação reaproveita (voz em cache em `social/out/_voz`).
   Visual "papel" (`papel.tsx`, desde 21/11/2026, inspirado no explicador do @atlasconhecimento): fundo creme
   quadriculado, título em duas linhas na fonte Anton (escura + destaque vermelho/azul), desenho plano no meio
   (frasco, frascos, numero, barras, pontos, linha, lista, carimbo, icone), fonte do dado no rodapé. Carrossel:
   tipo por slide (`layouts.ts`, campo `layout` obrigatório; com 4+ slides, ao menos um fora de "padrao") vira
   o desenho do slide (`carouselSlide` em `render.ts`). Inter e Anton não têm ✓/✗/≠: marcas são SVG e "≠" sai em Inter.
2. Código em `scripts/social/` (rodado com `tsx`): temas saem de posts, fichas e comparativos
   (`topics.ts`; posts de compra/preço e Melanotan II ficam fora), o Claude escreve (`write.ts`: API
   com `ANTHROPIC_API_KEY`; sem ela, `claude -p` da assinatura, com `CLAUDE_CODE_OAUTH_TOKEN` do
   `claude setup-token`; nas tarefas do app, a própria conversa escreve) e
   `validate.ts` barra número que não está na fonte e linguagem de venda. Slide e fala final do guia
   seguem `ebookFor*` (`ebook-cta.ts`).
3. `npm run social:preview` renderiza um exemplo sem API; `npm run social:carrossel -- --dry` gera de
   verdade em `social/out/` sem publicar. Precisa de ffmpeg e `pip install edge-tts`.
   Reels: explicador de 40 a 60 s em cenas (`scenes` no texto: 8 a 12, até 170 palavras, gancho de até 10, no
   máximo 3 números: padrões dos Reels mais vistos do nicho, regras em `write.ts`; uma frase por cena, com selo,
   título de duas linhas, desenho e fonte; regras em `validate.ts`, `sceneProblems`). Animado quadro a
   quadro a 30 fps (`motion.ts`, puro; quadros em RGBA cru no pipe do ffmpeg): fundo, selo e marca não cortam;
   o título entra linha a linha de trás de uma máscara e sai subindo no respiro do fim da cena; o desenho entra
   por partes no ritmo da fala (frasco cai com mola, lista aparece apagada e acende item a item, barras crescem,
   número conta, carimbo bate) e flutua de leve; desenho igual ao da cena vizinha continua na tela. Legenda em
   pílula escura que pula a cada bloco. O resvg roda com `loadSystemFonts: false` e a grade do papel é de linhas
   soltas: sem isso o quadro custa ~250 ms em vez de ~70 ms (90 s de vídeo ≈ 3 min). Pronúncia em `pronuncia.ts`
   (marca, estudo, sigla e unidade ganham grafia falada só no áudio; `relabel` devolve a palavra original à
   legenda), conferida com transcrição (faster-whisper medium): mudou a voz → confira de novo. Texto antigo da fila (só `narration`) ainda vale: `scenesFor` (`scenes.ts`) monta uma
   cena por frase. Voz com tempo por palavra em `voice.ts` (ElevenLabs com `ELEVENLABS_API_KEY` e a variável
   `ELEVENLABS_VOICE_ID`; sem chave, edge-tts via `tts_words.py`), blocos da legenda em `captions.ts`,
   música de `scripts/social/music/` (uma trilha por dia) em `render.ts`.
   Sem mascote nem bordão (decisão do dono em 21/11/2026): a voz é a do perfil, em primeira pessoa; o logo
   assina o topo de todo quadro e o protagonista na tela é o dado. O validador barra os bordões antigos
   (`CATCHPHRASE`). Ordem fixa do Reels: gancho (nunca cumprimento) → cenas → chamada final, que pede
   "comenta GUIA" e o envio do vídeo (`ctaSpeech`).
   Exemplo pronto: `social/exemplos/retatrutida-reels/` (`run.ts reels --draft <pasta> --dry`).
   Mudou o visual → troque `VISUAL` em `run.ts`, senão a publicação reaproveita a prévia antiga.
   "Comenta GUIA" → direct: webhook `app/api/instagram/webhook` (regras em `lib/instagram-dm.ts`) manda a
   página do guia do post com o cupom `EXIT_COUPON` e responde o comentário em público; o guia vem do título
   entre aspas da linha 📘 da legenda (`ctaLine`; mudou o formato dela → mude `ebookFromCaption`). Um
   direct por pessoa por post (`social_dms`). Setup na Meta: `docs/instagram-setup.md`, Parte 6.
4. Token: o do login unificado é do Facebook (`EAA…`), usa `graph.facebook.com` (`apiBase`) e renova
   por `fb_exchange_token` com `IG_APP_SECRET` no `.env.local` (`refreshToken`); o `IG…` usa
   `refresh_access_token`. Histórico e token renovado ficam em `social_posts`/`social_state`, criadas pelo próprio robô
   (`ensureTables` em `state.ts`, espelho de `drizzle/schema.ts`: mudou um, mude o outro). O webhook
   cria só `social_state` e `social_dms` (`ensureWebhookTables`), pois pode rodar antes do robô.
5. Bio do perfil aponta para `/links` (noindex), com UTM `instagram/bio` (`bioUrl`).
   Shorts no YouTube (`youtube.ts`, setup na Parte 9): com `YT_CLIENT_ID`, `YT_CLIENT_SECRET` e `YT_REFRESH_TOKEN`
   o Reels também sobe como Shorts depois do Instagram, renderizado de novo como `short.mp4` com o fechamento
   "link no canal" (`shortsSpeech`, `ReelCta platform="youtube"`): não há direct no YouTube. Título é o gancho
   (`shortsTitle`) e a descrição leva o link do site com UTM `youtube/shorts` (`shortsDescription`). `social_posts.platform`
   separa as duas: `publishedOn` e o histórico do tema (`getHistory`, só Instagram) contam cada uma à parte.
6. Restrição de 23/11/2026: um Reels sobre reganho foi sinalizado e a conta saiu das recomendações
   (Status da conta). Desde então, até a conta voltar: o post não cita guia pago (`GUIDE_IN_POSTS` em
   `ebook-cta.ts`; sem guia, a chamada é das calculadoras grátis); o validador barra emagrecer, perda e
   reganho de peso, quilos e antes e depois (`BANNED`); os temas são só semaglutida, tirzepatida e
   liraglutida mais posts gerais de uso, sem rebote, manipulado, "peso" ou "emagrecer" no título
   (`SAFE_PEPTIDES`, `RISKY_POST`, `RISKY_TITLE` em `topics.ts`). Não religue nada disso sem o dono pedir.
7. Estratégia de crescimento (dados e decisões de 21/11/2026): `docs/instagram-estrategia.md`. Resumo:
   - Legenda sem preço e sem desconto (`ctaLine`), porque o Instagram não recomenda post que vende
     produto de saúde a quem não segue. Preço e cupom vão só no direct.
   - Marca (Mounjaro/Ozempic) no gancho quando o remédio é o de marca.
   - Nota do gancho em `viral.ts` (`hookScore`, pesos do levantamento do nicho; só avisa, no `--check`).
   - O site chama para seguir com `InstagramFollow` (rodapé, fim do post, resultado da calculadora;
     evento `Seguir Instagram`).
   - Métricas por post em `scripts/social/metricas.ts`, que precisa da permissão de insights no token.

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
- Logo (gota com check): `components/brand/DropCheck.tsx`, no site (404, estado vazio da calculadora, /links)
  e nos quadros do Instagram; duas na mesma página pedem `id` diferentes. Não há mais mascote (a Gotinha saiu
  em 21/11/2026, decisão do dono): não crie personagem, bordão nem frase de efeito fixa.
- Description gerada de texto longo: `clipDescription` (`lib/meta.ts`), nunca `.slice()`.
- Newsletter: `NewsletterSignup` (`variant="compact"` no fim dos posts e no rodapé; `via` vai na origem
  gravada, `rota#via`). O rodapé decide onde aparece em `FooterNewsletter` (`HIDDEN`). Só grava o email:
  ainda não existe envio.
- Eventos de analytics: `lib/track.ts` (nomes em `lib/event-names.ts`). As ações de `STORED_EVENTS`
  (`lib/site-events.ts`) vão para a tabela `site_events` via `/api/evento`; relatório em
  `/admin/assistente/eventos`. "Visto" e "calculado" não vão ao banco (volume): visitas vêm da Vercel Analytics.

## Cuidados

- Tailwind só gera classes escritas por extenso no código (nada de `bg-${cor}`).
- Modo escuro usa tokens CSS em `app/globals.css`; prefira `text-ink`, `bg-surface` etc.
  a cores fixas.
- Dentro de `.prose-article` (posts), o estilo de título (h2/h3) e de link do texto não vale em
  `.not-prose`: componente ali (oferta, rótulos do fim do post, cards) precisa trazer as próprias classes.
- `lib/articles.ts` lê arquivos (`fs`): não importe em componentes client.
  A busca global carrega `/busca.json`.
- Cabeçalhos de segurança e reescrita de `/favicon.ico` e `/apple-touch-icon*.png` ficam em
  `next.config.mjs`; `X-Frame-Options` não vale em `/embed/*` (iframe em outros sites).
- Banco só em newsletter, `/admin` e o webhook do Instagram. Mudou `drizzle/schema.ts` → `npm run db:push`.
