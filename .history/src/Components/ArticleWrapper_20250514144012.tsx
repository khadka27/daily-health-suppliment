/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Components/ArticleWrapper.tsx

"use client"

import { useState, useEffect } from "react"

interface ArticleWrapperProps {
  id: string; // The ID of the article to fetch
}

const ArticleWrapper: React.FC<ArticleWrapperProps> = ({ id }) => {
  const [articleData, setArticleData] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/article?id=${id}`)

        if (!response.ok) {
          throw new Error(`Error fetching article: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          setArticleData(data.article)
        } else {
          console.error('Error fetching article:', data.message)
        }
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id]) // Only run the effect when `id` changes

  if (loading) {
    return <div>Loading...</div>
  }

  if (!articleData) {
    return <div>No article found</div>
  }

  return (
    <div className="article-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Display Article Title */}
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">{articleData.title}</h1>

      {/* Article Overview */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Overview</h2>
        <p className="text-gray-700">{articleData.overview}</p>
      </section>

      {/* Article Description */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Description</h2>
        <p className="text-gray-700">{articleData.description}</p>
      </section>

      {/* Article Benefits */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Benefits</h2>
        <ul className="list-disc pl-5 space-y-2">
          {articleData.benefits?.map((benefit: any, index: number) => (
            <li key={index} className="text-gray-700">
              <strong>{benefit.title}:</strong> {benefit.description}
            </li>
          ))}
        </ul>
      </section>

      {/* Article Ratings */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Ratings</h2>
        <p className="text-gray-700">Overall Rating: {articleData.overallRating} / 5</p>
        <p className="text-gray-700">Ingredients Rating: {articleData.ingredientsRating} / 5</p>
        <p className="text-gray-700">Value Rating: {articleData.valueRating} / 5</p>
      </section>

      {/* Additional Sections like Safety, Effectiveness, Pricing, etc. */}
      {/* Add sections like Safety, Effectiveness, Pricing, etc., as per your data structure */}

    </div>
  )
}

export default ArticleWrapper
