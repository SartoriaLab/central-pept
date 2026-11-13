import { SITE_URL } from '@/lib/site';

export const BASE_URL = SITE_URL;

export const PATHS = [
  { label: 'Reconstituição', value: '/ferramentas/reconstituicao' },
  { label: 'Titulação GLP-1', value: '/ferramentas/titulacao' },
  { label: 'Comparar peptídeos', value: '/comparar' },
  { label: 'Home', value: '/' },
  { label: 'Blog — Armazenamento', value: '/blog/como-guardar-ozempic-wegovy' },
  { label: 'Blog — Sema vs Tirze', value: '/blog/semaglutida-vs-tirzepatida' },
] as const;

export const SOURCES: { value: string; medium: string; label: string }[] = [
  { value: 'whatsapp', medium: 'grupo', label: 'WhatsApp' },
  { value: 'reddit', medium: 'comentario', label: 'Reddit' },
  { value: 'telegram', medium: 'grupo', label: 'Telegram' },
  { value: 'telegram-pago', medium: 'parceria', label: 'Telegram (pago)' },
  { value: 'tiktok', medium: 'video', label: 'TikTok' },
  { value: 'instagram', medium: 'bio', label: 'Instagram' },
  { value: 'facebook', medium: 'grupo', label: 'Facebook' },
  { value: 'forum', medium: 'post', label: 'Fórum' },
];

export interface UtmParams {
  path: string;
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
}

export function buildUtmUrl(params: UtmParams): string {
  const { path, source, medium, campaign = 'divulgacao', content } = params;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const qs = new URLSearchParams();
  if (source) qs.set('utm_source', source);
  if (medium) qs.set('utm_medium', medium);
  if (campaign) qs.set('utm_campaign', campaign);
  if (content?.trim()) qs.set('utm_content', content.trim());
  const queryString = qs.toString();
  return `${BASE_URL}${cleanPath}${queryString ? `?${queryString}` : ''}`;
}

export function defaultMediumForSource(source: string): string {
  return SOURCES.find((s) => s.value === source)?.medium ?? 'link';
}
