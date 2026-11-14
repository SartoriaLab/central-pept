# Ebooks — estratégia de conversão e plano de cada ebook

Catálogo em `lib/ebooks.ts` (fonte única). Este documento explica o porquê de cada título, posição e preço.

## Parte 1 — Estratégia de conversão

### 1.1 Princípios

1. **Uma oferta por página.** A página decide o ebook; a pessoa nunca escolhe entre dois.
2. **Oferta depois do valor.** Aparece depois do cálculo, do TL;DR ou do bloco de dose. Nunca no topo, nunca em pop-up.
3. **Vender o erro evitado.** Dose errada, frasco perdido, produto falso, desistência por náusea. Nenhuma promessa de quilos, cura ou rejuvenescimento.
4. **Usar o dado da pessoa.** Na calculadora, a chamada cita o que ela acabou de calcular.
5. **Prova = fontes.** Bulas, estudos de registro e data de revisão, que o site já mostra.
6. **Risco zero para comprar.** Garantia de 7 dias em destaque e amostra real na landing.

### 1.2 Fórmula dos títulos

Título = gancho; subtítulo = prova e números. Cinco ganchos, todos apoiados em um fato que o site já publica:

| Gancho | Como funciona | Exemplo |
|---|---|---|
| Lacuna | Promete o que a pessoa não recebeu | "O Manual Que Não Vem na Caixa" |
| Ordem direta | Manda parar antes de errar | "Não Suba a Dose Antes de Ler Isto" |
| Número + ameaça | Quantifica o erro invisível | "7 Erros Que Mudam Sua Dose Sem Você Perceber" |
| Inimigo comum | Fórum, marketing, vendedor | "O Que os Fóruns Não Te Contam" |
| Pergunta que dói | A dúvida que a pessoa já tem | "Parei. E Agora?" |

- Nome da molécula sempre no título: é o que a pessoa digitou no Google.
- Todo número é compromisso do sumário.
- Princípio ativo no título; marca só no texto, de forma descritiva.
- O gancho assusta com o erro, nunca promete o resultado. Peptídeo sem aprovação: "o que os estudos mostram", nunca "protocolo".
- Cada ebook tem título principal e um alternativo para testar (duas semanas cada).

### 1.3 Funil

| Etapa | O que acontece | Medida |
|---|---|---|
| Página | Pessoa usa a ferramenta ou lê | Visitas (Plausible) |
| Oferta | Card contextual aparece | `Ebook Visto` (por ebook e posição) |
| Clique | Vai para `/ebooks/<slug>` | `Ebook Clique` |
| Landing | Sumário, amostra, garantia | `Ebook Checkout` (clique no botão) |
| Checkout Kiwify | Order bump | Venda (webhook → `conversions`) |
| Pós-compra | Página de obrigado oferece o kit | Venda do kit |

Regra de decisão (ponto de partida, ajustar com dados): oferta com 500 visualizações e menos de 1% de clique troca a chamada; landing com 200 visitas e menos de 10% de clique no botão troca título ou amostra. Um teste por vez, duas semanas cada.

### 1.4 Oferta e preço (sugestões)

| Item | Preço | Observação |
|---|---|---|
| Ebook individual ou transversal | R$ 29,90 | Preço que o site já usou |
| Guia de categoria | R$ 29,90 | Mesmo preço: simplifica a comunicação |
| "Parei. E Agora?" (T3) avulso | R$ 24,90 | R$ 14,90 como order bump de I1 e I2 |
| Order bump universal | R$ 14,90 | "7 Erros Que Mudam Sua Dose" (T1) em todo checkout de injetável; em T1 o bump é T2 |
| Kit Começo Seguro (I1 + I2 + T1 + T2) | R$ 69,90 | Âncora real: soma R$ 119,60 |
| Biblioteca completa | Definir depois da onda 2 | Só quando houver 8+ ebooks |

- Âncora de preço só real (kit contra a soma). Nada de "de R$ 49,90" que nunca foi cobrado.
- Garantia de 7 dias em toda landing e ao lado de todo botão.

### 1.5 Landing `/ebooks/<slug>`

