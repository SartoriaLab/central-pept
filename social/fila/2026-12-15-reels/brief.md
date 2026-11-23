# reels de 2026-12-15

Regras e schema: `social/fila/REGRAS.md`. Sai como Reels: capriche no gancho e nas cenas (scenes): uma frase por cena, com título e desenho.
Salve o texto em `social/fila/2026-12-15-reels/texto.json` e confira com:

    "C:/Users/julia/AppData/Roaming/nvm/v20.14.0/node.exe" node_modules/tsx/dist/cli.mjs scripts/social/run.ts --check social/fila/2026-12-15-reels

Se sair "REPROVADO", corrija só o que a lista aponta e rode de novo.

## PEDIDO

TEMA: Quantas unidades puxar de tirzepatida e semaglutida em cada dose

FONTE:
Título: Quantas unidades puxar de tirzepatida e semaglutida em cada dose

Resumo: Unidades na seringa U-100 = dose (mg) ÷ concentração (mg/ml) × 100, e concentração = mg do frasco ÷ ml de água. Exemplo: frasco de 10 mg com 2 ml de água fica com 5 mg/ml, e 2,5 mg de tirzepatida são 50 unidades. Frasco de 5 mg de semaglutida com 2 ml fica com 2,5 mg/ml, e 0,25 mg são 10 unidades. As tabelas abaixo cobrem as doses das bulas. A dose é a que o médico prescreveu; a conta só traduz essa dose em volume.

Quando a tirzepatida ou a semaglutida vêm em frasco com pó para reconstituir, a prescrição diz a dose em **mg**, mas a seringa de insulina mede em **unidades**. A ponte entre as duas é uma conta simples, e errar essa conta é o erro mais perigoso de quem prepara o próprio frasco. Este texto explica a fórmula, traz tabelas para os frascos e volumes de água mais comuns e aponta para as páginas de cada dose.

as tabelas traduzem uma dose em volume; não dizem qual dose usar. A dose, o momento de subir e o tempo em cada etapa são decisões do médico que prescreveu. As canetas aprovadas (Mounjaro, Ozempic, Wegovy) vêm prontas e não precisam desta conta. Sobre os riscos de frascos de origem não regulada, veja tirzepatida manipulada.

## A fórmula

Tudo depende de duas contas, para seringa de insulina **U-100** (100 unidades = 1 ml):

1. **Concentração (mg/ml) = mg do frasco ÷ ml de água**
2. **Unidades = dose (mg) ÷ concentração (mg/ml) × 100**

As duas juntas viram uma só, a mesma usada nas calculadoras do site: **unidades = dose (mg) × água (ml) × 100 ÷ mg do frasco.**

Exemplo com tirzepatida: frasco de **10 mg** com **2 ml** de água bacteriostática fica com 10 ÷ 2 = **5 mg/ml**. A dose de 2,5 mg dá 2,5 ÷ 5 × 100 = **50 unidades** (0,5 ml).

Exemplo com semaglutida: frasco de **5 mg** com **2 ml** fica com **2,5 mg/ml**. A dose de 0,25 mg dá 0,25 ÷ 2,5 × 100 = **10 unidades** (0,1 ml).

O volume de água não muda a quantidade de remédio no frasco; muda só a concentração e, portanto, quantas unidades cada dose ocupa.

## Tabela: tirzepatida

As doses são as da bula do Mounjaro (FDA): começo em 2,5 mg por semana, com subidas de 2,5 mg a cada 4 semanas ou mais, até no máximo 15 mg. Valores em unidades na seringa U-100.

| Dose | 10 mg + 2 ml (5 mg/ml) | 10 mg + 1 ml (10 mg/ml) | 15 mg + 1 ml (15 mg/ml) |
| --- | --- | --- | --- |
| 2,5 mg | 50 U | 25 U | 16,7 U |
| 5 mg | 100 U | 50 U | 33,3 U |
| 7,5 mg | passa de 100 U | 75 U | 50 U |
| 10 mg | passa de 100 U | 100 U | 66,7 U |
| 12,5 mg | frasco menor que a dose | frasco menor que a dose | 83,3 U |
| 15 mg | frasco menor que a dose | frasco menor que a dose | 100 U |

Cada dose da primeira coluna leva à página dela, com todas as combinações de frasco e água e quantas semanas o frasco rende.

## Tabela: semaglutida

As doses são as das bulas do Ozempic (0,25 → 0,5 → 1 → 2 mg por semana) e do Wegovy (0,25 → 0,5 → 1 → 1,7 → 2,4 mg por semana), sempre com 4 semanas ou mais em cada etapa.

