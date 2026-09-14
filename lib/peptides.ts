export type DoseUnit = 'mg' | 'mcg' | 'UI';

export type PeptideCategory =
  | 'healing'
  | 'glp-1'
  | 'gh'
  | 'sexual'
  | 'cosmetic'
  | 'longevity'
  | 'weight-loss'
  | 'cognitive'
  | 'hormone'
  | 'custom';

export const CATEGORY_LABELS: Record<PeptideCategory, string> = {
  'healing':     'Cicatrização',
  'glp-1':       'GLP-1 / Emagrecimento',
  'gh':          'Hormônio do crescimento',
  'sexual':      'Função sexual',
  'cosmetic':    'Cosmético',
  'longevity':   'Longevidade',
  'weight-loss': 'Emagrecimento',
  'cognitive':   'Cognitivo',
  'hormone':     'Hormonal',
  'custom':      'Personalizado',
};

/**
 * Status regulatório:
 * - fda-approved:        aprovado pela FDA para alguma indicação (pode ter uso off-label)
 * - discontinued:        já foi aprovado, descontinuado comercialmente (não por segurança)
 * - regional-approved:   aprovado em país específico (Japão, Rússia) mas não FDA/EMA/ANVISA
 * - investigational:     em ensaios clínicos, não aprovado ainda
 * - research-only:       sem aprovação regulatória, uso humano off-label / pesquisa
 * - unapproved-warning:  não aprovado + agências regulatórias emitiram alerta explícito
 */
export type RegulatoryStatus =
  | 'fda-approved'
  | 'discontinued'
  | 'regional-approved'
  | 'investigational'
  | 'research-only'
  | 'unapproved-warning';

export const REGULATORY_LABELS: Record<RegulatoryStatus, { label: string; tone: 'success' | 'neutral' | 'warn' | 'danger' }> = {
  'fda-approved':        { label: 'Aprovado FDA',        tone: 'success' },
  'discontinued':        { label: 'Aprovação histórica', tone: 'neutral' },
  'regional-approved':   { label: 'Aprovação regional',  tone: 'neutral' },
  'investigational':     { label: 'Em desenvolvimento',  tone: 'warn'    },
  'research-only':       { label: 'Apenas pesquisa',     tone: 'warn'    },
  'unapproved-warning':  { label: 'Alertas regulatórios', tone: 'danger' },
};

export type Peptide = {
  slug: string;
  name: string;
  typicalDose: number;
  doseUnit: DoseUnit;
  frequency: string;
  shortDescription: string;
  commonAmounts: number[]; // mg sizes do frasco
  category?: PeptideCategory | string;
  // Campos estendidos — preenchidos gradualmente (Fase 2)
  longDescription?: string;  // markdown
  mechanism?: string;        // markdown
  sideEffects?: string[];    // bullets
  contraindications?: string[];
  halfLife?: string;         // "~2h"
  doseRange?: string;        // "200-500 mcg"
  references?: { title: string; url: string }[];
  lastReviewed?: string;     // ISO yyyy-mm-dd
  reviewedBy?: { name: string; credentials?: string; url?: string }; // quem revisou
  regulatoryStatus?: RegulatoryStatus;
  wadaProhibited?: boolean;  // true se consta na Lista Proibida da WADA
  chemicalStructure?: string; // URL para SVG/PNG da estrutura química (futuro)
};

