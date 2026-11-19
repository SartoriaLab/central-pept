# carrossel de 2027-03-05

Regras e schema: `social/fila/REGRAS.md`. Sai como carrossel: capriche na capa (hook) e nos slides.
Salve o texto em `social/fila/2027-03-05-carrossel/texto.json` e confira com:

    "C:/Users/julia/AppData/Roaming/nvm/v20.14.0/node.exe" node_modules/tsx/dist/cli.mjs scripts/social/run.ts --check social/fila/2027-03-05-carrossel

Se sair "REPROVADO", corrija só o que a lista aponta e rode de novo.

## PEDIDO

TEMA: Retatrutida × tirzepatida: o que os estudos mediram e por que não dá para comparar direto

FONTE:
Título: Retatrutida × tirzepatida: o que os estudos mediram e por que não dá para comparar direto

Resumo: No SURMOUNT-1 (NEJM, 2022), a tirzepatida 15 mg levou a perda média de 20,9% em 72 semanas contando todos os participantes. No TRIUMPH-1 (comunicado da Lilly, maio de 2026), a retatrutida 12 mg levou a 25,0% em 80 semanas na mesma conta, e 28,3% entre quem seguiu o tratamento. Os estudos tiveram populações, durações e pesos iniciais diferentes e nunca colocaram as duas drogas no mesmo grupo de comparação. O estudo que compara as duas diretamente, o TRIUMPH-5, ainda não tem resultado. E só a tirzepatida é aprovada.

Quem pesquisa retatrutida quase sempre chega à mesma pergunta: ela é melhor que a tirzepatida? Os números de perda de peso da retatrutida são maiores, e é tentador colocar um ao lado do outro e tirar a conclusão. Este texto mostra o que cada estudo mediu de fato e por que essa comparação direta engana. Se você quer só a tabela das duas moléculas (mecanismo, meia-vida, status), ela está em Tirzepatida vs Retatrutida. Aqui o assunto são os estudos.

a tirzepatida é aprovada (Mounjaro, Zepbound). A retatrutida é **experimental** e não tem aprovação em nenhum país. As doses citadas abaixo são as que os ensaios usaram, não orientação de uso.

## Os dois estudos principais

O estudo de referência da tirzepatida para obesidade é o **SURMOUNT-1**, publicado no NEJM em 2022. O da retatrutida é o **TRIUMPH-1**, com resultados divulgados pela Eli Lilly em 21 de maio de 2026. Os dois são da mesma empresa, controlados por placebo e em pessoas sem diabetes. As semelhanças param aí.

| | SURMOUNT-1 (tirzepatida) | TRIUMPH-1 (retatrutida) |
| --- | --- | --- |
| Participantes | 2.539 | 2.339 |
| População | Obesidade, ou sobrepeso com comorbidade, sem diabetes | Obesidade, ou sobrepeso com comorbidade, sem diabetes |
| Duração | 72 semanas | 80 semanas |
| Doses-alvo | 5, 10 e 15 mg por semana | 4, 9 e 12 mg por semana |
| Peso médio no início | cerca de 105 kg | 112,7 kg (IMC médio 40,0) |
| Perda média na dose mais alta, todos os participantes | 20,9% | 25,0% |
| Perda média na dose mais alta, quem seguiu o tratamento | 22,5% | 28,3% |
| Placebo, todos os participantes | 3,1% | 3,9% |
| Abandono por efeito adverso na dose mais alta | 6,2% (placebo 2,6%) | 11,3% (placebo 4,9%) |

Fontes: NEJM 2022 e comunicado da Lilly sobre o SURMOUNT-1; comunicado da Lilly de 21/05/2026 sobre o TRIUMPH-1. Os resultados completos do TRIUMPH-1 em revista científica podem trazer números ligeiramente diferentes dos do comunicado.

A subida de dose também foi diferente. A tirzepatida começa em 2,5 mg e sobe 2,5 mg a cada 4 semanas, como na bula. A retatrutida, na fase 3, começou em 2 mg e subiu a cada 4 semanas na escada 2 → 4 → 6 → 9 → 12 mg.

## Duas contas para o mesmo estudo

Cada estudo divulga dois números de perda de peso, e misturar os dois é o erro mais comum nas comparações que circulam na internet.

- **Regime de tratamento** (em inglês, *treatment-regimen estimand*): conta todo mundo que entrou no estudo, inclusive quem parou o remédio no meio. É o número mais perto do que acontece na vida real.
- **Estimativa de eficácia** (*efficacy estimand*): estima o que aconteceria se todos tivessem seguido o tratamento até o fim. É sempre maior.

Comparar os 28,3% da retatrutida (eficácia) com os 20,9% da tirzepatida (regime de tratamento) exagera a diferença. Na mesma conta, os pares são 25,0% contra 20,9% e 28,3% contra 22,5%.

