// Chaves do seu .env
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_DATABASE_ID_CASAS = process.env.NOTION_DATABASE_ID_CASAS;

const HEADERS = {
  'Authorization': `Bearer ${NOTION_API_KEY}`,
  'Notion-Version': '2022-06-28',
  'Content-Type': 'application/json',
};

// Função auxiliar avançada para extrair URL da imagem (propriedades customizadas ou Capa da página)
function extractImageUrl(page: any): string | null {
  if (!page || !page.properties) return null;
  const props = page.properties;

  // 1. Procura em todas as propriedades que possam conter arquivos/mídia
  for (const key of Object.keys(props)) {
    const prop = props[key];
    if (prop && prop.type === 'files' && Array.isArray(prop.files) && prop.files.length > 0) {
      const fileObj = prop.files[0];
      if (fileObj.type === 'external' && fileObj.external?.url) {
        return fileObj.external.url;
      }
      if (fileObj.type === 'file' && fileObj.file?.url) {
        return fileObj.file.url;
      }
    }
  }

  // 2. Se não encontrou em colunas, tenta a capa (Cover) da própria página do Notion
  if (page.cover) {
    if (page.cover.type === 'external' && page.cover.external?.url) {
      return page.cover.external.url;
    }
    if (page.cover.type === 'file' && page.cover.file?.url) {
      return page.cover.file.url;
    }
  }

  return null;
}

// ==========================================
// FUNÇÕES DO BLOG
// ==========================================

export async function getBlogPosts() {
  if (!NOTION_DATABASE_ID || !NOTION_API_KEY) {
    console.error('Variáveis do Notion não configuradas no .env');
    return [];
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        filter: {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Erro na API do Notion:', res.status, errText);
      return [];
    }

    const data = await res.json();

    return data.results.map((page: any) => {
      const props = page.properties;

      return {
        id: page.id,
        title: props.Title?.title[0]?.plain_text || props.Nome?.title[0]?.plain_text || 'Sem título',
        slug: props.Slug?.rich_text[0]?.plain_text || '',
        excerpt: props.Excerpt?.rich_text[0]?.plain_text || props.Resumo?.rich_text[0]?.plain_text || '',
        date: props.Date?.date?.start || '',
        cover: extractImageUrl(page),
      };
    });
  } catch (error) {
    console.error('Erro ao buscar posts do blog:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  if (!NOTION_DATABASE_ID || !NOTION_API_KEY) return null;

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        filter: {
          property: 'Slug',
          rich_text: {
            equals: slug,
          },
        },
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const page: any = data.results[0];
    if (!page) return null;

    const props = page.properties;

    // Busca os blocos do conteúdo do post
    const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, {
      headers: HEADERS,
      next: { revalidate: 60 },
    });
    const blocksData = await blocksRes.json();

    return {
      id: page.id,
      title: props.Title?.title[0]?.plain_text || props.Nome?.title[0]?.plain_text || 'Sem título',
      date: props.Date?.date?.start || '',
      cover: extractImageUrl(page),
      blocks: blocksData.results || [],
    };
  } catch (error) {
    console.error('Erro ao buscar post por slug:', error);
    return null;
  }
}

// ==========================================
// FUNÇÕES DOS IMÓVEIS (CASAS)
// ==========================================