| Dose | 3 mg + 1 ml (3 mg/ml) | 5 mg + 2 ml (2,5 mg/ml) | 5 mg + 1 ml (5 mg/ml) |
| --- | --- | --- | --- |
| 0,25 mg | 8,3 U | 10 U | 5 U |
| 0,5 mg | 16,7 U | 20 U | 10 U |
| 1 mg | 33,3 U | 40 U | 20 U |
| 1,7 mg | 56,7 U | 68 U | 34 U |
| 2 mg | 66,7 U | 80 U | 40 U |
| 2,4 mg | 80 U | 96 U | 48 U |

## Como escolher frasco e água

A tabela mostra que a mesma dose pode cair em números bem diferentes. Três critérios ajudam:

- **Número fácil de medir.** 50 unidades é fácil; 16,7 unidades obriga a estimar entre traços. Se a combinação dá número quebrado, outra quantidade de água costuma resolver.
- **Cabe na seringa.** Tudo que passa de 100 U não cabe numa seringa de 1 ml de uma vez. Doses pequenas, abaixo de 30 U, ficam mais precisas na seringa de 30 U. O guia seringa de 30, 50 ou 100 unidades explica a escolha.
- **Cabe no prazo.** O frasco reconstituído tem referência de até 28 dias na geladeira. Com uma aplicação por semana, só 4 doses cabem nesse período: um frasco de 15 mg na dose de 2,5 mg teria 6 doses, e 2 venceriam. Os detalhes estão em quanto tempo dura o frasco reconstituído.

**A concentração vale para o frasco inteiro.** Se a etapa seguinte da subida de dose pede outra combinação, isso é um frasco novo, preparado do zero. Não acrescente água a um frasco já reconstituído.

## Erros que mudam a dose

- **Confundir unidades com mg.** 50 unidades não são 50 mg; são 0,5 ml da solução que você preparou.
- **Esquecer a quantidade de água.** Sem a concentração anotada na etiqueta, não há como saber quantas unidades puxar na semana seguinte.
- **Usar seringa U-40.** A escala é outra: o mesmo número de unidades dá 2,5 vezes mais volume. Todas as contas aqui são para U-100.
- **Usar a tabela de outro produto.** Tirzepatida e semaglutida têm doses muito diferentes; 2,5 mg de uma não equivale a 2,5 mg da outra.
- **Pular etapas.** A subida gradual das bulas existe para reduzir náusea e vômito. Mudar de dose é decisão do médico.

## Ferramentas

- Calculadora de reconstituição: qualquer frasco, água e dose, com a seringa marcada. Há versões prontas para tirzepatida e semaglutida.
- Tabela de doses GLP-1: todas as etapas da subida de dose para imprimir.
- Subida de dose: calendário com a data de cada etapa.

O passo a passo do preparo está em como reconstituir tirzepatida e como reconstituir semaglutida.

P: Quantas unidades são 2,5 mg de tirzepatida?
R: Depende da concentração do frasco. Com frasco de 10 mg e 2 ml de água (5 mg/ml), 2,5 mg são 50 unidades na seringa U-100. Com 10 mg e 1 ml (10 mg/ml), 25 unidades. Com 15 mg e 1 ml (15 mg/ml), cerca de 16,7 unidades. Sem saber quanta água foi usada, não há resposta certa.
P: Quantas unidades são 0,25 mg de semaglutida?
R: Com frasco de 5 mg e 2 ml de água (2,5 mg/ml), 10 unidades. Com 5 mg e 1 ml (5 mg/ml), 5 unidades. Com 3 mg e 1 ml (3 mg/ml), cerca de 8,3 unidades. A conta é sempre dose ÷ concentração × 100.
P: Quantas unidades tem 1 ml na seringa de insulina?
R: Na seringa U-100, 100 unidades. Cada unidade é 0,01 ml, então 10 unidades são 0,1 ml e 50 unidades, 0,5 ml.
P: Por que a mesma dose dá unidades diferentes em frascos diferentes?
R: Porque a unidade da seringa mede volume, não quantidade de remédio. Mais água deixa a solução mais diluída, e a mesma dose ocupa mais unidades. Menos água concentra a solução, e a dose ocupa menos unidades. A quantidade de remédio aplicada é a mesma se a conta estiver certa.
P: Caneta Mounjaro, Ozempic ou Wegovy precisa dessa conta?
R: Não. As canetas desses medicamentos vêm com a solução pronta e a dose é escolhida na própria caneta, sem contar unidades. A conta de unidades só existe quando o medicamento vem em frasco com pó para reconstituir.

