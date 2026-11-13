import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import ArticleLayout from '@/components/blog/ArticleLayout';
import FAQ from '@/components/ui/FAQ';
import { mdxComponents } from '@/components/blog/mdx-components';
import { buildArticleMetadata, getArticleBody, getArticleBySlug, getMdxArticleSlugs } from '@/lib/articles';

// Posts escritos em content/blog/<slug>.mdx. Para criar um post, basta o arquivo:
// esta rota, o sitemap, o RSS, a busca e as imagens de compartilhamento leem de lá.

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getMdxArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  return article ? buildArticleMetadata(article) : {};
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const body = getArticleBody(slug);
  if (!article || body === undefined) notFound();

  const { content } = await compileMDX({
    source: body,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  return (
    <ArticleLayout article={article}>
      {content}
      {article.faq && article.faq.length > 0 && (
        <div className="not-prose">
          <FAQ items={article.faq} />
        </div>
      )}
    </ArticleLayout>
  );
}
