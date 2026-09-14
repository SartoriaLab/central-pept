import type { FAQItem } from '@/components/ui/FAQ';
import type { Peptide } from './peptides';

/**
 * Gera um FAQ genérico baseado nos dados do peptídeo.
 * Perguntas comuns que pessoas buscam no Google sobre qualquer peptídeo.
 */
export function buildPeptideFaq(p: Peptide): FAQItem[] {
  const faqs: FAQItem[] = [];

  // 1. Dose típica
  faqs.push({
    q: `Qual a dose típica de ${p.name}?`,
    a:
      `A dose típica reportada na literatura é de ${p.typicalDose} ${p.doseUnit} por aplicação, ${p.frequency.toLowerCase()}.` +
      (p.doseRange ? ` A faixa de dose observada em estudos é ${p.doseRange}.` : '') +
      ' Doses individuais variam conforme objetivo, peso corporal e resposta clínica — sempre sob orientação profissional.',
  });

  // 2. Como calcular / reconstituir
  faqs.push({
    q: `Como calcular a dose de ${p.name} na seringa?`,
    a:
      `A quantidade de unidades depende de quanto peptídeo tem no frasco e quanta água bacteriostática foi adicionada. Use a calculadora de reconstituição com a dose de ${p.typicalDose} ${p.doseUnit} pré-preenchida para descobrir quantas unidades puxar.`,
  });

  // 3. Status regulatório
  if (p.regulatoryStatus === 'fda-approved') {
    faqs.push({
      q: `${p.name} é aprovado pelo FDA?`,
      a: `Sim, ${p.name} é aprovado pela FDA para indicações específicas documentadas em bula. Uso fora dessas indicações é off-label e não possui respaldo regulatório direto.`,
    });
  } else if (p.regulatoryStatus === 'research-only') {
    faqs.push({
      q: `${p.name} é aprovado para uso em humanos?`,
      a: `Não. ${p.name} é considerado peptídeo de pesquisa — não possui aprovação por FDA, EMA ou ANVISA para uso humano. Qualquer uso é off-label e sem respaldo regulatório.`,
    });
  } else if (p.regulatoryStatus === 'regional-approved') {
    faqs.push({
      q: `${p.name} é aprovado no Brasil?`,
      a: `${p.name} tem aprovação regulatória em outros países, mas não possui registro ativo na ANVISA. No Brasil, geralmente é acessado via farmácia de manipulação para uso off-label.`,
    });
  } else if (p.regulatoryStatus === 'discontinued') {
    faqs.push({
      q: `${p.name} ainda é vendido?`,
      a: `${p.name} teve aprovação regulatória no passado, mas foi descontinuado comercialmente. Atualmente é acessado via farmácia de manipulação, sob prescrição, para uso off-label.`,
    });
  } else if (p.regulatoryStatus === 'unapproved-warning') {
    faqs.push({
      q: `Posso comprar ${p.name} legalmente?`,
      a: `${p.name} NÃO é aprovado em nenhuma jurisdição e múltiplas agências regulatórias (MHRA, TGA, FDA) emitiram alertas contra seu uso. Produtos vendidos online não têm garantia de qualidade nem esterilidade.`,
    });
  }

  // 4. WADA
  if (p.wadaProhibited) {
    faqs.push({
      q: `${p.name} é permitido em esporte competitivo?`,
      a: `Não. ${p.name} consta na Lista Proibida da WADA (Agência Mundial Antidoping), sendo banido dentro e fora de competição. Atletas sob código WADA que forem detectados com o composto podem ser sancionados.`,
    });
  }

  // 5. Armazenamento
  faqs.push({
    q: `Como guardar ${p.name} depois de reconstituído?`,
    a: `Após reconstituído com água bacteriostática, o frasco de ${p.name} deve ser mantido na geladeira (2-8°C) e usado em até 28 dias. Nunca congele nem deixe em temperatura ambiente por mais de 24 horas.`,
  });

  // 6. Efeitos colaterais resumo
  if (p.sideEffects && p.sideEffects.length > 0) {
    faqs.push({
      q: `Quais os efeitos colaterais mais comuns de ${p.name}?`,
      a: p.sideEffects.slice(0, 4).map((s) => `• ${s}`).join('\n') + '\n\nVeja a lista completa com fontes mais acima nesta página.',
    });
  }

  if (p.slug === 'tirzepatida') {
    faqs.push({
      q: 'Quanto custa tirzepatida no Brasil?',
      a: 'Depende da forma: caneta Mounjaro (industrializada) custa na faixa de R$ 1.100-1.400 por caneta de 4 doses; frascos manipulados ou liofilizados de 10 mg ficam entre R$ 500-900. Valores de mercado em 2026, variam por região e dose.',
      link: { label: 'Ver tabela de preços por dose', href: '/blog/tirzepatida-preco-quanto-custa' },
    });
    faqs.push({
      q: 'Onde comprar tirzepatida com segurança?',
      a: 'Em farmácia com registro, em farmácia de manipulação com farmacêutico responsável ou em fornecedor que apresente certificado de análise (COA/HPLC), lote e cadeia de frio. Evite marketplaces e ofertas sem lote ou sem nota.',
      link: { label: 'Guia de procedência', href: '/blog/onde-comprar-tirzepatida' },
    });
  }

  return faqs;
}