// Fase 1: hard-coded. Fase 2: mover para Supabase.
export const PEPTIDES: Peptide[] = [
  {
    slug: 'bpc-157',
    name: 'BPC-157',
    typicalDose: 250,
    doseUnit: 'mcg',
    frequency: '1-2x por dia',
    shortDescription: 'Peptídeo de proteção corporal. Promove cicatrização de tecidos, tendões e ligamentos.',
    commonAmounts: [5],
    category: 'healing',
    doseRange: '200-500 mcg/dia',
    halfLife: '~4h (subcutâneo)',
    longDescription:
      'BPC-157 ("Body Protection Compound") é um fragmento de 15 aminoácidos derivado de uma proteína encontrada no suco gástrico humano. Estudado em modelos animais pelo potencial de acelerar reparo de tendões, ligamentos, músculo e mucosa gastrointestinal.\n\nSem aprovação pelo FDA para uso humano — classificado pela WADA como proibido no esporte desde 2022. Uso em humanos é off-label / pesquisa.',
    mechanism:
      'Os mecanismos propostos incluem promoção de angiogênese via upregulation do VEGFR2, modulação do sistema nitric-oxide, aumento da expressão de fatores de crescimento (FGF, EGF) e interação com o eixo dopaminérgico/serotoninérgico. Boa parte dos dados vem de modelos animais.',
    sideEffects: [
      'Dados em humanos são limitados — perfil de segurança baseado principalmente em estudos animais',
      'Relatos anedóticos de reações no local da injeção, náusea leve',
      'Interações farmacológicas não bem caracterizadas',
    ],
    contraindications: [
      'Gestantes e lactantes (sem estudos)',
      'Histórico de câncer ativo (angiogênese teórica)',
      'Uso concomitante de anticoagulantes sem acompanhamento',
    ],
    references: [
      { title: 'Seiwerth S, et al. BPC 157 and standard angiogenic growth factors. Curr Pharm Des. 2018.', url: 'https://pubmed.ncbi.nlm.nih.gov/29769001/' },
      { title: 'WADA Prohibited List', url: 'https://www.wada-ama.org/en/prohibited-list' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: true,
  },

  {
    slug: 'tb-500',
    name: 'TB-500 (Timosina Beta-4)',
    typicalDose: 2.5,
    doseUnit: 'mg',
    frequency: '2x por semana (carga), 1x por semana (manutenção)',
    shortDescription: 'Promove recuperação tecidual, reduz inflamação e auxilia na cicatrização.',
    commonAmounts: [5, 10],
    category: 'healing',
    doseRange: 'Protocolos informais: 2-5 mg/semana SC (sem respaldo clínico)',
    longDescription:
      'TB-500 é um fragmento sintético da Timosina Beta-4 (Tβ4), proteína endógena de 43 aminoácidos com papel central em reparação tecidual, migração celular e angiogênese. Apesar do marketing online que o posiciona como agente de recuperação para lesões musculoesqueléticas, o TB-500 não possui aprovação regulatória em nenhuma jurisdição — a maior parte da evidência vem de modelos animais e estudos in vitro.\n\nEstá explicitamente proibido pela WADA (Seção S2 da Lista Proibida) dentro e fora de competição, além de incidir na cláusula S0 (substâncias não aprovadas). Produtos comercializados online frequentemente apresentam problemas de pureza e rotulagem imprecisa.',
    mechanism:
      'O principal mecanismo biológico descrito para a Tβ4 é o sequestro de G-actina monomérica, regulando a polimerização do citoesqueleto e favorecendo migração celular, remodelamento tecidual e exocitose. O motivo hexapeptídico 17-LKKTET-23 é o domínio essencial de ligação à actina.\n\nPromove angiogênese via modulação da via Notch/NF-κB, aumenta expressão de VEGF em hipóxia via óxido nítrico e inibe ativação de NF-κB induzida por TNF-α, reduzindo IL-8. Nenhum desses efeitos tem validação clínica robusta em humanos.',
    sideEffects: [
      'Dados de segurança em humanos são escassos (pequenos ensaios com Tβ4 recombinante, não TB-500)',
      'Reações no local da injeção relatadas por usuários',
      'Preocupação teórica pró-angiogênica em contexto tumoral (dados pré-clínicos mistos)',
      'Produtos de mercado cinza frequentemente apresentam contaminação e dosagem imprecisa',
    ],
    contraindications: [
      'Atletas sujeitos ao código WADA (proibição absoluta)',
      'Gestantes e lactantes (ausência total de dados)',
      'Pacientes com neoplasias ativas ou histórico oncológico',
      'Uso fora de protocolos de pesquisa aprovados',
    ],
    references: [
      { title: 'WADA Prohibited List', url: 'https://www.wada-ama.org/en/prohibited-list' },
      { title: 'Xing et al. Thymosin beta 4: a molecular mediator (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8724243/' },
      { title: 'Goldstein et al. Thymosin β4 in tissue repair (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4286745/' },
      { title: 'BSCG — TB-500 status, risks and bans', url: 'https://www.bscg.org/blogs/single/tb-500-status-risks-and-bans-in-sport-and-military' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: true,
  },

  {
    slug: 'semaglutida',
    name: 'Semaglutida',
    typicalDose: 0.25,
    doseUnit: 'mg',
    frequency: '1x por semana (dose inicial, aumentar gradualmente)',
    shortDescription: 'Agonista do receptor GLP-1. Usado para controle glicêmico e perda de peso.',
    commonAmounts: [3, 5],
    category: 'glp-1',
    doseRange: '0,25-2,4 mg/semana (subcutâneo, com titulação)',
    halfLife: '~7 dias',
    longDescription:
      'A semaglutida é um análogo do peptídeo semelhante ao glucagon tipo 1 (GLP-1), aprovada pela FDA e comercializada como Ozempic (2017, diabetes tipo 2), Rybelsus (oral, 2019) e Wegovy (2021, obesidade). Molécula modificada do GLP-1 humano com substituições de aminoácidos e conjugação a ácido graxo C18, o que permite ligação à albumina e administração semanal.\n\nIndicada para diabetes tipo 2 em adultos e manejo crônico de peso em obesidade (IMC ≥ 30) ou sobrepeso (IMC ≥ 27) com comorbidade. Ensaios de fase 3 (SUSTAIN e STEP) demonstraram perda ponderal média de 10-15% com 2,4 mg/semana. Em 2024 a FDA também aprovou para redução de risco cardiovascular em adultos com DCV estabelecida e obesidade/sobrepeso.',
    mechanism:
      'Agonista seletivo do receptor GLP-1, amplamente expresso em células beta pancreáticas, neurônios do SNC (hipotálamo, tronco cerebral), TGI e miocárdio. A ativação aumenta secreção de insulina glicose-dependente, suprime glucagon, retarda esvaziamento gástrico e atua em centros de saciedade, reduzindo ingestão calórica.\n\nA modificação estrutural (ácido graxo C18 ligado ao Lys26) confere alta afinidade pela albumina sérica, reduzindo depuração renal e degradação por DPP-4 — resultando em meia-vida plasmática de ~1 semana.',
    sideEffects: [
      'Náusea (>20% em Ozempic; até 44% em Wegovy)',
      'Vômito',
      'Diarreia',
      'Constipação',
      'Dor abdominal',
      'Reações no local da injeção',
    ],
    contraindications: [
      'História pessoal ou familiar de carcinoma medular de tireoide (CMT)',
      'Síndrome de Neoplasia Endócrina Múltipla tipo 2 (NEM 2)',
      'Hipersensibilidade grave à semaglutida ou excipientes',
      'Gestação (uso não recomendado)',
    ],
    references: [
      { title: 'FDA Label — Ozempic Prescribing Information', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/209637s035,209637s037lbl.pdf' },
      { title: 'FDA Label — Wegovy Prescribing Information', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2023/215256s007lbl.pdf' },
      { title: 'StatPearls — Semaglutide (NCBI)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK603723/' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'fda-approved',
    wadaProhibited: false,
  },

  {
    slug: 'tirzepatida',
    name: 'Tirzepatida',
    typicalDose: 2.5,
    doseUnit: 'mg',
    frequency: '1x por semana',
    shortDescription: 'Agonista duplo GIP/GLP-1 (Mounjaro, Zepbound). Usado para controle glicêmico e perda de peso.',
    commonAmounts: [5, 10, 15],
    category: 'glp-1',
    doseRange: '2,5-15 mg/semana (subcutâneo, titulação a cada ≥4 semanas)',
    halfLife: '~5 dias',
    longDescription:
      'A tirzepatida é um agonista dual dos receptores de GIP e GLP-1, aprovada pela FDA em 2022 como Mounjaro (diabetes tipo 2) e em 2023 como Zepbound (obesidade). Peptídeo sintético de 39 aminoácidos ligado a ácido graxo diácido C20, com ligação à albumina e administração subcutânea semanal.\n\nOs programas SURPASS (diabetes) e SURMOUNT (obesidade) demonstraram perda ponderal média de até ~20,9% com 15 mg/semana em 72 semanas (SURMOUNT-1), superior aos agonistas GLP-1 puros em comparações diretas. Indicada para adultos com DM2 e adultos com obesidade/sobrepeso com comorbidade.',
    mechanism:
      'Ativa simultaneamente os receptores GIP e GLP-1, ambos da família de receptores acoplados à proteína G classe B. Ativação do GLP-1: insulina glicose-dependente, supressão de glucagon, retardo do esvaziamento gástrico, saciedade central. A coativação de GIP contribui para sensibilidade à insulina e metabolismo lipídico, embora a sinergia exata ainda esteja sob investigação.\n\nA conjugação ao ácido graxo C20 confere meia-vida de ~5 dias.',
    sideEffects: [
      'Náusea',
      'Diarreia',
      'Vômito',
      'Constipação',
      'Diminuição do apetite',
      'Dispepsia / dor abdominal',
    ],
    contraindications: [
      'História pessoal ou familiar de carcinoma medular de tireoide (CMT)',
      'Síndrome de Neoplasia Endócrina Múltipla tipo 2 (NEM 2)',
      'Hipersensibilidade grave (anafilaxia e angioedema relatados)',
    ],
    references: [
      { title: 'FDA Label — Mounjaro Prescribing Information', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2022/215866s000lbl.pdf' },
      { title: 'Lilly USPI — Mounjaro', url: 'https://pi.lilly.com/us/mounjaro-uspi.pdf' },
      { title: 'StatPearls — Tirzepatide (NCBI)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK585056/' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'fda-approved',
    wadaProhibited: false,
  },

  {
    slug: 'retatrutide',
    name: 'Retatrutide',
    typicalDose: 2,
    doseUnit: 'mg',
    frequency: '1x por semana',
    shortDescription: 'Agonista triplo GLP-1/GIP/glucagon em desenvolvimento para obesidade e diabetes tipo 2.',
    commonAmounts: [5, 10],
    category: 'glp-1',
    doseRange: '1-12 mg/semana (doses investigacionais)',
    halfLife: '~6 dias',
    longDescription:
      'Retatrutida (LY3437943) é um peptídeo sintético investigacional da Eli Lilly, atuando como agonista triplo dos receptores GIP, GLP-1 e glucagon. Peptídeo de 39 aminoácidos com cadeia de ácido graxo diácido C20, administração subcutânea semanal. **Importante**: NÃO está aprovada por qualquer agência (FDA, EMA, ANVISA) até o momento — encontra-se em ensaios clínicos de fase 3 (programa TRIUMPH).\n\nDados de fase 2 (NEJM 2023; Nature Medicine 2024) demonstraram perda ponderal média de até ~24% em 48 semanas (12 mg/semana) em pacientes sem diabetes. Em dezembro de 2025 a Lilly reportou resultados positivos do TRIUMPH-4 (perda de ~28,7% em 68 semanas).',
    mechanism:
      'Ativa simultaneamente receptores de GLP-1, GIP e glucagon. GLP-1 e GIP reproduzem os efeitos observados nos análogos existentes (insulina glicose-dependente, supressão de glucagon pós-prandial, retardo do esvaziamento gástrico, modulação do apetite). O componente de agonismo ao receptor de glucagon é responsável por aumento do gasto energético e lipólise hepática, contribuindo para perda ponderal adicional e redução de gordura hepática.\n\nEstudos farmacológicos indicam menor potência relativa a GLP-1/glucagon humanos em comparação aos ligantes nativos, com maior potência relativa ao GIP. Conjugação a ácido graxo C20 confere meia-vida compatível com dosagem semanal.',
    sideEffects: [
      'Náusea (até ~43% em fase 2)',
      'Diarreia (até ~33%)',
      'Constipação (até ~25%)',
      'Vômito (até ~21%)',
      'Diminuição do apetite',
      'Disestesia (sensações cutâneas anormais) em doses mais altas',
    ],
    contraindications: [
      'Medicamento experimental — contraindicações formais ainda não estabelecidas em bula',
      'Exclusões dos ensaios: história pessoal/familiar de CMT ou NEM 2',
      'História de pancreatite',
      'Gravidez e lactação',
      'Hipersensibilidade à formulação',
    ],
    references: [
      { title: 'Jastreboff et al. Retatrutide for Obesity — Phase 2 (NEJM, 2023)', url: 'https://pubmed.ncbi.nlm.nih.gov/37366315/' },
      { title: 'Urva et al. LY3437943 Phase 1b MAD (Lancet, 2022)', url: 'https://pubmed.ncbi.nlm.nih.gov/36354040/' },
      { title: 'Sanyal et al. Retatrutide for MASLD — Phase 2a (Nature Medicine, 2024)', url: 'https://www.nature.com/articles/s41591-024-03018-2' },
      { title: 'Eli Lilly — TRIUMPH-4 Phase 3 Results (Dez 2025)', url: 'https://investor.lilly.com/news-releases/news-release-details/lillys-triple-agonist-retatrutide-delivered-weight-loss-average' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'investigational',
    wadaProhibited: false,
  },

  {
    slug: 'cjc-1295',
    name: 'CJC-1295 (com DAC)',
    typicalDose: 2,
    doseUnit: 'mg',
    frequency: '1x por semana',
    shortDescription: 'Análogo do GHRH com meia-vida prolongada. Estimula a liberação de GH.',
    commonAmounts: [2, 5],
    category: 'gh',
    doseRange: 'Estudos fase I: 30-60 µg/kg; uso clínico não aprovado',
    halfLife: '~5,8-8,1 dias',
    longDescription:
      'CJC-1295 com DAC (Drug Affinity Complex) é um análogo sintético do GHRH modificado para ligar-se covalentemente à albumina sérica por maleimida, o que prolonga drasticamente sua meia-vida em comparação ao GHRH nativo e à versão sem DAC (Mod GRF 1-29). Desenvolvido pela ConjuChem e avaliado em fase I/II para deficiência de GH e lipodistrofia associada ao HIV.\n\nNão possui aprovação em qualquer agência regulatória. No Brasil e na maior parte do mundo é peptídeo de pesquisa, comercializado ilegalmente para fins estéticos. Proibido pela WADA (S2) como secretagogo de GH. Por sua meia-vida prolongada e efeito cumulativo sobre IGF-1, apresenta perfil de risco distinto das formulações de curta duração.',
    mechanism:
      'Agonista do receptor de GHRH (GHRH-R) nos somatotrofos da hipófise anterior, estimulando síntese e liberação pulsátil de GH endógeno. A ligação covalente à albumina via DAC mantém concentrações plasmáticas ativas por vários dias, elevando níveis basais de GH e IGF-1 de forma sustentada — o que pode reduzir a pulsatilidade fisiológica observada com GHRH nativo ou análogos de curta duração.',
    sideEffects: [
      'Reações no local da injeção (eritema, prurido, dor)',
      'Rubor facial (flushing) e sensação de calor',
      'Cefaleia e tontura',
      'Retenção hídrica e parestesias',
      'Elevação sustentada de IGF-1 com potencial risco teórico oncogênico',
    ],
    contraindications: [
      'Malignidade ativa ou história recente de neoplasia',
      'Gestação e lactação',
      'Doença crítica aguda',
      'Retinopatia diabética proliferativa',
      'Hipersensibilidade ao peptídeo',
    ],
    references: [
      { title: 'Teichman et al. Prolonged stimulation of GH by CJC-1295 (JCEM, 2006)', url: 'https://pubmed.ncbi.nlm.nih.gov/16352683/' },
      { title: 'Ionescu & Frohman. Pulsatile GH secretion (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/16822960/' },
      { title: 'WADA Prohibited List', url: 'https://www.wada-ama.org/en/prohibited-list' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: true,
  },

  {
    slug: 'ipamorelina',
    name: 'Ipamorelina',
    typicalDose: 200,
    doseUnit: 'mcg',
    frequency: '2-3x por dia',
    shortDescription: 'Secretagogo de GH seletivo. Menor efeito sobre cortisol e prolactina.',
    commonAmounts: [2, 5],
    category: 'gh',
    doseRange: 'Estudos de pesquisa: 100-300 mcg/aplicação',
    halfLife: '~2h',
    longDescription:
      'Ipamorelina é um pentapeptídeo sintético (Aib-His-D-2-Nal-D-Phe-Lys-NH2) desenvolvido pela Novo Nordisk como o primeiro secretagogo de GH seletivo. Classe dos GHRPs (growth hormone-releasing peptides), age como agonista do receptor da grelina (GHSR-1a), mas com perfil farmacológico notavelmente mais seletivo que GHRP-6 e hexarelina.\n\nNão possui aprovação regulatória para uso clínico; alcançou fase II para íleo pós-operatório, mas o desenvolvimento foi interrompido. Peptídeo de pesquisa, proibido pela WADA (S2). Em clínicas de manipulação é frequentemente combinada com CJC-1295 sem DAC em protocolos off-label.',
    mechanism:
      'Agonista seletivo do receptor GHSR-1a nos somatotrofos hipofisários, induzindo liberação pulsátil de GH. Sua principal diferença em relação a outros GHRPs é não elevar significativamente ACTH, cortisol ou prolactina — mesmo em doses até 200× a DE50 para liberação de GH — atribuído à seletividade pelo subtipo receptorial envolvido na liberação de GH e menor interação com vias hipotálamo-hipófise-adrenais.',
    sideEffects: [
      'Reações no local da injeção',
      'Cefaleia leve a moderada',
      'Rubor transitório (flushing)',
      'Tontura',
      'Fome leve (menos intensa que com GHRP-6)',
    ],
    contraindications: [
      'Malignidade ativa',
      'Gestação e lactação',
      'Doença crítica aguda',
      'Hipersensibilidade ao peptídeo',
      'Uso concomitante de outros secretagogos de GH sem supervisão',
    ],
    references: [
      { title: 'Raun et al. Ipamorelin, most potent and selective GH secretagogue (Eur J Endocrinol, 1998)', url: 'https://pubmed.ncbi.nlm.nih.gov/9849822/' },
      { title: 'Gobburu et al. Pharmacokinetics of ipamorelin (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/10496658/' },
      { title: 'WADA Prohibited List', url: 'https://www.wada-ama.org/en/prohibited-list' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: true,
  },

  {
    slug: 'sermorelina',
    name: 'Sermorelina',
    typicalDose: 200,
    doseUnit: 'mcg',
    frequency: '1x por dia (antes de dormir)',
    shortDescription: 'Análogo do GHRH. Estimula a produção natural de hormônio do crescimento.',
    commonAmounts: [2, 3],
    category: 'gh',
    doseRange: 'Histórico (Geref): 0,3 µg/kg IV diagnóstico; compounding atual: 0,2-0,5 mg SC noturno',
    halfLife: '~11-12 min',
    longDescription:
      'Sermorelina (GRF 1-29) corresponde aos 29 primeiros aminoácidos do GHRH endógeno humano — o menor fragmento que preserva a atividade biológica completa do hormônio nativo. Aprovada pela FDA em 1990 como Geref (EMD Serono) para diagnóstico de função pituitária e tratamento de deficiência idiopática de GH em crianças.\n\nGeref foi descontinuada em 2008 por decisão comercial (não por segurança/eficácia — o FDA publicou determinação formal nesse sentido em 2013). Atualmente, sermorelina não é mais comercializada como produto aprovado, disponível apenas via farmácias de manipulação nos EUA para uso off-label em adultos, sem endosso do FDA. No Brasil, sem registro ativo na ANVISA. Proibida no esporte pela WADA (S2).',
    mechanism:
      'Agonista do receptor de GHRH (GHRH-R) nos somatotrofos da hipófise anterior, estimulando síntese e liberação pulsátil de GH por ativação de adenilato ciclase e elevação de cAMP intracelular. Por preservar a pulsatilidade fisiológica e depender de estoques hipofisários funcionantes, foi classicamente utilizada como teste diagnóstico da reserva de GH. Rapidamente degradada por DPP-IV e outras proteases séricas.',
    sideEffects: [
      'Reações no local da injeção (dor, eritema, tumefação)',
      'Rubor facial (flushing)',
      'Cefaleia',
      'Disgeusia (alteração do paladar)',
      'Náusea',
      'Reações de hipersensibilidade (raras)',
    ],
    contraindications: [
      'Malignidade ativa',
      'Hipersensibilidade ao GHRH ou à sermorelina',
      'Gestação e lactação',
      'Hipotireoidismo não tratado (pode atenuar a resposta)',
      'Uso concomitante de glicocorticoides em altas doses',
    ],
    references: [
      { title: 'Thorner MO et al. Growth hormone releasing hormone (1994)', url: 'https://pubmed.ncbi.nlm.nih.gov/7962295/' },
      { title: 'FDA — Determination that Geref was not withdrawn for safety (2013)', url: 'https://www.federalregister.gov/documents/2013/03/04/2013-04827/determination-that-geref-sermorelin-acetate-injection-05-milligrams-basevial-and-10-milligrams' },
      { title: 'WADA Prohibited List', url: 'https://www.wada-ama.org/en/prohibited-list' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'discontinued',
    wadaProhibited: true,
  },

  {
    slug: 'tesamorelina',
    name: 'Tesamorelina',
    typicalDose: 2,
    doseUnit: 'mg',
    frequency: '1x por dia',
    shortDescription: 'Análogo do GHRH. Reduz gordura visceral abdominal.',
    commonAmounts: [2],
    category: 'gh',
    doseRange: '2 mg/dia SC (dose fixa aprovada)',
    halfLife: '~26-38 min',
    longDescription:
      'Tesamorelina é um análogo sintético do GHRH humano, composto por 44 aminoácidos com modificação N-terminal (ácido trans-3-hexenoico no Tyr1) que confere resistência à DPP-4 e prolonga a meia-vida funcional. Aprovada pela FDA em 2010 como Egrifta, com formulação atualizada Egrifta WR aprovada posteriormente.\n\nA indicação aprovada é específica: redução de excesso de gordura abdominal visceral (lipodistrofia) em adultos HIV-positivos em terapia antirretroviral. Estudos pivotais demonstraram reduções médias de ~15-18% no tecido adiposo visceral após 26 semanas. Uso em outras populações (anti-envelhecimento, performance, perda de gordura geral) é off-label e não avaliado em ensaios regulatórios. Proibida pela WADA na categoria S2.',
    mechanism:
      'Liga-se e ativa o receptor de GHRH na hipófise anterior, estimulando síntese e liberação pulsátil endógena de GH. O GH, por sua vez, atua em tecidos-alvo diretamente e via estimulação da produção hepática de IGF-1, promovendo lipólise preferencialmente no tecido adiposo visceral.\n\nA modificação N-terminal com ácido trans-3-hexenoico protege a molécula da clivagem por DPP-4, resultando em meia-vida plasmática de ~26-38 minutos — maior que a do GHRH endógeno, mas ainda curta, justificando administração diária.',
    sideEffects: [
      'Artralgia (dor articular)',
      'Reações no local da injeção (eritema, prurido, dor, hematoma)',
      'Dor em extremidades / mialgia',
      'Edema periférico',
      'Parestesia',
      'Náusea',
    ],
    contraindications: [
      'Disfunção do eixo hipotálamo-hipofisário por hipofisectomia, hipopituitarismo, radiação hipofisária ou traumatismo',
      'Malignidade ativa',
      'Gravidez',
      'Hipersensibilidade à tesamorelina, manitol ou outros excipientes',
    ],
    references: [
      { title: 'FDA Label — Egrifta (tesamorelin) 2019', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/022505Orig1s010lbl.pdf' },
      { title: 'FDA Label — Egrifta 2025 update', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2025/022505s020lbl.pdf' },
      { title: 'WADA Prohibited List (S2)', url: 'https://www.wada-ama.org/en/prohibited-list' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'fda-approved',
    wadaProhibited: true,
  },

  {
    slug: 'hexarelina',
    name: 'Hexarelina',
    typicalDose: 200,
    doseUnit: 'mcg',
    frequency: '2-3x por dia',
    shortDescription: 'Secretagogo de GH potente. Pode elevar cortisol e prolactina.',
    commonAmounts: [2, 5],
    category: 'gh',
    doseRange: 'Estudos de pesquisa: 1,5-2 µg/kg IV; uso clínico não aprovado',
    halfLife: '~55 min (IV, humanos)',
    longDescription:
      'Hexarelina (examorelina) é um hexapeptídeo sintético da família dos GHRPs, análogo estrutural do GHRP-6 com potência superior para liberação de GH. Investigada em fase II para deficiência de GH e insuficiência cardíaca congestiva, mas o desenvolvimento clínico foi descontinuado e nunca foi comercializada.\n\nNão possui aprovação em nenhum país, considerada peptídeo exclusivamente de pesquisa. Proibida pela WADA (S2). Entre os GHRPs, tem perfil de estimulação hormonal mais amplo, ativando eixos ACTH/cortisol e prolactina de forma mais marcada que ipamorelina — o que limita seu interesse clínico. Possui literatura de interesse sobre efeitos cardiovasculares diretos mediados por receptor CD36.',
    mechanism:
      'Agonista do receptor GHSR-1a (receptor de grelina/secretagogo de GH) em hipófise e hipotálamo, induzindo liberação pulsátil de GH com potência superior ao GHRP-6. Diferentemente da ipamorelina, estimula de forma dose-dependente também ACTH, cortisol e prolactina. Demonstra ainda afinidade pelo receptor scavenger CD36 no miocárdio, mediando efeitos cardíacos independentes da liberação de GH.',
    sideEffects: [
      'Rubor facial transitório',
      'Elevação dose-dependente de cortisol e ACTH',
      'Elevação dose-dependente de prolactina',
      'Reações no local da injeção',
      'Cefaleia',
      'Dessensibilização hipofisária com uso crônico/dose alta',
    ],
    contraindications: [
      'Malignidade ativa',
      'Gestação e lactação',
      'Doença crítica aguda',
      'Hiperprolactinemia ou distúrbios do eixo adrenal',
      'Hipersensibilidade ao peptídeo',
    ],
    references: [
      { title: 'Imbimbo BP et al. Hexarelin pharmacokinetics (Eur J Clin Pharmacol, 1994)', url: 'https://pubmed.ncbi.nlm.nih.gov/8954038/' },
      { title: 'Broglio F et al. Hexarelin and GH secretion (1999)', url: 'https://pubmed.ncbi.nlm.nih.gov/10341859/' },
      { title: 'WADA Prohibited List', url: 'https://www.wada-ama.org/en/prohibited-list' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: true,
  },

  {
    slug: 'ghrp-2',
    name: 'GHRP-2',
    typicalDose: 100,
    doseUnit: 'mcg',
    frequency: '2-3x por dia',
    shortDescription: 'Secretagogo de GH potente. Menor efeito no apetite que GHRP-6.',
    commonAmounts: [5],
    category: 'gh',
    doseRange: 'Japão (diagnóstico): 100 µg IV dose única; fora dessa indicação não aprovado',
    halfLife: '~15-60 min (estimado)',
    longDescription:
      'GHRP-2 (pralmorelina, GPA-748) é um hexapeptídeo sintético secretagogo de GH, agonista do receptor de grelina. Recebeu aprovação regulatória apenas no Japão (Kaken Pharmaceutical), onde é usado como agente diagnóstico para deficiência de GH em adultos sob o nome GHRP Kaken 100. Não é aprovado pelo FDA, EMA ou ANVISA.\n\nFora do contexto diagnóstico japonês, é considerado peptídeo de pesquisa. Proibido pela WADA (S2) — há métodos validados de LC–MS/MS para detecção em urina em controle antidoping, com casos positivos já sancionados. No mercado de peptídeos manipulados é usado off-label sem respaldo regulatório, isoladamente ou combinado a análogos de GHRH.',
    mechanism:
      'Agonista do receptor GHSR-1a (receptor de grelina) nos somatotrofos hipofisários e no hipotálamo, estimula liberação pulsátil de GH. Apresenta sinergia conhecida com análogos de GHRH em coadministração. Em comparação com ipamorelina é menos seletivo, elevando ACTH, cortisol e prolactina de forma dose-dependente — embora em geral com magnitude inferior à hexarelina e ao GHRP-6.',
    sideEffects: [
      'Reações no local da injeção',
      'Elevação de cortisol e ACTH (dose-dependente)',
      'Elevação leve a moderada de prolactina',
      'Rubor e sensação de calor',
      'Estímulo de apetite (menos intenso que GHRP-6)',
      'Cefaleia',
    ],
    contraindications: [
      'Malignidade ativa',
      'Gestação e lactação',
      'Doença crítica aguda',
      'Distúrbios do eixo hipotálamo-hipófise-adrenal',
      'Hipersensibilidade ao peptídeo',
    ],
    references: [
      { title: 'Furuta S et al. GHRP-2 diagnostic use (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/15230633/' },
      { title: 'Bowers CY. GHRPs and GH secretion (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/9285939/' },
      { title: 'WADA Prohibited List', url: 'https://www.wada-ama.org/en/prohibited-list' },
      { title: 'Sigalos & Pastuszak. GHRPs in anti-aging clinics (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9631397/' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'regional-approved',
    wadaProhibited: true,
  },

  {
    slug: 'ghrp-6',
    name: 'GHRP-6',
    typicalDose: 100,
    doseUnit: 'mcg',
    frequency: '2-3x por dia',
    shortDescription: 'Secretagogo de GH. Aumenta apetite e liberação de GH.',
    commonAmounts: [5],
    category: 'gh',
    doseRange: 'Estudos de pesquisa: 100-400 µg/kg IV; uso clínico não aprovado',
    halfLife: '~2,5h (eliminação IV; distribuição ~7,6 min)',
    longDescription:
      'GHRP-6 é um hexapeptídeo sintético (His-D-Trp-Ala-Trp-D-Phe-Lys-NH2), um dos primeiros GHRPs desenvolvidos e protótipo farmacológico da classe. Foi amplamente estudado em ensaios clínicos iniciais, incluindo administração oral em crianças com baixa estatura, mas nunca obteve aprovação regulatória para comercialização em qualquer país.\n\nPeptídeo exclusivamente de pesquisa, proibido pela WADA (S2). Caracteriza-se clinicamente pela estimulação pronunciada do apetite — o mais intenso entre os GHRPs — consequência da ativação potente do receptor de grelina em núcleos hipotalâmicos reguladores da fome. Também eleva ACTH, cortisol e prolactina de forma mais marcada que ipamorelina.',
    mechanism:
      'Agonista do receptor GHSR-1a (receptor de grelina) nos somatotrofos hipofisários, estimula liberação pulsátil de GH. Atua adicionalmente em receptores GHSR no núcleo arqueado do hipotálamo e no núcleo do trato solitário, sinalizando fome — mecanismo compartilhado com a grelina endógena. A coativação de corticotrofos leva a elevações de ACTH e cortisol, e há estímulo de prolactina.',
    sideEffects: [
      'Aumento acentuado do apetite',
      'Reações no local da injeção',
      'Elevação transitória de cortisol e ACTH',
      'Elevação de prolactina',
      'Rubor facial e sonolência',
      'Retenção hídrica',
    ],
    contraindications: [
      'Malignidade ativa',
      'Gestação e lactação',
      'Doença crítica aguda',
      'Hiperprolactinemia e distúrbios do eixo adrenal',
      'Hipersensibilidade ao peptídeo',
    ],
    references: [
      { title: 'Cabrales A et al. GHRP-6 pharmacokinetics (2013)', url: 'https://pubmed.ncbi.nlm.nih.gov/23099431/' },
      { title: 'Bowers CY. GHRPs and GH secretion (PubMed)', url: 'https://pubmed.ncbi.nlm.nih.gov/9285939/' },
      { title: 'WADA Prohibited List', url: 'https://www.wada-ama.org/en/prohibited-list' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: true,
  },

  {
    slug: 'pt-141',
    name: 'PT-141 (Bremelanotida)',
    typicalDose: 1.75,
    doseUnit: 'mg',
    frequency: 'Conforme necessário (máx 1x a cada 24h)',
    shortDescription: 'Agonista do receptor MC4. Usado para disfunção sexual.',
    commonAmounts: [10],
    category: 'sexual',
    doseRange: '1,75 mg SC conforme necessário; máx 1 dose/24h e 8 doses/mês',
    halfLife: '~2,7h (terminal)',
    longDescription:
      'Bremelanotida (PT-141), comercializada como Vyleesi®, é um peptídeo agonista dos receptores de melanocortina aprovado pela FDA em 21/06/2019 para Transtorno do Desejo Sexual Hipoativo (TDSH) adquirido e generalizado em mulheres na pré-menopausa. Primeiro tratamento aprovado para uso "conforme necessário" dessa condição (Palatin Technologies/AMAG Pharmaceuticals).\n\nApresentação aprovada: autoinjetor SC de dose única (1,75 mg), administrado no abdome ou coxa ≥45 min antes da atividade sexual prevista. Não usar mais de 1× em 24h ou >8× por mês. Diferente de tratamentos para disfunção erétil masculina, atua no SNC — não sobre vasculatura genital. Qualquer uso fora da indicação aprovada (inclusive em homens) é off-label e sem respaldo regulatório.',
    mechanism:
      'Agonista não seletivo dos receptores de melanocortina (MC1R, MC3R, MC4R e MC5R). Acredita-se que o efeito sobre o desejo sexual seja mediado principalmente pela ativação de MC4R em vias hipotalâmicas e límbicas envolvidas na motivação sexual, embora o mecanismo preciso permaneça não completamente elucidado.\n\nA ativação de receptores de melanocortina também explica os efeitos adversos: elevação transitória da pressão arterial (via MC4R em núcleos autonômicos), redução da frequência cardíaca, náusea e rubor facial — que tipicamente se resolvem em até 12h.',
    sideEffects: [
      'Náusea (efeito adverso mais comum, ~40% dos pacientes em ensaios)',
      'Rubor facial (flushing)',
      'Reações no local da injeção',
      'Cefaleia',
      'Vômitos',
      'Tosse, fadiga, ondas de calor',
      'Hiperpigmentação focal (pele/gengiva), especialmente em peles escuras ou uso repetido',
      'Elevação transitória da PA e redução da FC após cada dose',
    ],
    contraindications: [
      'Hipertensão não controlada',
      'Doença cardiovascular conhecida',
      'Gravidez (descontinuar se ocorrer)',
      'Risco cardiovascular significativo (avaliação individualizada)',
    ],
    references: [
      { title: 'FDA Label — Vyleesi (bremelanotide) Prescribing Information', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/210557s000lbl.pdf' },
      { title: 'FDA — Vyleesi NDA Approval Letter', url: 'https://www.accessdata.fda.gov/drugsatfda_docs/nda/2019/210557Orig1s000Approv.pdf' },
      { title: 'Palatin — FDA approves Vyleesi (press release)', url: 'https://palatin.com/press_releases/fda-approves-new-drug-application-for-vyleesi-bremelanotide-injection-2/' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'fda-approved',
    wadaProhibited: false,
  },

  {
    slug: 'melanotan-ii',
    name: 'Melanotan II',
    typicalDose: 0.25,
    doseUnit: 'mg',
    frequency: '1x por dia (carga), 2x por semana (manutenção)',
    shortDescription: 'Agonista do receptor de melanocortina. Promove bronzeamento da pele.',
    commonAmounts: [10],
    category: 'cosmetic',
    doseRange: 'Não há dose segura estabelecida — produto não aprovado para uso humano',
    longDescription:
      'Melanotan II (MT-II) é um análogo sintético do α-MSH desenvolvido na Universidade do Arizona nos anos 1980 como potencial agente fotoprotetor. O desenvolvimento clínico foi interrompido por questões de segurança e o composto nunca obteve aprovação regulatória em nenhuma jurisdição. Apesar disso, é comercializado ilegalmente pela internet como "agente de bronzeamento injetável" ou em sprays nasais, frequentemente sob a alcunha de "Barbie drug".\n\nMúltiplas agências reguladoras emitiram alertas públicos contra o uso: a MHRA (UK) classifica os produtos como medicamentos não licenciados e de comercialização ilegal; a TGA (Austrália) proibiu sua venda e alerta para riscos de disfunção renal, edema cerebral, alterações em nevos, priapismo, hipertensão e potencial risco de melanoma. Produtos do mercado ilegal apresentam contaminação microbiana, dosagem variável e ingredientes não declarados.',
    mechanism:
      'Agonista não seletivo dos receptores de melanocortina (MC1R, MC3R, MC4R e MC5R). Ativação de MC1R em melanócitos estimula produção de eumelanina, causando escurecimento cutâneo. Ativação de MC3R/MC4R em núcleos hipotalâmicos explica efeitos sobre comportamento sexual (ereções espontâneas, priapismo) e redução de apetite.\n\nA atividade indiscriminada sobre toda a família de receptores melanocortinérgicos é responsável pelo perfil de efeitos adversos amplo e imprevisível, que inclui desde hiperpigmentação generalizada e escurecimento de nevos até disfunção autonômica e renal.',
    sideEffects: [
      'Náusea e vômitos (muito comuns, principalmente nas primeiras doses)',
      'Rubor facial e hipertensão',
      'Priapismo (ereção prolongada e dolorosa, pode exigir atendimento de emergência)',
      'Escurecimento e aumento de nevos preexistentes; surgimento rápido de novos nevos',
      'Hiperpigmentação difusa (incluindo mucosas e gengivas)',
      'Disfunção renal relatada',
      'Edema cerebral em casos isolados',
      'Preocupação com potencial promoção de melanoma',
      'Infecções por produtos de mercado ilegal',
    ],
    contraindications: [
      'Histórico pessoal ou familiar de melanoma ou câncer de pele',
      'Nevos atípicos ou displásicos',
      'Hipertensão, doença cardiovascular',
      'Gravidez e lactação',
      'Qualquer uso geral — produto não aprovado e desaconselhado por MHRA, TGA e FDA',
    ],
    references: [
      { title: 'TGA (Austrália) — Don\'t risk using tanning products containing Melanotan', url: 'https://www.tga.gov.au/news/blog/dont-risk-using-tanning-products-containing-melanotan' },
      { title: 'TGA — Melanotan illegal therapeutic goods', url: 'https://www.tga.gov.au/melanotan-illegal-therapeutic-goods' },
      { title: 'DermNet NZ — Melanotan II', url: 'https://dermnetnz.org/topics/melanotan-ii' },
      { title: 'MHRA FOI — Melanotan adverse reactions', url: 'https://assets.publishing.service.gov.uk/media/669fbd3aa3c2a28abb50d55a/Final_Redaction_FOI_24_274.pdf' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'unapproved-warning',
    wadaProhibited: false,
  },

  {
    slug: 'mots-c',
    name: 'MOTS-C',
    typicalDose: 500,
    doseUnit: 'mcg',
    frequency: '1x por dia',
    shortDescription: 'Peptídeo mitocondrial. Ativa AMPK, melhora sensibilidade à insulina e oxidação de gordura.',
    commonAmounts: [10],
    category: 'longevity',
    doseRange: 'Não há dose terapêutica aprovada; protocolos de pesquisa não padronizados',
    halfLife: 'Farmacocinética em caracterização; ordem de horas no plasma (pré-clínico)',
    longDescription:
      'MOTS-C é um peptídeo de 16 aminoácidos codificado pelo gene 12S rRNA mitocondrial, classificado como peptídeo derivado da mitocôndria (MDP). Descrito em 2015 pelo grupo de Pinchas Cohen (USC) como regulador da homeostase metabólica, com capacidade de atravessar da mitocôndria para o citosol e núcleo em situações de estresse energético. Literatura pré-clínica associa MOTS-C a melhora da sensibilidade à insulina, termogênese, aumento da capacidade de exercício e efeitos anti-inflamatórios em modelos murinos.\n\nA evidência em humanos ainda é limitada — estudos observacionais mostram níveis plasmáticos reduzidos em pacientes com DM2, diabetes gestacional e obesidade pediátrica (associativo). Um primeiro ensaio clínico em adultos saudáveis e em coorte com obesidade e esteatose hepática (NCT03998514) foi conduzido para PK e segurança, mas não há ensaios de fase tardia concluídos nem aprovação regulatória. Uso atual: estritamente peptídeo de pesquisa. Proibido pela WADA.',
    mechanism:
      'Mecanismo central proposto: ativação da AMPK via aumento do AICAR, levando à translocação do GLUT4 para a membrana de células musculares e aumento da captação de glicose. Modula também o metabolismo de folato/purinas e a resposta ao estresse integrado mitocondrial (ISRmt), atuando como sinalizador retrógrado mitocôndria→núcleo.\n\nA ativação da AMPK a jusante reduz expressão de genes lipogênicos, melhora oxidação de ácidos graxos e, em modelos animais, melhora função mitocondrial esquelética e cardíaca. Há evidência de translocação nuclear do peptídeo com regulação direta de fatores de transcrição ligados a resposta antioxidante (NRF2).',
    sideEffects: [
      'Dados de segurança em humanos muito limitados (apenas fase inicial)',
      'Perfil toxicológico aparentemente favorável em estudos pré-clínicos',
      'Reações no local da injeção relatadas em uso compounded',
      'Efeitos de longo prazo desconhecidos',
    ],
    contraindications: [
      'Gravidez e lactação (ausência de dados)',
      'Atletas sob regulamentação antidoping (proibido pela WADA)',
      'Câncer ativo ou recente (efeitos sobre proliferação não caracterizados)',
      'Uso pediátrico não estudado',
    ],
    references: [
      { title: 'Lu et al. MOTS-c promising mitochondrial peptide (PMC, 2023)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9905433/' },
      { title: 'Lee et al. MOTS-c promotes metabolic homeostasis (Cell Metabolism, 2015)', url: 'https://www.cell.com/article/S1550-4131(15)00061-3/fulltext' },
      { title: 'USADA — What is the MOTS-c peptide?', url: 'https://www.usada.org/spirit-of-sport/what-is-mots-c-peptide/' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: true,
  },

  {
    slug: 'aod-9604',
    name: 'AOD-9604',
    typicalDose: 300,
    doseUnit: 'mcg',
    frequency: '1x por dia',
    shortDescription: 'Fragmento modificado do HGH. Promove lipólise sem efeitos na glicose.',
    commonAmounts: [5],
    category: 'weight-loss',
    doseRange: 'Ensaios clínicos: 1 mg/dia SC; compounding atual: 250-500 mcg/dia',
    halfLife: 'Curta (horas); administração diária',
    longDescription:
      'AOD-9604 ("Anti-Obesity Drug 9604") é um fragmento modificado do hormônio do crescimento humano, correspondente aos aminoácidos 176-191 da cadeia do hGH, com tirosina adicional no N-terminal para estabilidade. Desenvolvido nos anos 1990 pela Metabolic Pharmaceuticals (Austrália) para reproduzir o efeito lipolítico do GH sem seus efeitos anabólicos e diabetogênicos.\n\nO desenvolvimento incluiu 6 ensaios em humanos com >900 participantes. Apesar de resultados iniciais modestos (-2,6 kg vs -0,8 kg placebo em 12 semanas), o estudo de fase IIb de 24 semanas com 536 pacientes **não atingiu significância estatística** e o desenvolvimento farmacêutico foi **interrompido em 2007**. AOD-9604 não possui aprovação como medicamento em FDA, EMA ou ANVISA.\n\nAtualmente é comercializado como peptídeo para pesquisa ou em compounding para usos off-label (composição corporal, queixas articulares — evidência muito limitada). Pacientes devem saber que a indicação original falhou em fase IIb.',
    mechanism:
      'Mecanismo proposto: estimulação da lipólise e inibição da lipogênese via interação com receptores em adipócitos, ativando AMPc e receptores β3-adrenérgicos, com aumento da oxidação de gorduras. Diferentemente do hGH inteiro, AOD-9604 não ativa o receptor de GH e, portanto, não induz IGF-1 nem efeitos proliferativos significativos — esta foi justamente a racionalidade original do desenvolvimento.\n\nHá relatos pré-clínicos de efeitos condroprotetores, com possível modulação de inflamação e regeneração em cartilagem articular — essa indicação nunca foi validada em ensaios humanos controlados.',
    sideEffects: [
      'Nos ensaios originais: perfil geralmente bem tolerado — cefaleia leve, reações no local da injeção, sintomas transitórios',
      'Não foram observadas alterações significativas de IGF-1 ou glicemia nas doses testadas',
      'Dados de uso prolongado fora de ensaio são escassos',
    ],
    contraindications: [
      'Gravidez e lactação',
      'Neoplasia ativa (precaução, apesar de não haver elevação documentada de IGF-1)',
      'Hipersensibilidade',
      'Uso em menores de 18 anos',
    ],
    references: [
      { title: 'Heffernan M et al. hGH fragment lipolytic effects (2001)', url: 'https://pubmed.ncbi.nlm.nih.gov/11713213/' },
      { title: 'Ng FM et al. AOD9604 in obesity (2001)', url: 'https://pubmed.ncbi.nlm.nih.gov/11673763/' },
      { title: 'Stark R et al. Obesity pharmacotherapy review (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3584306/' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: false,
  },

  {
    slug: 'ghk-cu',
    name: 'GHK-Cu',
    typicalDose: 1,
    doseUnit: 'mg',
    frequency: '1x por dia',
    shortDescription: 'Peptídeo de cobre. Promove regeneração tecidual e tem propriedades anti-envelhecimento.',
    commonAmounts: [50, 100],
    category: 'cosmetic',
    doseRange: 'Tópico: 0,05-2% em cosméticos. Injetável: não estabelecido para uso humano',
    longDescription:
      'GHK-Cu é o complexo de cobre do tripeptídeo glicil-L-histidil-L-lisina (GHK), isolado pela primeira vez do plasma humano em 1973 por Loren Pickart. Os níveis plasmáticos de GHK declinam com a idade (de ~200 ng/mL aos 20 anos para ~80 ng/mL aos 60), motivando pesquisa sobre ações regenerativas cutâneas, cicatrizantes e moduladoras da expressão gênica.\n\nImportante distinguir aplicações: o GHK-Cu é **ingrediente cosmético amplamente utilizado e permitido** em formulações tópicas (anti-envelhecimento, pós-procedimentos, cuidados capilares), com décadas de uso seguro documentado. Já a forma **injetável** (SC/IM), popular em biohacking, **não possui aprovação regulatória** para uso humano — permanece no domínio da pesquisa, e os produtos injetáveis comercializados são rotulados "apenas para pesquisa", frequentemente de fornecedores não farmacêuticos sem garantia de pureza ou esterilidade.',
    mechanism:
      'GHK apresenta altíssima afinidade pelo cobre(II), formando complexo estável que atua como transportador fisiológico de cobre. O cobre é cofator essencial para enzimas da cicatrização (lisil oxidase, superóxido dismutase) e síntese de matriz extracelular. O complexo GHK-Cu estimula síntese de colágeno, elastina, glicosaminoglicanos e proteoglicanos por fibroblastos dérmicos.\n\nAnálises transcriptômicas mostram modulação da expressão de mais de 4.000 genes humanos — remodelamento tecidual, resposta antioxidante, sinalização anti-inflamatória (supressão de NF-κB) e reparo de DNA. Clinicamente, ensaios em úlceras diabéticas, cirurgia de Mohs e pele pós-laser CO2 documentaram aceleração de reepitelização e melhora da qualidade da cicatriz.',
    sideEffects: [
      'Tópico: perfil de segurança favorável em décadas de uso cosmético — irritação local ocasional, eritema transitório',
      'Possível dermatite de contato em sensibilizados ao cobre',
      'Injetável (uso experimental): dados humanos muito limitados; reações no local; preocupação com esterilidade de produtos de mercado cinza',
      'Teórico: risco de acúmulo de cobre em uso crônico sem monitorização',
    ],
    contraindications: [
      'Alergia conhecida ao cobre',
      'Doença de Wilson ou outros distúrbios do metabolismo do cobre',
      'Gestação e lactação (uso injetável — ausência de dados)',
      'Uso injetável fora de protocolos de pesquisa não é recomendado',
    ],
    references: [
      { title: 'Pickart L et al. GHK-Cu in tissue remodeling (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6073405/' },
      { title: 'GHK-Cu peptide and anti-aging review (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4508379/' },
      { title: 'Pickart L. GHK-Cu latest advances (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8789089/' },
      { title: 'GHK peptide as natural modulator (MDPI Cosmetics)', url: 'https://www.mdpi.com/2079-9284/5/2/29' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: false,
  },

  {
    slug: 'epithalon',
    name: 'Epithalon',
    typicalDose: 5,
    doseUnit: 'mg',
    frequency: '1x por dia por 10-20 dias',
    shortDescription: 'Tetrapeptídeo que ativa a telomerase. Potencial anti-envelhecimento.',
    commonAmounts: [10, 50],
    category: 'longevity',
    doseRange: 'Protocolos russos: 5-10 mg/dia em ciclos de 10-20 dias, 1-2x/ano',
    halfLife: 'Meia-vida plasmática muito curta (minutos); efeitos biológicos mais duradouros',
    longDescription:
      'Epithalon (também grafado Epitalon) é um tetrapeptídeo sintético de sequência Ala-Glu-Asp-Gly (AEDG), desenvolvido a partir da pesquisa do grupo de Vladimir Khavinson no Instituto de Bioregulação e Gerontologia de São Petersburgo, Rússia. Derivado do peptídeo pineal natural Epitalamina, estudado desde os anos 1980-1990 como agente geroprotetor (telomerase, ritmo circadiano, função pineal).\n\nA maior parte da literatura origina-se do grupo russo de Khavinson, incluindo estudos em cultura celular, modelos animais e coortes clínicas em idosos. Publicações como as do Bulletin of Experimental Biology and Medicine (2003) descrevem indução da telomerase e alongamento de telômeros em fibroblastos humanos. Coortes observacionais russas relataram redução de mortalidade em idosos, porém essas publicações têm limitações metodológicas e replicação independente fora da Rússia é escassa.\n\nNão há aprovação por FDA, EMA ou ANVISA. Consumidores devem entender que a evidência é promissora mas preliminar, e que a maior parte dos estudos positivos não foi replicada por grupos independentes.',
    mechanism:
      'Hipótese central: ativação da telomerase (hTERT), levando a alongamento de telômeros em células somáticas humanas, com potencial reversão parcial da senescência replicativa. Estudos mais recentes sugerem que Epithalon pode também ativar mecanismos de manutenção alternativa de telômeros (ALT).\n\nMecanismos complementares propostos: modulação da expressão de genes ligados ao eixo pineal-hipotálamo, normalização de secreção de melatonina, efeitos antioxidantes e regulação epigenética com ligação direta do peptídeo a sequências promotoras em DNA. Esses mecanismos permanecem em grande parte especulativos.',
    sideEffects: [
      'Estudos clínicos russos em idosos: boa tolerabilidade, sem eventos adversos significativos em observações de até 6-15 anos',
      'Dados ocidentais independentes são muito limitados',
      'Reações locais no sítio da injeção são possíveis',
      'Efeitos de longo prazo sobre proliferação celular (risco teórico oncológico associado à reativação de telomerase) não estão bem caracterizados',
    ],
    contraindications: [
      'Gravidez e lactação',
      'Histórico de câncer (risco teórico pela reativação de telomerase)',
      'Hipersensibilidade ao peptídeo',
      'Uso pediátrico não estudado',
    ],
    references: [
      { title: 'Khavinson VK et al. Epithalon peptide induces telomerase activity (2003)', url: 'https://pubmed.ncbi.nlm.nih.gov/12937682/' },
      { title: 'Overview of Epitalon (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11943447/' },
      { title: 'Epitalon — Wikipedia', url: 'https://en.wikipedia.org/wiki/Epitalon' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'research-only',
    wadaProhibited: false,
  },

  {
    slug: 'selank',
    name: 'Selank',
    typicalDose: 250,
    doseUnit: 'mcg',
    frequency: '1-2x por dia',
    shortDescription: 'Peptídeo ansiolítico. Reduz ansiedade e melhora função cognitiva.',
    commonAmounts: [5],
    category: 'cognitive',
    doseRange: 'Intranasal (Rússia): 250-500 mcg em cada narina, 2-3×/dia',
    halfLife: 'Plasmática muito curta (minutos); efeitos funcionais por várias horas',
    longDescription:
      'Selank é um heptapeptídeo sintético (Thr-Lys-Pro-Arg-Pro-Gly-Pro), desenvolvido no Instituto de Genética Molecular da Academia Russa de Ciências em cooperação com o Instituto V.V. Zakusov de Farmacologia. Análogo da tuftsina (fragmento da imunoglobulina G humana) com extensão C-terminal (Pro-Gly-Pro) para aumentar estabilidade metabólica. Desenhado como ansiolítico peptídico não benzodiazepínico.\n\nAprovado como medicamento na Federação Russa para transtornos de ansiedade generalizada e neurastenia. Ensaios clínicos russos descrevem eficácia ansiolítica comparável a benzodiazepínicos, porém sem sedação, tolerância ou dependência. Não há aprovação pelo FDA, EMA ou ANVISA, e a literatura peer-reviewed fora da Rússia é limitada.\n\nPacientes devem entender que, apesar do uso clínico autorizado em seu país de origem, a evidência ocidental é modesta e o perfil de segurança de longo prazo em populações ampliadas não está tão bem caracterizado quanto o de medicamentos ansiolíticos aprovados internacionalmente.',
    mechanism:
      'Mecanismo principal: modulação do sistema GABAérgico. Estudos transcriptômicos mostraram que Selank altera expressão de numerosos genes relacionados à neurotransmissão GABAérgica no córtex frontal, aparentemente modulando alostericamente o receptor GABA-A de forma distinta das benzodiazepinas (sem sedação/dependência).\n\nMecanismos secundários: modulação dos sistemas serotonérgico e dopaminérgico, inibição de enzimas que degradam encefalinas (potencializando peptídeos endógenos), efeitos imunomoduladores (herança da tuftsina) e aumento da expressão de BDNF no hipocampo.',
    sideEffects: [
      'Literatura clínica russa: tolerabilidade descrita como favorável',
      'Cefaleia leve e reações locais (uso intranasal ou injetável) relatadas',
      'Dados em humanos fora da Rússia são limitados',
      'Sem relato significativo de sedação, dependência ou síndrome de abstinência nos estudos publicados',
    ],
    contraindications: [
      'Gravidez e lactação (dados insuficientes)',
      'Hipersensibilidade ao composto',
      'Uso pediátrico fora de protocolos russos específicos não estabelecido',
    ],
    references: [
      { title: 'Volkova A et al. Selank — GABAergic neurotransmission (PMC)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4757669/' },
      { title: 'Selank review (Frontiers in Pharmacology, 2017)', url: 'https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2017.00089/full' },
      { title: 'Selank — Wikipedia', url: 'https://en.wikipedia.org/wiki/Selank' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'regional-approved',
    wadaProhibited: false,
  },

  {
    slug: 'semax',
    name: 'Semax',
    typicalDose: 200,
    doseUnit: 'mcg',
    frequency: '1-2x por dia',
    shortDescription: 'Peptídeo nootrópico. Melhora função cognitiva e neuroproteção.',
    commonAmounts: [5],
    category: 'cognitive',
    doseRange: 'Formulação russa intranasal 0,1% ou 1%: 200-2000 mcg/dia',
    halfLife: 'Plasmática muito curta (minutos); efeitos centrais por várias horas',
    longDescription:
      'Semax é um heptapeptídeo sintético (Met-Glu-His-Phe-Pro-Gly-Pro), análogo do fragmento ACTH(4-10), com modificação C-terminal (Pro-Gly-Pro) para estabilidade. Desenvolvido no final dos anos 1980 no Instituto de Genética Molecular da Academia Russa de Ciências, usado clinicamente na Rússia como nootrópico e neuroprotetor (AVC isquêmico, encefalopatia, transtornos cognitivos, distúrbios do nervo óptico).\n\nConsta da Lista Russa de Medicamentos Vitais e Essenciais (aprovado pelo governo em 07/12/2011). Apesar de extensa pesquisa clínica russa, Semax não foi avaliado, aprovado nem comercializado pela FDA, EMA ou ANVISA. A literatura peer-reviewed indexada em inglês é significativamente mais modesta que o corpo total de publicações russas.',
    mechanism:
      'Mecanismo mais bem descrito: elevação rápida da expressão de BDNF (fator neurotrófico derivado do cérebro) e de seu receptor TrkB no hipocampo — com relatos de triplicação do mRNA de BDNF em poucas horas após dose intranasal única em modelos animais. Associado a aumento de plasticidade sináptica, sobrevivência neuronal e consolidação de memória.\n\nTambém atua como agonista parcial de receptores de melanocortina (particularmente MC4R), ativando vias cAMP/PKA e MAPK/ERK, e modula sistemas dopaminérgico e serotonérgico. Inibe enzimas que degradam encefalinas endógenas, com possível efeito analgésico/antidepressivo indireto.',
    sideEffects: [
      'Literatura clínica russa: tolerabilidade favorável em uso intranasal',
      'Possível irritação nasal local, cefaleia transitória',
      'Dados de uso prolongado fora da Rússia são limitados',
      'Sem relatos significativos de dependência ou tolerância',
    ],
    contraindications: [
      'Gravidez e lactação (dados insuficientes)',
      'Transtornos psicóticos agudos / mania (precaução por ação em sistemas monoaminérgicos)',
      'Hipersensibilidade ao composto',
      'Uso pediátrico fora de protocolos russos específicos não estabelecido',
    ],
    references: [
      { title: 'Dolotov OV et al. Semax regulates BDNF and TrkB (2006)', url: 'https://pubmed.ncbi.nlm.nih.gov/16996037/' },
      { title: 'Semax — Wikipedia', url: 'https://en.wikipedia.org/wiki/Semax' },
      { title: 'Alzheimer\'s Drug Discovery Foundation — Semax Report', url: 'https://www.alzdiscovery.org/uploads/cognitive_vitality_media/Semax-Cognitive-Vitality-For-Researchers.pdf' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'regional-approved',
    wadaProhibited: false,
  },

  {
    slug: 'gonadorelina',
    name: 'Gonadorelina',
    typicalDose: 100,
    doseUnit: 'mcg',
    frequency: '2-3x por semana',
    shortDescription: 'Análogo do GnRH. Estimula a produção de LH e FSH.',
    commonAmounts: [2],
    category: 'hormone',
    doseRange: 'Diagnóstico: 100 mcg SC/IV dose única. Indução ovulatória: 5-20 mcg IV a cada 90 min. Compounding TRT: 100-300 mcg SC 2-3×/semana',
    halfLife: '2-10 min',
    longDescription:
      'Gonadorelina é a forma sintética do hormônio liberador de gonadotrofina (GnRH), decapeptídeo hipotalâmico endógeno (pGlu-His-Trp-Ser-Tyr-Gly-Leu-Arg-Pro-Gly-NH2) que estimula secreção de LH e FSH pela hipófise anterior. Historicamente aprovada pela FDA sob as marcas Factrel (gonadorelina hidrocloreto, para diagnóstico em puberdade atrasada e hipogonadismo hipogonadotrófico) e Lutrepulse (gonadorelina acetato, para indução de ovulação via bomba de infusão pulsátil).\n\nAmbas apresentações foram descontinuadas comercialmente nos EUA, embora a substância não tenha sido retirada por segurança — a retirada foi comercial e devida à complexidade do regime pulsátil. Atualmente, gonadorelina é disponibilizada via farmácias de compounding nos EUA, frequentemente associada a protocolos de TRT (terapia de reposição de testosterona) para manter função testicular endógena e fertilidade, em substituição ao hCG — uso off-label.\n\nNo Brasil, já teve uso clínico diagnóstico e para indução ovulatória; atualmente seu acesso também é tipicamente via manipulação. Diferentemente da maioria dos peptídeos "de pesquisa", gonadorelina tem histórico regulatório robusto e farmacologia bem caracterizada.',
    mechanism:
      'Liga-se ao receptor de GnRH (GnRHR) nas células gonadotróficas da hipófise anterior, ativando via Gq/fosfolipase C, com aumento de IP3 e cálcio intracelular, resultando em liberação pulsátil de LH e FSH. LH estimula células de Leydig (testículos) a produzir testosterona e células da teca (ovário) a produzir androgênios precursores; FSH estimula espermatogênese e desenvolvimento folicular.\n\nA administração **pulsátil** (imitando o padrão hipotalâmico fisiológico, ~a cada 90-120 min) é essencial para a função fisiológica — administração contínua causa dessensibilização do receptor, com supressão paradoxal do eixo, efeito explorado terapeuticamente por agonistas de longa ação (leuprolida, triptorelina). Por isso, regimes de manutenção testicular em TRT usam doses menores, SC, em frequências que buscam estimulação sem dessensibilização.',
    sideEffects: [
      'Reações no local da injeção (mais comuns): dor, eritema, edema',
      'Cefaleia, rubor, náuseas transitórias',
      'Reações de hipersensibilidade raras, incluindo anafilaxia (bula original Factrel)',
      'Formação de anticorpos anti-GnRH com uso prolongado (raro)',
      'Em doses/frequências inadequadas: supressão paradoxal (dessensibilização) do eixo',
    ],
    contraindications: [
      'Hipersensibilidade à gonadorelina ou excipientes',
      'Gravidez (exceto em protocolos específicos de indução ovulatória supervisionada)',
      'Condições hormônio-dependentes não controladas',
      'Neoplasia hipofisária não caracterizada',
    ],
    references: [
      { title: 'Gonadorelin — Wikipedia', url: 'https://en.wikipedia.org/wiki/Gonadorelin' },
      { title: 'Factrel (gonadorelin hydrochloride) — DailyMed', url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1451663c-b85a-4b45-8b27-6d572d0032f9' },
      { title: 'Gonadorelin — DrugBank', url: 'https://go.drugbank.com/drugs/DB00644' },
    ],
    lastReviewed: '2026-04-16',
    regulatoryStatus: 'discontinued',
    wadaProhibited: false,
  },
];

export function getPeptides(): Peptide[] {
  return PEPTIDES;
}

export function getPeptideBySlug(slug: string): Peptide | undefined {
  return PEPTIDES.find((p) => p.slug === slug);
}

export function getPeptideSlugs(): string[] {
  return PEPTIDES.map((p) => p.slug);
}