1. Título, subtítulo, capa, preço, botão, garantia.
2. "Este guia é para você se…" (3 situações concretas).
3. Sumário real, com número de páginas.
4. Amostra: 2 páginas do PDF como imagem.
5. Bônus imprimíveis (tabela, checklist).
6. De onde vêm os dados: fontes e data de revisão.
7. "Não é para você se…" (quem busca prescrição ou promessa).
8. FAQ + garantia + botão final. Botão fixo no rodapé em celular.

### 1.6 Chamadas por posição

| Posição | Formato | Exemplo (T1 na calculadora) |
|---|---|---|
| Resultado da calculadora | 1 frase com o dado + link | "Você vai puxar 25 UI. Veja os 7 erros que mudam essa conta depois que o frasco está aberto." |
| Depois do TL;DR (artigo) | 1 linha + link | "PDF: os 7 erros que mudam sua dose sem você perceber." |
| Fim do artigo | Card com capa, 3 itens, preço | Substitui nada; fica antes de `RelatedPosts` |
| Ficha / marca | Card depois do bloco de dose | Idem, com o nome do peptídeo |
| Páginas genéricas (home, `/peptideos`, glossário) | Card do kit | Um só, perto do fim |

Fora: embeds (`app/embed/*`), impressão, topo de página, pop-up de saída.

### 1.7 Limites (protegem a conversão a longo prazo)

- Sem promessa de resultado, sem depoimento inventado, sem contagem regressiva falsa.
- Propaganda de medicamento de prescrição ao público é restrita pela ANVISA: o ebook é educativo e a venda é do guia, não do remédio. Confirmar com advogado antes do lançamento.
- Todo ebook abre com aviso de que não substitui acompanhamento médico.
- Os dois PDFs antigos precisam de revisão antes de voltar: "Maximizar Resultados", "perda de peso esperada", "como escolher farmácia de manipulação" (Retatrutida, sem aprovação em nenhum país) e "Faz a Pele Voltar no Tempo", "resultados esperados semana a semana" (GHK-Cu).
- Meia-vida sem dado publicado continua "Não caracterizada", também dentro dos ebooks.

### 1.8 Ordem de lançamento

| Onda | Ebooks | Motivo |
|---|---|---|
| 1 | I2, I1, T1, T2 (+ T3 como bump) | 21 dos 44 posts e 6 das 9 ferramentas são desse grupo |
| 2 | I3 e I5 (revisar PDFs existentes), I4, I6, C1 | Material já existe ou o grupo tem muitas páginas (GH: 7 fichas, 15 comparações) |
| 3 | I7, I8, C2 a C6 | Só escrever os que tiverem tráfego na ficha (Plausible) |

Prioridade definida pela estrutura do conteúdo; não houve acesso aos dados de tráfego.

---

## Parte 2 — Plano de cada ebook

Legenda: **I** individual, **C** categoria, **T** transversal. Páginas e contagens ("7 erros", "12 checagens") são proposta do sumário e viram compromisso do texto.

### I1 — Semaglutida: O Manual Que Não Vem na Caixa

- **Subtítulo:** Semana a semana, de 0,25 mg até a manutenção: o que esperar em cada etapa, como atravessar a náusea e os 9 erros que fazem desistir no meio.
- **Título alternativo para teste:** Antes da Sua Próxima Dose de Semaglutida.
- **Para quem:** quem vai começar ou está nas primeiras etapas.
- **Sumário:** (1) Como a semaglutida age e por que a dose sobe devagar. (2) A escada: 0,25 → 0,5 → 1,0 → 1,7 → 2,4 mg, etapa por etapa, e a variante até 2,0 mg. (3) O que é normal sentir em cada etapa e o que é sinal de alerta. (4) Náusea, constipação e refluxo: o que as bulas e os estudos recomendam. (5) Dose esquecida, viagem, armazenamento. (6) Comprimido diário: como difere da injeção. (7) Os 9 erros. (8) Perguntas para levar ao médico.
- **Bônus:** escada de doses imprimível; diário de sintomas de 16 semanas.
- **Aparece em:** `/peptideos/semaglutida`; `/medicamentos/ozempic`, `wegovy`, `rybelsus`; titulação com semaglutida selecionada; posts `efeitos-colaterais-semaglutida`, `nausea-ozempic-como-lidar`, `quanto-tempo-ozempic-faz-efeito`, `como-guardar-ozempic-wegovy`, `ozempic-para-perder-peso-sem-diabetes`; comparações com semaglutida em primeiro.
- **Chamada (titulação):** "Seu calendário vai até a semana 17. O guia mostra o que esperar em cada uma das 5 etapas."
- **~40 páginas · R$ 29,90 · bumps: T1 e T3.**

