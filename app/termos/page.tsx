import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso da Central Peptídeos.',
  alternates: { canonical: '/termos' },
};

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 prose-article">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">Termos de Uso</h1>
      <p className="text-ink-3 text-sm mb-8">Última atualização: 16 de abril de 2026</p>

      <div className="not-prose p-5 rounded-xl bg-amber-50 border-2 border-amber-200 mb-8 text-amber-900 leading-relaxed">
        <strong>Aviso crítico:</strong> o conteúdo deste site é exclusivamente
        informativo. <strong>Não constitui aconselhamento médico, farmacêutico,
        diagnóstico ou prescrição</strong>. Peptídeos são compostos farmacologicamente
        ativos e seu uso inadequado pode causar dano à saúde.
      </div>

      <h2>1. Natureza do serviço</h2>
      <p>
        A Central Peptídeos é uma central de <strong>informação educativa</strong>{' '}
        sobre peptídeos, oferecendo calculadoras auxiliares e fichas técnicas
        baseadas em literatura científica pública.
      </p>

      <h2>2. Uso por sua conta e risco</h2>
      <p>
        Ao usar este site você concorda que:
      </p>
      <ul>
        <li>As informações aqui <strong>não substituem</strong> consulta médica</li>
        <li>Os cálculos são ferramentas auxiliares — <strong>você é responsável</strong> por verificar os valores antes de qualquer aplicação</li>
        <li>Os autores e mantenedores do site <strong>não se responsabilizam</strong> por consequências do uso de qualquer peptídeo mencionado</li>
        <li>Peptídeos mencionados podem ter status regulatório variável — alguns não são aprovados para uso humano</li>
      </ul>

      <h2>3. Não prescrevemos, não vendemos, não indicamos</h2>
      <p>
        O site não comercializa peptídeos, não indica fornecedores e não presta
        serviço clínico. Qualquer decisão terapêutica deve ser tomada com profissional
        de saúde habilitado (médico, farmacêutico).
      </p>

      <h2>4. Propriedade intelectual</h2>
      <p>
        O código-fonte do site é aberto. O conteúdo editorial (artigos, fichas) pode
        ser citado com atribuição, mas não reproduzido integralmente sem
        consentimento. Referências científicas linkadas pertencem aos seus
        respectivos autores e publicações.
      </p>

      <h2>5. Limitação de responsabilidade</h2>
      <p>
        Fazemos esforço razoável para manter as informações precisas e atualizadas,
        mas:
      </p>
      <ul>
        <li>Não garantimos precisão, completude ou atualização permanente</li>
        <li>Dados médicos evoluem — informações podem ficar desatualizadas</li>
        <li>Não somos responsáveis por decisões tomadas com base em informações deste site</li>
      </ul>

      <h2>6. Conteúdo regulatório</h2>
      <p>
        Quando informamos status regulatório (aprovado FDA, proibido WADA, etc.) é
        baseado em fontes citadas. Regulamentação pode mudar — verifique
        diretamente nas agências relevantes para o seu país.
      </p>

      <h2>7. Alterações</h2>
      <p>
        Podemos alterar estes termos sem aviso prévio. Uso continuado do site após
        alterações implica aceitação.
      </p>

      <h2>8. Jurisdição</h2>
      <p>
        Estes termos são regidos pela legislação brasileira.
      </p>

      <h2>9. Contato</h2>
      <p>
        Para correções, sugestões ou questões legais, veja a{' '}
        <Link href="/contato">página de contato</Link>.
      </p>
    </div>
  );
}
