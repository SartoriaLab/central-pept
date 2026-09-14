# Cluster Tirzepatida — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mais cliques qualificados no WhatsApp do Fornecedor Oficial vindos de visitantes de tirzepatida: CTA contextual por peptídeo, mensagem de WhatsApp com o nome do peptídeo, sticky bar mobile e 4 posts de intenção comercial.

**Architecture:** `lib/affiliates.ts` ganha copy por peptídeo e template de mensagem. `AffiliateBox` aceita `peptide` e passa `pep=` ao `/api/click`, que injeta o nome na mensagem e grava em `utm_content`. Um `WhatsAppStickyBar` client-only aparece em páginas de tirzepatida. Conteúdo segue o padrão existente: página TSX por post + entrada em `lib/articles.ts`.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind. Sem framework de testes no repo: verificação = `npx tsc --noEmit`, `npm run build`, e checagem manual do redirect via `curl` com `npm run dev`.

Spec: `docs/superpowers/specs/2026-09-14-tirzepatida-leads-design.md`

---

## File map

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `lib/affiliates.ts` | modificar | copy por peptídeo, template de mensagem, helpers |
| `components/affiliate/AffiliateBox.tsx` | modificar | prop `peptide`, href com `pep` |
| `app/api/click/route.ts` | modificar | lê `pep`, monta mensagem, grava `utm_content` |
| `components/affiliate/WhatsAppStickyBar.tsx` | criar | barra fixa mobile, client |
| `components/ui/FAQ.tsx` | modificar | `FAQItem.link` opcional |
| `lib/peptide-faqs.ts` | modificar | 2 FAQs comerciais para tirzepatida |
| `app/peptideos/[slug]/page.tsx` | modificar | `peptide` no box + sticky bar |
| `app/comparar/[slug]/page.tsx` | modificar | `peptide` no box |
| `components/blog/ArticleLayout.tsx` | modificar | sticky bar quando post cita tirzepatida |
| `components/calculator/ReconstitutionCalculator.tsx` | modificar | box abaixo do resultado se tirzepatida |
| `components/calculator/TitrationCalculator.tsx` | modificar | box abaixo da timeline se esquema tirzepatida |
| `lib/articles.ts` | modificar | 4 entradas novas + tag em post existente |
| `app/blog/tirzepatida-preco-quanto-custa/page.tsx` | criar | post 1 |
| `app/blog/onde-comprar-tirzepatida/page.tsx` | criar | post 2 |
| `app/blog/como-reconstituir-tirzepatida/page.tsx` | criar | post 3 |
| `app/blog/mounjaro-falso-como-identificar/page.tsx` | criar | post 4 |
| `app/blog/tirzepatida-manipulada-seguranca/page.tsx` | modificar | box meio + peptide + leia também |
| `app/blog/semaglutida-vs-tirzepatida/page.tsx` | modificar | box meio + peptide + leia também |

---

### Task 1: Copy por peptídeo e template de mensagem em `lib/affiliates.ts`

**Files:**
- Modify: `lib/affiliates.ts`

- [ ] **Step 1: Substituir o arquivo inteiro por**

```ts
export type AffiliateNetwork = 'whatsapp' | 'direto';

export type AffiliateCopy = { title: string; blurb: string; cta: string };

export type AffiliateProduct = AffiliateCopy & {
  id: string;
  network: AffiliateNetwork;
  url: string;
  priceHint?: string;
  image?: { src: string; width: number; height: number; alt: string };
  /** Mensagem pré-preenchida no WhatsApp (anexada como ?text= no redirect). */
  message?: string;
  /** Variante da mensagem quando se sabe o peptídeo. `{peptide}` é substituído pelo nome. */
  messageWithPeptide?: string;
};

export const AFFILIATES: Record<string, AffiliateProduct> = {
  fornecedor_oficial: {
    id: 'fornecedor_oficial',
    network: 'whatsapp',
    url: 'https://wa.me/5511920904819',
    title: 'Fornecedor Oficial',
    blurb: 'Peptídeos com procedência. Fale direto no WhatsApp.',
    cta: 'Falar no WhatsApp',
    message:
      'Olá! Vim do site Central Peptídeos e gostaria de mais informações.',
    messageWithPeptide:
      'Olá! Vim do site Central Peptídeos e quero informações sobre {peptide}.',
  },
};

/** Copy específica por peptídeo (slug). Só peptídeos listados aqui mudam o card. */
export const PEPTIDE_COPY: Record<string, AffiliateCopy> = {
  tirzepatida: {
    title: 'Tirzepatida com procedência',
    blurb: 'Fornecedor verificado. Tire dúvidas e receba orçamento direto no WhatsApp.',
    cta: 'Quero tirzepatida',
  },
};

export function getAffiliate(id: string): AffiliateProduct | undefined {
  return AFFILIATES[id];
}

/** Copy do card: a do peptídeo se existir, senão a padrão do produto. */
export function getAffiliateCopy(product: AffiliateProduct, peptideSlug?: string): AffiliateCopy {
  const custom = peptideSlug ? PEPTIDE_COPY[peptideSlug] : undefined;
  return custom ?? { title: product.title, blurb: product.blurb, cta: product.cta };
}

/** Mensagem do WhatsApp: com nome do peptídeo quando houver, senão a genérica. */
export function buildAffiliateMessage(product: AffiliateProduct, peptideName?: string): string | undefined {
  if (peptideName && product.messageWithPeptide) {
    return product.messageWithPeptide.replace('{peptide}', peptideName);
  }
  return product.message;
}

/** Href interno de tracking. `peptide` (slug) vira `pep=` e é usado pelo /api/click. */
export function affiliateHref(productId: string, slot: string, peptide?: string): string {
  const q = new URLSearchParams({ p: productId, slot });
  if (peptide) q.set('pep', peptide);
  return `/api/click?${q.toString()}`;
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros (AffiliateBox ainda usa `product.title` etc., que continuam existindo).

- [ ] **Step 3: Commit**

```bash
git add lib/affiliates.ts
git commit -m "feat(affiliate): copy por peptídeo e mensagem WhatsApp contextual

Gerado pelo Claude Code"
```

---

### Task 2: `AffiliateBox` aceita `peptide`

**Files:**
- Modify: `components/affiliate/AffiliateBox.tsx`

- [ ] **Step 1: Trocar imports, props e cálculo de copy/href**

Substituir as linhas 1-27 por:

```tsx
import { affiliateHref, getAffiliate, getAffiliateCopy } from '@/lib/affiliates';

