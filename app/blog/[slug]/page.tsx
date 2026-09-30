import { getPostBySlug } from '@/lib/notion';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

// Função auxiliar para extrair o texto de blocos do Notion
function renderRichText(richTextArray: any[]) {
  if (!richTextArray || richTextArray.length === 0) return '';
  return richTextArray.map((t: any) => t.plain_text).join('');
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden p-6 sm:p-10">
        <Link href="/" className="text-sm font-medium text-emerald-700 hover:underline mb-6 inline-block">
          ← Voltar para todos os artigos
        </Link>

        {post.cover && (
          <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden mb-8">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        {post.date && <p className="text-sm text-gray-500 mb-8">{post.date}</p>}

        <div className="prose prose-emerald max-w-none space-y-4 text-gray-700 leading-relaxed border-t pt-6">
          {post.blocks && post.blocks.length > 0 ? (
            post.blocks.map((block: any) => {
              const type = block.type;

              if (type === 'paragraph') {
                const text = renderRichText(block.paragraph?.rich_text);
                return text ? <p key={block.id} className="text-base text-gray-700">{text}</p> : null;
              }

              if (type === 'heading_1') {
                const text = renderRichText(block.heading_1?.rich_text);
                return <h1 key={block.id} className="text-2xl font-bold text-gray-900 mt-6 mb-2">{text}</h1>;
              }

              if (type === 'heading_2') {
                const text = renderRichText(block.heading_2?.rich_text);
                return <h2 key={block.id} className="text-xl font-bold text-gray-900 mt-5 mb-2">{text}</h2>;
              }

              if (type === 'heading_3') {
                const text = renderRichText(block.heading_3?.rich_text);
                return <h3 key={block.id} className="text-lg font-semibold text-gray-900 mt-4 mb-2">{text}</h3>;
              }

              if (type === 'bulleted_list_item') {
                const text = renderRichText(block.bulleted_list_item?.rich_text);
                return <li key={block.id} className="ml-5 list-disc text-gray-700">{text}</li>;
              }

              if (type === 'numbered_list_item') {
                const text = renderRichText(block.numbered_list_item?.rich_text);
                return <li key={block.id} className="ml-5 list-decimal text-gray-700">{text}</li>;
              }

              if (type === 'quote') {
                const text = renderRichText(block.quote?.rich_text);
                return (
                  <blockquote key={block.id} className="border-l-4 border-emerald-600 pl-4 italic text-gray-600 my-4">
                    {text}
                  </blockquote>
                );
              }

              return null;
            })
          ) : (
            <p className="text-gray-400 italic">Nenhum conteúdo encontrado no corpo da página do Notion.</p>
          )}
        </div>
      </article>
    </main>
  );
}