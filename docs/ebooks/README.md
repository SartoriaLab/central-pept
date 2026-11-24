# Manuscritos dos ebooks

Cada pasta é um ebook (`<slug>` de `lib/ebooks.ts`). Os arquivos `.html` são os capítulos, na ordem de
`manifest.json`, e viram as aulas da área de membros na Kiwify (o mesmo texto gera o PDF).

## Regras do HTML (limite da Kiwify)

Só estas tags: `p, br, strong, b, em, i, u, s, del, h1–h6, ul, ol, li, blockquote, a, img, span, div,
pre, code, hr, figure, figcaption`. `style` só em `span`, `div` e `p`, e só com `text-align`, `color`,
`background-color` e `font-size`. Sem `table`, `script` ou `iframe`.

## Áreas de membros

| Ebook | Área (club_id) | Curso | Turma "Grupo A" |
|---|---|---|---|
| I1 semaglutida-manual | 11561d2b-7f03-42f5-98c6-2ab1c2c71d8e | 80bd102f-22ae-4059-a6f8-261bba6832c8 | e2d1503e-b189-4cfb-8104-86554ecab3dc |
| I2 tirzepatida-antes-de-subir-a-dose | dcec49d6-8dd8-44df-bf0c-b37b6cede7a5 | 8cbbe1b5-ca0c-489a-8b24-d76573d421d2 | 9ce5bf24-83dd-4202-88c3-482cdbd4fd11 |
| T1 reconstituicao-sem-erro | 16639053-0531-40da-950d-33a2dc684771 | 7c707b7a-a94a-4deb-afb0-ad8e9da179e3 | dce49626-3d2e-4047-a00d-510aa168d38e |
| T2 antes-de-comprar | b43ad6a5-108a-45c2-8e12-c70a748347f5 | e41647fb-6670-4a1e-99b4-878a30644445 | d076a2d6-2883-4382-a931-5bab502aea72 |
| T3 parei-e-agora | dd55f328-8e7b-4db7-ab51-8d8e446bb7ad | 91396cc6-a732-49c9-99c1-b24240b767c2 | 0f0830e7-4a27-41c4-be0a-691fb95ad540 |
| KIT kit-comeco-seguro | 7fec0672-78f0-4997-8da7-0cfca55ca91b | e7aaee64-87f8-4011-a8dd-5b719da6e58a | af8e979e-b77f-4370-9cf4-5c90d21163c0 |
| I3 retatrutida-verdade | 14383ba1-2dff-411b-b04f-3ebe49f8c89d | 05d5fbe3-b28a-4e0f-882f-e1c6e52d62a4 | c463994c-dd6c-480e-b868-6c895402ccd6 |
| I5 ghk-cu-rotina | b9874a68-b0d9-427e-b231-a0a42bf4a2c2 | e9f65496-fb77-4277-aaee-43381ef23a84 | 49d35ccc-444a-4553-8262-da1c405ffb41 |
| I8 pt-141-segredos | d593e71e-977b-4586-81e8-0fa08fe59854 | 10cbb1bc-c3eb-4645-bc90-60e3fdf32672 | 89616c02-fd6e-4a5e-a3fc-770a87986107 |
| I7 tesamorelina-segredos | 82fb572d-a9c6-402c-941c-33b73c35397f | 605ddab2-638a-4917-a5cb-3614b7f25ee2 | 6c8ed038-5f00-420e-9bf5-0cf2a8878c1f |
| I4 bpc-157-sem-achismo | 861db833-e599-4dc9-b8b8-d3a43b8c0055 | a908351c-cc01-44c1-bb3c-76be7ba9df2e | 743b8866-aaf5-4deb-8dad-95e1cf0a088a |

## Produtos e checkout

