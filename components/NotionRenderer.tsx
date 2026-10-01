import React from 'react';

interface NotionBlockProps {
  blocks: any[];
}

export default function NotionRenderer({ blocks }: NotionBlockProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-4 text-gray-800 leading-relaxed">
      {blocks.map((block) => {
        const { type, id } = block;

        // 1. IMAGENS NO CORPO DO TEXTO
        if (type === 'image') {
          const value = block.image;
          const imageUrl = value.type === 'external' ? value.external?.url : value.file?.url;
          const caption = value.caption?.[0]?.plain_text || '';

          if (!imageUrl) return null;

          return (
            <figure key={id} className="my-6">
              <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt={caption || 'Imagem do conteúdo'}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              {caption && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        }

        // 2. PARÁGRAFO DE TEXTO
        if (type === 'paragraph') {
          const textContent = block.paragraph?.rich_text;
          if (!textContent || textContent.length === 0) {
            return <div key={id} className="h-4" />;
          }

          return (
            <p key={id}>
              {textContent.map((segment: any, i: number) => {
                let element = <span key={i}>{segment.plain_text}</span>;

                if (segment.annotations?.bold) {
                  element = <strong key={i}>{element}</strong>;
                }
                if (segment.annotations?.italic) {
                  element = <em key={i}>{element}</em>;
                }
                if (segment.annotations?.code) {
                  element = (
                    <code key={i} className="bg-gray-100 text-red-500 px-1.5 py-0.5 rounded text-sm">
                      {element}
                    </code>
                  );
                }
                if (segment.href) {
                  element = (
                    <a
                      key={i}
                      href={segment.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      {element}
                    </a>
                  );
                }

                return element;
              })}
            </p>
          );
        }

        // 3. TÍTULOS (H1, H2, H3)
        if (type === 'heading_1') {
          return (
            <h1 key={id} className="text-3xl font-bold mt-8 mb-4">
              {block.heading_1?.rich_text[0]?.plain_text}
            </h1>
          );
        }

        if (type === 'heading_2') {
          return (
            <h2 key={id} className="text-2xl font-semibold mt-6 mb-3">
              {block.heading_2?.rich_text[0]?.plain_text}
            </h2>
          );
        }

        if (type === 'heading_3') {
          return (
            <h3 key={id} className="text-xl font-semibold mt-4 mb-2">
              {block.heading_3?.rich_text[0]?.plain_text}
            </h3>
          );
        }

        // 4. LISTAS COM MARCADORES
        if (type === 'bulleted_list_item') {
          return (
            <li key={id} className="ml-6 list-disc">
              {block.bulleted_list_item?.rich_text[0]?.plain_text}
            </li>
          );
        }

        return null;
      })}
    </div>
  );
}