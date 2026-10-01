import { getHouses } from '@/lib/notion';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ bairro?: string }>;
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  const { bairro } = await searchParams;
  const houses = await getHouses(bairro);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navegação / Cabeçalho */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm font-medium text-emerald-700 hover:underline mb-4 inline-block"
          >
            ← Voltar para a página inicial
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {bairro ? `Imóveis no bairro: ${bairro}` : 'Todos os Imóveis'}
          </h1>
          <p className="text-gray-600 mt-1">
            Encontrados {houses.length} {houses.length === 1 ? 'imóvel' : 'imóveis'}
          </p>
        </div>

        {/* Lista / Grid de Imóveis */}
        {houses.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">
              Nenhum imóvel encontrado {bairro ? `no bairro "${bairro}"` : ''}.
            </p>
            {bairro && (
              <Link
                href="/imoveis"
                className="mt-4 inline-block text-emerald-700 font-medium hover:underline"
              >
                Ver todos os imóveis disponíveis
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {houses.map((house) => (
              <Link
                key={house.id}
                href={`/imoveis/${house.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
              >
                {/* Imagem do Card */}
                <div className="relative h-60 w-full bg-gray-100 overflow-hidden">
                  {house.foto ? (
                    <img
                      src={house.foto}
                      alt={house.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Sem foto disponível
                    </div>
                  )}
                  {house.bairro && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-gray-800 shadow-sm">
                      {house.bairro}
                    </span>
                  )}
                </div>

                {/* Informações do Imóvel */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">
                      {house.title}
                    </h2>
                    {house.preco > 0 && (
                      <p className="text-2xl font-extrabold text-emerald-700 mb-4">
                        {house.preco.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Resumo de Características */}
                  <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100 text-xs text-gray-600 text-center">
                    <div>
                      <span className="block font-bold text-gray-900 text-sm">
                        {house.quartos}
                      </span>
                      Quartos
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900 text-sm">
                        {house.suites}
                      </span>
                      Suítes
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900 text-sm">
                        {house.vagas}
                      </span>
                      Vagas
                    </div>
                    <div>
                      <span className="block font-bold text-gray-900 text-sm">
                        {house.area} m²
                      </span>
                      Área
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}