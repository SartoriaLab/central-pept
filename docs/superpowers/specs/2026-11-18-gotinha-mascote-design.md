# Gotinha: mascote protagonista dos Reels e do carrossel (@dosecerta_br)

Data: 2026-11-18. Complementa `2026-11-15-instagram-dosecerta-design.md`.

## Objetivo

Dar ao perfil um personagem fixo que conduz todo vídeo: a **Gotinha**, a gota amarela do logo
(`components/brand/DropCheck.tsx`) com rosto, bracinhos e expressões. Tom descontraído, porém
informativo, falando com o público feminino, com gancho forte e bordões fixos.

## Decisões tomadas

| Tema | Escolha |
| --- | --- |
| Mascote | Gotinha, a gota da marca |
| Técnica | Desenho vetorial (SVG no satori), animado pelo próprio robô; custo zero por vídeo |
| Condução | Ela narra em primeira pessoa, olhando para a câmera |
| Alcance | Reels (animada) e carrossel (parada, uma pose por slide). Site fica para depois |
| Público | Feminino: "amiga", "você", gírias leves |
| Bordão de abertura | "Senta que a Gotinha te explica." |
| Bordão de fechamento | "Gotinha falou, tá falado!" |

## 1. Personagem (`scripts/social/mascot.tsx`)

- Corpo: o mesmo path da gota do logo, gradiente amarelo, contorno marrom-escuro fino.
- Rosto: olhos grandes (branco + pupila), sobrancelhas, bochechas rosadas, boca.
- Bracinhos em traço arredondado; sem pernas (a gota "quica").
- Componente `Gotinha({ pose, mouth, blink, size })`, SVG puro (satori e resvg).
- `Pose` (8): `feliz`, `explicando` (braço erguido, dedo para cima), `pensando` (mão no queixo,
  olhos para cima), `alerta` (olhos arregalados, sobrancelhas altas), `piscadinha`, `comemorando`
  (dois braços para cima), `apontando` (braço para baixo e para o lado, rumo à legenda ou ao botão),
  `ih` (careta de "não é bem assim", sobrancelha torta).
- `Mouth`: `fechada` (sorriso ou linha, conforme a pose), `meia`, `aberta`, `o`.
- `blink: true` fecha os olhos (arco), menos na `piscadinha`, que já tem um olho fechado.
- `POSES` exportado (lista) para o schema do Claude e o validador.

## 2. Reels

### Roteiro falado (ordem fixa)

1. **Gancho** (`narration[0]`, escrito pelo Claude): dor, erro comum, mito ou curiosidade, nos
   primeiros 2 s. Nunca começa com saudação.
2. **Bordão de abertura**, constante no código (`BORDAO_ABERTURA`), falado logo após o gancho,
   na mesma cena.
3. **Falas** (`narration[1..]`), uma cena cada, com a pose escolhida pelo Claude.
4. **Chamada final** (`ctaSpeech`), seguida do **bordão de fechamento** (`BORDAO_FECHAMENTO`)
   e de "Segue o Dose Certa pra próxima." Pose `comemorando` e depois `apontando`.

Bordões ficam no código, não no texto do Claude: saem sempre idênticos e o validador barra o
Claude se ele os escrever por conta própria.

### Cena

- Fundo (como hoje, com zoom lento): faixa de cor, selo da marca, título da cena no alto,
  ilustração 3D pequena (180 px) flutuando no canto superior direito, como objeto de cena.
- Gotinha grande (cerca de 560 px de altura) no centro, levemente abaixo do meio.
- Legenda palavra a palavra logo abaixo dela (mesmo `Caption` de hoje).

### Animação

- **Boca** (`scripts/social/lipsync.ts`, função pura `mouthTrack(words, total)`): dentro de uma
  palavra alterna `aberta`/`meia` a cada 0,12 s, começando por `aberta`; palavra terminada em
  "o"/"u" acentuado ou não fecha em `o`; fora das palavras, `fechada`. Devolve segmentos
  contíguos `{ start, end, mouth }`.
