import { buildSearchIndex } from '@/lib/search-index';

// Índice da busca global, gerado no build. O GlobalSearch baixa este arquivo só quando
// a busca é aberta, em vez de embutir o catálogo inteiro no JavaScript de toda página.
export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildSearchIndex(), {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  });
}
