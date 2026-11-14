// Catálogo de ebooks (lib/ebooks.ts): slugs únicos, referências que existem e uma única
// oferta resolvida para cada página do site.
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  EBOOKS,
  NO_EBOOK_PEPTIDES,
  checkoutUrl,
  ebookForCategory,
  ebookForComparison,
  ebookForPeptide,
  ebookForPost,
  ebookForSection,
  ebookForTool,
  getActiveEbooks,
  getEbookById,
  kitFullPrice,
  offerFor,
  toOffer,
} from '@/lib/ebooks';
import { getPeptides } from '@/lib/peptides';
import { getArticles } from '@/lib/articles';
import { TOOLS } from '@/lib/tools';
import { getCategoryPages } from '@/lib/categories';
import { COMPARISONS } from '@/lib/comparisons';
import { getBrands } from '@/lib/brands';

const dupes = (list: string[]) => list.filter((s, i) => list.indexOf(s) !== i);

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('catálogo', () => {
  it('ids, slugs e variáveis de checkout únicos', () => {
    expect(dupes(EBOOKS.map((e) => e.id))).toEqual([]);
    expect(dupes(EBOOKS.map((e) => e.slug))).toEqual([]);
    expect(dupes(EBOOKS.map((e) => e.checkoutEnv))).toEqual([]);
  });

  it('cada ebook tem conteúdo de landing completo', () => {
    for (const e of EBOOKS) {
      expect(e.slug, e.id).toMatch(/^[a-z0-9-]+$/);
      expect(e.checkoutEnv, e.id).toMatch(/^KIWIFY_CHECKOUT_[A-Z0-9_]+$/);
      expect(e.price, e.id).toBeGreaterThan(0);
      expect(e.pages, e.id).toBeGreaterThan(0);
      expect(e.forWho.length, e.id).toBeGreaterThanOrEqual(3);
      expect(e.notFor.length, e.id).toBeGreaterThan(0);
      expect(e.toc.length, e.id).toBeGreaterThanOrEqual(3);
      expect(e.sources.length, e.id).toBeGreaterThan(0);
    }
  });

  it('bumps e kits apontam para ebooks que existem', () => {
    for (const e of EBOOKS) {
      for (const id of [...(e.bumps ?? []), ...(e.includes ?? [])]) {
        expect(getEbookById(id), `${e.id} → ${id}`).toBeDefined();
        expect(id, `${e.id} não pode ofertar a si mesmo`).not.toBe(e.id);
      }
    }
  });

  it('kit custa menos que a soma real dos guias', () => {
    for (const e of EBOOKS.filter((x) => x.kind === 'kit')) {
      expect(kitFullPrice(e), e.id).toBeGreaterThan(e.price);
    }
  });
});

describe('referências', () => {
  const peptides = new Set(getPeptides().map((p) => p.slug));
  const posts = new Set(getArticles().map((a) => a.slug));
  const tools = new Set(TOOLS.map((t) => t.slug));
  const categories = new Set(getCategoryPages().map((c) => c.slug));

  it.each(EBOOKS.map((e) => [e.id, e] as const))('%s', (_id, e) => {
    for (const s of e.places.peptides ?? []) expect(peptides.has(s), `${e.id} → peptídeo ${s}`).toBe(true);
    for (const s of e.places.posts ?? []) expect(posts.has(s), `${e.id} → post ${s}`).toBe(true);
    for (const s of e.places.tools ?? []) expect(tools.has(s), `${e.id} → ferramenta ${s}`).toBe(true);
    for (const s of e.places.categories ?? []) expect(categories.has(s), `${e.id} → categoria ${s}`).toBe(true);
    for (const s of e.places.sections ?? []) expect(['seringas', 'glossario'], `${e.id} → seção ${s}`).toContain(s);
  });

  it('nenhuma página é disputada por dois ebooks', () => {
    for (const key of ['peptides', 'posts', 'tools', 'categories', 'sections'] as const) {
      expect(dupes(EBOOKS.flatMap((e) => e.places[key] ?? [])), key).toEqual([]);
    }
  });
});

describe('uma oferta por página', () => {
  it('todo peptídeo tem ebook, menos os sem oferta', () => {
    for (const p of getPeptides()) {
      if (NO_EBOOK_PEPTIDES.includes(p.slug)) expect(ebookForPeptide(p.slug), p.slug).toBeUndefined();
      else expect(ebookForPeptide(p.slug), p.slug).toBeDefined();
    }
  });

  it('todo post tem ebook, menos os de peptídeo sem oferta', () => {
    for (const a of getArticles()) {
      const e = ebookForPost(a.slug, a.relatedPeptides);
      if (NO_EBOOK_PEPTIDES.includes(a.relatedPeptides?.[0] ?? '')) expect(e, a.slug).toBeUndefined();
      else expect(e, a.slug).toBeDefined();
    }
  });

  it('ferramentas, categorias, marcas, comparativos e seções', () => {
    // Titulação escolhe o ebook pelo peptídeo do esquema selecionado.
    for (const t of TOOLS.filter((x) => x.slug !== 'titulacao')) expect(ebookForTool(t.slug), t.slug).toBeDefined();
    for (const c of getCategoryPages()) expect(ebookForCategory(c.slug), c.slug).toBeDefined();
    for (const b of getBrands()) expect(ebookForPeptide(b.peptideSlug), b.slug).toBeDefined();
    for (const c of COMPARISONS) expect(ebookForComparison(c.peptideSlugs), c.slug).toBeDefined();
    for (const s of ['seringas', 'glossario']) expect(ebookForSection(s), s).toBeDefined();
  });

  it('exemplos do plano', () => {
    expect(ebookForPeptide('tirzepatida')?.id).toBe('I2');
    expect(ebookForPeptide('sermorelina')?.id).toBe('C1');
    expect(ebookForPost('semaglutida-vs-tirzepatida', ['semaglutida', 'tirzepatida'])?.id).toBe('I2');
    expect(ebookForPost('como-reconstituir-tirzepatida', ['tirzepatida'])?.id).toBe('T1');
    expect(ebookForPost('melanotan-2-riscos', ['melanotan-ii', 'pt-141'])).toBeUndefined();
    expect(ebookForTool('custo-glp1')?.id).toBe('T2');
    expect(ebookForCategory('emagrecimento')?.id).toBe('KIT');
  });
});