Peptídeo: Tirzepatida
Categoria: GLP-1 / Emagrecimento
Resumo: Agonista duplo GIP/GLP-1 (Mounjaro, Zepbound). Usado para controle glicêmico e perda de peso.
Dose típica: 2.5 mg, 1x por semana
Faixa de dose: 2,5-15 mg/semana (subcutâneo, titulação a cada ≥4 semanas)
Meia-vida: ~5 dias
Frascos comuns: 5 mg, 10 mg, 15 mg, 20 mg, 60 mg
Status regulatório: Aprovado FDA
Descrição: A tirzepatida é um agonista dual dos receptores de GIP e GLP-1, aprovada pela FDA em 2022 como Mounjaro (diabetes tipo 2) e em 2023 como Zepbound (obesidade). Peptídeo sintético de 39 aminoácidos ligado a ácido graxo diácido C20, com ligação à albumina e administração subcutânea semanal.

Os programas SURPASS (diabetes) e SURMOUNT (obesidade) demonstraram perda ponderal média de até ~20,9% com 15 mg/semana em 72 semanas (SURMOUNT-1), superior aos agonistas GLP-1 puros em comparações diretas. Indicada para adultos com DM2 e adultos com obesidade/sobrepeso com comorbidade.
Mecanismo: Ativa simultaneamente os receptores GIP e GLP-1, ambos da família de receptores acoplados à proteína G classe B. Ativação do GLP-1: insulina glicose-dependente, supressão de glucagon, retardo do esvaziamento gástrico, saciedade central. A coativação de GIP contribui para sensibilidade à insulina e metabolismo lipídico, embora a sinergia exata ainda esteja sob investigação.

A conjugação ao ácido graxo C20 confere meia-vida de ~5 dias.
Efeitos colaterais: Náusea; Diarreia; Vômito; Constipação; Diminuição do apetite; Dispepsia / dor abdominal
Contraindicações: História pessoal ou familiar de carcinoma medular de tireoide (CMT); Síndrome de Neoplasia Endócrina Múltipla tipo 2 (NEM 2); Hipersensibilidade grave (anafilaxia e angioedema relatados)

Peptídeo: Semaglutida
Categoria: GLP-1 / Emagrecimento
Resumo: Agonista do receptor GLP-1. Usado para controle glicêmico e perda de peso.
Dose típica: 0.25 mg, 1x por semana (dose inicial, aumentar gradualmente)
Faixa de dose: 0,25-2,4 mg/semana (subcutâneo, com titulação)
Meia-vida: ~7 dias
Frascos comuns: 3 mg, 5 mg
Status regulatório: Aprovado FDA
Descrição: A semaglutida é um análogo do peptídeo semelhante ao glucagon tipo 1 (GLP-1), aprovada pela FDA e comercializada como Ozempic (2017, diabetes tipo 2), Rybelsus (oral, 2019) e Wegovy (2021, obesidade). Molécula modificada do GLP-1 humano com substituições de aminoácidos e conjugação a ácido graxo C18, o que permite ligação à albumina e administração semanal.

Indicada para diabetes tipo 2 em adultos e manejo crônico de peso em obesidade (IMC ≥ 30) ou sobrepeso (IMC ≥ 27) com comorbidade. Ensaios de fase 3 (SUSTAIN e STEP) demonstraram perda ponderal média de 10-15% com 2,4 mg/semana. Em 2024 a FDA também aprovou para redução de risco cardiovascular em adultos com DCV estabelecida e obesidade/sobrepeso.
Mecanismo: Agonista seletivo do receptor GLP-1, amplamente expresso em células beta pancreáticas, neurônios do SNC (hipotálamo, tronco cerebral), TGI e miocárdio. A ativação aumenta secreção de insulina glicose-dependente, suprime glucagon, retarda esvaziamento gástrico e atua em centros de saciedade, reduzindo ingestão calórica.

A modificação estrutural (ácido graxo C18 ligado ao Lys26) confere alta afinidade pela albumina sérica, reduzindo depuração renal e degradação por DPP-4 — resultando em meia-vida plasmática de ~1 semana.
Efeitos colaterais: Náusea (>20% em Ozempic; até 44% em Wegovy); Vômito; Diarreia; Constipação; Dor abdominal; Reações no local da injeção
Contraindicações: História pessoal ou familiar de carcinoma medular de tireoide (CMT); Síndrome de Neoplasia Endócrina Múltipla tipo 2 (NEM 2); Hipersensibilidade grave à semaglutida ou excipientes; Gestação (uso não recomendado)
