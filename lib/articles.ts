import type { Metadata } from 'next';

export type Author = {
  name: string;
  credentials?: string;
  url?: string;
  image?: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;  // ISO
  updatedAt?: string;
  readMinutes: number;
  tags: string[];
  relatedPeptides?: string[]; // slugs
  coverColor?: string; // classe tailwind para gradient
  draft?: boolean;     // mostra aviso de draft no hero
  author?: Author;
  reviewedBy?: Author;
  tldr?: string;       // resumo curto (aparece em destaque + melhora featured snippet)
};

// Fase 3: hard-coded. Fase 2 Supabase moveria isso.
// Cada artigo é uma página TSX em app/blog/[slug]/page.tsx (controle total sobre estilo)
export const ARTICLES: Article[] = [
  {
    slug: 'tirzepatida-preco-quanto-custa',
    title: 'Tirzepatida: quanto custa no Brasil em 2026 (Mounjaro, manipulada e frasco)',
    excerpt: 'Preço por caneta, por frasco e por mês em cada dose (2,5 a 15 mg). Por que varia tanto e como não pagar caro por produto ruim.',
    tldr: 'Em 2026, uma caneta Mounjaro (4 doses) custa R$ 1.100-1.400; frasco manipulado ou liofilizado de 10 mg fica em R$ 500-900. O custo mensal vai de ~R$ 350 (2,5 mg em frasco) a mais de R$ 4.000 (15 mg em frasco). Preço muito abaixo dessas faixas é sinal de alerta, não de oportunidade.',
    publishedAt: '2026-09-14',
    readMinutes: 9,
    tags: ['tirzepatida', 'preço', 'glp-1'],
    relatedPeptides: ['tirzepatida'],
    coverColor: 'from-orange-500/20 to-teal-500/10',
  },
  {
    slug: 'onde-comprar-tirzepatida',
    title: 'Onde comprar tirzepatida com segurança: guia de procedência (2026)',
    excerpt: 'Os três canais que existem no Brasil, o que cada um exige, checklist de procedência (COA, lote, cadeia de frio) e sinais de golpe.',
    tldr: 'Tirzepatida se compra em farmácia (caneta Mounjaro, com receita), em farmácia de manipulação (frasco, com receita) ou com fornecedor especializado (frasco liofilizado). Em qualquer canal exija lote, certificado de análise com HPLC, envio refrigerado e comprovante. Marketplace, Instagram sem CNPJ e preço fora da curva são os três maiores sinais de golpe.',
    publishedAt: '2026-09-14',
    readMinutes: 10,
    tags: ['tirzepatida', 'segurança', 'onde comprar'],
    relatedPeptides: ['tirzepatida'],
    coverColor: 'from-green-500/20 to-teal-500/10',
  },
  {
    slug: 'como-reconstituir-tirzepatida',
    title: 'Como reconstituir tirzepatida 5, 10 e 15 mg: quantas unidades por dose',
    excerpt: 'Passo a passo com água bacteriostática, tabela pronta de unidades na seringa para cada frasco e dose, erros comuns e armazenamento.',
    tldr: 'Frasco de 10 mg com 2 ml de água = 5 mg/ml. Dose de 2,5 mg = 50 unidades; 5 mg = 100 unidades. Para doses altas use menos água ou frasco maior. Reconstitua escorrendo a água pela parede, gire sem agitar e guarde de 2-8 °C por até 28 dias.',
    publishedAt: '2026-09-14',
    readMinutes: 9,
    tags: ['tirzepatida', 'reconstituição', 'passo-a-passo'],
    relatedPeptides: ['tirzepatida'],
    coverColor: 'from-blue-500/20 to-teal-500/10',
  },
  {
    slug: 'mounjaro-falso-como-identificar',
    title: 'Mounjaro falso: como identificar caneta e frasco falsificados',
    excerpt: 'Sinais na caixa, na caneta KwikPen e no frasco liofilizado; como consultar o registro na ANVISA e o que fazer se desconfiar.',
    tldr: 'Mounjaro original no Brasil é caneta KwikPen da Eli Lilly, vendida em farmácia com receita. Sinais de falsificação: preço muito abaixo de R$ 1.000, venda em marketplace ou rede social, lote da caixa diferente do lote da caneta, rótulo adesivo, líquido turvo. Em frasco liofilizado, exija COA com lote batendo com o rótulo. Não aplique produto suspeito e notifique via Notivisa.',
    publishedAt: '2026-09-14',
    readMinutes: 7,
    tags: ['tirzepatida', 'mounjaro', 'segurança'],
    relatedPeptides: ['tirzepatida'],
    coverColor: 'from-red-500/20 to-orange-500/10',
  },
  {
    slug: 'como-reconstituir-semaglutida',
    title: 'Como reconstituir semaglutida: passo a passo com seringa de insulina',
    excerpt: 'Guia completo de reconstituição de semaglutida com proporções corretas, cálculo de dose e armazenamento seguro.',
    tldr: 'Para reconstituir semaglutida 5 mg: limpe a tampa de ambos os frascos com álcool, puxe 2 ml de água bacteriostática, introduza no frasco de semaglutida escorrendo pela lateral, gire suavemente (nunca agite) até dissolver, e armazene refrigerado. Cada dose de 0,25 mg equivale a 10 unidades na seringa de insulina.',
    publishedAt: '2026-04-16',
    readMinutes: 8,
    tags: ['semaglutida', 'glp-1', 'reconstituição', 'passo-a-passo'],
    relatedPeptides: ['semaglutida', 'tirzepatida'],
    coverColor: 'from-blue-500/20 to-teal-500/10',
  },
  {
    slug: 'semaglutida-vs-tirzepatida',
    title: 'Semaglutida vs Tirzepatida: comparativo completo (2026)',
    excerpt: 'Comparação detalhada entre os dois agonistas GLP-1 mais usados: mecanismo, eficácia, efeitos e custos.',
    tldr: 'Semaglutida é agonista GLP-1 puro; tirzepatida ativa GLP-1 + GIP. Em ensaios fase 3, tirzepatida (15 mg/sem) levou a perda de peso de ~21% vs ~15% da semaglutida (2,4 mg/sem). Efeitos gastrointestinais são similares, com ligeira vantagem de tolerabilidade para tirzepatida. Ambas aprovadas pelo FDA; semaglutida tem mais dados de longo prazo.',
    publishedAt: '2026-04-16',
    readMinutes: 10,
    tags: ['tirzepatida', 'glp-1', 'comparação', 'emagrecimento'],
    relatedPeptides: ['semaglutida', 'tirzepatida'],
    coverColor: 'from-orange-500/20 to-blue-500/10',
  },
  {
    slug: 'agua-bacteriostatica-guia',
    title: 'Água bacteriostática: o que é e por que usar na reconstituição',
    excerpt: 'Entenda por que a água bacteriostática é o diluente correto, como armazenar o frasco reconstituído e quais as alternativas.',
    tldr: 'Água bacteriostática é água estéril com 0,9% de álcool benzílico como conservante, permitindo múltiplas perfurações no mesmo frasco sem contaminação. É o diluente padrão para peptídeos multi-dose. Frascos reconstituídos duram 28 dias refrigerados. Nunca use água destilada comum em frascos multi-dose — contamina em horas.',
    publishedAt: '2026-04-16',
    readMinutes: 6,
    tags: ['reconstituição', 'armazenamento', 'guia-básico'],
    coverColor: 'from-teal-500/20 to-green-500/10',
  },
  {
    slug: 'ozempic-para-perder-peso-sem-diabetes',
    title: 'Ozempic para perder peso sem diabetes: o que a ciência mostra',
    excerpt: 'Uso de semaglutida off-label em pessoas sem diabetes, dados dos ensaios clínicos STEP e riscos do uso estético.',
    tldr: 'Semaglutida funciona para perda de peso em pessoas sem diabetes — o estudo STEP-1 mostrou perda média de ~15% com 2,4 mg/semana em 68 semanas. Ozempic (1-2 mg) é aprovado para diabetes; Wegovy (2,4 mg) para obesidade. Usar Ozempic off-label para emagrecer é comum mas deve ser acompanhado por endocrinologista. Reganho de 60-70% do peso perdido ocorre em 1 ano se descontinuado.',
    publishedAt: '2026-04-16',
    readMinutes: 9,
    tags: ['semaglutida', 'emagrecimento', 'off-label'],
    relatedPeptides: ['semaglutida'],
    coverColor: 'from-blue-500/20 to-teal-500/10',
  },
  {
    slug: 'efeitos-colaterais-semaglutida',
    title: 'Semaglutida faz mal? Efeitos colaterais documentados',
    excerpt: 'Revisão dos efeitos adversos da semaglutida a partir dos ensaios STEP, SUSTAIN e relatórios pós-comercialização.',
    tldr: 'Os efeitos colaterais mais comuns da semaglutida são gastrointestinais: náusea (até 44%), diarreia (30%), vômito (25%), constipação (24%). Efeitos sérios raros incluem pancreatite (~0,3%), cálculos biliares e reações de hipersensibilidade. Contraindicações absolutas: história pessoal/familiar de carcinoma medular de tireoide, NEM 2 e gravidez.',
    publishedAt: '2026-04-16',
    readMinutes: 7,
    tags: ['semaglutida', 'efeitos-colaterais', 'segurança'],
    relatedPeptides: ['semaglutida'],
    coverColor: 'from-amber-500/20 to-blue-500/10',
  },
  {
    slug: 'como-guardar-ozempic-wegovy',
    title: 'Como guardar Ozempic e Wegovy corretamente (antes e depois de abertos)',
    excerpt: 'Orientações de armazenamento conforme bula: temperatura, proteção da luz, tempo pós-abertura e dicas de viagem.',
    tldr: 'Antes de abrir: geladeira (2-8°C), nunca na porta, nunca congelar, proteger da luz. Depois de abrir (primeira perfuração): pode ficar em temperatura ambiente (até 25°C) por até 56 dias, ou continuar refrigerado. Congelamento ou temperatura acima de 30°C degrada a molécula — descarte.',
    publishedAt: '2026-04-16',
    readMinutes: 5,
    tags: ['armazenamento', 'ozempic', 'wegovy', 'guia-básico'],
    relatedPeptides: ['semaglutida'],
    coverColor: 'from-teal-500/20 to-green-500/10',
  },
  {
    slug: 'ozempic-falso-como-identificar',
    title: 'Ozempic falso: como identificar e o que fazer',
    excerpt: 'Sinais visuais em embalagem, número de lote, alerta da ANVISA e orientações para não comprar produto falsificado.',
    tldr: 'Sinais de Ozempic falso: preço muito abaixo do mercado (<R$ 500 para 1 mg), venda em marketplaces ou redes sociais, lote da caixa não bate com lote do pen, impressão de baixa qualidade, bula em folha avulsa. Verifique sempre na consulta ANVISA (consultas.anvisa.gov.br) e compre apenas em farmácia física com nota fiscal. Em caso de suspeita, notifique via Notivisa.',
    publishedAt: '2026-04-16',
    readMinutes: 6,
    tags: ['ozempic', 'segurança', 'regulatório'],
    relatedPeptides: ['semaglutida'],
    coverColor: 'from-red-500/20 to-amber-500/10',
  },
  {
    slug: 'tirzepatida-manipulada-seguranca',
    title: 'Tirzepatida manipulada é segura? Cuidados ao usar',
    excerpt: 'Diferenças entre o Mounjaro industrial e versões manipuladas: qualidade, certificação, sinais de confiança na farmácia.',
    tldr: 'Tirzepatida manipulada custa 60-70% menos que Mounjaro mas não é equivalente — pureza, estabilidade e dose exata variam. Farmácia confiável tem: registro ANVISA visível, fornece COA (Certificado de Análise), HPLC, farmacêutico responsável identificado e exige prescrição. Se orçamento permite, industrializado é sempre mais seguro.',
    publishedAt: '2026-04-16',
    readMinutes: 8,
    tags: ['tirzepatida', 'manipulação', 'segurança'],
    relatedPeptides: ['tirzepatida'],
    coverColor: 'from-orange-500/20 to-red-500/10',
  },
  {
    slug: 'quanto-tempo-ozempic-faz-efeito',
    title: 'Quanto tempo Ozempic leva para começar a fazer efeito?',
    excerpt: 'Linha do tempo esperada: controle glicêmico em dias, saciedade em semanas, perda de peso em meses — com referências.',
    tldr: 'Saciedade aparece em 2-3 dias. Redução consistente de apetite em 2-4 semanas. Perda de peso de 4-8 kg até a semana 12. Controle glicêmico (HbA1c) detectável em 8-12 semanas. Perda máxima de peso (10-15%) em 6 meses com dose de manutenção. Semaglutida tem meia-vida de 7 dias, então estado estacionário só acontece após 4-5 semanas.',
    publishedAt: '2026-04-16',
    readMinutes: 6,
    tags: ['ozempic', 'semaglutida', 'expectativas'],
    relatedPeptides: ['semaglutida'],
    coverColor: 'from-blue-500/20 to-teal-500/10',
  },
  {
    slug: 'efeito-rebote-apos-parar-semaglutida',
    title: 'Efeito rebote após parar semaglutida: o que esperar',
    excerpt: 'Dados do estudo STEP-4 sobre reganho de peso pós-descontinuação e estratégias discutidas para minimizar.',
    tldr: 'O estudo STEP-4 mostrou que pacientes que trocaram semaglutida por placebo recuperaram ~70% do peso perdido em 48 semanas, enquanto quem continuou manteve a perda. Semaglutida não "cura" obesidade — trata enquanto ativa. Para minimizar rebote: reduzir dose gradualmente, manter treino resistido, aumentar proteína e monitorar peso semanalmente.',
    publishedAt: '2026-04-16',
    readMinutes: 7,
    tags: ['semaglutida', 'emagrecimento', 'manutenção'],
    relatedPeptides: ['semaglutida'],
    coverColor: 'from-amber-500/20 to-orange-500/10',
  },
  {
    slug: 'nausea-ozempic-como-lidar',
    title: 'Náusea no Ozempic: como minimizar e quando procurar médico',
    excerpt: 'Estratégias dietéticas e de timing para reduzir náusea durante a titulação da semaglutida.',
    tldr: 'Para minimizar náusea no Ozempic: refeições pequenas e frequentes (5-6x/dia), evitar gordura e frituras durante picos, hidratação reforçada, gengibre ou dimenidrinato pontual. Se náusea persiste, não suba a dose — repita a etapa atual por mais 2-4 semanas. Procure médico se: dor abdominal severa e persistente, vômito impedindo hidratação por 24h, ou perda de peso maior que 4 kg/semana.',
    publishedAt: '2026-04-16',
    readMinutes: 5,
    tags: ['ozempic', 'efeitos-colaterais', 'dicas'],
    relatedPeptides: ['semaglutida'],
    coverColor: 'from-green-500/20 to-teal-500/10',
  },
  {
    slug: 'bpc-157-ciclo-duracao',
    title: 'Ciclo de BPC-157: quanto tempo usar e quando pausar',
    excerpt: 'Protocolos típicos usados em pesquisa, duração recomendada por objetivo (cicatrização vs manutenção) e pausas.',
    tldr: 'Protocolo típico informal de BPC-157 para cicatrização aguda: 250 mcg SC 2x/dia por 4-6 semanas. Para questões GI: 250-500 mcg 1-2x/dia por 2-4 semanas. Padrão conservador de pausa: 4 semanas on, 2 semanas off. Evitar em quem tem câncer ativo ou histórico recente (preocupação teórica com angiogênese). BPC-157 não é aprovado para uso humano em nenhuma jurisdição.',
    publishedAt: '2026-04-16',
    readMinutes: 7,
    tags: ['bpc-157', 'protocolo', 'cicatrização'],
    relatedPeptides: ['bpc-157'],
    coverColor: 'from-green-500/20 to-teal-500/10',
  },
  {
    slug: 'cjc-ipamorelina-como-combinar',
    title: 'CJC-1295 + Ipamorelina: o combo mais usado, explicado',
    excerpt: 'Por que a combinação GHRH + GHRP potencializa a liberação de GH, protocolos comuns e limites de segurança.',
    tldr: 'CJC-1295 (GHRH analog) e ipamorelina (GHRP) agem em receptores diferentes e sinérgicos — juntos, amplificam a liberação de GH mais que qualquer um isolado. Protocolo informal: CJC sem DAC 100 mcg + ipamorelina 200-300 mcg SC, 2-3x/dia em estômago vazio. Use CJC sem DAC (não a versão com DAC de longa duração) para preservar pulsatilidade fisiológica. Monitore IGF-1 a cada 6-8 semanas. Ambos proibidos pela WADA.',
    publishedAt: '2026-04-16',
    readMinutes: 8,
    tags: ['cjc-1295', 'ipamorelina', 'gh', 'combinação'],
    relatedPeptides: ['cjc-1295', 'ipamorelina'],
    coverColor: 'from-violet-500/20 to-blue-500/10',
  },
  {
    slug: 'retatrutida-o-que-e',
    title: 'Retatrutida: o que é, doses e por que promete perda de peso recorde',
    excerpt: 'O agonista triplo GLP-1/GIP/glucagon da Eli Lilly em fase 3: como funciona, os dados de perda de peso (~24-28%) e por que ainda não está aprovado.',
    tldr: 'Retatrutida (LY3437943) é um agonista triplo (GLP-1 + GIP + glucagon) da Eli Lilly, ainda em ensaios de fase 3 (TRIUMPH) e SEM aprovação de FDA, EMA ou ANVISA. Em fase 2 levou a perda de peso média de ~24% em 48 semanas; a Lilly reportou ~28,7% em 68 semanas no TRIUMPH-4. Dose investigacional semanal de 1 a 12 mg. Efeitos colaterais são gastrointestinais, como nos demais GLP-1.',
    publishedAt: '2026-07-17',
    readMinutes: 8,
    tags: ['retatrutida', 'glp-1', 'emagrecimento', 'em-desenvolvimento'],
    relatedPeptides: ['retatrutide', 'tirzepatida', 'semaglutida'],
    coverColor: 'from-blue-500/20 to-teal-500/10',
  },
  {
    slug: 'tb-500-para-que-serve',
    title: 'TB-500: para que serve, protocolo e combinação com BPC-157',
    excerpt: 'O que é TB-500 (fragmento da Timosina Beta-4), a evidência real (majoritariamente pré-clínica), os protocolos informais e por que é proibido no esporte.',
    tldr: 'TB-500 é um fragmento sintético da Timosina Beta-4 promovido para recuperação tecidual, mas SEM aprovação regulatória e com evidência majoritariamente animal e in vitro. É proibido pela WADA dentro e fora de competição. Protocolos informais usam 2-5 mg/semana SC, frequentemente combinado com BPC-157. Produtos do mercado cinza têm pureza e dosagem incertas.',
    publishedAt: '2026-07-17',
    readMinutes: 7,
    tags: ['tb-500', 'cicatrização', 'recuperação', 'protocolo'],
    relatedPeptides: ['tb-500', 'bpc-157'],
    coverColor: 'from-green-500/20 to-teal-500/10',
  },
  {
    slug: 'pt-141-bremelanotida',
    title: 'PT-141 (Bremelanotida): como funciona para a libido, dose e efeitos',
    excerpt: 'Bremelanotida (Vyleesi) age no cérebro, não na vasculatura: o mecanismo via MC4R, a dose aprovada, os efeitos colaterais e o que é uso off-label.',
    tldr: 'PT-141 (bremelanotida, Vyleesi) é aprovado pela FDA (2019) para transtorno do desejo sexual hipoativo em mulheres na pré-menopausa. Age no sistema nervoso central via receptores de melanocortina (MC4R) — diferente do Viagra, que age na vasculatura. Dose aprovada: 1,75 mg SC conforme necessário, no máximo 1x/24h e 8x/mês. Náusea é o efeito mais comum (~40%). Uso em homens é off-label.',
    publishedAt: '2026-07-17',
    readMinutes: 6,
    tags: ['pt-141', 'função-sexual', 'bremelanotida'],
    relatedPeptides: ['pt-141'],
    coverColor: 'from-pink-500/20 to-rose-500/10',
  },
  {
    slug: 'melanotan-2-riscos',
    title: 'Melanotan II: bronzeamento injetável, dose e os riscos que ninguém conta',
    excerpt: 'O "Barbie drug" promete bronzeado sem sol, mas nunca foi aprovado e agências alertam para priapismo, alteração de nevos e risco renal. O que a evidência mostra.',
    tldr: 'Melanotan II é um análogo do α-MSH vendido ilegalmente como bronzeador injetável. NUNCA foi aprovado — MHRA, TGA e FDA emitiram alertas. Riscos documentados incluem náusea, priapismo, escurecimento e aumento de nevos (com preocupação sobre melanoma), hipertensão e disfunção renal. Produtos do mercado ilegal têm contaminação e dose imprevisível. Não há dose segura estabelecida.',
    publishedAt: '2026-07-17',
    readMinutes: 6,
    tags: ['melanotan', 'cosmético', 'segurança', 'regulatório'],
    relatedPeptides: ['melanotan-ii', 'pt-141'],
    coverColor: 'from-amber-500/20 to-orange-500/10',
  },
  {
    slug: 'ghk-cu-para-que-serve',
    title: 'GHK-Cu: benefícios para pele e cabelo, uso tópico vs injetável',
    excerpt: 'O peptídeo de cobre é um ingrediente cosmético consagrado no tópico — mas a forma injetável não é aprovada. A diferença crucial, o mecanismo e a evidência.',
    tldr: 'GHK-Cu é o complexo de cobre do tripeptídeo GHK. No TÓPICO é ingrediente cosmético consagrado e permitido (anti-idade, pós-procedimento, cabelo), com décadas de uso. Já a forma INJETÁVEL não tem aprovação regulatória para uso humano — permanece no domínio da pesquisa. Estimula colágeno, elastina e reparo tecidual e modula milhares de genes. Distinguir tópico de injetável é o ponto central.',
    publishedAt: '2026-07-17',
    readMinutes: 7,
    tags: ['ghk-cu', 'pele', 'cabelo', 'cosmético'],
    relatedPeptides: ['ghk-cu'],
    coverColor: 'from-amber-500/20 to-teal-500/10',
  },
  {
    slug: 'mots-c-o-que-e',
    title: 'MOTS-c: o peptídeo mitocondrial que promete energia e metabolismo',
    excerpt: 'MOTS-c ativa a AMPK e melhora a sensibilidade à insulina em modelos animais — mas a evidência humana é inicial e ele é proibido no esporte. O panorama honesto.',
    tldr: 'MOTS-c é um peptídeo de 16 aminoácidos codificado pelo DNA mitocondrial, estudado por ativar a AMPK e melhorar a sensibilidade à insulina e a oxidação de gordura — a maior parte em modelos animais. A evidência humana é inicial (farmacocinética e segurança) e não há aprovação regulatória. É proibido pela WADA. O uso atual é estritamente como peptídeo de pesquisa.',
    publishedAt: '2026-07-17',
    readMinutes: 6,
    tags: ['mots-c', 'longevidade', 'metabolismo', 'em-pesquisa'],
    relatedPeptides: ['mots-c'],
    coverColor: 'from-teal-500/20 to-blue-500/10',
  },
  {
    slug: 'sermorelina-o-que-e',
    title: 'Sermorelina: o que é, como estimula o GH e por que saiu do mercado',
    excerpt: 'A sermorelina (GRF 1-29) já foi aprovada como Geref para diagnóstico e deficiência de GH. Entenda o mecanismo, o status atual e o uso off-label.',
    tldr: 'Sermorelina (GRF 1-29) é o menor fragmento ativo do GHRH humano. Foi aprovada pela FDA em 1990 como Geref (diagnóstico e deficiência de GH em crianças), mas descontinuada em 2008 por decisão comercial — não por segurança. Hoje só existe via manipulação, off-label, sem registro ativo na ANVISA. Estimula a liberação natural e pulsátil de GH; meia-vida de ~11-12 min. Proibida pela WADA.',
    publishedAt: '2026-07-17',
    readMinutes: 7,
    tags: ['sermorelina', 'gh', 'ghrh'],
    relatedPeptides: ['sermorelina', 'ipamorelina', 'cjc-1295'],
    coverColor: 'from-violet-500/20 to-blue-500/10',
  },
  {
    slug: 'tesamorelina-gordura-visceral',
    title: 'Tesamorelina: o análogo de GHRH aprovado contra gordura visceral',
    excerpt: 'A tesamorelina (Egrifta) é aprovada pela FDA para reduzir gordura abdominal visceral em pacientes HIV+. Mecanismo, dose, efeitos e uso off-label.',
    tldr: 'Tesamorelina (Egrifta) é um análogo do GHRH aprovado pela FDA (2010) para reduzir excesso de gordura visceral abdominal em adultos HIV-positivos com lipodistrofia (redução de ~15-18% em 26 semanas). Estimula a liberação natural de GH. Dose aprovada: 2 mg/dia SC. Uso para "anti-idade" ou perda de gordura geral é off-label e não avaliado. Proibida pela WADA.',
    publishedAt: '2026-07-17',
    readMinutes: 7,
    tags: ['tesamorelina', 'gh', 'gordura-visceral'],
    relatedPeptides: ['tesamorelina'],
    coverColor: 'from-violet-500/20 to-blue-500/10',
  },
  {
    slug: 'hexarelina-o-que-e',
    title: 'Hexarelina: o secretagogo de GH mais potente (e seus limites)',
    excerpt: 'A hexarelina libera muito GH, mas eleva cortisol e prolactina e dessensibiliza o receptor. Por que nunca foi aprovada e o que a diferencia dos outros GHRPs.',
    tldr: 'Hexarelina é um GHRP potente (análogo do GHRP-6) que estimula forte liberação de GH via receptor de grelina. Mas eleva cortisol, ACTH e prolactina mais que a ipamorelina e causa dessensibilização hipofisária com uso crônico — o que limitou seu interesse clínico. Nunca foi aprovada (apenas pesquisa) e é proibida pela WADA. Meia-vida de ~55 min.',
    publishedAt: '2026-07-17',
    readMinutes: 6,
    tags: ['hexarelina', 'gh', 'ghrp'],
    relatedPeptides: ['hexarelina', 'ghrp-2', 'ghrp-6'],
    coverColor: 'from-violet-500/20 to-blue-500/10',
  },
  {
    slug: 'ghrp-2-o-que-e',
    title: 'GHRP-2 (Pralmorelina): o que é, como funciona e status',
    excerpt: 'O GHRP-2 é aprovado só no Japão como agente diagnóstico. Mecanismo via receptor de grelina, comparação com outros GHRPs e situação antidoping.',
    tldr: 'GHRP-2 (pralmorelina) é um secretagogo de GH agonista do receptor de grelina, aprovado APENAS no Japão como agente diagnóstico. Não tem registro FDA/EMA/ANVISA e é proibido pela WADA (com métodos de detecção validados). Eleva cortisol, ACTH e prolactina de forma dose-dependente, mas menos que a hexarelina e o GHRP-6, e estimula menos o apetite que o GHRP-6.',
    publishedAt: '2026-07-17',
    readMinutes: 6,
    tags: ['ghrp-2', 'gh', 'pralmorelina'],
    relatedPeptides: ['ghrp-2', 'ghrp-6'],
    coverColor: 'from-violet-500/20 to-blue-500/10',
  },
  {
    slug: 'ghrp-6-o-que-e',
    title: 'GHRP-6: o secretagogo de GH que dá fome, explicado',
    excerpt: 'O GHRP-6 é o protótipo da classe e o que mais estimula apetite. Como funciona via receptor de grelina, efeitos e por que nunca foi aprovado.',
    tldr: 'GHRP-6 é um dos primeiros secretagogos de GH e o protótipo da classe. Age no receptor de grelina liberando GH, mas se destaca por estimular fortemente o APETITE — o mais intenso entre os GHRPs. Também eleva cortisol, ACTH e prolactina. Nunca foi aprovado (apenas pesquisa) e é proibido pela WADA.',
    publishedAt: '2026-07-17',
    readMinutes: 6,
    tags: ['ghrp-6', 'gh', 'ghrp'],
    relatedPeptides: ['ghrp-6', 'ghrp-2'],
    coverColor: 'from-violet-500/20 to-blue-500/10',
  },
  {
    slug: 'semax-nootropico',
    title: 'Semax: o nootrópico russo que aumenta BDNF, explicado',
    excerpt: 'O Semax é usado na Rússia como nootrópico e neuroprotetor. O mecanismo (BDNF, melanocortina), a evidência real e por que não é aprovado no Ocidente.',
    tldr: 'Semax é um heptapeptídeo análogo de um fragmento do ACTH, aprovado e usado na Rússia como nootrópico e neuroprotetor (AVC, cognição). Seu mecanismo mais descrito é a rápida elevação de BDNF e TrkB no hipocampo; também age em receptores de melanocortina. Consta da lista russa de medicamentos essenciais, mas NÃO tem aprovação FDA/EMA/ANVISA e a literatura em inglês é modesta. Não é proibido pela WADA.',
    publishedAt: '2026-07-17',
    readMinutes: 6,
    tags: ['semax', 'cognitivo', 'nootrópico'],
    relatedPeptides: ['semax', 'selank'],
    coverColor: 'from-indigo-500/20 to-blue-500/10',
  },
  {
    slug: 'selank-ansiedade',
    title: 'Selank: o peptídeo ansiolítico russo, o que a ciência mostra',
    excerpt: 'O Selank é aprovado na Rússia para ansiedade, sem sedação nem dependência. Mecanismo GABAérgico, evidência e por que não é aprovado no Ocidente.',
    tldr: 'Selank é um heptapeptídeo análogo da tuftsina, aprovado na Rússia para ansiedade generalizada e neurastenia. É descrito como ansiolítico sem a sedação, tolerância ou dependência dos benzodiazepínicos, com mecanismo GABAérgico e aumento de BDNF. NÃO tem aprovação FDA/EMA/ANVISA e a evidência ocidental é modesta. Não é proibido pela WADA.',
    publishedAt: '2026-07-17',
    readMinutes: 6,
    tags: ['selank', 'cognitivo', 'ansiedade'],
    relatedPeptides: ['selank', 'semax'],
    coverColor: 'from-indigo-500/20 to-blue-500/10',
  },
  {
    slug: 'epithalon-telomerase',
    title: 'Epithalon: o peptídeo da telomerase e a promessa de longevidade',
    excerpt: 'O Epithalon é estudado por ativar a telomerase e alongar telômeros — mas a maior parte da evidência vem de um único grupo russo. O panorama honesto.',
    tldr: 'Epithalon (AEDG) é um tetrapeptídeo sintético derivado de um peptídeo pineal, estudado como geroprotetor por ativar a telomerase e alongar telômeros. A maior parte da evidência vem do grupo russo de Khavinson (cultura, animais, coortes de idosos), com replicação independente escassa. Não é aprovado por FDA/EMA/ANVISA e há um risco teórico oncológico ligado à reativação da telomerase. Evidência promissora, porém preliminar.',
    publishedAt: '2026-07-17',
    readMinutes: 7,
    tags: ['epithalon', 'longevidade', 'telomerase'],
    relatedPeptides: ['epithalon', 'mots-c'],
    coverColor: 'from-teal-500/20 to-green-500/10',
  },
  {
    slug: 'aod-9604-o-que-e',
    title: 'AOD-9604: o fragmento do GH para gordura que falhou na fase 3',
    excerpt: 'O AOD-9604 foi criado para queimar gordura sem os efeitos do GH — mas o ensaio de fase IIb não deu resultado. O que isso significa na prática.',
    tldr: 'AOD-9604 é um fragmento modificado do hormônio do crescimento (aa 176-191), criado para reproduzir o efeito lipolítico do GH sem seus efeitos anabólicos e sobre a glicose. Apesar de bem tolerado, o ensaio de fase IIb (24 semanas, 536 pacientes) NÃO atingiu significância estatística e o desenvolvimento foi interrompido em 2007. Não é aprovado como medicamento — hoje é peptídeo de pesquisa / compounding off-label.',
    publishedAt: '2026-07-17',
    readMinutes: 6,
    tags: ['aod-9604', 'emagrecimento', 'gh'],
    relatedPeptides: ['aod-9604', 'semaglutida'],
    coverColor: 'from-orange-500/20 to-amber-500/10',
  },
  {
    slug: 'gonadorelina-trt-fertilidade',
    title: 'Gonadorelina: GnRH, TRT e fertilidade — o que é e como age',
    excerpt: 'A gonadorelina é a forma sintética do GnRH. Usada no diagnóstico e, hoje, off-label na TRT para manter a função testicular. Por que a pulsatilidade importa.',
    tldr: 'Gonadorelina é a forma sintética do GnRH (hormônio liberador de gonadotrofina), estimulando LH e FSH pela hipófise. Teve aprovação da FDA (Factrel/Lutrepulse) para diagnóstico e indução de ovulação, ambas descontinuadas comercialmente (não por segurança). Hoje é usada via manipulação, off-label, em protocolos de TRT para manter a função testicular e a fertilidade. A administração PULSÁTIL é essencial — uso contínuo dessensibiliza e suprime o eixo. Não é proibida pela WADA.',
    publishedAt: '2026-07-17',
    readMinutes: 7,
    tags: ['gonadorelina', 'hormonal', 'trt'],
    relatedPeptides: ['gonadorelina'],
    coverColor: 'from-rose-500/20 to-pink-500/10',
  },
];

