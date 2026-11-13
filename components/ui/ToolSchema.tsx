import { SITE_URL as SITE } from '@/lib/site';

type Props = {
  name: string;
  description: string;
  path: string; // ex.: '/ferramentas/mistura'
};

// JSON-LD WebApplication para as calculadoras — sinaliza ao Google que a página
// é uma ferramenta interativa gratuita (elegível a rich results de app).
export default function ToolSchema({ name, description, path }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: `${SITE}${path}`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript',
    inLanguage: 'pt-BR',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
    publisher: { '@type': 'Organization', name: 'Central Peptídeos', url: SITE },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
