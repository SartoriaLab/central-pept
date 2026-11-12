// URL canônica do site, compartilhada por metadata, sitemap e JSON-LD.
export const SITE_URL = process.env.SITE_URL || 'https://centralpeptideos.com.br';

/**
 * Data da última mudança editorial em páginas sem data própria (ferramentas, índices,
 * comparativos, glossário). Atualize ao mexer no conteúdo dessas páginas: o sitemap usa
 * este valor em <lastmod>, e uma data que muda a cada build faz o Google ignorar o campo.
 */
export const CONTENT_UPDATED_AT = '2026-11-12';
