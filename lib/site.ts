// URL canônica do site, compartilhada por metadata, sitemap e JSON-LD.
export const SITE_URL = process.env.SITE_URL || 'https://centralpeptideos.com.br';

export const SITE_NAME = 'Central Peptídeos';

// Caixa de entrada usada em /contato, /privacidade e /metodologia.
export const CONTACT_EMAIL = 'contato@centralpeptideos.com.br';

/**
 * Data da última mudança editorial em páginas sem data própria (ferramentas, índices,
 * comparativos, glossário). Atualize ao mexer no conteúdo dessas páginas: o sitemap usa
 * este valor em <lastmod>, e uma data que muda a cada build faz o Google ignorar o campo.
 */
export const CONTENT_UPDATED_AT = '2026-11-12';

// Domínio sem protocolo, para textos e imagens de compartilhamento ("centralpeptideos.com.br").
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
