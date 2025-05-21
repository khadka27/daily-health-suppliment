"use client"

import type React from "react"
import { useState, useEffect } from "react"

// Update the interface to match our transformed article structure
interface Article {
  id: string
  title: string
  slug: string
  author: string
  publishDate: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  overview: string
  description: string
  howToTake: string
  safety: string
  effectiveness: string
  howItWorks: string
  conclusion: string
  officialWebsite: string
  overallRating: number
  ingredientsRating: number
  valueRating: number
  manufacturerRating: number
  safetyRating: number
  pros: string[]
  cons: string[]
  brandHighlights: string[]
  keyIngredients: string[]
  pricing: {
    singleBottle: string
    threeBottles: string
    sixBottles: string
  }
  manufacturerInfo: {
    name: string
    location: string
    description: string
  }
  ingredients: Array<{
    name: string
    description: string
    benefits: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  customerReviews: Array<{
    name: string
    location: string
    rating: number
    review: string
  }>
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
        const response = await fetch(`/api/article?id=${id}`)

        if (!response.ok) {
          throw new Error(`Error fetching article: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          setArticleData(data.article)
        } else {
          console.error("Error fetching article:", data.message)
        }
      } catch (error) {
        console.error("Error fetching article:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id]) // Only run the effect when `id` changes

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-xl">Loading article...</div>
      </div>
    )
  }

  if (!articleData) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Article Not Found</h2>
          <p>We couldn't find the article you're looking for.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{articleData.title}</h1>
      <div className="prose" dangerouslySetInnerHTML={{ __html: articleData.description }} />
    </div>
  )
}

export default ArticleWrapper