### I2 — Tirzepatida: Não Suba a Dose Antes de Ler Isto

- **Subtítulo:** De 2,5 mg a 15 mg, semana a semana: quando subir, quando segurar e os 9 erros que custam frasco, dinheiro e semanas de enjoo.
- **Título alternativo:** Tirzepatida: O Manual Que Não Vem na Caixa.
- **Para quem:** quem vai começar ou está subindo dose.
- **Sumário:** (1) GIP + GLP-1: o que muda em relação à semaglutida. (2) A escada de 6 etapas, 2,5 mg a cada 4 semanas ou mais. (3) Ficar numa dose intermediária: o que as bulas permitem. (4) Efeitos por etapa e sinais de alerta. (5) Náusea e alimentação na subida. (6) Frascos de 5, 10 e 15 mg: quantas doses rendem e a validade de 28 dias depois de reconstituído. (7) Os 9 erros. (8) Perguntas para o médico.
- **Bônus:** escada imprimível; tabela de unidades por frasco; diário de 20 semanas.
- **Aparece em:** `/peptideos/tirzepatida`; `/medicamentos/mounjaro`, `zepbound`; titulação com tirzepatida; `tabela-doses-glp1`; posts `efeitos-colaterais-tirzepatida`, `nausea-tirzepatida-como-lidar`, `quanto-tempo-tirzepatida-faz-efeito`, `semaglutida-vs-tirzepatida`; comparações com tirzepatida em primeiro.
- **Chamada (ficha):** "Vai começar em 2,5 mg? Veja as 6 etapas até a manutenção e quando faz sentido segurar a dose."
- **~40 páginas · R$ 29,90 · bumps: T1 e T3.**

### I3 — Retatrutida: A Verdade Antes da Aprovação

- **Subtítulo:** O que os estudos já provaram, o que ainda é aposta e o que estão te vendendo antes da hora.
- **Título alternativo:** Retatrutida: O Que Não Te Contam nos Grupos.
- **Para quem:** quem acompanha a nova geração e quer separar dado de boato.
- **Sumário:** (1) Tri-agonista: GLP-1, GIP e glucagon. (2) Resultados publicados, estudo por estudo. (3) Doses dos ensaios: 2 a 12 mg/semana em incrementos de 4 semanas. (4) Efeitos adversos relatados. (5) Comparação com semaglutida e tirzepatida. (6) Situação regulatória e WADA. (7) Riscos de produto sem registro.
- **Bônus:** linha do tempo dos estudos; tabela comparativa das três moléculas.
- **Aparece em:** `/peptideos/retatrutida`; titulação com retatrutida selecionada; post `retatrutida-o-que-e`; comparações `tirzepatida-vs-retatrutida`, `semaglutida-vs-retatrutida` e a tripla.
- **Chamada:** "Ainda sem aprovação em nenhum país. Veja o que os estudos mostraram até agora, dose por dose."
- **PDF existe; precisa de novo título e revisão dos capítulos de protocolo e farmácia.**
- **~45 páginas · R$ 29,90 · bump: T1.**

### I4 — BPC-157: O Que os Fóruns Não Te Contam

