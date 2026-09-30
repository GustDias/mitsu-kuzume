import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Star } from 'lucide-react';
import { getBlogPosts } from '@/lib/notion';

export const revalidate = 3600; // Atualiza o cache do Notion a cada 1 hora

export default async function Home() {
  const posts = await getBlogPosts();

  const bairros = [
    { name: 'CAMPO BELO', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80' },
    { name: 'MOEMA', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80' },
    { name: 'BROOKLIN', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80' },
    { name: 'ITAIM BIBI', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80' },
    { name: 'VILA OLÍMPIA', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80' },
  ];

  const depoimentos = [
    { nome: 'Ana Paula Santos', texto: 'Atendimento impecável! O Mitzu entendeu exatamente o perfil de imóvel que minha família buscava no Itaim Bibi.' },
    { nome: 'Carlos Eduardo', texto: 'Processo transparente do início ao fim. Conseguimos fechar o negócio com total segurança jurídica.' },
    { nome: 'Mariana & Roberto', texto: 'Excelente consultoria imobiliária. A seleção de imóveis no Campo Belo superou nossas expectativas.' }
  ];

  return (
    <main className="min-h-screen bg-white text-gray-800 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[85vh] bg-cover bg-center flex items-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80')` }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
          <div className="max-w-xl text-white space-y-6">
            <h1 className="text-5xl md:text-6xl font-serif tracking-wide font-light">
              MITZU KUZUME
            </h1>
            <p className="text-lg text-gray-200 font-light leading-relaxed">
              Consultoria imobiliária especializada nos bairros mais nobres e valorizados de São Paulo. Encontre o imóvel ideal com exclusividade.
            </p>
            <a href="#contato" className="inline-flex items-center gap-2 bg-emeraldCustom hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-md transition-all shadow-lg">
              Falar com Consultor <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. ENCONTRE A CASA IDEAL */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-emeraldCustom font-normal tracking-wide">
            ENCONTRE A CASA IDEAL
          </h2>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            Imóveis selecionados sob medida para o seu estilo de vida
          </p>
        </div>
        <div className="relative w-full h-[450px] rounded-xl overflow-hidden shadow-2xl">
          <Image 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80" 
            alt="Interior de luxo" 
            fill 
            className="object-cover"
          />
        </div>
      </section>

      {/* 3. BAIRROS MAIS VALORIZADOS */}
      <section className="py-16 px-6 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-emeraldCustom font-normal">
            OS BAIRROS MAIS VALORIZADOS DE SÃO PAULO
          </h2>
          <p className="text-sm text-gray-500">
            Conheça as melhores localizações para morar ou investir
          </p>
        </div>

        <div className="space-y-6">
          {bairros.map((bairro, index) => (
            <div key={index} className="relative h-48 md:h-64 rounded-xl overflow-hidden group cursor-pointer shadow-md">
              <Image 
                src={bairro.image} 
                alt={bairro.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <h3 className="text-3xl md:text-5xl font-serif text-white tracking-widest font-light">
                  {bairro.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SEÇÃO DO BLOG (ALIMENTADO PELO NOTION) */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-emeraldCustom font-normal">
                ARTIGOS & MERCADO IMOBILIÁRIO
              </h2>
              <p className="text-sm text-gray-500 mt-2">Dicas, análises de mercado e tendências de arquitetura</p>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
              <p className="text-gray-500">Nenhum artigo publicado ainda no Notion.</p>
              <p className="text-xs text-gray-400 mt-1">Crie uma linha na tabela do Notion e marque a caixinha "Published".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
  <div className="relative h-48 w-full bg-gray-100">
    {post.cover && (
      <Image 
        src={post.cover} 
        alt={post.title || 'Imagem do artigo'} 
        fill 
        className="object-cover" 
        unoptimized // Evita erros de domínio no Next Image com URLs externas do Notion
      />
    )}
  </div>
  
  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
    <div>
      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{post.title}</h3>
      <p className="text-sm text-gray-600 mt-2 line-clamp-3">{post.excerpt}</p>
    </div>
    
    <a href={`/blog/${post.slug}`} className="text-emerald-700 font-medium text-sm hover:underline inline-flex items-center">
      Ler Artigo Completo →
    </a>
  </div>
</article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. DEPOIMENTOS DE CLIENTES */}
      <section className="py-20 bg-emeraldCustom text-white px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-normal">
              O QUE MEUS CLIENTES DIZEM
            </h2>
            <p className="text-emerald-100 text-sm">A satisfação de quem encontrou o imóvel dos sonhos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {depoimentos.map((dep, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 flex flex-col justify-between space-y-4">
                <div className="flex gap-1 text-amber-300">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-300" />)}
                </div>
                <p className="text-sm text-gray-100 italic leading-relaxed">"{dep.texto}"</p>
                <span className="text-sm font-medium text-white">{dep.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA / CONTATO */}
      <section id="contato" className="py-20 text-center px-6 max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-serif text-emeraldCustom font-normal">
          ENCONTRE O IMÓVEL CERTO PARA O SEU PERFIL
        </h2>
        <p className="text-gray-600 text-sm max-w-md mx-auto">
          Entre em contato diretamente para agendar uma visita ou receber um atendimento personalizado.
        </p>
        <a 
          href="https://wa.me/5511999999999" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-emeraldCustom hover:bg-emerald-700 text-white font-medium px-8 py-4 rounded-md transition-all shadow-lg text-lg"
        >
          <MessageCircle className="w-6 h-6" /> Falar via WhatsApp
        </a>
      </section>
    </main>
  );
}