describe('checkout', () => {
  const tirz = getEbookById('I2')!;

  it('sem variável de ambiente o ebook fica oculto', () => {
    vi.stubEnv(tirz.checkoutEnv, '');
    expect(checkoutUrl(tirz)).toBeUndefined();
    expect(toOffer(tirz)).toBeNull();
    expect(getActiveEbooks().map((e) => e.id)).not.toContain('I2');
  });

  it('só aceita https', () => {
    vi.stubEnv(tirz.checkoutEnv, 'http://pay.kiwify.com.br/x');
    expect(checkoutUrl(tirz)).toBeUndefined();
  });

  it('com checkout configurado vira oferta', () => {
    vi.stubEnv(tirz.checkoutEnv, 'https://pay.kiwify.com.br/teste');
    const offer = toOffer(tirz);
    expect(offer?.slug).toBe(tirz.slug);
    expect(offer?.priceLabel).toMatch(/^R\$\s?29,90$/);
    expect(offer?.bullets).toHaveLength(3);
    expect(getActiveEbooks().map((e) => e.id)).toContain('I2');
  });
});

describe('reserva quando o guia não está à venda', () => {
  const stub = (ids: string[]) => {
    for (const e of EBOOKS) vi.stubEnv(e.checkoutEnv, ids.includes(e.id) ? 'https://pay.kiwify.com.br/teste' : '');
  };

  it('guia inativo cai para o de reconstituição', () => {
    stub(['T1', 'KIT']);
    expect(offerFor(ebookForPeptide('bpc-157'))?.id).toBe('T1');
  });

  it('página de caneta cai para o kit', () => {
    stub(['T1', 'KIT']);
    expect(offerFor(ebookForPeptide('liraglutida'), { pen: true })?.id).toBe('KIT');
  });

  it('guia ativo fica com a própria oferta', () => {
    stub(['I2', 'T1', 'KIT']);
    expect(offerFor(ebookForPeptide('tirzepatida'))?.id).toBe('I2');
  });

  it('peptídeo sem oferta continua sem oferta', () => {
    stub(['T1', 'KIT']);
    expect(offerFor(ebookForPeptide('melanotan-ii'))).toBeNull();
  });

  it('sem nenhum checkout, nada', () => {
    stub([]);
    expect(offerFor(ebookForPeptide('bpc-157'))).toBeNull();
  });
});

describe('copy de venda', () => {
  afterEach(() => vi.unstubAllEnvs());
  const withCopy = EBOOKS.filter((e) => e.pains || e.reveals || e.anchor);

  it('os guias com manuscrito têm dores, revelações, âncora e revisão', () => {
    for (const id of ['I1', 'I2', 'I3', 'I5', 'T1', 'T2', 'T3', 'KIT']) {
      const e = getEbookById(id)!;
      expect(e.pains, id).toHaveLength(3);
      expect(e.reveals, id).toHaveLength(5);
      expect(e.anchor, id).toBeTruthy();
      expect(e.revised, id).toBeTruthy();
    }
  });

  it('cada revelação diz onde está a resposta', () => {
    for (const e of withCopy) for (const r of e.reveals ?? []) expect(r, e.id).toMatch(/\([^)]+\)$/);
  });

  it('sem urgência falsa nem preço "de/por" inventado', () => {
    const banned = /\b(só hoje|últimas vagas|por tempo limitado|de R\$ ?[\d.,]+ por R\$)/i;
    for (const e of withCopy) {
      const text = [e.hook, e.line, e.anchor ?? '', ...(e.reveals ?? []), ...(e.pains ?? []).flatMap((p) => [p.erro, p.custo])].join(' ');
      expect(text, e.id).not.toMatch(banned);
    }
  });

  it('o card mostra a revelação sem a referência ao capítulo', () => {
    vi.stubEnv('KIWIFY_CHECKOUT_TIRZEPATIDA', 'https://pay.kiwify.com.br/teste');
    const offer = toOffer(getEbookById('I2'));
    for (const b of offer?.bullets ?? []) expect(b).not.toMatch(/\(cap\./);
  });
});

describe('cupom do pop-up de saída', () => {
  it('calcula o preço com desconto em centavos exatos', async () => {
    const { couponPrice, EXIT_COUPON } = await import('@/lib/ebooks');
    expect(couponPrice(29.9, 10)).toBe(26.91);
    expect(couponPrice(69.9, 10)).toBe(62.91);
    if (EXIT_COUPON) expect(EXIT_COUPON.code).toMatch(/^[A-Z0-9_-]{1,50}$/);
  });
});