| Ebook | Produto | Checkout (variável) | Oferta de bump R$ 14,90 |
|---|---|---|---|
| I1 | b5aa7fb0-dfc4-11f1-9b0e-1d63259b3d5d | https://pay.kiwify.com.br/ristzVQ (`KIWIFY_CHECKOUT_SEMAGLUTIDA`) | — |
| I2 | b8c16730-dfc5-11f1-992b-85e75ef0d685 | https://pay.kiwify.com.br/XcC0pn7 (`KIWIFY_CHECKOUT_TIRZEPATIDA`) | — |
| T1 | d3b93e00-dfc5-11f1-b2ef-e388708c1a73 | https://pay.kiwify.com.br/XOgXiPn (`KIWIFY_CHECKOUT_RECONSTITUICAO`) | mTo3uEg |
| T2 | 31260550-dfc6-11f1-9205-439bc5ce1992 | https://pay.kiwify.com.br/dkFPtT7 (`KIWIFY_CHECKOUT_COMPRA`) | 4ujmLVp |
| T3 | 560542a0-dfc6-11f1-9b0e-1d63259b3d5d | https://pay.kiwify.com.br/P5hlXr8 (`KIWIFY_CHECKOUT_PAREI`) | lMglm71 |
| KIT | 6fad40e0-dfc6-11f1-af23-a9366f1cb294 | https://pay.kiwify.com.br/KjyINY8 (`KIWIFY_CHECKOUT_KIT`) | — |
| I3 | 7cbc7730-e069-11f1-8857-8d1aae0a9d8c | https://pay.kiwify.com.br/f3dqjCt (`KIWIFY_CHECKOUT_RETATRUTIDA`) | — |
| I5 | 906a27a0-e069-11f1-8857-8d1aae0a9d8c | https://pay.kiwify.com.br/5bz91E3 (`KIWIFY_CHECKOUT_GHKCU`) | — |
| I8 | 6c909a40-e85b-11f1-ae0f-5f78cd40f391 | https://pay.kiwify.com.br/6tj9Bp9 (`KIWIFY_CHECKOUT_PT141`, ou `checkoutDefault`) | — |
| I7 | 6da6c530-e85b-11f1-ae0f-5f78cd40f391 | https://pay.kiwify.com.br/xc16l7E (`KIWIFY_CHECKOUT_TESAMORELINA`, ou `checkoutDefault`) | — |
| I4 | 8691fcc0-e853-11f1-b19a-4fa90a94ea91 | https://pay.kiwify.com.br/EGOLOmS (`KIWIFY_CHECKOUT_BPC157`, ou `checkoutDefault`) | — |

Série "Os Segredos do X Que Ninguém Te Conta" (desde 24/11/2026): um guia por peptídeo, R$ 29,90, bump T1
(oferta `mTo3uEg`), cupom `SAIDA10`, afiliados 40%. O produto de área de membros já pode ser criado pelo MCP
(`product_create` com `kind: club`, que cria a área junto). Molde: `bpc-157-sem-achismo/` (capítulos com
"O segredo deste capítulo" no topo, `catalogo.json` com os campos da landing). Entrada do catálogo:
`node scripts/ebook-catalog.mjs <slug> <id> <peptideo> [env] [checkout] [produto]`. Os guias de TB-500, CJC-1295 e
ipamorelina foram barrados pelo filtro de biologia do modelo (24/11/2026): peptídeo sem aprovação tende a cair nele.

Bumps: I1 e I2 oferecem T1 e T3; T1 oferece T2; T2 oferece T1; KIT oferece T3; I3 e I5 não têm bump (I3 trata de droga sem aprovação; I5 é de uso tópico). A descrição do produto
T2 na Kiwify é neutra porque o filtro da Kiwify bloqueou "lote"/"golpe" ao criar o produto.

Cada curso nasceu com dois módulos de exemplo da Kiwify ("Configurando as Aulas" e
"Organizando o Conteúdo"), removidos em 13/11/2026, junto com as áreas antigas que o MCP tinha
criado. Todas as aulas estão publicadas.
Ao editar um capítulo em `docs/ebooks/`, atualize a aula correspondente (lesson_update) e o PDF.

O Dashboard da Kiwify não lista áreas criadas pelo MCP ao criar um produto de área de membros. Por isso o
produto é criado com "Criar nova área de membros" e o conteúdo é montado depois na área nova; a área
antiga é apagada.

PDF: `node scripts/ebook-pdf.mjs <slug>` (Node 20) gera `out/ebooks/<slug>.pdf`. Kit:
`node scripts/ebook-pdf.mjs kit-comeco-seguro semaglutida-manual tirzepatida-antes-de-subir-a-dose reconstituicao-sem-erro antes-de-comprar`.
