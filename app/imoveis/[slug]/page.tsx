import { getHouseBySlug } from '@/lib/notion';
import NotionRenderer from '@/components/NotionRenderer';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ImovelIndividualPage({ params }: PageProps) {
  const { slug } = await params;
  const house = await getHouseBySlug(slug);

  if (!house) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden p-6 sm:p-10 border border-gray-100">
        {/* Botão de Voltar */}
        <Link
          href="/imoveis"
          className="text-sm font-medium text-emerald-700 hover:underline mb-6 inline-block"
        >
          ← Voltar para todos os imóveis
        </Link>

        {/* Título e Bairro */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {house.title}
        </h1>
        {house.bairro && (
          <p className="text-lg text-gray-600 mb-6 font-medium">
            📍 {house.bairro}
          </p>
        )}

        {/* Foto de Capa / Destaque */}
        {house.foto && (
          <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden mb-8 bg-gray-100">
            <img
              src={house.foto}
              alt={house.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Preço e Ficha Técnica */}
        <div className="bg-emerald-50/50 rounded-2xl p-6 mb-8 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {house.preco > 0 && (
            <div>
              <span className="text-xs text-emerald-800 uppercase font-semibold tracking-wider block mb-1">
                Valor de Investimento
              </span>
              <span className="text-3xl font-extrabold text-emerald-800">
                {house.preco.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full sm:w-auto text-center">
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <span className="block text-gray-500 text-xs">Quartos</span>
              <span className="text-lg font-bold text-gray-900">{house.quartos}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <span className="block text-gray-500 text-xs">Suítes</span>
              <span className="text-lg font-bold text-gray-900">{house.suites}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <span className="block text-gray-500 text-xs">Vagas</span>
              <span className="text-lg font-bold text-gray-900">{house.vagas}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <span className="block text-gray-500 text-xs">Área</span>
              <span className="text-lg font-bold text-gray-900">{house.area} m²</span>
            </div>
          </div>
        </div>

        {/* Galeria de Fotos / Descrição (Blocos do Corpo do Notion) */}
        <div className="border-t border-gray-100 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Detalhes do Imóvel
          </h2>
          <NotionRenderer blocks={house.blocks} />
        </div>
      </article>
    </main>
  );
}