## Por que, mesmo assim, não dá para comparar

Mesmo usando a mesma conta, comparar estudos diferentes (o que os pesquisadores chamam de comparação indireta ou "entre ensaios") tem limites que nenhuma tabela resolve:

1. **Duração diferente.** O TRIUMPH-1 durou 8 semanas a mais, e tempo muda a média: na extensão do próprio TRIUMPH-1 até 104 semanas, o grupo que começou em 12 mg chegou a 29,9% de perda, contando todos os participantes da extensão.
2. **Ponto de partida diferente.** Os participantes do TRIUMPH-1 começaram, em média, cerca de 8 kg mais pesados. Um grupo diferente no início pode responder de forma diferente, e a tabela não corrige isso.
3. **Época e regras diferentes.** Os estudos foram feitos em anos diferentes, cada um com seus critérios de inclusão, centros e rotina de acompanhamento. Nada disso é idêntico entre os dois.
4. **Placebo diferente.** O placebo do TRIUMPH-1 perdeu 3,9%; o do SURMOUNT-1, 3,1%. Isso já mostra que os grupos não se comportaram igual.
5. **Doses não equivalentes.** 12 mg de retatrutida e 15 mg de tirzepatida são as doses mais altas de cada estudo, não doses "iguais". As moléculas agem em receptores diferentes e com potências diferentes.

A única forma de responder à pergunta é um **estudo frente a frente**, em que as duas drogas são sorteadas entre participantes do mesmo ensaio. Esse estudo existe: o **TRIUMPH-5** (NCT06662383) compara retatrutida e tirzepatida em adultos com obesidade, em regime duplo-cego. Até novembro de 2026 ele não tinha resultado divulgado.

## E a fase 2?

Antes do TRIUMPH-1, o número mais citado era o da fase 2 da retatrutida (NEJM, 2023): perda média de **24,2% em 48 semanas** com 12 mg, em 338 participantes. É um estudo menor e mais curto, feito para escolher doses, e não substitui a fase 3. Comparar esses 24,2% com os 20,9% do SURMOUNT-1, que durou 72 semanas, tem todos os problemas acima e mais um: o tamanho da amostra.

## Efeitos colaterais: o que os estudos mostram

Nas duas moléculas, os efeitos mais comuns foram **gastrointestinais** (náusea, diarreia, vômito e prisão de ventre), concentrados na subida de dose. Duas diferenças aparecem nos dados divulgados:

- **Abandono por efeito adverso.** Na dose mais alta, 6,2% com tirzepatida 15 mg no SURMOUNT-1 e 11,3% com retatrutida 12 mg no TRIUMPH-1. Os placebos também diferem (2,6% e 4,9%), o que reforça o cuidado na comparação.
- **Disestesia.** Uma sensação anormal na pele (formigamento, ardor, sensibilidade ao toque) foi relatada por 12,5% dos participantes com retatrutida 12 mg no TRIUMPH-1, contra 0,9% no placebo. Não é um efeito típico dos remédios da classe já aprovados.

A lista completa de efeitos está nas fichas da tirzepatida e da retatrutida, e o guia efeitos colaterais da tirzepatida detalha o que é esperado com o remédio aprovado.

## O que pesa de verdade na escolha hoje

Na prática, a pergunta "qual é melhor" ainda não tem uma resposta que sirva para decidir. O que existe é:

- A **tirzepatida** tem bula, estudos publicados em vários cenários (SURMOUNT e SURPASS) e registro no Brasil.
- A **retatrutida** tem resultados de fase 3 promissores, divulgados em grande parte por comunicados da empresa, e nenhuma aprovação. A ANVISA orientou a não usar produtos vendidos com esse nome; os detalhes estão em Retatrutida no Brasil: o que diz a ANVISA.

Para entender a molécula nova, veja Retatrutida: o que é. Para a comparação com a semaglutida, que também é aprovada, veja Semaglutida vs Tirzepatida e a tabela Semaglutida vs Tirzepatida vs Retatrutida. A decisão sobre qualquer tratamento é do médico, com base no seu caso.

