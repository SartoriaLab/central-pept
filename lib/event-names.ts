// Nomes dos eventos de métrica. Ficam aqui (sem dependências) para lib/track.ts e
// lib/site-events.ts importarem sem ciclo.

export const EVENTS = {
  reconstitution: 'Calculo Reconstituicao',
  cost: 'Calculo Custo GLP1',
  icsDownload: 'Download ICS',
  print: 'Imprimir',
  copyResult: 'Copiar Resultado',
  share: 'Compartilhar Calculo',
  embedCopy: 'Embed Copiado',
  newsletterSignup: 'Newsletter Inscricao',
  // Funil dos ebooks: props { ebook: id do ebook, posicao: card | line | result | barra | landing-*,
  // pagina: caminho da página onde a oferta apareceu }
  ebookView: 'Ebook Visto',
  ebookClick: 'Ebook Clique',
  ebookCheckout: 'Ebook Checkout',
  // Visita à landing (props { ebook, origem }) e clique no pacote dentro da landing de um guia.
  ebookLanding: 'Ebook Landing',
  ebookKitClick: 'Ebook Kit Clique',
  // Pop-up de saída (props { ebook, pagina }).
  ebookPopupView: 'Ebook Popup Visto',
  ebookPopupClick: 'Ebook Popup Clique',
  // Resultado enviado pelo WhatsApp a partir de uma calculadora (props { ferramenta }).
  whatsapp: 'Enviar WhatsApp',
  // Convite de instalação da PWA (props { so: ios | android | desktop }; no clique, { resultado }).
  installView: 'Instalar Visto',
  installClick: 'Instalar Clique',
  installed: 'App Instalado',
  // iPhone: tocou em "Mostrar onde tocar" na janela do passo a passo (props { so, guia }).
  installGuide: 'Instalar Guia',
  // Site aberto pelo ícone da tela inicial (uma vez por sessão): mede quem volta pelo app.
  pwaOpen: 'PWA Aberta',
} as const;