- **Subtítulo:** O que tem estudo, o que é achismo e as 8 perguntas para fazer antes de gastar um real.
- **Título alternativo:** BPC-157 Sem Achismo.
- **Para quem:** quem pesquisa recuperação de lesão e encontra só relato.
- **Sumário:** (1) Origem e mecanismo proposto. (2) Mapa da evidência: células, animais, humanos. (3) De onde vêm as doses citadas (250 mcg, 1 a 2 vezes ao dia) e por que não são de bula. (4) Meia-vida e frequência. (5) Riscos: angiogênese, procedência, pureza. (6) WADA: proibido dentro e fora de competição. (7) As 8 perguntas. (8) Como ler um laudo.
- **Bônus:** quadro de evidência por tipo de lesão; checklist de laudo.
- **Aparece em:** `/peptideos/bpc-157`; post `bpc-157-ciclo-duracao`; comparações `bpc-157-vs-tb-500`, `bpc-157-vs-ghk-cu`, `kpv-vs-bpc-157`, tripla; `/peptideos/categoria/cicatrizacao`.
- **Chamada:** "Quase tudo sobre BPC-157 vem de estudo em animal. Veja o que existe em humanos antes de decidir."
- **~35 páginas · R$ 29,90 · bump: T1.**

### I5 — GHK-Cu: Você Pode Estar Anulando o Seu

- **Subtítulo:** A ordem certa com vitamina C e retinol, o que tem estudo de verdade e o que é só marketing de cosmético.
- **Título alternativo:** GHK-Cu Sem Marketing.
- **Para quem:** quem já usa ácidos e retinoides e quer o próximo passo com base.
- **Sumário:** (1) O tripeptídeo de cobre. (2) Estudos com uso tópico: o que foi medido. (3) Concentrações de 0,05% a 2% e como ler um rótulo. (4) Rotina: horários, pH e combinações. (5) Injetável: por que não há dose estabelecida. (6) Armazenamento. (7) Quando evitar.
- **Bônus:** tabela de compatibilidade de ativos; rotina de manhã e noite imprimível.
- **Aparece em:** `/peptideos/ghk-cu`; post `ghk-cu-para-que-serve`; `/peptideos/categoria/pele-e-estetica`; comparações `tb-500-vs-ghk-cu`, `ghk-cu-vs-epithalon`.
- **Chamada:** "Vitamina C junto pode desestabilizar o cobre. Veja a ordem certa da rotina."
- **PDF existe; precisa de novo título e retirada de promessas de resultado.**
- **~40 páginas · R$ 29,90 · sem bump (público de uso tópico).**

### I6 — CJC-1295 + Ipamorelina: Com DAC ou Sem DAC?

- **Subtítulo:** A dúvida que muda tudo: horários, mistura no mesmo frasco e os 7 erros de quem copia protocolo de fórum.
- **Título alternativo:** CJC + Ipamorelina: O Guia Que Faltava.
- **Para quem:** quem pesquisa a combinação de GH mais citada.
- **Sumário:** (1) GHRH e GHRP: por que se combinam. (2) Com DAC (meia-vida de dias) e sem DAC (cerca de 30 minutos): duas substâncias na prática. (3) Ipamorelina: seletividade e meia-vida de ~2 h. (4) Doses citadas e de onde vêm. (5) Mistura no mesmo frasco: a conta. (6) GH, IGF-1 e riscos. (7) WADA S2. (8) Os 7 erros.
- **Bônus:** tabela de mistura por tamanho de frasco; comparativo com e sem DAC.
- **Aparece em:** `/peptideos/cjc-1295`, `/peptideos/ipamorelina`; post `cjc-ipamorelina-como-combinar`; `/ferramentas/mistura`; comparações `cjc-1295-vs-ipamorelina` e a tripla com sermorelina.
- **Chamada (mistura):** "Misturou CJC e ipamorelina? Veja o que muda com e sem DAC antes de aplicar."
- **~40 páginas · R$ 29,90 · bump: T1.**

### I7 — Tesamorelina: O Único Peptídeo de GH Aprovado

