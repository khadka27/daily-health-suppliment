"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

interface Block {
  id: string
  type: string
  content?: string
  level?: number
  listType?: string
  imageUrl?: string
  language?: string
  ctaText?: string
  ctaLink?: string
  productName?: string
  overallRating?: number
  ingredientsIntroduction?: string
  howToUse?: string
  price?: string
  verdict?: string
  author?: string
  reviewDate?: string
  medicallyReviewed?: boolean
  factChecked?: boolean
  ctaButtonText?: string
  ctaButtonLink?: string
  backgroundColor?: string
  order: number
  ratings?: {
    ingredients?: number
    value?: number
    manufacturer?: number
    safety?: number
    effectiveness?: number
  }
  pros?: { content: string; order: number }[]
  cons?: { content: string; order: number }[]
  ingredients?: { content: string; order: number }[]
  highlights?: { content: string; order: number }[]
  customFields?: { name: string; value: string }[]
  ingredientsList?: {
    number: number
    name: string
    imageUrl: string
    description: string
    studyYear?: string
    studySource?: string
    studyDescription?: string
  }[]
}

interface Article {
  id: string
  title: string
  slug: string
  author: string
  publishDate: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  blocks: Block[]
}

interface ArticleWrapperProps {
  id: string
}

const ArticleWrapper: React.FC<ArticleWrapperProps> = ({ id }) => {
  const [articleData, setArticleData] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/articles/${id}`)

        if (!response.ok) {
          throw new Error(`Error fetching article: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setArticleData(data)
      } catch (error) {
        console.error("Error fetching article:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!articleData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Article Not Found</h2>
          <p>We couldn't find the article you're looking for. It may have been removed or the ID is incorrect.</p>
        </div>
      </div>
    )
  }

  // Render article content based on blocks
  return (
    <div className="article-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Display Article Title */}
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">{articleData.title}</h1>

      {/* Article Meta */}
      <div className="text-center text-gray-600 mb-8">
        {articleData.author && <span className="mr-4">By: {articleData.author}</span>}
        {articleData.publishDate && <span>Published: {new Date(articleData.publishDate).toLocaleDateString()}</span>}
      </div>

      {/* Featured Image */}
      {articleData.imageUrl && (
        <div className="mb-6 text-center">
          <Image
            src={articleData.imageUrl || "/placeholder.svg"}
            alt={articleData.title}
            width={800}
            height={400}
            className="mx-auto rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Render blocks based on their type */}
      <div className="space-y-6">
        {articleData.blocks.map((block) => (
          <div key={block.id} className="mb-6">
            {block.type === "heading" && (
              <h2 className={`font-bold text-blue-600 ${block.level === 1 ? 'text-2xl' : block.level === 2 ? 'text-xl' : 'text-lg'} mb-4`}>
                {block.content}
              </h2>
            )}
            
            {block.type === "paragraph" && (
              <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: block.content || '' }} />
            )}
            
            {block.type === "image" && block.imageUrl && (
              <div className="my-4 text-center">
                <Image
                  src={block.imageUrl || "/placeholder.svg"}
                  alt={block.content || "Article image"}
                  width={600}
                  height={400}
                  className="mx-auto rounded-lg shadow-md"
                />
                {block.content && <p className="text-sm text-gray-500 mt-2">{block.content}</p>}
              </div>
            )}
            
            {block.type === "list" && block.content && (
              <ul className={block.listType === "ordered" ? "list-decimal pl-5" : "list-disc pl-5"}>
                {block.content.split('\n').map((item, i) => (
                  <li key={i} className="text-gray-700 mb-2">{item}</li>
                ))}
              </ul>
            )}
            
            {block.type === "code" && (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{block.content}</code>
              </pre>
            )}
            
            {block.type === "cta" && (
              <div className="bg-blue-50 p-4 rounded-lg text-center my-6">
                <p className="text-lg mb-3">{block.ctaText}</p>
                {block.ctaLink && (
                  <a 
                    href={block.ctaLink} 
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {block.ctaButtonText || "Learn More"}
                  </a>
                )}
              </div>
            )}
            
            {block.type === "productReview" && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm my-6">
                {block.productName && <h3 className="text-xl font-bold mb-3">{block.productName}</h3>}
                
                {block.overallRating && (
                  <div className="mb-4">
                    <p className="font-semibold">Overall Rating: {block.overallRating}/5</p>
                  </div>
                )}
                
                {block.ratings && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {block.ratings.ingredients && (
                      <div><span className="font-medium">Ingredients:</span> {block.ratings.ingredients}/5</div>
                    )}
                    {block.ratings.value && (
                      <div><span className="font-medium">Value:</span> {block.ratings.value}/5</div>
                    )}
                    {block.ratings.manufacturer && (
                      <div><span className="font-medium">Manufacturer:</span> {block.ratings.manufacturer}/5</div>
                    )}
                    {block.ratings.safety && (
                      <div><span className="font-medium">Safety:</span> {block.ratings.safety}/5</div>
                    )}
                    {block.ratings.effectiveness && (
                      <div><span className="font-medium">Effectiveness:</span> {block.ratings.effectiveness}/5</div>
                    )}
                  </div>
                )}
                
                {/* Pros and Cons */}
                {(block.pros?.length > 0 || block.cons?.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    {block.pros && block.pros.length > 0 && (
                      <div className="bg-green-50 p-3 rounded">
                        <h4 className="font-bold text-green-700 mb-2">Pros</h4>
                        <ul className="list-disc pl-5">
                          {block.pros.map((pro, idx) => (
                            <li key={idx} className="text-gray-700">{pro.content}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {block.cons && block.cons.length > 0 && (
                      <div className="bg-red-50 p-3 rounded">
                        <h4 className="font-bold text-red-700 mb-2">Cons</h4>
                        <ul className="list-disc pl-5">
                          {block.cons.map((con, idx) => (
                            <li key={idx} className="text-gray-700">{con.content}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {block.verdict && (
                  <div className="mt-4">
                    <h4 className="font-bold mb-2">Verdict</h4>
                    <p>{block.verdict}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Last updated: {new Date(articleData.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default ArticleWrapper
