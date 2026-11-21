# Instagram @dosecerta_br — criar a conta e ligar a automação

Três partes: criar a conta (celular, 10 min), deixar ela "aquecer" por uns dias e gerar o
token para o robô (computador, 15 min). Ao fim, me passe só o que está em **Me mande**.

---

## Parte 1 — Criar a conta (no celular)

1. Instale o Instagram, abra e toque em **Criar nova conta**.
   - Se você já tem outra conta logada: Perfil → toque no seu @ no topo → **Adicionar conta do
     Instagram** → **Criar nova conta**.
2. Use um **email dedicado** (ex.: `contato@centralpeptideos.com.br`), não o seu pessoal.
3. Nome de usuário: `dosecerta_br`.
4. Senha forte, guardada no gerenciador de senhas.
5. Pule "encontrar amigos" e "sincronizar contatos" (não misture com seus contatos pessoais).

### Deixar o perfil completo

Perfil → **Editar perfil**:

| Campo | Valor |
|---|---|
| Foto | logo Dose Certa (eu gero se quiser) |
| Nome | `Dose Certa \| Peptídeos sem achismo` |
| Nome de usuário | `dosecerta_br` |
| Bio | texto abaixo (copie só o que está dentro do bloco) |
| Links | `https://centralpeptideos.com.br/links` |

Bio (cerca de 110 caracteres, limite de 150). A última linha aponta para o link, que o
Instagram mostra logo abaixo da bio:

```
Peptídeos e GLP-1 sem achismo
🧮 Calculadoras de dose grátis
🚫 Não vendemos peptídeos
👇 Guias e calculadoras
```

### Mudar para conta profissional

1. Perfil → **☰** (canto superior direito) → **Configurações e atividade**.
2. Role até **Para profissionais** → **Tipo de conta e ferramentas** → **Mudar para conta profissional**.
   - Em algumas versões o caminho é **Editar perfil → Mudar para conta profissional**.
3. Categoria: procure **Site educacional** (alternativas: *Educação*, *Saúde/beleza*). Marque
   **Exibir no perfil**: desligado ou ligado, tanto faz.
4. Tipo: **Criador de conteúdo**.
   - Empresa também funciona com a API. Criador tem a biblioteca de músicas completa, útil se
     um dia você postar Reels à mão.
5. Quando perguntar sobre **conectar Página do Facebook**: **Pular**. Não precisa.
6. Ative a **verificação em duas etapas**: Central de contas → Senha e segurança →
   Autenticação de dois fatores.

### Conta pública

Configurações → **Privacidade da conta** → **Conta privada** desligada. (Conta profissional
já é pública; só confira. A API exige conta pública.)

---

## Parte 2 — Aquecer a conta (5 a 7 dias)

Conta nova que já começa postando por API todo dia costuma ser travada pela Meta. Antes de
ligar o robô:

- Entre no app 1 ou 2 vezes por dia, siga 10 a 20 perfis do nicho (saúde, nutrição, GLP-1),
  curta e comente algo de verdade.
- Poste **3 conteúdos à mão** nesses dias. Eu gero os arquivos com a automação em modo teste
  (`--dry`) e você só sobe pelo app. Isso também serve de revisão do visual.
- Não use link encurtador, não siga em massa, não compre seguidor.

---

## Parte 3 — App da Meta e token (no computador)

1. Acesse **https://developers.facebook.com/apps** e entre com seu Facebook pessoal.
   (A conta de desenvolvedor é sua; o Instagram não precisa estar ligado a ela.)
   Na primeira vez ele pede para **registrar como desenvolvedor**: aceite e confirme o telefone.
2. **Criar app**.
   - Caso de uso: **Outro** → Avançar.
   - Tipo: **Empresa** → Avançar.
   - Nome: `Dose Certa Publicador`; email de contato: o mesmo da conta. Portfólio empresarial:
     pode deixar sem. → **Criar app**.
3. No painel do app, no produto **Instagram**, clique **Configurar**.
   Abre **Configuração da API com login do Instagram**.
4. Em **Gerar tokens de acesso**, clique **Adicionar conta** e entre com **@dosecerta_br**.
   - Se aparecer que é preciso aceitar convite: no app do Instagram, Configurações →
     **Apps e sites** → **Convites de testador** → Aceitar. Depois volte e clique de novo.
5. Ao lado da conta aparece o **ID** (número) e o botão **Gerar token**. Clique, autorize, e
   **copie o token** (começa com `IG...`, é bem longo). Ele só aparece uma vez; se perder,
   gere de novo.
