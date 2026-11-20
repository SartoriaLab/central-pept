/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Empacotado pelo Next para usar o mesmo React do App Router; carregado direto de
  // node_modules ele criaria elementos com outra cópia do React e o build quebra.
  transpilePackages: ['next-mdx-remote'],
  async headers() {
    const base = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    return [
      { source: '/:path*', headers: base },
      // Só /embed/* pode abrir em iframe de outro site (é para isso que existe). O resto do site
      // dentro de um iframe alheio serviria para clickjacking nos botões de compra.
      { source: '/((?!embed/).*)', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] },
    ];
  },
  async rewrites() {
    return [
      // Navegadores e iPhones pedem estes endereços fixos sem olhar o <link rel="icon"> da página
      // (davam ~1.300 respostas 404 por semana). Os ícones de verdade saem de app/icone.
      { source: '/favicon.ico', destination: '/icone/32' },
      { source: '/apple-touch-icon.png', destination: '/icone/180' },
      { source: '/apple-touch-icon-precomposed.png', destination: '/icone/180' },
    ];
  },
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
      // URLs que davam 404 e ainda aparecem no Search Console.
      { source: '/tirzepatida-preco-quanto-custa', destination: '/blog/tirzepatida-preco-quanto-custa', permanent: true },
      { source: '/blog/retatrutida', destination: '/blog/retatrutida-o-que-e', permanent: true },
    ];
  },
};

export default nextConfig;
