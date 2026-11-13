import { SITE_HOST } from '@/lib/site';
import { ImageResponse } from 'next/og';
import { getArticleBySlug, getArticleSlugs } from '@/lib/articles';
import { getComparison, getComparisonSlugs } from '@/lib/comparisons';
import { getPeptideBySlug, getPeptideSlugs } from '@/lib/peptides';
import { getBrand, getBrandSlugs } from '@/lib/brands';
import { getCategoryPage, getCategoryPageSlugs } from '@/lib/categories';
import { getGlossarySlugs, getGlossaryTerm } from '@/lib/glossary';
import { OG_PAGES } from '@/lib/og';

// Imagens OG geradas no build (uma por artigo/comparativo). Nada é renderizado
// em runtime: slug fora da lista → 404, sem invocar função.
export const dynamic = 'force-static';
export const dynamicParams = false;

const size = { width: 1200, height: 630 };

type Params = { kind: string; slug: string };

export function generateStaticParams(): Params[] {
  return [
    ...getArticleSlugs().map((slug) => ({ kind: 'blog', slug })),
    ...getComparisonSlugs().map((slug) => ({ kind: 'comparar', slug })),
    ...getPeptideSlugs().map((slug) => ({ kind: 'calculadora', slug })),
    ...getBrandSlugs().map((slug) => ({ kind: 'medicamentos', slug })),
    ...getCategoryPageSlugs().map((slug) => ({ kind: 'categoria', slug })),
    ...getGlossarySlugs().map((slug) => ({ kind: 'glossario', slug })),
    ...Object.keys(OG_PAGES).map((slug) => ({ kind: 'pagina', slug })),
  ];
}

function resolve(kind: string, slug: string): { title: string; eyebrow: string } | null {
  if (kind === 'calculadora') {
    const p = getPeptideBySlug(slug);
    return p ? { title: `Calculadora de ${p.name}: quantas unidades puxar na seringa`, eyebrow: 'Calculadora' } : null;
  }
  if (kind === 'medicamentos') {
    const b = getBrand(slug);
    return b ? { title: `${b.name} (${b.activeIngredient.toLowerCase()}): o que é, doses e para que serve`, eyebrow: 'Medicamento' } : null;
  }
  if (kind === 'categoria') {
    const c = getCategoryPage(slug);
    return c ? { title: c.title, eyebrow: 'Peptídeos por objetivo' } : null;
  }
  if (kind === 'glossario') {
    const t = getGlossaryTerm(slug);
    return t ? { title: `${t.term}: o que é e para que serve`, eyebrow: 'Glossário' } : null;
  }
  if (kind === 'pagina') return OG_PAGES[slug] ?? null;
  if (kind === 'blog') {
    const a = getArticleBySlug(slug);
    return a ? { title: a.title, eyebrow: a.tags[0] ?? 'Blog' } : null;
  }
  if (kind === 'comparar') {
    const c = getComparison(slug);
    return c ? { title: c.title, eyebrow: 'Comparativo' } : null;
  }
  return null;
}

// GET /og/blog/<slug> e /og/comparar/<slug>
// Imagem 1200x630 para OpenGraph/Twitter.
export async function GET(_req: Request, { params }: { params: Promise<Params> }) {
  const { kind, slug } = await params;
  const data = resolve(kind, slug);
  if (!data) return new Response('Not found', { status: 404 });

  const title = data.title.slice(0, 140);
  const eyebrow = data.eyebrow.slice(0, 40);
  const accent = '#0d9488';

  const titleSize = title.length > 78 ? 58 : title.length > 48 ? 68 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          padding: 60,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header: logo + eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 22, fontWeight: 800,
            }}>
              CP
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Central Peptídeos</div>
              <div style={{ fontSize: 15, color: '#64748b' }}>{SITE_HOST}</div>
            </div>
          </div>
          {eyebrow && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 16px', borderRadius: 999,
              background: '#f8fafc', border: '1px solid #e2e8f0',
              fontSize: 18, fontWeight: 700, color: '#475569',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: accent }} />
              {eyebrow}
            </div>
          )}
        </div>

        {/* Main: título */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 64, flex: 1, justifyContent: 'center' }}>
          <div style={{
            fontSize: titleSize, fontWeight: 800, color: '#0f172a',
            letterSpacing: -1.5, lineHeight: 1.08, maxWidth: 1040, display: 'flex',
          }}>
            {title}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 22, color: '#64748b', display: 'flex' }}>
            Calculadoras · Enciclopédia · Guias
          </div>
        </div>

        {/* Barra colorida no rodapé */}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: 12, background: accent,
        }} />
      </div>
    ),
    size
  );
}
