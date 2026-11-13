// Compartilhado entre o formulário (cliente) e a API: o texto aceito é gravado junto
// com o email como prova do consentimento.
export const NEWSLETTER_CONSENT =
  'Aceito receber por email novos artigos e atualizações da Central Peptídeos. Posso cancelar a qualquer momento.';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}
