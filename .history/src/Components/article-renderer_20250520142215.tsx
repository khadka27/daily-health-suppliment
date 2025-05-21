/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import Image from "next/image"

interface ArticleRendererProps {
  blocks: any[]
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({ blocks }) => {
  return (
    <div>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={block.id} className="mb-4 text-gray-700">
                {block.content}
              </p>
            )
          case "heading":
            return (
              <h2
                key={block.id}
                className={`text-${block.level === 1 ? "3xl" : block.level === 2 ? "2xl" : "xl"} font-semibold mb-3 text-gray-800`}
              >
                {block.content}
              </h2>
            )
          case "image":
            return (
              <div key={block.id} className="mb-4">
                <Image
                  src={block.imageUrl || "/placeholder.svg"}
                  alt={block.content || "Article Image"}
                  width={800}
                  height={450}
                  className="w-full rounded-md shadow-md"
                />
                {block.content && <p className="text-sm text-gray-500 mt-2">{block.content}</p>}
              </div>
            )
          case "list":
            return (
              <ul key={block.id} className={`list-${block.listType === "ordered" ? "decimal" : "disc"} pl-5 mb-4`}>
                {block.content &&
                  block.content.split("\n").map((item: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
                    <li key={i} className="text-gray-700">
                      {item}
                    </li>
                  ))}
              </ul>
            )
          case "quote":
            return (
              <blockquote key={block.id} className="bg-gray-100 border-l-4 border-gray-500 pl-4 italic mb-4">
                <p className="text-gray-700">{block.content}</p>
              </blockquote>
            )
          default:
            return <div key={block.id}>Unknown block type: {block.type}</div>
        }
      })}
    </div>
  )
}
