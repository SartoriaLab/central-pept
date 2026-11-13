import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Quais dados a Central Peptídeos coleta, para quê e como exercer seus direitos pela LGPD.',
  alternates: { canonical: '/privacidade' },
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-12 prose-article">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">Política de Privacidade</h1>
      <p className="text-ink-3 text-sm mb-8">Última atualização: 13 de novembro de 2026</p>

      <p>
        Este documento explica, de forma direta, quais dados a Central Peptídeos
        coleta, para que servem e quais são seus direitos pela Lei Geral de
        Proteção de Dados (Lei 13.709/2018).
      </p>

      <h2>Resumo</h2>
      <ul>
        <li>Não há cadastro nem login</li>
        <li>Os cálculos ficam no seu navegador, não em servidores nossos</li>
        <li>Medimos visitas de forma agregada, sem cookies de rastreamento</li>
        <li>Só guardamos seu email se você assinar a newsletter, e você pode sair quando quiser</li>
      </ul>

      <h2>Dados que ficam no seu navegador</h2>
      <p>
        Salvamos alguns dados localmente no seu navegador (localStorage). Eles{' '}
        <strong>não</strong> são enviados para nenhum servidor:
      </p>
      <ul>
        <li>Último estado da calculadora (peptídeo selecionado, mg, água, unidades)</li>
        <li>Peptídeos personalizados que você adicionou</li>
        <li>Preferência de tema (claro/escuro)</li>
      </ul>
      <p>
        Você pode apagar esses dados a qualquer momento nas configurações do
        navegador (Limpar dados de navegação → Dados de sites).
      </p>

      <h2>Métricas de uso</h2>
      <p>
        Para saber quais páginas e ferramentas são mais usadas, usamos{' '}
        <strong>Vercel Web Analytics</strong> e, quando ativado,{' '}
        <strong>Plausible Analytics</strong>. As duas ferramentas:
      </p>
      <ul>
        <li>Não usam cookies</li>
        <li>Não identificam você nem seguem você entre sites</li>
        <li>Registram dados agregados: página visitada, site de origem, país, tipo de dispositivo e navegador</li>
      </ul>
      <p>
        Alguns cliques (por exemplo, “calcular”, “imprimir” ou “baixar .ics”)
        são contados como eventos, apenas com o nome do peptídeo ou da
        ferramenta — nunca com doses, valores digitados ou dados de saúde.
      </p>

      <h2>Newsletter</h2>
      <p>
        Se você assinar a newsletter, guardamos seu <strong>email</strong>, a
        data e a página em que você assinou e o registro do seu consentimento.
        Usamos esse email só para enviar novos artigos e atualizações do site.
      </p>
      <ul>
        <li>Base legal: seu consentimento (art. 7º, I, da LGPD)</li>
        <li>Cada email traz um link de descadastro; ao usá-lo, seu endereço é apagado</li>
        <li>Não vendemos nem compartilhamos a lista com terceiros</li>
        <li>Os dados ficam em um banco de dados hospedado em provedor de nuvem contratado pelo site</li>
      </ul>

      <h2>O que não fazemos</h2>
      <ul>
        <li>Não vendemos dados</li>
        <li>Não instalamos pixels de anúncio (Facebook, Google Ads, TikTok)</li>
        <li>Não pedimos nome, CPF, endereço ou telefone</li>
      </ul>

      <h2>Hospedagem</h2>
      <p>
        O site é hospedado na Vercel, que processa dados técnicos de cada acesso
        (como endereço IP) para entregar as páginas e proteger contra abuso.
      </p>

      <h2>Links externos</h2>
      <p>
        O site aponta para fontes primárias (FDA, PubMed, WADA, fabricantes).
        Esses sites têm políticas de privacidade próprias.
      </p>

      <h2>Menores de idade</h2>
      <p>
        O site não é direcionado a menores de 18 anos.
      </p>

      <h2>Seus direitos</h2>
      <p>
        Você pode pedir confirmação, acesso, correção ou exclusão dos seus dados,
        ou revogar o consentimento, escrevendo para{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>Alterações nesta política</h2>
      <p>
        Mudanças são refletidas na data no topo desta página. Mudanças relevantes
        também serão avisadas a quem assina a newsletter.
      </p>

      <p>
        Veja também os <Link href="/termos">termos de uso</Link> e a{' '}
        <Link href="/contato">página de contato</Link>.
      </p>
    </div>
  );
}