- **Subtítulo:** Para quem a FDA aprovou, o que os estudos mediram na gordura visceral e o que ninguém pode te prometer fora disso.
- **Título alternativo:** Gordura Visceral e Tesamorelina: O Que É Fato.
- **Sumário:** (1) Análogo de GHRH. (2) A indicação aprovada: gordura abdominal em HIV com lipodistrofia. (3) Dose de bula (2 mg/dia) e meia-vida de minutos. (4) Resultados e o que acontece ao parar. (5) Uso fora da bula: o que falta. (6) Efeitos adversos, glicemia, IGF-1. (7) WADA.
- **Bônus:** resumo da bula em uma página.
- **Aparece em:** `/peptideos/tesamorelina`; post `tesamorelina-gordura-visceral`; comparações com tesamorelina em primeiro.
- **Chamada:** "Aprovada para um grupo específico. Veja o que os estudos mediram antes de extrapolar."
- **~30 páginas · R$ 29,90 · bump: T1.**

### I8 — PT-141: Leia Antes da Primeira Dose

- **Subtítulo:** A dose da bula, os 45 minutos, o limite de 8 por mês e como não passar a noite enjoado.
- **Título alternativo:** PT-141 Sem Sustos.
- **Sumário:** (1) Ação central, diferente dos inibidores de PDE5. (2) Aprovação FDA de 2019: para quem. (3) Dose de 1,75 mg, 45 minutos antes, 1 a cada 24 h. (4) Náusea e pressão arterial. (5) Contraindicações. (6) Uso em homens: fora da bula. (7) PT-141 não é Melanotan II.
- **Bônus:** cartão de bolso com limites de uso.
- **Aparece em:** `/peptideos/pt-141`; post `pt-141-bremelanotida`; `/peptideos/categoria/funcao-sexual`; comparação `pt-141-vs-melanotan-ii`.
- **Chamada:** "Máximo de 8 doses por mês e 1 a cada 24 h. Veja os outros limites da bula."
- **~30 páginas · R$ 29,90 · bump: T1.**

### C1 — Os 7 Peptídeos de GH, Lado a Lado

- **Subtítulo:** Qual dá fome, qual mexe no cortisol, qual dura minutos e qual dura dias: pare de escolher no escuro.
- **Título alternativo:** GHRH ou GHRP? Pare de Confundir.
- **Sumário:** (1) GHRH x GHRP. (2) Uma ficha de duas páginas para cada um: sermorelina, hexarelina, GHRP-2, GHRP-6, ipamorelina, CJC-1295, tesamorelina. (3) Tabela-mestra. (4) Efeitos em apetite, cortisol e prolactina. (5) Riscos de GH e IGF-1 elevados. (6) WADA S2.
- **Bônus:** tabela-mestra imprimível.
- **Aparece em:** fichas `sermorelina`, `hexarelina`, `ghrp-2`, `ghrp-6`; posts `sermorelina-o-que-e`, `hexarelina-o-que-e`, `ghrp-2-o-que-e`, `ghrp-6-o-que-e`; `/peptideos/categoria/hormonio-do-crescimento`; demais comparações de GH.
- **Chamada (ficha):** "Sermorelina dura cerca de 11 minutos; CJC com DAC, dias. Veja os 7 lado a lado."
- **~45 páginas · R$ 29,90 · bump: T1.**

### C2 — TB-500, KPV e LL-37: O Que Ninguém Mediu

- **Subtítulo:** O que existe de estudo, de onde saíram as doses que circulam e o que nunca foi testado em humanos.
- **Título alternativo:** Recuperação Além do Hype.
- **Sumário:** (1) Reparo tecidual em resumo. (2) TB-500 e timosina beta-4. (3) KPV. (4) LL-37. (5) O que não se sabe (meia-vida não caracterizada). (6) WADA. (7) Procedência.
- **Aparece em:** fichas `tb-500`, `kpv`, `ll-37`; posts `tb-500-para-que-serve`, `kpv-peptideo-o-que-e`, `ll-37-o-que-e`; comparação `timosina-alfa-1-vs-tb-500`.
- **Chamada:** "O fragmento TB-500 nunca teve a meia-vida medida em humanos. Veja o que existe de dado."
- **~35 páginas · R$ 29,90 · bump: T1.**

### C3 — Semax, Selank e DSIP: Funciona Fora da Rússia?