export function getArticles(): Article[] {
  return [...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticleSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}

// Artigos que citam um peptídeo específico (para linkar ficha → guias)
export function getArticlesByPeptide(peptideSlug: string): Article[] {
  return getArticles().filter(
    (a) => !a.draft && (a.relatedPeptides?.includes(peptideSlug) ?? false)
  );
}

// Posts relacionados por tags/peptídeos em comum (bloco "Leia também")
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const tags = new Set(article.tags);
  const peps = new Set(article.relatedPeptides ?? []);
  return getArticles()
    .filter((a) => !a.draft && a.slug !== article.slug)
    .map((a) => {
      const tagOverlap = a.tags.filter((t) => tags.has(t)).length;
      const pepOverlap = (a.relatedPeptides ?? []).filter((p) => peps.has(p)).length;
      return { a, score: tagOverlap + pepOverlap * 2 };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}

const iso = (d: string): string => (d.includes('T') ? d : `${d}T00:00:00-03:00`);

// URL da imagem OG dinâmica do artigo (gerada em /api/og). Relativa —
// resolvida por metadataBase.
export function articleOgImageUrl(article: Article): string {
  const eyebrow = article.tags[0] ?? 'Blog';
  return `/api/og?title=${encodeURIComponent(article.title)}&eyebrow=${encodeURIComponent(eyebrow)}`;
}

// Bloco openGraph/twitter de artigo — para plugar em posts já existentes
// sem sobrescrever title/description curados manualmente.
export function articleOpenGraph(article: Article): Pick<Metadata, 'openGraph' | 'twitter'> {
  const img = articleOgImageUrl(article);
  return {
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `/blog/${article.slug}`,
      publishedTime: iso(article.publishedAt),
      ...(article.updatedAt ? { modifiedTime: iso(article.updatedAt) } : {}),
      images: [{ url: img, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [img],
    },
  };
}

// Metadata completo a partir do artigo — usado pelos posts novos (Fase D).
export function buildArticleMetadata(article: Article): Metadata {
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    ...articleOpenGraph(article),
  };
}