6. O app pode ficar em **modo de desenvolvimento**: publicar na sua própria conta, adicionada
   ali, não precisa de Revisão do app nem verificação de empresa.

O token vale 60 dias. O robô renova sozinho antes de vencer; você não precisa voltar aqui
enquanto ele rodar ao menos uma vez a cada 60 dias.

---

## Parte 4 — Chave da Anthropic (texto dos posts)

1. Acesse **https://console.anthropic.com** → crie a conta → **Billing**: adicione cartão e
   US$ 5 de crédito, o mínimo (dá para meses; cada dia custa centavos).
2. **API Keys** → **Create Key** → nome `dosecerta` → copie (começa com `sk-ant-`).

## Parte 5 — Voz do Reels (ElevenLabs) e música

Sem esta parte o Reels sai com a voz grátis da Microsoft (Thalita), mais robótica.

1. Acesse **https://elevenlabs.io** → crie a conta → assine o plano **Starter** (cerca de
   US$ 5/mês; dá para um Reels por dia).
2. **Voices** → **Voice Library** → filtre **Portuguese** e sotaque **Brazilian** → ouça e
   escolha uma voz → **Add to my voices**. Em **My Voices**, abra a voz e copie o **Voice ID**.
3. Perfil (canto inferior esquerdo) → **API Keys** → **Create API Key** → copie a chave.
4. Música: baixe 2 a 5 trilhas instrumentais calmas da [Pixabay Music](https://pixabay.com/music/)
   e me mande os arquivos (ou coloque em `scripts/social/music/`). Sem trilha, o Reels sai sem música.

## Parte 6 — "Comenta GUIA" → direct automático

Quem comenta **GUIA** em qualquer post recebe no direct o guia do post, com o cupom `SAIDA10`
já aplicado no link, e uma resposta pública no comentário ("Te mandei no direct! 💧"). Uma vez
por pessoa por post. O guia sai do título entre aspas da linha 📘 da legenda; sem ela, vai o
Kit. Código: `app/api/instagram/webhook/route.ts` e `lib/instagram-dm.ts`.

1. **No Instagram (celular):** Configurações → **Mensagens e respostas a stories** →
   **Ferramentas conectadas** → ative **Permitir acesso às mensagens**.
2. **Permissões e token no app da Meta.** App novo não tem mais a "Configuração da API com login
   do Instagram": o caminho é **Casos de uso → API do Instagram → API setup with Unified login**.
   - O app precisa de um **portfólio empresarial**, e a conta @dosecerta_br precisa estar nele
     (Business Suite → Configurações → Contas do Instagram → Adicionar).
   - Em **Permissões e recursos**, confira `instagram_business_basic`,
     `instagram_business_content_publish`, `instagram_business_manage_comments` e
     `instagram_business_manage_messages`.
   - **1. Configure seu app:** crie a configuração do Login do Facebook para Empresas ("Criar do
     modelo", compatível com o Login do Instagram). Sem ela, gerar token dá "Selecione uma
     configuração na Etapa 1".
   - **2. Gerar tokens de acesso:** adicione @dosecerta_br e gere o token. A Meta pode obrigar a
     criar uma conta de anúncios no caminho; não tem custo. **Gere o token depois de conferir as
     permissões**: token antigo não tem permissão de mensagem. Se o robô já tiver rodado com o
     token antigo, me avise para eu apagar o token salvo no banco.
3. **Vercel** → projeto → Settings → Environment Variables (Production), três variáveis:
   - `IG_APP_SECRET`: em **Configurações do app → Básico → Chave Secreta do Aplicativo**. Ao
     clicar em **Mostrar**, a Meta pede a **sua senha do Facebook** só para confirmar; a chave é
     o que aparece no campo depois: 32 caracteres de 0-9 e a-f. Cole só o valor, sem o nome;
   - `IG_WEBHOOK_VERIFY_TOKEN`: uma senha que você inventa (ex.: 20 letras e números);
   - `IG_ACCESS_TOKEN`: o mesmo token dos segredos do GitHub (o site usa enquanto o robô não
     renova e guarda o dele no banco).
   Salve e **depois** faça o **Redeploy** (Deployments → ⋯ → Redeploy). Chave errada aparece no
   log da Vercel como `[instagram-dm] assinatura recusada ... chave=N chars`, com 403.
4. **Webhook:** na mesma tela do login unificado, **3. Configurar webhooks → Ver mais**:
   - URL de retorno: `https://centralpeptideos.com.br/api/instagram/webhook`
   - Verificar token: a senha do `IG_WEBHOOK_VERIFY_TOKEN`
   - **Verificar e salvar**; depois, na lista de campos, **Assinar** `comments`, e ative a
     assinatura de webhook da conta @dosecerta_br.
   - O link **Teste** na linha `comments` → **Enviar para servidor** manda um exemplo: o site
     deve responder 200 (Vercel → Observability).
5. **Teste:** com o app em modo de desenvolvimento, só funciona para quem tem função no app.
   Adicione a conta em **Funções do app → Funções → Testadores do Instagram**. O convite não
   aparece no app do celular: aceite no navegador, logado nessa conta, em
   `https://www.instagram.com/accounts/manage_access/` → **Convites de testador**. Depois
   comente GUIA em um post do @dosecerta_br com essa conta e veja o direct chegar.
6. **Para valer para todo mundo:** a Meta exige **Revisão do app** com acesso avançado a
   `instagram_business_manage_comments` e `instagram_business_manage_messages`, e o app em
   modo **Ao vivo**. Ela pede: URL da política de privacidade
   (`https://centralpeptideos.com.br/privacidade`), um vídeo de tela mostrando o comentário e o
   direct chegando (o teste do passo 5 serve) e um texto curto do uso ("respondemos com um link
   de material educativo quem comenta pedindo"). A análise costuma levar alguns dias.

## Parte 7 — Robô neste computador (sem GitHub e sem chave da Anthropic)

**Sem IA (padrão desde 19/11/2026):** duas tarefas do **Agendador do Windows** (pasta `DoseCerta`):
"Carrossel" todo dia às 12h e "Reels" todo dia: 19h de domingo a quinta, 18h na sexta e 10h no
sábado. Horários da pesquisa de 21/11/2026 (blogs brasileiros de gestão de Instagram concordam em
11h–13h e 18h–21h nos dias úteis, terça a quinta como melhores dias, sexta caindo depois das 21h e
sábado com pico de manhã; os maiores picos dos perfis de GLP-1 saíram de domingo, terça e sábado).
Mudou um horário → mude `REELS_HOURS`/`CAROUSEL_HOUR` em `scripts/social/queue.ts`. Cada uma roda
`scripts\social\agendado.ps1`, que publica o texto pronto da fila (Parte 8) com as imagens e o vídeo
da prévia. Não usa o Claude nem o app. O computador precisa estar ligado com o seu usuário logado;
se estava desligado no horário, a tarefa roda quando você entrar.

- **Criar ou recriar:** `npm run social:agendar` (remover: `npm run social:agendar -- -Remover`).
- **Fila acabou:** a tarefa não publica nada e o log em `social/logs/` diz "Sem texto pronto na
  fila". Peça ao Claude mais 30 dias de conteúdo (plano, textos e prévia).
- **Teste sem publicar:** `powershell -ExecutionPolicy Bypass -File scripts\social\agendado.ps1 -Formato carrossel -Dry`.
- **Escrever na hora quando faltar texto:** `-ComIA` no `agendado.ps1` (usa `claude -p`, com
  `claude setup-token` e `CLAUDE_CODE_OAUTH_TOKEN` no `.env.local`).

**Com IA (desativado):** duas **tarefas agendadas do app Claude** (barra lateral → Agendadas), "Dose
Certa: carrossel do dia" e "Dose Certa: Reels", nos mesmos horários. Cada uma abre uma conversa que
publica a fila ou, sem ela, escolhe o tema, escreve o texto e publica, na sua assinatura. Não deixe
as duas formas ligadas ao mesmo tempo.

1. **`.env.local`** (na pasta do projeto; não vai para o git): acrescente uma linha por variável, no
   formato `NOME=valor`:
   - `DATABASE_URL` e `BLOB_READ_WRITE_TOKEN`: os mesmos da Vercel (`vercel env pull` traz os dois);
   - `IG_USER_ID` e `IG_ACCESS_TOKEN`: o ID e o token do Instagram (Parte 3);
   - `IG_APP_SECRET`: a mesma Chave Secreta do Aplicativo da Vercel (Parte 6, passo 3). O token do
     login unificado começa com `EAA` e vence em 60 dias; o robô o renova sozinho 15 dias antes,
     e só consegue com essa chave. O token renovado fica no banco e vale também para o direct;
   - opcional: `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` (Parte 5).
   Sem as quatro primeiras, a tarefa para no começo com "faltam variáveis" e não gasta nada.
2. **Postar na hora:** no Agendador do Windows, clique com o botão direito na tarefa → **Executar**.
   Se já saiu post daquele formato no dia, não publica de novo.
3. **Pausar:** desabilite as tarefas no Agendador ou `npm run social:agendar -- -Remover`.

---

## Parte 8 — Fila de textos prontos e o que viraliza

A tarefa do dia tenta primeiro o texto pronto de `social/fila/<data>-<formato>/texto.json`
(`run.ts <formato> --fila`). Sem texto válido para o dia, sai com código 3 e a conversa escreve na
hora, como antes. `social/fila/PLANO.md` mostra o calendário; `REGRAS.md` tem as regras e o schema.

- **Montar ou estender a fila:** `run.ts plano --dias 30` (a partir de amanhã; `--inicio AAAA-MM-DD`
  muda o começo). Simula a escolha do tema dia a dia com o histórico do banco, sem repetir tema da
  fila, e cria `brief.md`/`brief.json` em cada pasta nova. `--refazer` escolhe de novo os horários
  ainda sem texto. Depois, peça ao Claude para escrever os `texto.json` seguindo os `brief.md`.
- **Conferir um texto:** `run.ts --check social/fila/<pasta>` (mesma validação da publicação).
- **Ver antes de sair:** `run.ts previa` gera em `social/out/<data>-<formato>/` as imagens e os vídeos
  da fila (`--formato reels`, `--ate AAAA-MM-DD`). No dia, a publicação reaproveita o que a prévia
  gerou (mesmo texto, guia e cenário); a voz fica em cache em `social/out/_voz`, então gerar de
  novo não paga a fala duas vezes.
- **Visual que muda:** cinco cenários (`themes.ts`: noite, claro, cor da categoria, caderno,
  azulejo) giram pela data, nunca o mesmo em dois dias seguidos, e o Reels do dia sai num
  cenário diferente do carrossel. Cada slide tem um tipo (`layouts.ts`: padrão, mito × verdade,
  passo a passo, lado a lado, número em destaque, pergunta e resposta), escolhido por quem
  escreve.
- **Trocar um post:** edite o `texto.json` da pasta e rode o `--check`. Apagar o `texto.json` faz o dia
  ser escrito na hora.
- O tema escrito na hora evita os temas que a fila ainda vai publicar.

O que a pesquisa de 2026 (Instagram, GLP-1, mulheres de 30 a 55) mostrou e já está nas regras:

- Os sinais que mais pesam, segundo o chefe do Instagram, são tempo assistido, curtidas por alcance
  e **envios por alcance**: por isso o "Manda pra..." de todo post. A taxa de pulo dos 3 primeiros
  segundos decide o Reels: gancho na tela no primeiro quadro.
- Carrossel de 7 a 10 imagens é o que mais engaja e é salvo (de 5 a 8 slides de conteúdo). Reels
  alcança mais gente nova; carrossel é salvo cerca de 2×.
- Temas com mais busca e envio: enjoo, constipação, queda de cabelo, "cara de Ozempic", massa
  muscular e proteína, dose esquecida, guardar e viajar, Mounjaro × Ozempic × genérico, receita
  retida, caneta falsa, retatrutida, álcool, parar e reganho, platô, escalonamento, pílula
  anticoncepcional. `topicPriority` (`pick.ts`) põe na frente as dúvidas práticas de GLP-1.
  Sem post no site sobre um tema, ele não entra: o robô só usa fatos do site.
- Evitar: antes e depois, quilos perdidos, prazo para emagrecer, prescrever dose, urgência, promover
  marca, nome de produto sem registro e repostar trecho de outro criador (regra de originalidade).

---

## Me mande

Não cole os valores aqui no chat. Coloque direto nos segredos do GitHub, que eu já uso no
workflow:

1. Acesse https://github.com/SartoriaLab/central-pept/settings/secrets/actions
2. **New repository secret** para cada um:

| Nome | Valor |
|---|---|
| `IG_USER_ID` | o ID numérico da Parte 3, passo 5 |
| `IG_ACCESS_TOKEN` | o token `IG...` |
| `ANTHROPIC_API_KEY` | a chave `sk-ant-...` |
| `ELEVENLABS_API_KEY` | a chave da ElevenLabs (Parte 5) |

3. Na aba **Variables** do mesmo lugar, **New repository variable**: `ELEVENLABS_VOICE_ID` com o
   Voice ID da Parte 5 (não é segredo).

Depois me avise "segredos salvos". O `BLOB_READ_WRITE_TOKEN` e o `DATABASE_URL` eu configuro.