- **Subtítulo:** Foco, ansiedade e sono: o que os estudos russos mostram, o que falta provar e como converter a dose em gotas.
- **Título alternativo:** Foco, Calma e Sono: O Guia Honesto dos Peptídeos.
- **Sumário:** (1) Origem e registro russo. (2) Semax. (3) Selank. (4) DSIP: dados escassos. (5) Spray: gotas e jatos em vez de unidades. (6) Limites da evidência. (7) Procedência.
- **Aparece em:** fichas `semax`, `selank`, `dsip`; posts `semax-nootropico`, `selank-ansiedade`, `dsip-peptideo-do-sono`; `/peptideos/categoria/cognitivo`; comparações `semax-vs-selank`, `dsip-vs-selank`.
- **Chamada:** "Dose em gotas, não em unidades de seringa. Veja como converter."
- **~35 páginas · R$ 29,90 · sem bump.**

### C4 — Longevidade Sem Ilusão

- **Subtítulo:** MOTS-c, Epithalon e Timosina Alfa-1: o que foi medido em gente, o que é estudo em rato e o que é só promessa.
- **Título alternativo:** Peptídeos Anti-Idade: Fato ou Promessa?
- **Sumário:** (1) O que "anti-envelhecimento" quer dizer em estudo. (2) MOTS-c. (3) Epithalon e telomerase. (4) Timosina alfa-1: aprovação regional. (5) Nenhum estudo de expectativa de vida. (6) WADA e procedência.
- **Aparece em:** fichas `mots-c`, `epithalon`, `timosina-alfa-1`; posts `mots-c-o-que-e`, `epithalon-telomerase`, `timosina-alfa-1-o-que-e`; `/peptideos/categoria/longevidade`; comparação `mots-c-vs-epithalon`.
- **Chamada:** "Nenhum peptídeo aumentou expectativa de vida em estudo com humanos. Veja o que de fato foi medido."
- **~35 páginas · R$ 29,90 · bump: T1.**

### C5 — Emagrecedores: O Que Funciona, O Que Vem Aí e O Que É Furada

- **Subtítulo:** Liraglutida, cagrilintida e AOD-9604: o aprovado, o que está em estudo e o que não passou nos ensaios.
- **Título alternativo:** Além da Semaglutida e da Tirzepatida.
- **Sumário:** (1) O mapa das opções. (2) Liraglutida: diária, escada semanal até 3 mg. (3) Cagrilintida: amilina, em estudo. (4) AOD-9604: sem eficácia nos ensaios. (5) Comparativo com semaglutida e tirzepatida. (6) Status regulatório.
- **Aparece em:** fichas `liraglutida`, `cagrilintida`, `aod-9604`; `/medicamentos/saxenda`, `victoza`; posts `liraglutida-saxenda-victoza`, `cagrilintida-o-que-e`, `aod-9604-o-que-e`; titulação com liraglutida; comparações com esses em primeiro.
- **Chamada:** "AOD-9604 não mostrou eficácia nos ensaios clínicos. Veja o que tem aprovação e o que vem aí."
- **~35 páginas · R$ 29,90 · bump: T1.**

### C6 — Gonadorelina na TRT: O Erro Que Desliga o Eixo

- **Subtítulo:** Por que a aplicação precisa ser em pulsos, a diferença para o hCG e onde entra a kisspeptina.
- **Título alternativo:** TRT e Fertilidade: Gonadorelina e Kisspeptina.
- **Sumário:** (1) O eixo: hipotálamo, hipófise, gônadas. (2) Gonadorelina: meia-vida de 2 a 10 minutos e o efeito oposto do estímulo contínuo. (3) Diferença para hCG. (4) Kisspeptina-10: uso experimental. (5) Exames e acompanhamento. (6) WADA.
- **Aparece em:** fichas `gonadorelina`, `kisspeptina-10`; posts `gonadorelina-trt-fertilidade`, `kisspeptina-o-que-e`; `/peptideos/categoria/hormonal`; comparação entre os dois.
- **Chamada:** "Estímulo contínuo de GnRH suprime o eixo em vez de ativar. Veja por que a frequência decide tudo."
- **~30 páginas · R$ 29,90 · bump: T1.**

