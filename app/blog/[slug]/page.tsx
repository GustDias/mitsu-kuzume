import { getPostBySlug } from '@/lib/notion';
import NotionRenderer from '@/components/NotionRenderer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ slug: string }>;
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

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {post.date && (
          <p className="text-sm text-gray-500 mb-8">
            {new Date(post.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}

        {post.cover && (
          <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden mb-8">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* AQUI É ONDE O NOTION RENDERER É CHAMADO PARA EXIBIR AS IMAGENS E TEXTOS DO CORPO */}
        <NotionRenderer blocks={post.blocks} />
      </article>
    </main>
  );
}