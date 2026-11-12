import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade da Central Peptídeos.',
  alternates: { canonical: '/privacidade' },
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 prose-article">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">Política de Privacidade</h1>
      <p className="text-ink-3 text-sm mb-8">Última atualização: 16 de abril de 2026</p>

      <p>
        A Central Peptídeos leva privacidade a sério. Este documento explica, de forma
        direta, quais dados coletamos, como são usados e quais são seus direitos.
      </p>

      <h2>Resumo em 30 segundos</h2>
      <ul>
        <li>Não pedimos cadastro nem login</li>
        <li>Não coletamos seu nome, email, CPF, endereço ou qualquer dado pessoal identificável</li>
        <li>Os cálculos e preferências ficam salvos no seu navegador (localStorage), não em servidores nossos</li>
        <li>Usamos analytics opcional e respeitador de privacidade (sem cookies de rastreamento)</li>
      </ul>

      <h2>Dados que ficam no seu navegador</h2>
      <p>
        Para melhorar sua experiência, salvamos alguns dados localmente no seu
        navegador (localStorage). Eles <strong>não</strong> são enviados para nenhum
        servidor:
      </p>
      <ul>
        <li>Último estado da calculadora (peptídeo selecionado, mg, água, unidades)</li>
        <li>Peptídeos personalizados que você adicionou</li>
        <li>Preferência de tema (claro/escuro)</li>
      </ul>
      <p>
        Você pode limpar esses dados a qualquer momento nas configurações do seu
        navegador (Limpar dados de navegação → Dados de sites).
      </p>

      <h2>Analytics (uso agregado)</h2>
      <p>
        Para entender quais peptídeos e ferramentas são mais usados, podemos usar
        uma solução de analytics que respeita privacidade (como Plausible ou Umami).
        Essas ferramentas:
      </p>
      <ul>
        <li>Não usam cookies</li>
        <li>Não rastreiam indivíduos entre sessões</li>
        <li>Agregam dados de forma anônima (país, tipo de dispositivo, página visitada)</li>
        <li>Não compartilham dados com terceiros</li>
      </ul>

      <h2>O que não fazemos</h2>
      <ul>
        <li>Não vendemos dados — não temos dados a vender</li>
        <li>Não instalamos pixels de rastreamento (Facebook, Google Ads)</li>
        <li>Não compartilhamos informações com redes sociais</li>
        <li>Não enviamos emails de marketing</li>
      </ul>

      <h2>Links externos</h2>
      <p>
        O site contém links para fontes primárias (FDA, PubMed, WADA, fabricantes).
        Não somos responsáveis pela política de privacidade desses sites — consulte
        individualmente.
      </p>

      <h2>Menores de idade</h2>
      <p>
        O site não é direcionado a menores de 18 anos. Peptídeos são produtos para
        uso adulto sob orientação profissional.
      </p>

      <h2>Alterações nesta política</h2>
      <p>
        Atualizações serão refletidas na data acima. Por ser site estático sem
        conta de usuário, não temos como notificar mudanças — recomendamos revisar
        esta página periodicamente se o tema interessa.
      </p>

      <h2>Contato</h2>
      <p>
        Dúvidas sobre privacidade? Veja a <a href="/contato">página de contato</a>.
      </p>
    </div>
  );
}