type Props = {
  productId: string;
  slot: string;
  /** Slug do peptídeo em contexto. Muda copy (se houver em PEPTIDE_COPY) e a mensagem do WhatsApp. */
  peptide?: string;
  variant?: 'inline' | 'compact';
  title?: string;
  blurb?: string;
  cta?: string;
};

export default function AffiliateBox({
  productId,
  slot,
  peptide,
  variant = 'compact',
  title,
  blurb,
  cta,
}: Props) {
  const product = getAffiliate(productId);
  if (!product) return null;

  const copy = getAffiliateCopy(product, peptide);
  const displayTitle = title ?? copy.title;
  const displayBlurb = blurb ?? copy.blurb;
  const displayCta = cta ?? copy.cta;

  const href = affiliateHref(product.id, slot, peptide);
```

O restante do JSX (a partir de `return (`) fica igual.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros. `variant` continua não usado (já era assim).

- [ ] **Step 3: Commit**

```bash
git add components/affiliate/AffiliateBox.tsx
git commit -m "feat(affiliate): AffiliateBox aceita peptide e passa pep= ao click

Gerado pelo Claude Code"
```

---

### Task 3: `/api/click` injeta peptídeo na mensagem e grava em `utm_content`

**Files:**
- Modify: `app/api/click/route.ts`

- [ ] **Step 1: Imports**

Trocar a linha `import { getAffiliate } from '@/lib/affiliates';` por:

```ts
import { buildAffiliateMessage, getAffiliate } from '@/lib/affiliates';
import { getPeptideBySlug } from '@/lib/peptides';
```

- [ ] **Step 2: Resolver peptídeo logo após validar o produto**

Depois do bloco `if (!product) { ... }` inserir:

```ts
  const pepSlug = searchParams.get('pep');
  const peptide = pepSlug ? getPeptideBySlug(pepSlug) : undefined;
```

- [ ] **Step 3: Gravar em utm_content**

Na chamada `db.insert(...)`, trocar

```ts
        utmContent: searchParams.get('utm_content'),
```

por

```ts
        utmContent: searchParams.get('utm_content') ?? peptide?.slug ?? null,
```

- [ ] **Step 4: Montar a mensagem**

Trocar

```ts
  let redirectUrl = product.url;
  if (product.message) {
    const sep = redirectUrl.includes('?') ? '&' : '?';
    redirectUrl += `${sep}text=${encodeURIComponent(product.message)}`;
  }
```

por

```ts
  let redirectUrl = product.url;
  const message = buildAffiliateMessage(product, peptide?.name);
  if (message) {
    const sep = redirectUrl.includes('?') ? '&' : '?';
    redirectUrl += `${sep}text=${encodeURIComponent(message)}`;
  }
```

- [ ] **Step 5: Verificar redirect manualmente**

Run (em outro terminal `npm run dev` já rodando):

```bash
curl -sI "http://localhost:3000/api/click?p=fornecedor_oficial&slot=t&pep=tirzepatida" | grep -i location
curl -sI "http://localhost:3000/api/click?p=fornecedor_oficial&slot=t" | grep -i location
curl -sI "http://localhost:3000/api/click?p=fornecedor_oficial&slot=t&pep=nao-existe" | grep -i location
```

Expected:
1. `location: https://wa.me/5511920904819?text=Ol%C3%A1!%20Vim%20do%20site%20Central%20Pept%C3%ADdeos%20e%20quero%20informa%C3%A7%C3%B5es%20sobre%20Tirzepatida.`
2. e 3. `...text=Ol%C3%A1!%20Vim%20do%20site%20Central%20Pept%C3%ADdeos%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.`

- [ ] **Step 6: Commit**

```bash
git add app/api/click/route.ts
git commit -m "feat(affiliate): mensagem WhatsApp com nome do peptídeo e pep em utm_content

Gerado pelo Claude Code"
```

---

### Task 4: `WhatsAppStickyBar` (client, mobile)

**Files:**
- Create: `components/affiliate/WhatsAppStickyBar.tsx`

- [ ] **Step 1: Criar o componente**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { affiliateHref, getAffiliate, getAffiliateCopy } from '@/lib/affiliates';

const DISMISS_KEY = 'wa-sticky-dismissed';
const SHOW_AFTER = 0.4; // fração da página rolada

type Props = {
  productId: string;
  slot: string;
  peptide?: string;
};

/**
 * Barra fixa inferior, só mobile. Aparece após rolar 40% da página,
 * some ao fechar (por sessão). Não usar em /ferramentas/* (conflita com
 * o mini-resultado flutuante da calculadora).
 */
export default function WhatsAppStickyBar({ productId, slot, peptide }: Props) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true); // true até hidratar → nunca pisca no SSR

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= SHOW_AFTER) setVisible(true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  const product = getAffiliate(productId);
  if (!product || dismissed || !visible) return null;

  const copy = getAffiliateCopy(product, peptide);
  const href = affiliateHref(product.id, slot, peptide);

  const close = () => {
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    setDismissed(true);
  };

  return (
    <div
      role="complementary"
      aria-label={copy.title}
      className="lg:hidden no-print fixed bottom-0 inset-x-0 z-40 animate-slide-up"
    >
      <div className="mx-3 mb-3 rounded-2xl border-2 border-green-500 bg-white dark:bg-green-950 shadow-xl flex items-center gap-3 p-3">
        <a
          href={href}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="flex-1 min-w-0 flex items-center gap-3"
        >
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block font-extrabold text-sm text-green-800 dark:text-green-200 leading-tight truncate">{copy.title}</span>
            <span className="block text-xs text-green-700 dark:text-green-300 leading-snug truncate">{copy.cta} →</span>
          </span>
        </a>
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="flex-shrink-0 w-8 h-8 rounded-full text-ink-3 hover:bg-green-50 dark:hover:bg-green-900 flex items-center justify-center"
        >
          <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden><path d="M5 5l10 10M15 5L5 15" /></svg>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: sem erros.

- [ ] **Step 3: Commit**

```bash
git add components/affiliate/WhatsAppStickyBar.tsx
git commit -m "feat(affiliate): WhatsAppStickyBar mobile com dismiss por sessão

Gerado pelo Claude Code"
```

---

### Task 5: Montar `peptide` + sticky bar na página de peptídeo e comparações

**Files:**
- Modify: `app/peptideos/[slug]/page.tsx:14,177-180` e antes do fechamento do componente
- Modify: `app/comparar/[slug]/page.tsx:17,133`

- [ ] **Step 1: Página de peptídeo — import**

Após `import AffiliateBox from '@/components/affiliate/AffiliateBox';` adicionar:

```tsx
import WhatsAppStickyBar from '@/components/affiliate/WhatsAppStickyBar';
import { PEPTIDE_COPY } from '@/lib/affiliates';
```

- [ ] **Step 2: Página de peptídeo — box com peptide**

Trocar

```tsx
          <AffiliateBox
            productId="fornecedor_oficial"
            slot={`peptide-${p.slug}`}
          />
```

por

```tsx
          <AffiliateBox
            productId="fornecedor_oficial"
            slot={`peptide-${p.slug}`}
            peptide={p.slug}
          />
```

- [ ] **Step 3: Página de peptídeo — sticky bar**

Logo após `<FAQ items={faq} title={...} />` (linha ~329) inserir:

```tsx
        {p.slug in PEPTIDE_COPY && (
          <WhatsAppStickyBar
            productId="fornecedor_oficial"
            slot={`sticky-peptide-${p.slug}`}
            peptide={p.slug}
          />
        )}
```

- [ ] **Step 4: Comparar — import e box**

Após `import AffiliateBox from '@/components/affiliate/AffiliateBox';` adicionar `import { PEPTIDE_COPY } from '@/lib/affiliates';`.

Trocar

```tsx
          <AffiliateBox productId="fornecedor_oficial" slot={`comparar-${slug}`} />
```

por

```tsx
          <AffiliateBox
            productId="fornecedor_oficial"
            slot={`comparar-${slug}`}
            peptide={c.peptideSlugs.find((s) => s in PEPTIDE_COPY)}
          />
```

(`c` é a comparação já resolvida no componente; confirmar o nome da variável no arquivo — em `generateMetadata` é `c`, no componente usar o mesmo nome que já existe.)

- [ ] **Step 5: Type-check e build**

Run: `npx tsc --noEmit && npm run build`
Expected: build OK. Abrir `/peptideos/tirzepatida` → card "Tirzepatida com procedência"; `/peptideos/semaglutida` → card "Fornecedor Oficial" inalterado; `/comparar/tirzepatida-vs-retatrutide` → card tirzepatida.

- [ ] **Step 6: Commit**

```bash
git add "app/peptideos/[slug]/page.tsx" "app/comparar/[slug]/page.tsx"
git commit -m "feat(affiliate): CTA contextual de tirzepatida em peptídeo e comparações

Gerado pelo Claude Code"
```

---

### Task 6: Sticky bar no `ArticleLayout` para posts de tirzepatida

**Files:**
- Modify: `components/blog/ArticleLayout.tsx`

- [ ] **Step 1: Imports**

Após `import Breadcrumb from '@/components/ui/Breadcrumb';` adicionar:

```tsx
import WhatsAppStickyBar from '@/components/affiliate/WhatsAppStickyBar';
import { PEPTIDE_COPY } from '@/lib/affiliates';
```

- [ ] **Step 2: Resolver peptídeo com copy**

Após `const related = getRelatedArticles(article);` adicionar:

```tsx
  const ctaPeptide = article.relatedPeptides?.find((s) => s in PEPTIDE_COPY);
```

- [ ] **Step 3: Renderizar**

Antes de `<MedicalDisclaimer variant="prominent" />` inserir:

```tsx
        {ctaPeptide && (
          <WhatsAppStickyBar
            productId="fornecedor_oficial"
            slot={`sticky-blog-${article.slug}`}
            peptide={ctaPeptide}
          />
        )}
```

- [ ] **Step 4: Type-check e commit**

Run: `npx tsc --noEmit`

```bash
git add components/blog/ArticleLayout.tsx
git commit -m "feat(affiliate): sticky bar WhatsApp em posts que citam tirzepatida

Gerado pelo Claude Code"
```

---

### Task 7: Box contextual nas calculadoras

**Files:**
- Modify: `components/calculator/ReconstitutionCalculator.tsx` (import + após bloco `{/* Alertas */}`)
- Modify: `components/calculator/TitrationCalculator.tsx` (import + após `</ol>` da timeline)

- [ ] **Step 1: Reconstituição — import**

Após a linha de imports existentes no topo adicionar:

```tsx
import AffiliateBox from '@/components/affiliate/AffiliateBox';
import { PEPTIDE_COPY } from '@/lib/affiliates';
```

- [ ] **Step 2: Reconstituição — render**

Dentro do painel de resultado, após o bloco `{alerts.length > 0 && ( ... )}` e antes do `</div>` que fecha o card de resultado (linha ~784), inserir:

```tsx
              {peptide && peptide.slug in PEPTIDE_COPY && (
                <div className="p-3 border-t border-border">
                  <AffiliateBox
                    productId="fornecedor_oficial"
                    slot={`reconstituicao-result-${peptide.slug}`}
                    peptide={peptide.slug}
                  />
                </div>
              )}
```

- [ ] **Step 3: Titulação — import**

Após `import { useMemo, useState } from 'react';` adicionar:

```tsx
import AffiliateBox from '@/components/affiliate/AffiliateBox';
```

- [ ] **Step 4: Titulação — render**

Após o `</ol>` da timeline e antes de `<div className="mt-5 pt-5 border-t border-border text-xs ...">` inserir:

```tsx
          {schemeId.startsWith('tirzepatida-') && (
            <div className="mt-5">
              <AffiliateBox
                productId="fornecedor_oficial"
                slot="titulacao-result-tirzepatida"
                peptide="tirzepatida"
              />
            </div>
          )}
```

- [ ] **Step 5: Type-check, build, checar visual**

Run: `npx tsc --noEmit && npm run build`
Abrir `/ferramentas/reconstituicao?peptide=tirzepatida&mg=10&water=2` → box abaixo dos alertas. Selecionar semaglutida → box some. `/ferramentas/titulacao` → escolher esquema Tirzepatida → box abaixo da timeline.

- [ ] **Step 6: Commit**

```bash
git add components/calculator/ReconstitutionCalculator.tsx components/calculator/TitrationCalculator.tsx
git commit -m "feat(affiliate): CTA tirzepatida no resultado das calculadoras

Gerado pelo Claude Code"
```

---

### Task 8: `FAQItem.link` + FAQs comerciais na página de tirzepatida

**Files:**
- Modify: `components/ui/FAQ.tsx`
- Modify: `lib/peptide-faqs.ts`

- [ ] **Step 1: FAQ.tsx — tipo e render**

Trocar `export type FAQItem = { q: string; a: string };` por:

```tsx
import Link from 'next/link';

export type FAQItem = {
  q: string;
  a: string;
  /** Link interno opcional exibido abaixo da resposta (não entra no JSON-LD). */
  link?: { label: string; href: string };
};
```

Trocar

```tsx
            <p className="mt-3 text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">
              {item.a}
            </p>
```

por

```tsx
            <p className="mt-3 text-sm text-ink-2 leading-relaxed whitespace-pre-wrap">
              {item.a}
            </p>
            {item.link && (
              <Link href={item.link.href} className="inline-block mt-2 text-sm font-semibold text-teal-700 hover:underline">
                {item.link.label} →
              </Link>
            )}
```

- [ ] **Step 2: peptide-faqs.ts — FAQs de tirzepatida**

No fim de `buildPeptideFaq`, antes do `return faqs;`, inserir:

```ts
  if (p.slug === 'tirzepatida') {
    faqs.push({
      q: 'Quanto custa tirzepatida no Brasil?',
      a: 'Depende da forma: caneta Mounjaro (industrializada) custa na faixa de R$ 1.100-1.400 por caneta de 4 doses; frascos manipulados ou liofilizados de 10 mg ficam entre R$ 500-900. Valores de mercado em 2026, variam por região e dose.',
      link: { label: 'Ver tabela de preços por dose', href: '/blog/tirzepatida-preco-quanto-custa' },
    });
    faqs.push({
      q: 'Onde comprar tirzepatida com segurança?',
      a: 'Em farmácia com registro, em farmácia de manipulação com farmacêutico responsável ou em fornecedor que apresente certificado de análise (COA/HPLC), lote e cadeia de frio. Evite marketplaces e ofertas sem lote ou sem nota.',
      link: { label: 'Guia de procedência', href: '/blog/onde-comprar-tirzepatida' },
    });
  }
```

- [ ] **Step 3: Type-check e commit**

Run: `npx tsc --noEmit`

```bash
git add components/ui/FAQ.tsx lib/peptide-faqs.ts
git commit -m "feat(seo): FAQ com link opcional e perguntas comerciais de tirzepatida

Gerado pelo Claude Code"
```

---

### Task 9: Entradas em `lib/articles.ts`

**Files:**
- Modify: `lib/articles.ts` (array `ARTICLES` e tags de `semaglutida-vs-tirzepatida`)

- [ ] **Step 1: Tag em post existente**

Em `semaglutida-vs-tirzepatida` trocar `tags: ['glp-1', 'comparação', 'emagrecimento'],` por `tags: ['tirzepatida', 'glp-1', 'comparação', 'emagrecimento'],`.

- [ ] **Step 2: 4 entradas novas**

Inserir no início do array `ARTICLES` (posts mais novos primeiro, se a listagem ordena por data isso não importa):

```ts
  {
    slug: 'tirzepatida-preco-quanto-custa',
    title: 'Tirzepatida: quanto custa no Brasil em 2026 (Mounjaro, manipulada e frasco)',
    excerpt: 'Preço por caneta, por frasco e por mês em cada dose (2,5 a 15 mg). Por que varia tanto e como não pagar caro por produto ruim.',
    tldr: 'Em 2026, uma caneta Mounjaro (4 doses) custa R$ 1.100-1.400; frasco manipulado ou liofilizado de 10 mg fica em R$ 500-900. O custo mensal vai de ~R$ 350 (2,5 mg em frasco) a mais de R$ 4.000 (15 mg em caneta). Preço muito abaixo dessas faixas é sinal de alerta, não de oportunidade.',
    publishedAt: '2026-09-14',
    readMinutes: 9,
    tags: ['tirzepatida', 'preço', 'glp-1'],
    relatedPeptides: ['tirzepatida'],
    coverColor: 'from-orange-500/20 to-teal-500/10',
  },
  {
    slug: 'onde-comprar-tirzepatida',
    title: 'Onde comprar tirzepatida com segurança: guia de procedência (2026)',
    excerpt: 'Os três canais que existem no Brasil, o que cada um exige, checklist de procedência (COA, lote, cadeia de frio) e sinais de golpe.',
    tldr: 'Tirzepatida se compra em farmácia (caneta Mounjaro, com receita), em farmácia de manipulação (frasco, com receita) ou com fornecedor especializado (frasco liofilizado). Em qualquer canal exija lote, certificado de análise com HPLC, envio refrigerado e comprovante. Marketplace, Instagram sem CNPJ e preço fora da curva são os três maiores sinais de golpe.',
    publishedAt: '2026-09-14',
    readMinutes: 10,
    tags: ['tirzepatida', 'segurança', 'onde comprar'],
    relatedPeptides: ['tirzepatida'],
    coverColor: 'from-green-500/20 to-teal-500/10',
  },
  {
    slug: 'como-reconstituir-tirzepatida',
    title: 'Como reconstituir tirzepatida 5, 10 e 15 mg: quantas unidades por dose',
    excerpt: 'Passo a passo com água bacteriostática, tabela pronta de unidades na seringa para cada frasco e dose, erros comuns e armazenamento.',
    tldr: 'Frasco de 10 mg com 2 ml de água = 5 mg/ml. Dose de 2,5 mg = 50 unidades; 5 mg = 100 unidades. Para doses altas use menos água ou frasco maior. Reconstitua escorrendo a água pela parede, gire sem agitar e guarde de 2-8 °C por até 28 dias.',
    publishedAt: '2026-09-14',
    readMinutes: 9,
    tags: ['tirzepatida', 'reconstituição', 'passo-a-passo'],
    relatedPeptides: ['tirzepatida'],
    coverColor: 'from-blue-500/20 to-teal-500/10',
  },
  {
    slug: 'mounjaro-falso-como-identificar',
    title: 'Mounjaro falso: como identificar caneta e frasco falsificados',
    excerpt: 'Sinais na caixa, na caneta KwikPen e no frasco liofilizado; como consultar o registro na ANVISA e o que fazer se desconfiar.',
    tldr: 'Mounjaro original no Brasil é caneta KwikPen da Eli Lilly, vendida em farmácia com receita. Sinais de falsificação: preço muito abaixo de R$ 1.000, venda em marketplace ou rede social, lote da caixa diferente do lote da caneta, rótulo adesivo, líquido turvo. Em frasco liofilizado, exija COA com lote batendo com o rótulo. Não aplique produto suspeito e notifique via Notivisa.',
    publishedAt: '2026-09-14',
    readMinutes: 7,
    tags: ['tirzepatida', 'mounjaro', 'segurança'],
    relatedPeptides: ['tirzepatida'],
    coverColor: 'from-red-500/20 to-orange-500/10',
  },
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: OK. (`npm run build` ainda vai falhar até as páginas existirem? Não: a listagem só gera links. Mas `/blog/<slug>` daria 404. Build passa.)

- [ ] **Step 4: Commit**

```bash
git add lib/articles.ts
git commit -m "feat(content): metadados dos 4 posts do cluster tirzepatida

Gerado pelo Claude Code"
```

---

### Task 10: Post `tirzepatida-preco-quanto-custa`

**Files:**
- Create: `app/blog/tirzepatida-preco-quanto-custa/page.tsx`

Estrutura obrigatória (mesmo esqueleto de `app/blog/aod-9604-o-que-e/page.tsx`):

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { getArticleBySlug, buildArticleMetadata } from '@/lib/articles';
import FAQ, { type FAQItem } from '@/components/ui/FAQ';
import AffiliateBox from '@/components/affiliate/AffiliateBox';

const SLUG = 'tirzepatida-preco-quanto-custa';
export const metadata: Metadata = buildArticleMetadata(getArticleBySlug(SLUG)!);

const FAQ_ITEMS: FAQItem[] = [ /* 5 itens abaixo */ ];

export default function Article() {
  const article = getArticleBySlug(SLUG)!;
  return (
    <ArticleLayout article={article}>
      {/* seções */}
      <div className="not-prose"><FAQ items={FAQ_ITEMS} /></div>
      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-tirze-preco" peptide="tirzepatida" />
      </div>
    </ArticleLayout>
  );
}
```

- [ ] **Step 1: Escrever o conteúdo com estas seções e dados**

1. Intro (2 parágrafos): por que o preço confunde — três produtos diferentes com o mesmo princípio ativo. Valores são faixas de mercado de setembro/2026, mudam toda semana.
2. `<h2>As três formas de comprar tirzepatida</h2>` — lista: **Caneta Mounjaro** (Lilly, 4 doses por caneta, uma dose fixa por caneta: 2,5 / 5 / 7,5 / 10 / 12,5 / 15 mg); **Frasco manipulado** (farmácia de manipulação, 5-15 mg em pó, precisa reconstituir, exige receita); **Frasco liofilizado de fornecedor** (mesmo formato, sem intermediação de farmácia; qualidade depende 100% do fornecedor).
3. `<h2>Tabela: custo por mês em cada dose</h2>` — tabela HTML (`<div className="not-prose overflow-x-auto">` + `<table>`), colunas: Dose semanal · Caneta Mounjaro (mês) · Frasco 10 mg (mês) · Frasco 15 mg (mês). Linhas com estas contas (caneta = R$ 1.250 média por 4 doses da dose escolhida; frasco 10 mg = R$ 700 média; frasco 15 mg = R$ 950 média; 4,3 doses/mês):
   - 2,5 mg: caneta ~R$ 1.250 · frasco 10 mg ~R$ 750 (1 frasco rende 4 doses ≈ 1 mês) · frasco 15 mg ~R$ 680 (6 doses)
   - 5 mg: caneta ~R$ 1.250 · frasco 10 mg ~R$ 1.500 (2 doses/frasco) · frasco 15 mg ~R$ 1.360 (3 doses)
   - 7,5 mg: caneta ~R$ 1.250 · frasco 15 mg ~R$ 2.040 (2 doses)
   - 10 mg: caneta ~R$ 1.250 · frasco 10 mg ~R$ 3.000 (1 dose/frasco) · frasco 15 mg ~R$ 2.720 (1,5 dose)
   - 15 mg: caneta ~R$ 1.250 · frasco 15 mg ~R$ 4.080 (1 dose/frasco)
   Parágrafo após a tabela: em dose baixa o frasco é mais barato; a partir de 7,5-10 mg a caneta empata ou ganha, porque a Lilly cobra o mesmo por caneta independente da dose. Isso surpreende quem só olha o preço do frasco.
4. **Box meio** aqui: `<div className="my-8 not-prose"><AffiliateBox productId="fornecedor_oficial" slot="blog-tirze-preco-mid" peptide="tirzepatida" /></div>`
5. `<h2>Por que o preço varia tanto</h2>` — lista: patente (sem genérico até ~2036), importação e câmbio, cadeia de frio, dose (caneta tem preço único), demanda (falta de estoque em 2024-2025 elevou preço), margem do canal.
6. `<h2>Preço por miligrama: a conta que importa</h2>` — frasco 10 mg a R$ 700 = R$ 70/mg; frasco 15 mg a R$ 950 = R$ 63/mg; caneta 5 mg (20 mg total) a R$ 1.250 = R$ 62/mg; caneta 15 mg (60 mg total) a R$ 1.250 = R$ 21/mg. Conclusão: por mg, a caneta de dose alta é disparada a mais barata; o frasco só compensa em doses baixas ou quando a caneta está indisponível.
7. `<h2>Barato demais é caro</h2>` — frasco de 10 mg abaixo de R$ 350 ou caneta abaixo de R$ 800: matéria-prima duvidosa, subdosagem, falsificação. Linkar `/blog/mounjaro-falso-como-identificar` e `/blog/tirzepatida-manipulada-seguranca`.
8. `<h2>Como economizar sem arriscar</h2>` — lista: comparar por mg e não por frasco; escolher frasco com mg compatível com a dose (evitar sobra que vence em 28 dias); usar a <Link href="/ferramentas/reconstituicao?peptide=tirzepatida">calculadora de reconstituição</Link> pra não desperdiçar; seguir a <Link href="/ferramentas/titulacao">titulação</Link> pra não subir dose antes da hora; pedir COA antes de pagar (link `/blog/onde-comprar-tirzepatida`).
9. FAQ (5): "Mounjaro tem genérico no Brasil?" (não; patente até ~2036; o que existe é manipulado/importado); "Plano de saúde cobre tirzepatida?" (em geral não para obesidade; alguns cobrem para DM2 com laudo); "Frasco de 10 mg rende quanto?" (4 doses de 2,5 mg, 2 de 5 mg, 1 de 10 mg); "Preço da tirzepatida vai cair?" (tendência de queda com Zepbound e mais oferta, mas sem genérico); "Compensa importar?" (Lilly vende Zepbound em frasco nos EUA por ~US$ 400-500/mês; importação pessoal exige receita e a ANVISA pode reter).
10. Box rodapé `blog-tirze-preco`.

- [ ] **Step 2: Build e abrir a página**

Run: `npm run build`
Expected: rota `/blog/tirzepatida-preco-quanto-custa` no output do build; página abre com tabela rolável no mobile.

- [ ] **Step 3: Commit**

```bash
git add app/blog/tirzepatida-preco-quanto-custa/page.tsx
git commit -m "feat(content): post tirzepatida preço por dose e por forma

Gerado pelo Claude Code"
```

---

### Task 11: Post `onde-comprar-tirzepatida`

**Files:**
- Create: `app/blog/onde-comprar-tirzepatida/page.tsx`

Mesmo esqueleto da Task 10 com `SLUG = 'onde-comprar-tirzepatida'`, slots `blog-onde-comprar-tirze-mid` e `blog-onde-comprar-tirze`.

- [ ] **Step 1: Escrever o conteúdo com estas seções e dados**

1. Intro: a pergunta certa não é "onde é mais barato" e sim "como saber que o que chega é tirzepatida na dose do rótulo". Este guia é sobre procedência.
2. `<h2>Os três canais no Brasil</h2>` — tabela HTML: Canal · O que vende · Exige receita? · Como comprovar qualidade. Linhas: **Farmácia / drogaria** (caneta Mounjaro; sim; registro ANVISA, nota fiscal, lote na caixa); **Farmácia de manipulação** (frasco em pó 5-15 mg; sim; alvará, farmacêutico RT, COA por lote); **Fornecedor especializado** (frasco liofilizado; varia; COA com HPLC, lote, envio refrigerado, atendimento que responde perguntas técnicas).
3. `<h2>Checklist de procedência (use em qualquer canal)</h2>` — lista ordenada de 7 itens com um parágrafo curto cada: (1) **Lote e validade impressos**, não adesivo solto; (2) **COA — Certificado de Análise** do lote, com pureza por HPLC ≥ 98% e identidade por espectrometria de massa; peça antes de pagar; (3) **Cadeia de frio**: envio com gelo/isopor, chegada ainda fria; pó liofilizado tolera alguns dias em temperatura ambiente, mas reconstituído não; (4) **Comprovante**: nota fiscal ou, no mínimo, recibo com CNPJ; (5) **Quem responde**: farmacêutico ou atendente que sabe explicar reconstituição, armazenamento e por que o COA importa; (6) **Rótulo coerente**: nome, mg, "uso subcutâneo", lote, validade; (7) **Preço dentro da faixa** — link `/blog/tirzepatida-preco-quanto-custa`.
4. **Box meio** `blog-onde-comprar-tirze-mid`.
5. `<h2>Sinais de golpe</h2>` — lista: marketplace (Mercado Livre, Shopee, OLX — ANVISA proíbe); perfil de Instagram/Telegram sem CNPJ; preço 40%+ abaixo da faixa; "última unidade", pressão pra fechar; não fornece COA ou manda COA sem número de lote; só aceita Pix pra conta de pessoa física sem recibo; promete "efeito garantido" ou "sem efeito colateral".
6. `<h2>O que perguntar no primeiro contato</h2>` — 6 perguntas prontas em lista: "Qual o lote e a validade?"; "Pode me mandar o COA desse lote?"; "Qual a pureza por HPLC?"; "Como é o envio e em quanto tempo chega?"; "Vem com água bacteriostática ou compro à parte?"; "Qual a política se chegar com o lacre violado ou quente?". Parágrafo: fornecedor sério responde tudo sem se irritar. Quem foge de COA e lote, descarta.
7. `<h2>Depois de comprar</h2>` — conferir lacre e rótulo ao receber; guardar na geladeira; reconstituir com <Link href="/blog/agua-bacteriostatica-guia">água bacteriostática</Link> usando a <Link href="/ferramentas/reconstituicao?peptide=tirzepatida">calculadora</Link> (link `/blog/como-reconstituir-tirzepatida`); começar em 2,5 mg mesmo com experiência prévia (link `/ferramentas/titulacao`).
8. `<h2>Receita médica</h2>` — parágrafo: tirzepatida é medicamento de prescrição. Farmácia e manipulação exigem receita por lei. Acompanhamento médico também é o que protege de contraindicações (CMT, NEM 2, pancreatite). Link `/peptideos/tirzepatida`.
9. FAQ (5): "Posso comprar tirzepatida sem receita?" (farmácia/manipulação: não; o que é vendido sem receita não tem respaldo regulatório e a responsabilidade é sua — exija ao menos COA); "O que é COA e como ler?" (documento do laboratório com lote, pureza HPLC, identidade MS, endotoxinas; lote do COA tem que bater com o do rótulo); "Tirzepatida de fornecedor é igual ao Mounjaro?" (mesmo princípio ativo, mas sem o controle industrial; pureza e dose podem variar; ver `/blog/tirzepatida-manipulada-seguranca`); "Quanto tempo o frasco aguenta fora da geladeira?" (pó liofilizado: dias; reconstituído: horas — refrigerar sempre); "Como sei se chegou falso?" (link `/blog/mounjaro-falso-como-identificar`).
10. Box rodapé `blog-onde-comprar-tirze`.

- [ ] **Step 2: Build e commit**

Run: `npm run build`

```bash
git add app/blog/onde-comprar-tirzepatida/page.tsx
git commit -m "feat(content): post onde comprar tirzepatida com checklist de procedência

Gerado pelo Claude Code"
```

---

### Task 12: Post `como-reconstituir-tirzepatida`

**Files:**
- Create: `app/blog/como-reconstituir-tirzepatida/page.tsx`

Mesmo esqueleto, `SLUG = 'como-reconstituir-tirzepatida'`, slots `blog-reconstituir-tirze-mid` e `blog-reconstituir-tirze`.

- [ ] **Step 1: Escrever o conteúdo com estas seções e dados**

Fórmula base (seringa de insulina 100 U/ml): `unidades = dose_mg × água_ml × 100 / mg_frasco`.

1. Intro: frasco de tirzepatida vem em pó; a dose certa depende de quanta água você coloca. Erro aqui é o erro mais comum (e mais perigoso) de quem sai da caneta pro frasco.
2. `<h2>Material</h2>` — lista: frasco de tirzepatida (5, 10 ou 15 mg); água bacteriostática (link `/blog/agua-bacteriostatica-guia`); seringa de 3 ml com agulha pra transferir a água; seringas de insulina 100 U (30, 50 ou 100 U); álcool 70% e algodão.
3. `<h2>Passo a passo</h2>` — lista ordenada de 7 passos: (1) higienizar mãos e tampas com álcool; (2) puxar a água na seringa de 3 ml (1 ml para frascos de 5 mg; 2 ml para 10 e 15 mg — ver tabela); (3) injetar devagar escorrendo pela parede do frasco, nunca direto no pó; (4) girar suavemente entre as mãos, não agitar, até ficar límpido (1-2 min); (5) esperar 5 min e conferir se não há partículas; (6) etiquetar com data e concentração (ex.: "10 mg / 2 ml = 5 mg/ml"); (7) geladeira 2-8 °C.
4. `<h2>Tabela pronta: unidades na seringa por dose</h2>` — tabela HTML com colunas: Frasco · Água · Concentração · 2,5 mg · 5 mg · 7,5 mg · 10 mg · 12,5 mg · 15 mg. Linhas:
   - 5 mg · 1 ml · 5 mg/ml · 50 U · 100 U · — · — · — · —
   - 10 mg · 1 ml · 10 mg/ml · 25 U · 50 U · 75 U · 100 U · — · —
   - 10 mg · 2 ml · 5 mg/ml · 50 U · 100 U · — · — · — · —
   - 15 mg · 1,5 ml · 10 mg/ml · 25 U · 50 U · 75 U · 100 U · — · —
   - 15 mg · 3 ml · 5 mg/ml · 50 U · 100 U · — · — · — · —
   Nota abaixo: "—" = não cabe em uma seringa de 100 U; use menos água ou divida em duas aplicações no mesmo momento. Doses de 12,5 e 15 mg pedem concentração de 10 mg/ml (125 U e 150 U → duas seringas) ou frasco de 15 mg com 1 ml (15 mg/ml: 12,5 mg = 83 U; 15 mg = 100 U).
   Parágrafo: pra qualquer combinação fora da tabela, a <Link href="/ferramentas/reconstituicao?peptide=tirzepatida">calculadora de reconstituição</Link> faz a conta e desenha a seringa.
5. **Box meio** `blog-reconstituir-tirze-mid`.
6. `<h2>Quantas doses rende cada frasco</h2>` — lista: 5 mg = 2 doses de 2,5 mg; 10 mg = 4 de 2,5 / 2 de 5 / 1 de 10; 15 mg = 6 de 2,5 / 3 de 5 / 2 de 7,5 / 1 de 15. Reconstituído dura 28 dias na geladeira: frasco de 15 mg na dose de 2,5 mg (6 semanas) vai vencer antes de acabar — prefira o de 10 mg nessa fase. Link `/blog/tirzepatida-preco-quanto-custa`.
7. `<h2>Erros comuns</h2>` — lista: agitar (desnatura o peptídeo); água destilada ou soro em vez de bacteriostática (contamina em dias); esquecer de anotar a concentração e errar a dose na semana seguinte; confundir "unidades" com "mg"; reutilizar seringa; pular a titulação (link `/ferramentas/titulacao`).
8. `<h2>Armazenamento</h2>` — pó: geladeira, aceita alguns dias fora; reconstituído: geladeira 2-8 °C, até 28 dias, longe da luz, nunca congelar; ao viajar, bolsa térmica. Link `/blog/como-guardar-ozempic-wegovy` (mesmos princípios).
9. FAQ (5): "Posso usar 1 ml ou 2 ml, tanto faz?" (a dose final é a mesma; muda só o volume na seringa — mais água = mais fácil medir doses baixas); "Ficou turvo, e agora?" (não use; pode ser contaminação ou peptídeo degradado); "Quantas unidades são 5 mg de tirzepatida?" (depende da concentração: 100 U a 5 mg/ml, 50 U a 10 mg/ml); "Posso reconstituir com água pra injeção comum?" (só se usar tudo no mesmo dia; sem conservante o frasco contamina); "Tirzepatida reconstituída dura quanto?" (28 dias refrigerada, por convenção de segurança).
10. Box rodapé `blog-reconstituir-tirze`.

- [ ] **Step 2: Conferir as contas da tabela com a calculadora**

Abrir `/ferramentas/reconstituicao?peptide=tirzepatida&mg=10&water=2&dose=2.5` → 50 U. `mg=15&water=1.5&dose=7.5` → 75 U. Se divergir, a tabela está errada — corrigir.

- [ ] **Step 3: Build e commit**

```bash
git add app/blog/como-reconstituir-tirzepatida/page.tsx
git commit -m "feat(content): post como reconstituir tirzepatida com tabela de unidades

Gerado pelo Claude Code"
```

---

### Task 13: Post `mounjaro-falso-como-identificar`

**Files:**
- Create: `app/blog/mounjaro-falso-como-identificar/page.tsx`

Mesmo esqueleto, `SLUG = 'mounjaro-falso-como-identificar'`, slots `blog-mounjaro-falso-mid` e `blog-mounjaro-falso`. Estrutura espelha `app/blog/ozempic-falso-como-identificar/page.tsx`.

- [ ] **Step 1: Escrever o conteúdo com estas seções e dados**

1. Intro: Mounjaro chegou às farmácias brasileiras em 2025 já com fila de espera e preço alto. Onde há escassez e preço alto, há falsificação. A Lilly e a ANVISA emitiram alertas sobre canetas falsas em vários países.
2. `<h2>Onde o risco é maior</h2>` — lista: marketplaces; redes sociais e Telegram; "farmácia online" sem CNPJ ou endereço; preço abaixo de R$ 900 por caneta; vendedor que oferece "Mounjaro em frasco" (a Lilly não vende frasco no Brasil — frasco é sempre manipulado ou importado, nunca Mounjaro).
3. `<h2>O que verificar na caixa</h2>` — lista: nome Mounjaro + tirzepatida + dose (2,5/5/7,5/10/12,5/15 mg) impressos; fabricante Eli Lilly; registro ANVISA impresso; lote e validade impressos em relevo/tinta, não adesivo; lacre intacto; bula em português dentro; caixa de 4 canetas (apresentação nacional) — caixa "solta" com 1 caneta sem embalagem é suspeita.
4. `<h2>O que verificar na caneta (KwikPen)</h2>` — lista: caneta multidose com seletor de 4 doses; rótulo impresso de fábrica com lote igual ao da caixa; líquido límpido e incolor; seletor trava nas posições, não gira livre; tampa e cores da apresentação coerentes com a dose.
5. **Box meio** `blog-mounjaro-falso-mid`.
6. `<h2>E se for frasco (tirzepatida liofilizada)?</h2>` — parágrafo: não é Mounjaro, é tirzepatida manipulada ou de fornecedor. A verificação é outra: COA com lote batendo com o rótulo, pureza HPLC, pó branco compacto sem manchas, lacre de alumínio intacto. Link `/blog/onde-comprar-tirzepatida` e `/blog/tirzepatida-manipulada-seguranca`.
7. `<h2>Como conferir na ANVISA</h2>` — lista ordenada: consultas.anvisa.gov.br → buscar "Mounjaro" → registro da Eli Lilly do Brasil → comparar; checar alertas de lotes falsificados na página da ANVISA.
8. `<h2>Se desconfiar</h2>` — lista igual à do post de Ozempic: não aplique, fotos, Notivisa, Procon, pronto-socorro se já aplicou e há sintomas.
9. `<h2>Conclusão</h2>` — caneta só em farmácia com nota; frasco só com COA e lote. O desconto do Instagram custa a saúde.
10. FAQ (4): "Mounjaro vende em frasco?" (não no Brasil; nos EUA existe Zepbound em frasco; aqui frasco = manipulado/fornecedor); "Quanto custa Mounjaro original?" (R$ 1.100-1.400 por caixa de 4 canetas — link preço); "Como saber se o lote é válido?" (consulta ANVISA + lote da caixa = lote da caneta); "Mounjaro precisa de receita?" (sim, retenção não, mas farmácia exige apresentar).
11. Box rodapé `blog-mounjaro-falso`.

- [ ] **Step 2: Build e commit**

```bash
git add app/blog/mounjaro-falso-como-identificar/page.tsx
git commit -m "feat(content): post Mounjaro falso como identificar

Gerado pelo Claude Code"
```

---

### Task 14: Ajustar os 2 posts existentes

**Files:**
- Modify: `app/blog/tirzepatida-manipulada-seguranca/page.tsx`
- Modify: `app/blog/semaglutida-vs-tirzepatida/page.tsx`

- [ ] **Step 1: Manipulada — box meio + peptide + leia também**

Após o `</ul>` da seção `<h2>Sinais de uma farmácia confiável</h2>` inserir:

```tsx
      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-tirze-manipulada-mid" peptide="tirzepatida" />
      </div>
```

Antes do box de rodapé inserir:

```tsx
      <h2>Leia também</h2>
      <ul>
        <li><Link href="/blog/onde-comprar-tirzepatida">Onde comprar tirzepatida com segurança</Link></li>
        <li><Link href="/blog/tirzepatida-preco-quanto-custa">Quanto custa tirzepatida por dose</Link></li>
        <li><Link href="/blog/como-reconstituir-tirzepatida">Como reconstituir tirzepatida 5, 10 e 15 mg</Link></li>
        <li><Link href="/blog/mounjaro-falso-como-identificar">Mounjaro falso: como identificar</Link></li>
      </ul>
```

No box de rodapé adicionar `peptide="tirzepatida"`.

- [ ] **Step 2: Sema vs tirze — box meio + peptide + leia também**

Após o `</p>` da nota na seção `<h2>Custo no Brasil (abril/2026)</h2>` inserir:

```tsx
      <div className="my-8 not-prose">
        <AffiliateBox productId="fornecedor_oficial" slot="blog-sema-vs-tirze-mid" peptide="tirzepatida" />
      </div>
```

Antes do box de rodapé inserir o mesmo bloco "Leia também" da Step 1 (sem o item de manipulada? Não: incluir os 4 novos + `/blog/tirzepatida-manipulada-seguranca` como 5º item). No box de rodapé adicionar `peptide="tirzepatida"`.

- [ ] **Step 3: Build e commit**

Run: `npm run build`

```bash
git add app/blog/tirzepatida-manipulada-seguranca/page.tsx app/blog/semaglutida-vs-tirzepatida/page.tsx
git commit -m "feat(content): CTA contextual e links cruzados nos posts de tirzepatida

Gerado pelo Claude Code"
```

---

### Task 15: Verificação final

- [ ] **Step 1: Type-check, lint e build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: tudo limpo; as 4 rotas novas aparecem na lista de rotas estáticas do build.

- [ ] **Step 2: Checagem funcional com `npm run dev`**

- `/blog` lista os 4 posts novos no topo; `/blog/tag/tirzepatida` lista 6 posts.
- `/sitemap.xml` e `/feed.xml` contêm os 4 slugs.
- `/peptideos/tirzepatida`: card "Tirzepatida com procedência", FAQ com 2 perguntas novas e links; em viewport mobile (DevTools ≤ 1024 px), rolar 40% → barra aparece; fechar → não volta ao recarregar na mesma aba.
- `/peptideos/semaglutida`: card e comportamento inalterados, sem barra.
- `/api/click?p=fornecedor_oficial&slot=x&pep=tirzepatida` → `Location` com "sobre Tirzepatida".
- Calculadoras: box aparece só com tirzepatida selecionada.

- [ ] **Step 3: Atualizar `PROGRESSO.md`**

Adicionar seção "Sessão 14/09/2026 — Cluster tirzepatida" listando: copy por peptídeo (`PEPTIDE_COPY`), `pep=` no click (vai pra `utm_content`), `WhatsAppStickyBar`, 4 posts, FAQ com link. Métrica: comparar cliques por slot contendo `tirze` 30 dias antes/depois na tabela `affiliate_clicks`.

- [ ] **Step 4: Commit**

```bash
git add PROGRESSO.md
git commit -m "docs: registra cluster tirzepatida no PROGRESSO

Gerado pelo Claude Code"
```
