/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Empacotado pelo Next para usar o mesmo React do App Router; carregado direto de
  // node_modules ele criaria elementos com outra cópia do React e o build quebra.
  transpilePackages: ['next-mdx-remote'],
  async redirects() {
    return [
      // Ebooks foram descontinuados: endereços antigos voltam para a home.
      { source: '/ebook/:slug*', destination: '/', permanent: true },
      { source: '/obrigado', destination: '/', permanent: true },
      // Antigo redirect de afiliado (desativado): links em cache caem na home.
      { source: '/api/click', destination: '/', permanent: false },
      // /peptideos/categoria sem slug cairia na rota de ficha ([slug]) e daria 404.
      { source: '/peptideos/categoria', destination: '/peptideos', permanent: false },
      // Grafia em português: "retatrutide" virou "retatrutida" nas URLs.
      { source: '/peptideos/retatrutide', destination: '/peptideos/retatrutida', permanent: true },
      { source: '/ferramentas/reconstituicao/retatrutide', destination: '/ferramentas/reconstituicao/retatrutida', permanent: true },
      { source: '/comparar/tirzepatida-vs-retatrutide', destination: '/comparar/tirzepatida-vs-retatrutida', permanent: true },
      { source: '/comparar/semaglutida-vs-retatrutide', destination: '/comparar/semaglutida-vs-retatrutida', permanent: true },
      { source: '/comparar/semaglutida-vs-tirzepatida-vs-retatrutide', destination: '/comparar/semaglutida-vs-tirzepatida-vs-retatrutida', permanent: true },
    ];
  },
};

export default nextConfig;
