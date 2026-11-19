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

Duas **tarefas agendadas do app Claude** (barra lateral → Agendadas): "Dose Certa: carrossel do dia"
todo dia às 12h e "Dose Certa: Reels" às 19h30 de domingo, segunda, quarta e sexta. Cada uma abre
uma conversa que escolhe o tema, escreve o texto e publica, na sua assinatura. O app precisa estar
aberto; se estava fechado no horário, a tarefa roda quando você abrir.

1. **`.env.local`** (na pasta do projeto; não vai para o git): acrescente uma linha por variável, no
   formato `NOME=valor`:
   - `DATABASE_URL` e `BLOB_READ_WRITE_TOKEN`: os mesmos da Vercel (`vercel env pull` traz os dois);
   - `IG_USER_ID` e `IG_ACCESS_TOKEN`: o ID e o token do Instagram (Parte 3);
   - opcional: `ELEVENLABS_API_KEY` e `ELEVENLABS_VOICE_ID` (Parte 5).
   Sem elas, a tarefa para no começo com "faltam variáveis" e não gasta nada.
2. **Primeira vez:** abra a tarefa no app e clique **Executar agora**. Aprove o Bash e a escrita de
   arquivo quando pedir: o app guarda essas aprovações e as próximas rodam sozinhas.
3. **Postar na hora:** **Executar agora** na tarefa. Se já saiu post daquele formato no dia, não
   publica de novo.
4. **Pausar:** desative a tarefa no app.

Sem o app aberto, a alternativa é o Agendador do Windows com o `claude` de linha de comando:
`claude setup-token`, `CLAUDE_CODE_OAUTH_TOKEN` no `.env.local` e `npm run social:agendar`
(remover: `npm run social:agendar -- -Remover`). Teste sem publicar:
`powershell -ExecutionPolicy Bypass -File scripts\social\agendado.ps1 -Formato carrossel -Dry`.

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