P: Retatrutida é melhor que tirzepatida?
R: Ainda não dá para dizer. Os números de perda de peso da retatrutida são maiores, mas vêm de estudos diferentes dos da tirzepatida, com população, duração e peso inicial diferentes. A resposta depende de um estudo que coloque as duas no mesmo ensaio: o TRIUMPH-5 (NCT06662383) faz isso e ainda não divulgou resultado. Além disso, só a tirzepatida tem aprovação.
P: Quanto se perde de peso com retatrutida e com tirzepatida nos estudos?
R: No SURMOUNT-1, a tirzepatida 15 mg levou a perda média de 20,9% em 72 semanas contando todos os participantes (22,5% entre quem seguiu o tratamento). No TRIUMPH-1, a retatrutida 12 mg levou a 25,0% em 80 semanas contando todos (28,3% entre quem seguiu). São médias de ensaio, não resultado esperado para cada pessoa.
P: Por que existem dois números de perda de peso para o mesmo estudo?
R: Porque há duas formas de contar. A estimativa de regime de tratamento inclui todo mundo que entrou no estudo, inclusive quem parou o remédio. A estimativa de eficácia calcula o que aconteceria se todos tivessem seguido o tratamento. O segundo número é sempre maior. Para comparar estudos, é preciso usar a mesma conta nos dois.
P: Existe estudo comparando retatrutida e tirzepatida diretamente?
R: Sim, o TRIUMPH-5, registrado como NCT06662383, que compara as duas em adultos com obesidade, em regime duplo-cego. Até novembro de 2026 ele não tinha resultado divulgado.
P: A retatrutida tem mais efeitos colaterais que a tirzepatida?
R: Nos dois estudos, os efeitos mais comuns foram gastrointestinais. O abandono por efeito adverso na dose mais alta foi de 6,2% com tirzepatida 15 mg no SURMOUNT-1 e de 11,3% com retatrutida 12 mg no TRIUMPH-1, e a retatrutida teve um efeito pouco visto na classe, a disestesia (12,5% com 12 mg). Como os estudos são diferentes, nem esses números permitem uma conclusão firme.

Peptídeo: Retatrutida
Categoria: GLP-1 / Emagrecimento
Resumo: Agonista triplo GLP-1/GIP/glucagon em desenvolvimento para obesidade e diabetes tipo 2.
Dose típica: 2 mg, 1x por semana
Faixa de dose: Ensaios: 1, 4, 8 e 12 mg/semana (fase 2); 4, 9 e 12 mg/semana com início em 2 mg (fase 3)
Meia-vida: ~6 dias
Frascos comuns: 5 mg, 10 mg, 60 mg
Status regulatório: Em desenvolvimento
Proibido pela WADA no esporte.
Descrição: Retatrutida (LY3437943) é um peptídeo sintético investigacional da Eli Lilly, atuando como agonista triplo dos receptores GIP, GLP-1 e glucagon. Peptídeo de 39 aminoácidos com cadeia de ácido graxo diácido C20, administração subcutânea semanal. **Importante**: NÃO está aprovada por qualquer agência (FDA, EMA, ANVISA). Em julho de 2026 a ANVISA informou que não há pedido de registro e orientou a não usar produtos vendidos como retatrutida. Os ensaios de fase 3 TRIUMPH-1, 2, 3 e 4 já tiveram resultados divulgados; outros seguem em andamento.

Na fase 2 (NEJM 2023), a perda ponderal média foi de 24,2% em 48 semanas com 12 mg/semana em pessoas sem diabetes. No TRIUMPH-1 (fase 3, NEJM 2026, 80 semanas), a média com 12 mg foi de 25,0% contando todos os participantes e de 28,3% considerando quem manteve o tratamento. No TRIUMPH-4 (68 semanas, comunicado da empresa de dezembro de 2025), 23,7% e 28,7% nas mesmas duas contas.
Mecanismo: Ativa simultaneamente receptores de GLP-1, GIP e glucagon. GLP-1 e GIP reproduzem os efeitos observados nos análogos existentes (insulina glicose-dependente, supressão de glucagon pós-prandial, retardo do esvaziamento gástrico, modulação do apetite). A hipótese dos autores dos ensaios é que o agonismo ao receptor de glucagon aumente o gasto energético e a mobilização de gordura no fígado, contribuindo para a perda ponderal adicional e para a redução de gordura hepática; isso ainda não foi demonstrado diretamente em humanos.

Estudos farmacológicos indicam menor potência relativa a GLP-1/glucagon humanos em comparação aos ligantes nativos, com maior potência relativa ao GIP. Conjugação a ácido graxo C20 confere meia-vida compatível com dosagem semanal.
Efeitos colaterais: Náusea (fase 2: 45% com 12 mg e até 60% com início em dose mais alta; fase 3: até ~43%); Diarreia (fase 3: até ~35%); Constipação (fase 3: até ~26%); Vômito (fase 3: até ~25%); Diminuição do apetite; Disestesia (sensações cutâneas anormais), mais frequente nas doses altas: até ~21% com 12 mg em um ensaio de fase 3
Contraindicações: Medicamento experimental — contraindicações formais ainda não estabelecidas em bula; Exclusões dos ensaios: história pessoal/familiar de CMT ou NEM 2; História de pancreatite; Gravidez e lactação; Hipersensibilidade à formulação

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
