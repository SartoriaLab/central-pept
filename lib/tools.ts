// Registro único das ferramentas (/ferramentas/<slug>). Home, /ferramentas, busca global,
// sitemap e imagens de compartilhamento leem daqui: ferramenta nova = uma entrada aqui,
// a página em app/ferramentas/<slug>/page.tsx e o ícone em components/ui/ToolIcon.tsx.

export type Tool = {
  slug: string;
  /** Título completo (/ferramentas e busca). */
  title: string;
  /** Título curto (cards da home). */
  shortTitle: string;
  /** Descrição longa (/ferramentas). */
  desc: string;
  /** Uma linha (home e busca). */
  shortDesc: string;
  /** Imagem de compartilhamento: título e rótulo. */
  og: { title: string; eyebrow: string };
  /** Prioridade no sitemap. */
  priority: number;
};

export const TOOLS: Tool[] = [
  {
    slug: 'reconstituicao',
    title: 'Reconstituição',
    shortTitle: 'Reconstituição',
    desc: 'Descubra quanta água adicionar, a concentração resultante, unidades na seringa e quantas doses cabem no frasco. Resultado em tempo real.',
    shortDesc: 'Quantas unidades puxar na seringa, em tempo real.',
    og: { title: 'Calculadora de reconstituição: quantas unidades puxar na seringa', eyebrow: 'Calculadora' },
    priority: 0.95,
  },
  {
    slug: 'mistura',
    title: 'Mistura',
    shortTitle: 'Mistura',
    desc: 'Combine 2 a 4 peptídeos em um único frasco e veja a dose exata de cada um entregue numa seringa compartilhada.',
    shortDesc: 'Combine peptídeos num mesmo frasco e veja a dose de cada um.',
    og: { title: 'Calculadora de mistura de peptídeos na mesma seringa', eyebrow: 'Calculadora' },
    priority: 0.8,
  },
  {
    slug: 'conversor',
    title: 'Conversor mg ↔ mcg ↔ UI',
    shortTitle: 'Conversor',
    desc: 'Converta entre miligramas, microgramas e unidades internacionais. Mostra a quantidade como múltiplo da dose típica.',
    shortDesc: 'mg ↔ mcg ↔ UI por peptídeo, com multiplicador de dose.',
    og: { title: 'Conversor mg, mcg e UI para peptídeos', eyebrow: 'Calculadora' },
    priority: 0.8,
  },
  {
    slug: 'titulacao',
    title: 'Subida de Dose — Ozempic e Mounjaro',
    shortTitle: 'Subida de Dose GLP-1',
    desc: 'Calendário de escalonamento de semaglutida (Ozempic, Wegovy, Rybelsus), tirzepatida (Mounjaro, Zepbound) e liraglutida (Saxenda, Victoza). Com datas e export .ics.',
    shortDesc: 'Escalonamento de Ozempic, Wegovy, Mounjaro, Zepbound, Saxenda e Rybelsus.',
    og: { title: 'Subida de dose: Ozempic, Wegovy e Mounjaro semana a semana', eyebrow: 'Calculadora' },
    priority: 0.85,
  },
  {
    slug: 'cronograma',
    title: 'Cronograma de Doses',
    shortTitle: 'Cronograma',
    desc: 'Planeje um ciclo de aplicações e baixe como arquivo .ics para importar no Google Calendar, Apple Calendar ou Outlook.',
    shortDesc: 'Monte o calendário de doses e exporte .ics pro Google Calendar.',
    og: { title: 'Cronograma de doses de peptídeos', eyebrow: 'Calculadora' },
    priority: 0.8,
  },
  {
    slug: 'custo-glp1',
    title: 'Custo por Dose — Mounjaro, Ozempic e tirzepatida',
    shortTitle: 'Custo de GLP-1',
    desc: 'Informe o preço pago e os mg da embalagem: custo por mg, por aplicação, por mês e por ano, já contando a perda do frasco após 28 dias.',
    shortDesc: 'Quanto sai por dose, por mês e por mg em cada apresentação.',
    og: { title: 'Custo por dose e por mês: Mounjaro, Ozempic e tirzepatida', eyebrow: 'Calculadora' },
    priority: 0.85,
  },
  {
    slug: 'duracao-frasco',
    title: 'Duração do Frasco — quantos frascos preciso',
    shortTitle: 'Duração do frasco',
    desc: 'Quantos dias dura um frasco, quantos frascos o ciclo pede e quanto se perde pela validade de 28 dias depois de reconstituído.',
    shortDesc: 'Quantos dias o frasco dura e quantos o ciclo pede.',
    og: { title: 'Quanto tempo dura o frasco e quantos frascos preciso', eyebrow: 'Calculadora' },
    priority: 0.8,
  },
  {
    slug: 'diario',
    title: 'Diário de Aplicações com rodízio de locais',
    shortTitle: 'Diário de aplicações',
    desc: 'Registre cada aplicação, veja qual local usar na próxima pelo rodízio e exporte o histórico em CSV ou a próxima dose para a agenda. Fica só no seu navegador.',
    shortDesc: 'Anote as aplicações e veja o próximo local do rodízio.',
    og: { title: 'Diário de aplicações com rodízio de locais', eyebrow: 'Ferramenta' },
    priority: 0.75,
  },
  {
    slug: 'tabela-doses-glp1',
    title: 'Tabela de Doses GLP-1 para imprimir',
    shortTitle: 'Tabela de Doses GLP-1',
    desc: 'Escada de titulação de tirzepatida, semaglutida e retatrutida e unidades na seringa por frasco, em uma página pronta para impressão.',
    shortDesc: 'Tabela imprimível com escalas, unidades por frasco e diário de aplicação.',
    og: { title: 'Tabela de doses de Mounjaro, Ozempic e Wegovy para imprimir', eyebrow: 'Tabela' },
    priority: 0.85,
  },
];