### T1 — 7 Erros Que Mudam Sua Dose Sem Você Perceber

- **Subtítulo:** Reconstituição do frasco à seringa em 7 passos, com a tabela de unidades pronta para imprimir.
- **Título alternativo:** Reconstituição Sem Erro.
- **Para quem:** quem usa a calculadora e tem medo de errar na prática.
- **Sumário:** (1) mg, mcg, ml e UI sem confusão. (2) Os 7 passos. (3) Água bacteriostática: quanto e por quê. (4) Seringas de 30, 50 e 100 UI. (5) Os 7 erros. (6) Armazenamento e validade de 28 dias. (7) Mistura no mesmo frasco. (8) Tabelas por frasco.
- **Bônus:** tabela de unidades imprimível; checklist de bancada.
- **Aparece em:** `/ferramentas/reconstituicao` e páginas de frasco e dose; `conversor`; `cronograma`; `/seringas/*`; glossário; posts `como-reconstituir-semaglutida`, `como-reconstituir-tirzepatida`, `agua-bacteriostatica-guia`.
- **Chamada (resultado):** usa unidades calculadas, como no exemplo da seção 1.6.
- **~35 páginas · R$ 29,90 avulso · R$ 14,90 como bump · bump próprio: T2.**

### T2 — Não Compre Antes de Checar Isto

- **Subtítulo:** 12 checagens para não levar produto falso nem pagar mais caro por mg.
- **Título alternativo:** Original, Manipulado ou Falso?
- **Para quem:** quem está comparando preço e fornecedor.
- **Sumário:** (1) Original, manipulado, "de pesquisa": o que cada um garante. (2) As 12 checagens (embalagem, lote, laudo, cadeia de frio). (3) Custo por mg, por dose e por mês. (4) A perda dos 28 dias na conta. (5) Sinais de golpe. (6) O que perguntar ao vendedor.
- **Bônus:** checklist de uma página; planilha de custo por mg.
- **Aparece em:** `/ferramentas/custo-glp1`, `duracao-frasco`; posts `ozempic-falso-como-identificar`, `mounjaro-falso-como-identificar`, `onde-comprar-tirzepatida`, `tirzepatida-preco-quanto-custa`, `tirzepatida-manipulada-seguranca`; `/peptideos/categoria/aprovados`.
- **Chamada (custo):** "Sua dose sai por R$ X. Antes de fechar, passe pelas 12 checagens."
- **~30 páginas · R$ 29,90 · bump: T1.**

### T3 — Parei. E Agora?

- **Subtítulo:** O que os estudos mostram sobre o peso depois da semaglutida e da tirzepatida e o plano de 90 dias para reduzir o reganho.
- **Título alternativo:** Depois da Caneta.
- **Para quem:** quem pensa em parar ou já parou.
- **Sumário:** (1) O que os estudos de interrupção mostraram. (2) Por que o peso volta. (3) Opções para discutir com o médico: manter, reduzir, espaçar. (4) Proteína, treino de força e massa magra. (5) Primeiros 90 dias sem a medicação. (6) Quando voltar.
- **Bônus:** plano de 90 dias imprimível.
- **Aparece em:** posts `efeito-rebote-apos-parar-semaglutida`, `efeito-rebote-apos-parar-tirzepatida`; `/ferramentas/diario`; bump de I1 e I2.
- **Chamada:** "Nos estudos, boa parte do peso voltou em um ano. Veja o que dá para fazer antes de parar."
- **~30 páginas · R$ 24,90 avulso · R$ 14,90 como bump.**

### Páginas sem ebook próprio

| Página | Oferta |
|---|---|
| Home, `/peptideos`, `/ferramentas`, `/blog`, `/peptideos/categoria/emagrecimento` | Kit Começo Seguro |
| Listas `proibidos-no-esporte`, `meia-vida`, `/comparar` (índice), `/medicamentos` (índice) | Kit Começo Seguro |
| `/peptideos/melanotan-ii`, post `melanotan-2-riscos` | Nenhuma |
| Sobre, metodologia, contato, termos, privacidade, embeds, admin | Nenhuma |
