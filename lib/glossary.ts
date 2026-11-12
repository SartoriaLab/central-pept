// Glossário: cada termo vira uma rota indexável /glossario/<slug>.
// `definition` é a resposta curta (aparece no índice e no topo da página);
// `body` aprofunda e conecta o termo ao uso prático no site.

export type GlossaryLink = { href: string; label: string; desc?: string };

export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string;
  body: string[];
  /** Slugs de outros termos do glossário. */
  related?: string[];
  links?: GlossaryLink[];
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: 'agua-bacteriostatica',
    term: 'Água bacteriostática',
    definition:
      'Água estéril com 0,9% de álcool benzílico como conservante. É o diluente padrão para reconstituição de peptídeos em frascos multidose, pois inibe crescimento bacteriano após múltiplas perfurações.',
    body: [
      'O álcool benzílico não esteriliza o conteúdo: ele apenas impede que bactérias introduzidas pela agulha se multipliquem. Por isso a técnica asséptica continua necessária — limpar a tampa de borracha com álcool e usar agulha nova a cada retirada.',
      'Na prática, um frasco reconstituído com água bacteriostática costuma ser usado em até 28 dias, guardado na geladeira (2-8 °C). Água estéril para injeção, sem conservante, serve para uso único. A quantidade de água adicionada não muda a quantidade de peptídeo, só a concentração — e, portanto, quantas unidades puxar na seringa.',
    ],
    related: ['reconstituicao', 'frasco-multidose', 'concentracao', 'liofilizado'],
    links: [
      { href: '/blog/agua-bacteriostatica-guia', label: 'Água bacteriostática: guia completo', desc: 'Qual diluente usar e como armazenar o frasco.' },
      { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Quanta água adicionar e quantas unidades puxar.' },
    ],
  },
  {
    slug: 'agonista',
    term: 'Agonista',
    definition:
      'Molécula que se liga a um receptor e ativa sua função. "Agonista GLP-1" significa que o composto ativa o receptor de GLP-1 imitando o hormônio natural.',
    body: [
      'O oposto é o antagonista, que ocupa o receptor sem ativá-lo e bloqueia a ação do hormônio natural. Há também agonistas parciais, que ativam o receptor com intensidade menor que a do ligante original.',
      'Um mesmo composto pode ativar mais de um receptor: a tirzepatida é agonista duplo (GIP e GLP-1) e a retatrutida é agonista triplo (GIP, GLP-1 e glucagon). Em geral, quanto mais receptores envolvidos, maior o efeito metabólico — e mais complexo o perfil de efeitos colaterais.',
    ],
    related: ['glp-1', 'gip', 'glucagon', 'incretina'],
    links: [
      { href: '/comparar/semaglutida-vs-tirzepatida-vs-retatrutida', label: 'Semaglutida vs Tirzepatida vs Retatrutida', desc: 'Agonista simples, duplo e triplo lado a lado.' },
    ],
  },
  {
    slug: 'ampk',
    term: 'AMPK',
    definition:
      'AMP-activated Protein Kinase. Enzima sensor do estado energético celular; sua ativação promove oxidação de gorduras, captação de glicose e biogênese mitocondrial. Alvo proposto de peptídeos como MOTS-c.',
    body: [
      'A AMPK é ativada quando a célula gasta mais energia do que produz — durante exercício ou jejum, por exemplo. Ativada, ela desliga processos que consomem energia (síntese de gordura e de proteína) e liga os que produzem (queima de gordura, captação de glicose).',
      'É também um dos alvos indiretos da metformina. No caso do MOTS-c, a ativação de AMPK foi demonstrada sobretudo em modelos celulares e animais; dados em humanos ainda são limitados.',
    ],
    related: ['meia-vida'],
    links: [
      { href: '/peptideos/mots-c', label: 'Ficha do MOTS-c', desc: 'Mecanismo, dose de referência e evidências.' },
      { href: '/blog/mots-c-o-que-e', label: 'MOTS-c: o que é', desc: 'O peptídeo mitocondrial explicado.' },
    ],
  },
  {
    slug: 'anvisa',
    term: 'ANVISA',
    definition:
      'Agência Nacional de Vigilância Sanitária. Órgão brasileiro que registra medicamentos, fiscaliza fabricação e venda e publica alertas sobre produtos irregulares ou falsificados.',
    body: [
      'Um medicamento só pode ser vendido no Brasil com registro na ANVISA. O número de registro vem impresso na embalagem e pode ser conferido no portal de consultas da agência, assim como a bula oficial no Bulário Eletrônico.',
      'Suspeita de falsificação ou de evento adverso pode ser notificada pelo sistema Notivisa. Muitos peptídeos catalogados aqui não têm registro na ANVISA — nesses casos a ficha indica o status regulatório e o que ele significa.',
    ],
    related: ['bula', 'fda', 'off-label', 'coa'],
    links: [
      { href: '/blog/mounjaro-falso-como-identificar', label: 'Mounjaro falso: como identificar', desc: 'Como conferir registro, lote e embalagem.' },
    ],
  },
  {
    slug: 'bula',
    term: 'Bula',
    definition:
      'Documento oficial aprovado pela agência regulatória (ANVISA, FDA) contendo indicações, posologia, contraindicações e efeitos colaterais do medicamento.',
    body: [
      'A bula é a fonte de maior hierarquia para um medicamento aprovado: resume os ensaios clínicos que sustentaram o registro e define o uso considerado seguro e eficaz. Qualquer uso fora do que ela descreve é chamado off-label.',
      'As escadas de dose de semaglutida e tirzepatida usadas nas ferramentas deste site vêm das bulas. Peptídeos sem aprovação não têm bula — as doses citadas para eles são referências de estudos, com nível de evidência menor.',
    ],
    related: ['anvisa', 'fda', 'off-label', 'dose-tipica', 'titulacao'],
    links: [
      { href: '/ferramentas/titulacao', label: 'Subida de dose GLP-1', desc: 'Escada de bula com datas automáticas.' },
      { href: '/metodologia', label: 'Metodologia editorial', desc: 'Como as fontes são hierarquizadas.' },
    ],
  },
  {
    slug: 'coa',
    term: 'COA (certificado de análise)',
    definition:
      'Certificate of Analysis — documento do fabricante atestando pureza e composição do produto, geralmente com resultado de HPLC. Importante ao avaliar peptídeos manipulados ou de pesquisa.',
    body: [
      'Um COA útil traz o número do lote, a data da análise, a pureza medida por HPLC e a confirmação de identidade (em geral por espectrometria de massa). O lote do documento precisa ser o mesmo impresso no frasco — um COA sem lote serve para qualquer frasco e, portanto, não comprova nada.',
      'O ideal é que a análise seja de laboratório independente, não do próprio vendedor. Mesmo assim, o COA atesta o lote analisado: não garante cadeia de frio, esterilidade nem o que aconteceu com o produto depois.',
    ],
    related: ['hplc', 'liofilizado', 'anvisa'],
    links: [
      { href: '/blog/onde-comprar-tirzepatida', label: 'Guia de procedência da tirzepatida', desc: 'Checklist: COA, lote e cadeia de frio.' },
    ],
  },
  {
    slug: 'concentracao',
    term: 'Concentração',
    definition:
      'Quantidade de substância por volume. Ex.: "2,5 mg/ml" significa 2,5 miligramas de peptídeo por mililitro de solução reconstituída. Determina quantas unidades puxar na seringa.',
    body: [
      'A conta é direta: concentração = mg do frasco ÷ ml de água adicionada. Um frasco de 10 mg com 2 ml de água fica a 5 mg/ml; com 1 ml, a 10 mg/ml.',
      'Concentração mais alta significa volume menor por dose — prático, mas difícil de medir quando a dose cai abaixo de 5 unidades. Concentração mais baixa facilita a medida, até o ponto em que a dose passa da capacidade da seringa. A faixa confortável costuma ser de 10 a 50 unidades por aplicação.',
    ],
    related: ['reconstituicao', 'seringa-de-insulina-u100', 'agua-bacteriostatica', 'dose-tipica'],
    links: [
      { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Concentração e unidades em tempo real.' },
    ],
  },
  {
    slug: 'dose-tipica',
    term: 'Dose típica',
    definition:
      'Quantidade de peptídeo tipicamente administrada em cada aplicação, conforme documentado em estudos clínicos ou uso estabelecido. Não é uma recomendação individual — doses reais variam por pessoa, objetivo e supervisão médica.',
    body: [
      'Para medicamentos aprovados, a dose típica vem da bula. Para peptídeos de pesquisa, vem dos protocolos usados nos estudos disponíveis, muitas vezes pequenos ou feitos em animais — por isso a faixa de dose costuma ser larga e a incerteza, maior.',
      'Neste site a dose típica serve de ponto de partida para as calculadoras: ela já vem preenchida, mas pode ser alterada. O que a calculadora faz é converter a dose em volume; ela não diz qual dose é adequada para alguém.',
    ],
    related: ['bula', 'titulacao', 'concentracao', 'meia-vida'],
    links: [
      { href: '/peptideos', label: 'Enciclopédia de peptídeos', desc: 'Dose de referência e faixa de cada composto.' },
    ],
  },
  {
    slug: 'dpp-4',
    term: 'DPP-4',
    definition:
      'Dipeptidil-peptidase 4. Enzima que degrada peptídeos como o GLP-1 endógeno, limitando sua meia-vida. Peptídeos como a semaglutida têm modificações para resistir à DPP-4 e durar mais no organismo.',
    body: [
      'O GLP-1 produzido pelo intestino dura apenas um a dois minutos na circulação, justamente porque a DPP-4 o inativa. Há duas estratégias farmacológicas para contornar isso: inibir a enzima (as gliptinas, como a sitagliptina) ou criar análogos de GLP-1 que ela não consegue cortar.',
      'A semaglutida usa a segunda estratégia: uma troca de aminoácido protege a molécula da DPP-4, e uma cadeia de ácido graxo a prende à albumina. O resultado é uma meia-vida de cerca de uma semana, que permite aplicação semanal.',
    ],
    related: ['glp-1', 'meia-vida', 'incretina', 'gip'],
    links: [{ href: '/peptideos/semaglutida', label: 'Ficha da semaglutida', desc: 'Mecanismo e farmacocinética.' }],
  },
  {
    slug: 'fda',
    term: 'FDA',
    definition:
      'Food and Drug Administration — agência reguladora dos Estados Unidos. A aprovação pela FDA é um dos marcos mais rigorosos de evidência de eficácia e segurança farmacológica.',
    body: [
      'Para aprovar um medicamento, a FDA exige ensaios clínicos em fases, culminando em estudos de fase 3 com milhares de participantes. Aprovação significa que, para uma indicação específica, os benefícios demonstrados superam os riscos conhecidos.',
      'Aprovação pela FDA não equivale a registro no Brasil: aqui quem decide é a ANVISA. O inverso também vale — um composto "em fase 3" ou "apenas pesquisa" não passou por essa avaliação, e seu perfil de segurança é menos conhecido.',
    ],
    related: ['anvisa', 'bula', 'off-label'],
    links: [{ href: '/metodologia', label: 'Metodologia editorial', desc: 'Como classificamos o status regulatório.' }],
  },
  {
    slug: 'frasco-multidose',
    term: 'Frasco multidose',
    definition:
      'Frasco com tampa de borracha perfurável que contém várias doses. A solução é retirada aos poucos, em aplicações diferentes, ao longo de dias ou semanas.',
    body: [
      'Como a tampa é perfurada repetidas vezes, o diluente precisa ter conservante — daí o uso de água bacteriostática. A cada retirada, a tampa deve ser limpa com álcool 70% e a agulha deve ser nova.',
      'O número de doses de um frasco depende só da quantidade de peptídeo e da dose: frasco de 10 mg ÷ dose de 2,5 mg = 4 doses, qualquer que seja o volume de água. Depois de reconstituído, o prazo usual de uso é de até 28 dias sob refrigeração.',
    ],
    related: ['agua-bacteriostatica', 'reconstituicao', 'liofilizado', 'concentracao'],
    links: [
      { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Doses por frasco e unidades por dose.' },
      { href: '/ferramentas/custo-glp1', label: 'Custo por dose', desc: 'Quanto se perde quando o frasco vence antes de acabar.' },
    ],
  },
  {
    slug: 'gh',
    term: 'GH (hormônio do crescimento)',
    definition:
      'Hormônio do crescimento (Growth Hormone). Hormônio peptídico produzido pela hipófise. Peptídeos "secretagogos de GH" estimulam sua liberação endógena.',
    body: [
      'O GH é liberado em pulsos, com o maior deles durante o sono profundo. Ele age diretamente nos tecidos e, de forma indireta, estimulando o fígado a produzir IGF-1 — responsável por boa parte dos efeitos de crescimento e reparo.',
      'A liberação é regulada por dois sinais opostos do hipotálamo: o GHRH estimula e a somatostatina freia. Peptídeos como sermorelina e ipamorelina atuam sobre esse eixo em vez de fornecer GH pronto, o que preserva o padrão pulsátil.',
    ],
    related: ['ghrh', 'ghrp', 'igf-1', 'secretagogo-de-gh'],
    links: [
      { href: '/comparar/cjc-1295-vs-ipamorelina', label: 'CJC-1295 vs Ipamorelina', desc: 'Duas vias de estímulo do GH comparadas.' },
    ],
  },
  {
    slug: 'ghrh',
    term: 'GHRH',
    definition:
      'Growth Hormone-Releasing Hormone. Hormônio hipotalâmico que estimula a secreção de GH pela hipófise. Análogos de GHRH incluem sermorelina, tesamorelina e CJC-1295.',
    body: [
      'Os análogos de GHRH ligam-se ao mesmo receptor do hormônio natural na hipófise. A diferença entre eles está principalmente na duração: a sermorelina age por minutos, a tesamorelina por algumas horas e o CJC-1295 com DAC por dias.',
      'Como o GHRH depende da hipófise funcionar e respeita o freio da somatostatina, o aumento de GH tende a ser mais fisiológico do que o obtido com GH exógeno. Análogos de GHRH são frequentemente combinados com um GHRP, que age por outro receptor.',
    ],
    related: ['gh', 'ghrp', 'igf-1', 'secretagogo-de-gh'],
    links: [
      { href: '/comparar/sermorelina-vs-tesamorelina', label: 'Sermorelina vs Tesamorelina', desc: 'Dois análogos de GHRH lado a lado.' },
      { href: '/blog/sermorelina-o-que-e', label: 'Sermorelina: o que é', desc: 'O análogo de GHRH mais antigo.' },
    ],
  },
  {
    slug: 'ghrp',
    term: 'GHRP',
    definition:
      'Growth Hormone-Releasing Peptide. Classe de peptídeos sintéticos que imitam a grelina e estimulam liberação de GH via receptor GHSR-1a. Inclui ipamorelina, GHRP-2, GHRP-6 e hexarelina.',
    body: [
      'Os GHRPs diferem bastante em seletividade. GHRP-6 aumenta o apetite de forma marcante; GHRP-2 e hexarelina podem elevar cortisol e prolactina; a ipamorelina é considerada a mais seletiva, com pouco efeito sobre esses outros hormônios.',
      'Por agirem em um receptor diferente do GHRH, os dois tipos de peptídeo têm efeito somado quando usados juntos — é a lógica por trás de combinações como CJC-1295 com ipamorelina.',
    ],
    related: ['gh', 'ghrh', 'secretagogo-de-gh', 'igf-1'],
    links: [
      { href: '/comparar/ghrp-2-vs-ghrp-6', label: 'GHRP-2 vs GHRP-6', desc: 'Diferenças de potência e apetite.' },
      { href: '/comparar/ipamorelina-vs-ghrp-6', label: 'Ipamorelina vs GHRP-6', desc: 'Seletividade comparada.' },
    ],
  },
  {
    slug: 'glp-1',
    term: 'GLP-1',
    definition:
      'Glucagon-Like Peptide 1. Hormônio intestinal liberado após refeições que estimula secreção de insulina, suprime glucagon e promove saciedade. Agonistas incluem semaglutida e liraglutida.',
    body: [
      'Além do efeito sobre a insulina, o GLP-1 retarda o esvaziamento do estômago e age em centros de saciedade no cérebro. É essa combinação que explica a perda de peso — e também os efeitos colaterais mais comuns, como náusea e sensação de estômago cheio.',
      'O hormônio natural dura um a dois minutos; os medicamentos são análogos modificados para durar dias. Por agirem de forma dependente de glicose, raramente causam hipoglicemia quando usados sozinhos.',
    ],
    related: ['gip', 'glucagon', 'incretina', 'dpp-4', 'titulacao', 'agonista'],
    links: [
      { href: '/comparar/semaglutida-vs-tirzepatida', label: 'Semaglutida vs Tirzepatida', desc: 'Os dois agonistas mais usados.' },
      { href: '/ferramentas/titulacao', label: 'Subida de dose GLP-1', desc: 'Calendário de titulação.' },
      { href: '/blog/nausea-ozempic-como-lidar', label: 'Náusea no Ozempic', desc: 'Como lidar com o efeito mais comum.' },
    ],
  },
  {
    slug: 'gip',
    term: 'GIP',
    definition:
      'Glucose-dependent Insulinotropic Polypeptide. Hormônio incretínico que, combinado com GLP-1, potencializa a resposta insulínica. A tirzepatida ativa ambos (GIP + GLP-1) simultaneamente.',
    body: [
      'O GIP é produzido na parte inicial do intestino delgado e, assim como o GLP-1, estimula a insulina apenas quando a glicose está elevada. Tem também ação no tecido adiposo e em centros cerebrais ligados ao apetite.',
      'A hipótese por trás dos agonistas duplos é que ativar GIP junto com GLP-1 aumenta a perda de peso e melhora a tolerabilidade gastrointestinal. Nos ensaios comparativos, a tirzepatida produziu perda de peso maior que a semaglutida.',
    ],
    related: ['glp-1', 'incretina', 'glucagon', 'agonista'],
    links: [
      { href: '/peptideos/tirzepatida', label: 'Ficha da tirzepatida', desc: 'O agonista duplo GIP/GLP-1.' },
      { href: '/blog/semaglutida-vs-tirzepatida', label: 'Semaglutida vs tirzepatida', desc: 'O que os ensaios mostram.' },
    ],
  },
  {
    slug: 'glucagon',
    term: 'Glucagon',
    definition:
      'Hormônio produzido pelas células alfa do pâncreas que eleva a glicose no sangue, mobilizando as reservas do fígado. Também aumenta o gasto energético — por isso é um dos alvos da retatrutida.',
    body: [
      'Glucagon e insulina funcionam como contrapesos: a insulina baixa a glicose depois das refeições, o glucagon a sustenta no jejum. Os agonistas de GLP-1 reduzem a secreção de glucagon, o que ajuda no controle glicêmico.',
      'Parece contraditório ativar o receptor de glucagon em um medicamento para emagrecer, mas o efeito buscado é outro: maior gasto de energia e queima de gordura no fígado. Na retatrutida, a ação sobre GLP-1 e GIP compensa a tendência de elevar a glicose.',
    ],
    related: ['glp-1', 'gip', 'agonista', 'incretina'],
    links: [
      { href: '/blog/retatrutida-o-que-e', label: 'Retatrutida: o que é', desc: 'O agonista triplo em fase 3.' },
      { href: '/comparar/tirzepatida-vs-retatrutida', label: 'Tirzepatida vs Retatrutida', desc: 'Agonista duplo vs triplo.' },
    ],
  },
  {
    slug: 'hplc',
    term: 'HPLC',
    definition:
      'High-Performance Liquid Chromatography (cromatografia líquida de alta eficiência). Técnica de laboratório que separa os componentes de uma amostra e mede a pureza do peptídeo — é o número de "pureza" que aparece no certificado de análise.',
    body: [
      'O resultado é um gráfico com picos: o pico principal corresponde ao peptídeo e os menores, a impurezas. "Pureza de 99% por HPLC" significa que 99% da área dos picos pertence ao composto principal.',
      'O HPLC mede pureza, não identidade nem quantidade: sozinho, não prova que a molécula é a esperada (isso é feito por espectrometria de massa) nem que o frasco contém os miligramas declarados. Também não diz nada sobre esterilidade.',
    ],
    related: ['coa', 'liofilizado'],
    links: [
      { href: '/blog/onde-comprar-tirzepatida', label: 'Guia de procedência da tirzepatida', desc: 'Como ler um certificado de análise.' },
    ],
  },
  {
    slug: 'igf-1',
    term: 'IGF-1',
    definition:
      'Insulin-like Growth Factor 1. Hormônio produzido principalmente pelo fígado em resposta ao GH; medeia muitos dos efeitos anabólicos do GH. Elevação crônica está associada a preocupações oncológicas teóricas.',
    body: [
      'Como o GH é liberado em pulsos e oscila ao longo do dia, o IGF-1 — bem mais estável — é o exame de sangue normalmente usado para avaliar o eixo do hormônio do crescimento e acompanhar o efeito de secretagogos.',
      'IGF-1 estimula crescimento e divisão celular. Por isso, níveis persistentemente acima da faixa de referência não são desejáveis, e histórico de câncer costuma constar como contraindicação nas fichas de peptídeos que elevam GH.',
    ],
    related: ['gh', 'ghrh', 'ghrp', 'secretagogo-de-gh'],
    links: [{ href: '/peptideos/tesamorelina', label: 'Ficha da tesamorelina', desc: 'Análogo de GHRH com dados de IGF-1.' }],
  },
  {
    slug: 'incretina',
    term: 'Incretina',
    definition:
      'Hormônio intestinal liberado após a alimentação que aumenta a secreção de insulina de forma dependente de glicose. As duas incretinas principais são GLP-1 e GIP.',
    body: [
      'O "efeito incretina" é a observação de que a glicose ingerida por via oral provoca uma resposta de insulina maior do que a mesma quantidade aplicada na veia — sinal de que o intestino participa do controle glicêmico.',
      'Esse efeito está reduzido no diabetes tipo 2, o que motivou o desenvolvimento dos medicamentos baseados em incretinas: os inibidores de DPP-4, que preservam as incretinas naturais, e os agonistas de GLP-1 e GIP, que as imitam.',
    ],
    related: ['glp-1', 'gip', 'dpp-4', 'glucagon'],
    links: [
      { href: '/comparar/semaglutida-vs-tirzepatida', label: 'Semaglutida vs Tirzepatida', desc: 'Uma incretina ou duas.' },
    ],
  },
  {
    slug: 'liofilizado',
    term: 'Liofilizado',
    definition:
      'Pó seco obtido por liofilização (congelamento + desidratação a vácuo). Peptídeos são liofilizados para manter estabilidade durante armazenamento e transporte; precisam ser reconstituídos com água antes do uso.',
    body: [
      'Sem água, as reações que degradam o peptídeo ficam muito mais lentas. É por isso que o pó tolera transporte e armazenamento melhor que a solução pronta — embora o ideal continue sendo manter refrigerado e protegido da luz.',
      'O aspecto esperado é um pó ou "bolo" branco e compacto no fundo do frasco. Pó amarelado, derretido ou com manchas é sinal de alerta. Depois de reconstituído, o prazo de uso passa a ser contado em semanas.',
    ],
    related: ['reconstituicao', 'agua-bacteriostatica', 'frasco-multidose', 'coa'],
    links: [
      { href: '/blog/como-reconstituir-tirzepatida', label: 'Como reconstituir tirzepatida', desc: 'Passo a passo com tabela de unidades.' },
    ],
  },
  {
    slug: 'meia-vida',
    term: 'Meia-vida',
    definition:
      'Tempo necessário para que a concentração plasmática do peptídeo caia pela metade. Determina a frequência de aplicação: BPC-157 (~4 h, 1-2x/dia), semaglutida (~7 dias, 1x/semana).',
    body: [
      'Com aplicações repetidas, a concentração se acumula até estabilizar — o chamado estado de equilíbrio, atingido depois de cerca de quatro a cinco meias-vidas. Para a semaglutida, isso leva de quatro a cinco semanas, o que ajuda a explicar por que o efeito demora a aparecer.',
      'O mesmo raciocínio vale ao parar: são necessárias cerca de cinco meias-vidas para o composto ser quase todo eliminado. Meia-vida longa permite aplicações espaçadas, mas também faz com que efeitos colaterais demorem mais a passar.',
    ],
    related: ['dose-tipica', 'titulacao', 'dpp-4'],
    links: [
      { href: '/blog/quanto-tempo-ozempic-faz-efeito', label: 'Quanto tempo o Ozempic leva para fazer efeito', desc: 'A linha do tempo explicada pela meia-vida.' },
      { href: '/comparar', label: 'Comparador de peptídeos', desc: 'Meia-vida de cada composto lado a lado.' },
    ],
  },
  {
    slug: 'off-label',
    term: 'Off-label',
    definition:
      'Uso de um medicamento fora das indicações aprovadas em bula. Não é ilegal quando há prescrição médica, mas carece de validação regulatória para aquela indicação específica.',
    body: [
      'O uso off-label pode envolver outra doença, outra dose, outra faixa etária ou outra via de administração. A responsabilidade pela decisão é do médico que prescreve, com base na evidência disponível.',
      'Off-label não é o mesmo que "não aprovado": o termo se aplica a medicamentos registrados, usados fora da bula. Peptídeos sem registro em nenhuma agência entram em outra categoria — uso em pesquisa —, com base de evidência ainda menor.',
    ],
    related: ['bula', 'anvisa', 'fda'],
    links: [
      { href: '/blog/ozempic-para-perder-peso-sem-diabetes', label: 'Ozempic para emagrecer sem diabetes', desc: 'Um exemplo clássico de uso fora da bula.' },
    ],
  },
  {
    slug: 'pubmed',
    term: 'PubMed',
    definition:
      'Maior base de dados de literatura biomédica revisada por pares, mantida pela Biblioteca Nacional de Medicina dos EUA (NIH). É a fonte primária para pesquisa científica sobre peptídeos.',
    body: [
      'O PubMed indexa resumos de milhões de artigos, com link para o texto completo quando disponível. Estar no PubMed não é selo de qualidade: a base inclui desde ensaios clínicos grandes até estudos em células e relatos de caso.',
      'Ao ler uma referência, vale conferir o tipo de estudo (em humanos, em animais ou in vitro), o número de participantes e se houve grupo controle. As fichas deste site apontam para o PubMed sempre que a fonte está indexada.',
    ],
    related: ['bula', 'fda'],
    links: [{ href: '/metodologia', label: 'Metodologia editorial', desc: 'Hierarquia de fontes usada no site.' }],
  },
  {
    slug: 'reconstituicao',
    term: 'Reconstituição',
    definition:
      'Processo de dissolver um peptídeo liofilizado (em pó) em um diluente líquido, geralmente água bacteriostática, para obter solução injetável. A proporção determina a concentração e as unidades por dose.',
    body: [
      'O procedimento padrão: limpar as tampas com álcool, aspirar a água, injetá-la devagar escorrendo pela parede do frasco e girar suavemente até dissolver. Agitar com força pode danificar o peptídeo e formar espuma.',
      'A decisão prática é quanto de água usar. Ela não muda a quantidade de peptídeo nem o número de doses — só a concentração. O volume ideal é o que deixa a dose numa faixa fácil de medir na seringa, em geral entre 10 e 50 unidades.',
    ],
    related: ['agua-bacteriostatica', 'concentracao', 'liofilizado', 'seringa-de-insulina-u100', 'frasco-multidose'],
    links: [
      { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Água, concentração e unidades por dose.' },
      { href: '/blog/como-reconstituir-semaglutida', label: 'Como reconstituir semaglutida', desc: 'Passo a passo completo.' },
    ],
  },
  {
    slug: 'secretagogo-de-gh',
    term: 'Secretagogo de GH',
    definition:
      'Substância que estimula a hipófise a liberar o próprio hormônio do crescimento, em vez de fornecer o hormônio pronto. Os dois grupos principais são os análogos de GHRH e os GHRPs.',
    body: [
      'A diferença para o GH exógeno é que o secretagogo depende da hipófise e continua sujeito aos freios naturais do organismo. A liberação mantém o padrão em pulsos e há um teto fisiológico para o aumento.',
      'Análogos de GHRH (sermorelina, tesamorelina, CJC-1295) e GHRPs (ipamorelina, GHRP-2, GHRP-6, hexarelina) agem por receptores diferentes, e o efeito dos dois grupos se soma. A resposta costuma ser acompanhada pela dosagem de IGF-1.',
    ],
    related: ['gh', 'ghrh', 'ghrp', 'igf-1'],
    links: [
      { href: '/blog/cjc-ipamorelina-como-combinar', label: 'CJC-1295 + ipamorelina', desc: 'A combinação de GHRH com GHRP.' },
      { href: '/comparar/ipamorelina-vs-sermorelina', label: 'Ipamorelina vs Sermorelina', desc: 'Um GHRP e um análogo de GHRH.' },
    ],
  },
  {
    slug: 'seringa-de-insulina-u100',
    term: 'Seringa de insulina U100',
    definition:
      'Seringa graduada em unidades de insulina, em que 1 ml = 100 unidades (U). Vem em capacidades de 30 U (0,3 ml), 50 U (0,5 ml) e 100 U (1 ml). É a seringa padrão para aplicação subcutânea de peptídeos.',
    body: [
      'Cada unidade corresponde a 0,01 ml. "Unidade", aqui, é só uma medida de volume: 10 U são sempre 0,1 ml, qualquer que seja o peptídeo. Quantos miligramas existem nesse volume depende da concentração preparada.',
      'Seringas menores têm marcações mais espaçadas e são mais precisas para doses pequenas: até 30 U, prefira a de 0,3 ml. Doses abaixo de 5 U são difíceis de medir com segurança — nesse caso, vale reconstituir com mais água.',
    ],
    related: ['concentracao', 'reconstituicao', 'subcutaneo', 'ui-unidade-internacional'],
    links: [
      { href: '/ferramentas/reconstituicao', label: 'Calculadora de reconstituição', desc: 'Mostra a marcação exata na seringa.' },
      { href: '/ferramentas/conversor', label: 'Conversor de unidades', desc: 'mg, mcg e UI.' },
    ],
  },
  {
    slug: 'subcutaneo',
    term: 'Subcutâneo (SC)',
    definition:
      'Via de administração em que a injeção é feita no tecido gorduroso logo abaixo da pele (abdome, coxa, braço). É a via mais comum para peptídeos, com absorção lenta e sustentada.',
    body: [
      'Usa-se agulha curta e fina, como a das seringas de insulina, em ângulo de 45° a 90° conforme a espessura da prega de pele. Os locais habituais são o abdome (afastado do umbigo), a face externa da coxa e a parte de trás do braço.',
      'Alternar o local a cada aplicação reduz irritação, nódulos e alterações na gordura sob a pele. Vermelhidão leve e passageira no ponto da injeção é comum; dor intensa, calor ou secreção pedem avaliação.',
    ],
    related: ['seringa-de-insulina-u100', 'reconstituicao'],
    links: [{ href: '/peptideos', label: 'Enciclopédia de peptídeos', desc: 'Cada ficha traz o guia de locais de aplicação.' }],
  },
  {
    slug: 'titulacao',
    term: 'Titulação (subida de dose)',
    definition:
      'Aumento gradual da dose ao longo de semanas, em vez de começar pela dose alvo. Nos agonistas de GLP-1, dá tempo para o organismo se adaptar e reduz os efeitos gastrointestinais.',
    body: [
      'O padrão de bula é ficar pelo menos quatro semanas em cada etapa. Semaglutida: 0,25 → 0,5 → 1,0 → 1,7 → 2,4 mg por semana. Tirzepatida: 2,5 → 5 → 7,5 → 10 → 12,5 → 15 mg por semana.',
      'As primeiras doses são de adaptação, não de tratamento — por isso o efeito sobre o peso é pequeno no início. Se os efeitos colaterais forem fortes, a conduta habitual é permanecer mais tempo na etapa atual. Nem todos precisam chegar à dose máxima.',
    ],
    related: ['glp-1', 'dose-tipica', 'meia-vida', 'bula'],
    links: [
      { href: '/ferramentas/titulacao', label: 'Subida de dose GLP-1', desc: 'Calendário com datas automáticas.' },
      { href: '/ferramentas/tabela-doses-glp1', label: 'Tabela de doses para imprimir', desc: 'Escada de titulação em uma página.' },
    ],
  },
  {
    slug: 'ui-unidade-internacional',
    term: 'UI (Unidade Internacional)',
    definition:
      'Unidade de atividade biológica padronizada para um composto específico. Não é massa — a conversão UI↔mg depende do composto (ex.: 1 mg de GH ≈ 3 UI). Só existe para substâncias com potência biológica padronizada.',
    body: [
      'A confusão mais comum é entre UI e as "unidades" da seringa de insulina. São coisas diferentes: a UI mede atividade biológica; a unidade da seringa mede volume (1 U = 0,01 ml). O símbolo parecido é coincidência histórica — a seringa foi graduada para insulina a 100 UI/ml.',
      'A maioria dos peptídeos catalogados aqui é dosada em mg ou mcg, não em UI. Quando um produto é rotulado em UI, é preciso conhecer a equivalência daquele composto específico antes de fazer qualquer conversão.',
    ],
    related: ['seringa-de-insulina-u100', 'concentracao', 'dose-tipica'],
    links: [{ href: '/ferramentas/conversor', label: 'Conversor mg ↔ mcg ↔ UI', desc: 'Conversão entre unidades.' }],
  },
  {
    slug: 'vegf',
    term: 'VEGF',
    definition:
      'Vascular Endothelial Growth Factor. Fator de crescimento que promove a formação de novos vasos sanguíneos (angiogênese). É modulado por peptídeos como BPC-157 e timosina beta-4.',
    body: [
      'Novos vasos levam oxigênio e nutrientes ao tecido lesionado, o que é parte essencial da cicatrização. Essa é a base do interesse em peptídeos que atuam sobre a via do VEGF para tendões, ligamentos e músculo — interesse sustentado principalmente por estudos em animais.',
      'O mesmo mecanismo explica uma cautela: tumores também dependem de angiogênese para crescer. Por isso, câncer ativo ou recente costuma aparecer entre as contraindicações teóricas desses compostos.',
    ],
    related: ['meia-vida'],
    links: [
      { href: '/comparar/bpc-157-vs-tb-500', label: 'BPC-157 vs TB-500', desc: 'Os dois peptídeos de cicatrização comparados.' },
      { href: '/blog/tb-500-para-que-serve', label: 'TB-500: para que serve', desc: 'Timosina beta-4 e reparo tecidual.' },
    ],
  },
  {
    slug: 'wada',
    term: 'WADA',
    definition:
      'World Anti-Doping Agency. Agência internacional que define a lista de substâncias proibidas no esporte competitivo. A maioria dos peptídeos ligados a desempenho está na classe S2 (hormônios peptídicos e fatores de crescimento).',
    body: [
      'A Lista Proibida é atualizada todo ano. Além da classe S2, existe a S0, que abrange substâncias sem aprovação regulatória para uso humano — é nela que o BPC-157 foi incluído em 2022.',
      'A proibição vale em competição e fora dela, e a responsabilidade é do atleta, mesmo em caso de contaminação ou desconhecimento. As fichas deste site indicam quando um peptídeo consta na lista.',
    ],
    related: ['fda', 'anvisa', 'gh'],
    links: [{ href: '/peptideos', label: 'Enciclopédia de peptídeos', desc: 'Status antidoping em cada ficha.' }],
  },
];

export function getGlossary(): GlossaryTerm[] {
  return [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));
}

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.slug === slug);
}

export function getGlossarySlugs(): string[] {
  return GLOSSARY.map((t) => t.slug);
}
