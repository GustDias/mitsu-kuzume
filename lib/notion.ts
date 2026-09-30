import { Client } from '@notionhq/client';

const apiKey = process.env.NOTION_API_KEY || process.env.NOTION_TOKEN || '';
let rawDatabaseId = process.env.NOTION_DATABASE_ID || '';

function formatUUID(id: string) {
  const cleanId = id.replace(/-/g, '');
  if (cleanId.length !== 32) return id;
  return `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-${cleanId.slice(12, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20)}`;
}

const formattedDatabaseId = formatUUID(rawDatabaseId);

export const notion = new Client({
  auth: apiKey,
});

export async function getBlogPosts() {
  if (!apiKey || !formattedDatabaseId) {
    console.warn('NOTION_API_KEY ou NOTION_DATABASE_ID não estão definidos no .env.local');
    return [];
  }

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${formattedDatabaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
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
      cache: 'no-store',
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error('Erro na resposta do Notion:', errData);
      return [];
    }

    const data = await res.json();

    return (data.results || []).map((page: any) => {
      const props = page.properties;

      let coverUrl = null;
      if (page.cover) {
        coverUrl = page.cover.type === 'external' ? page.cover.external.url : page.cover.file?.url;
      } else if (props.Cover?.files?.[0]) {
        const file = props.Cover.files[0];
        coverUrl = file.type === 'external' ? file.external.url : file.file?.url;
      }

      const title = props.Title?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || 'Sem título';
      const excerpt = props.Excerpt?.rich_text?.[0]?.plain_text || '';
      const rawSlug = props.Slug?.rich_text?.[0]?.plain_text || page.id;
      const slug = rawSlug.startsWith('/') ? rawSlug.slice(1) : rawSlug;
      const date = props.Date?.date?.start || '';

      return {
        id: page.id,
        title,
        slug,
        excerpt,
        date,
        cover: coverUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      };
    });
  } catch (error) {
    console.error('Erro ao buscar posts no Notion:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  if (!apiKey || !formattedDatabaseId) return null;

  try {
    const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;

    const res = await fetch(`https://api.notion.com/v1/databases/${formattedDatabaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          or: [
            {
              property: 'Slug',
              rich_text: {
                equals: slug,
              },
            },
            {
              property: 'Slug',
              rich_text: {
                equals: cleanSlug,
              },
            },
          ],
        },
      }),
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const data = await res.json();
    const page = data.results?.[0];

    if (!page) return null;

    const props = page.properties;
    let coverUrl = null;
    if (page.cover) {
      coverUrl = page.cover.type === 'external' ? page.cover.external.url : page.cover.file?.url;
    } else if (props.Cover?.files?.[0]) {
      const file = props.Cover.files[0];
      coverUrl = file.type === 'external' ? file.external.url : file.file?.url;
    }

    const title = props.Title?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || 'Sem título';
    const date = props.Date?.date?.start || '';

    const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
      },
      cache: 'no-store',
    });

    const blocksData = await blocksRes.json();

    return {
      id: page.id,
      title,
      date,
      cover: coverUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      blocks: blocksData.results || [],
    };
  } catch (error) {
    console.error('Erro ao buscar post por slug:', error);
    return null;
  }
}