- **Piscada** (`blinkTrack(total, seed)`): 0,12 s a cada 2,8 a 4 s, sorteio determinístico pela
  semente (mesmo vídeo, mesmo resultado).
- **Camada separada**: a Gotinha é desenhada em PNG com fundo transparente (680×900) para cada
  combinação usada de pose, boca e piscada, com cache (no máximo 8 × 4 × 2 = 64 imagens; na prática
  menos de 20 por vídeo). O fundo segue o pipeline atual (concat + zoompan). O ffmpeg sobrepõe a
  camada da Gotinha depois do zoom, com quique: `y = Y0 + 10·sin(2π·1,6·t)`.
- Troca de pose entre cenas acontece no corte (xfade), sem interpolação.
- Tempo de render alvo: no máximo 20 % acima do atual (cerca de 2 min por Reels).

### Voz

- Continua `voice.ts`. ElevenLabs mais expressiva: `stability 0.35`, `style 0.45`.
  edge-tts: Thalita a `+12%`. Voz feminina nos dois.

## 3. Texto do Claude (`write.ts`, `types.ts`, `validate.ts`)

- `Draft.narration` passa de `string[]` para `{ text: string; pose: Pose }[]`.
- `Draft.slides[]` ganha `pose: Pose`; `Draft.hookPose: Pose` (capa e gancho).
- Prompt de sistema ganha a persona:
  - "Você é a Gotinha, mascote do Dose Certa. Fala com mulheres que usam ou pensam em usar
    GLP-1 e peptídeos, como uma amiga que entende do assunto."
  - 2ª pessoa, "amiga" no máximo uma vez por vídeo, gírias leves ("tá", "pra", "olha só"),
    uma tirada leve por vídeo.
  - Proibido: piada com corpo, peso ou aparência; promessa de resultado; diminutivo infantil em
    excesso; termos de venda (regra atual).
  - Gancho: até 70 caracteres, em uma das formas: pergunta de dor ("Seu Mounjaro tá dando
    enjoo?"), erro comum ("Para de guardar a caneta assim"), mito ("Dobrar a dose não acelera
    nada"), curiosidade com número da fonte.
  - Frases claramente em português (regra atual da voz).
  - Legenda do post também na voz da Gotinha.
- Validador:
  - `pose` e `hookPose` dentro de `POSES`;
  - gancho com até 70 caracteres e sem começar por saudação (`oi`, `olá`, `e aí`, `oie`);
  - nenhum texto do Claude contém os bordões;
  - regras atuais mantidas (números só da fonte, sem linguagem de venda, pergunta final).

## 4. Carrossel

- **Capa**: Gotinha na `hookPose` (360 px) com balão de fala contendo o gancho; rótulo da
  categoria acima.
- **Conteúdo**: Gotinha na pose do slide (240 px) no topo, à esquerda; ilustração 3D pequena à
  direita; título e texto como hoje.
- **CTA**: Gotinha `comemorando` ao lado do botão "Link na bio"; abaixo, "Gotinha falou, tá
  falado!".

## 5. O que não muda

Escolha de tema, fonte dos fatos, validação de números, CTA do guia (`ebookFor*`), música,
legenda palavra a palavra, horários e publicação.

## 6. Testes (`tests/social.test.ts`)

- `mouthTrack`: segmentos contíguos de 0 ao total; `fechada` nas pausas; alterna dentro da palavra.
- `blinkTrack`: determinístico pela semente; piscadas com 0,12 s e intervalo de 2,8 a 4 s.
- Toda pose × boca renderiza no satori sem erro (PNG não vazio).
- Validador recusa pose desconhecida, gancho com saudação, gancho longo e bordão no texto.
- `preview.ts` atualizado com poses; Reels de teste (post3) gerado e conferido em quadros.

## Fora do escopo

Gotinha no site (/links, /app, estados vazios), outras roupas ou acessórios por tema, voz clonada.