export async function getHouses(bairroFilter?: string) {
  if (!NOTION_DATABASE_ID_CASAS || !NOTION_API_KEY) return [];

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID_CASAS}/query`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        // Tira o filtro estrito do fetch para tratar tudo com segurança no código
      }),
      next: { revalidate: 60 }, // desativa cache temporariamente para testes
    });

    if (!res.ok) return [];

    const data = await res.json();

    let houses = data.results.map((page: any) => {
      const props = page.properties;

      // 1. Título
      const titleProp = props.Title || props.Name || props.Nome || props.title;
      const title = titleProp?.title?.[0]?.plain_text || 'Imóvel sem nome';

      // 2. Slug
      const slugProp = props.Slug || props.slug;
      const slug = slugProp?.rich_text?.[0]?.plain_text || page.id; // Se não tiver slug, usa o ID como fallback

      // 3. Bairro (trata 'bairros', 'Bairro', 'Bairros', 'Select' ou 'Multi-select')
      const bairroProp = props.bairros || props.Bairros || props.bairro || props.Bairro;
      let bairro = '';
      if (bairroProp?.select) {
        bairro = bairroProp.select.name;
      } else if (bairroProp?.multi_select && bairroProp.multi_select.length > 0) {
        bairro = bairroProp.multi_select[0].name;
      } else if (bairroProp?.rich_text) {
        bairro = bairroProp.rich_text[0]?.plain_text || '';
      }

      // 4. Preço (trata 'preço', 'Preço', 'Preco', 'Price')
      const precoProp = props.preço || props.Preço || props.preco || props.Preco || props.Price;
      const preco = precoProp?.number || 0;

      // 5. Outros Atributos
      const quartos = (props.Quartos || props.quartos)?.number || 0;
      const suites = (props.Suítes || props.Suites || props.suites)?.number || 0;
      const vagas = (props.Vagas || props.vagas)?.number || 0;
      const area = (props.Área || props.Area || props.area)?.number || 0;

      return {
        id: page.id,
        title,
        slug,
        bairro,
        preco,
        quartos,
        suites,
        vagas,
        area,
        foto: extractImageUrl(page),
      };
    });

    // Filtro por Bairro (remover acentos e minúsculas para não dar erro entre Vila Olímpia e Vila Olimpia)
    if (bairroFilter) {
      const cleanFilter = bairroFilter
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

      houses = houses.filter((h: any) => {
        const cleanBairro = h.bairro
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .trim()
          .toLowerCase();

        return cleanBairro === cleanFilter;
      });
    }

    return houses;
  } catch (error) {
    console.error('Erro ao buscar casas:', error);
    return [];
  }
}

export async function getHouseBySlug(slug: string) {
  if (!NOTION_DATABASE_ID_CASAS || !NOTION_API_KEY) return null;

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID_CASAS}/query`, {
      method: 'POST',
      headers: HEADERS,
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Procura o imóvel correspondente pelo Slug ou pelo ID
    const page = data.results.find((item: any) => {
      const props = item.properties;
      const itemSlug = (props.Slug || props.slug)?.rich_text?.[0]?.plain_text;
      return itemSlug === slug || item.id === slug;
    });

    if (!page) return null;

    const props = page.properties;

    // Busca o conteúdo interno da página (blocos de texto e imagem)
    const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, {
      headers: HEADERS,
      next: { revalidate: 60 },
    });

    const blocksData = blocksRes.ok ? await blocksRes.json() : { results: [] };

    const titleProp = props.Title || props.Name || props.Nome || props.title;
    const bairroProp = props.bairros || props.Bairros || props.bairro || props.Bairro;
    const precoProp = props.preço || props.Preço || props.preco || props.Preco;

    let bairro = '';
    if (bairroProp?.select) {
      bairro = bairroProp.select.name;
    } else if (bairroProp?.multi_select && bairroProp.multi_select.length > 0) {
      bairro = bairroProp.multi_select[0].name;
    }

    return {
      id: page.id,
      title: titleProp?.title?.[0]?.plain_text || 'Imóvel sem nome',
      bairro,
      preco: precoProp?.number || 0,
      quartos: (props.Quartos || props.quartos)?.number || 0,
      suites: (props.Suítes || props.Suites || props.suites)?.number || 0,
      vagas: (props.Vagas || props.vagas)?.number || 0,
      area: (props.Área || props.Area || props.area)?.number || 0,
      foto: extractImageUrl(page),
      blocks: blocksData.results || [],
    };
  } catch (error) {
    console.error('Erro ao buscar imóvel por slug:', error);
    return null;
  }
}