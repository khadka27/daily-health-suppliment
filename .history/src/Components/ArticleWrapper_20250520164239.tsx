/* eslint-disable react/no-unescaped-entities */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

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

  return (
    <div className="article-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Display Article Title */}
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">{articleData.title}</h1>

      {/* Article Meta */}
      <div className="text-center text-gray-600 mb-8">
        {articleData.author && <span className="mr-4">By: {articleData.author}</span>}
        {articleData.publishDate && <span>Published: {new Date(articleData.publishDate).toLocaleDateString()}</span>}
      </div>

      {/* Article Overview */}
      {articleData.overview && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Overview</h2>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: articleData.overview }} />
        </section>
      )}

      {/* Article Description */}
      {articleData.description && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Description</h2>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: articleData.description }} />
        </section>
      )}

      {/* How to Take the Product */}
      {articleData.howToTake && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">How to Take</h2>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: articleData.howToTake }} />
        </section>
      )}

      {/* Ratings Section */}
      {articleData.overallRating > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Ratings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-gray-700">
                <span className="font-semibold">Overall Rating:</span> {articleData.overallRating} / 5
              </p>
            </div>
            {articleData.ingredientsRating > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Ingredients Rating:</span> {articleData.ingredientsRating} / 5
                </p>
              </div>
            )}
            {articleData.valueRating > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Value Rating:</span> {articleData.valueRating} / 5
                </p>
              </div>
            )}
            {articleData.manufacturerRating > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Manufacturer Rating:</span> {articleData.manufacturerRating} / 5
                </p>
              </div>
            )}
            {articleData.safetyRating > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">Safety Rating:</span> {articleData.safetyRating} / 5
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Brand Highlights */}
      {articleData.brandHighlights && articleData.brandHighlights.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Brand Highlights</h2>
          <ul className="list-disc pl-5 space-y-2">
            {articleData.brandHighlights.map((highlight, index) => (
              <li key={index} className="text-gray-700">
                {highlight}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Key Ingredients */}
      {articleData.keyIngredients && articleData.keyIngredients.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Key Ingredients</h2>
          <ul className="list-disc pl-5 space-y-2">
            {articleData.keyIngredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">
                {ingredient}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pros and Cons */}
      {(articleData.pros?.length > 0 || articleData.cons?.length > 0) && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Pros and Cons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articleData.pros && articleData.pros.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-green-600 mb-3">Pros</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {articleData.pros.map((pro, index) => (
                    <li key={index} className="text-gray-700">
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {articleData.cons && articleData.cons.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-red-600 mb-3">Cons</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {articleData.cons.map((con, index) => (
                    <li key={index} className="text-gray-700">
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Safety Information */}
      {articleData.safety && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Safety</h2>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: articleData.safety }} />
        </section>
      )}

      {/* Effectiveness */}
      {articleData.effectiveness && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Effectiveness</h2>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: articleData.effectiveness }} />
        </section>
      )}

      {/* Pricing */}
      {articleData.pricing && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Pricing</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {articleData.pricing.singleBottle && (
                <li className="text-gray-700">
                  <span className="font-semibold">1 Bottle:</span> {articleData.pricing.singleBottle}
                </li>
              )}
              {articleData.pricing.threeBottles && (
                <li className="text-gray-700">
                  <span className="font-semibold">3 Bottles:</span> {articleData.pricing.threeBottles}
                </li>
              )}
              {articleData.pricing.sixBottles && (
                <li className="text-gray-700">
                  <span className="font-semibold">6 Bottles:</span> {articleData.pricing.sixBottles}
                </li>
              )}
            </ul>
          </div>
        </section>
      )}

      {/* Manufacturer Information */}
      {articleData.manufacturerInfo && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Manufacturer</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              {articleData.manufacturerInfo.name && <strong>{articleData.manufacturerInfo.name}</strong>}
              {articleData.manufacturerInfo.location && (
                <span> is located in {articleData.manufacturerInfo.location}.</span>
              )}
              {articleData.manufacturerInfo.description && <span> {articleData.manufacturerInfo.description}</span>}
            </p>
          </div>
        </section>
      )}

      {/* How it Works */}
      {articleData.howItWorks && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">How it Works</h2>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: articleData.howItWorks }} />
        </section>
      )}

      {/* Ingredients Section */}
      {articleData.ingredients && articleData.ingredients.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Ingredients</h2>
          <div className="space-y-4">
            {articleData.ingredients.map((ingredient, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">{ingredient.name}</h3>
                <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: ingredient.description }} />
                {ingredient.benefits && (
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Benefits:</span> {ingredient.benefits}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {articleData.faqs && articleData.faqs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">FAQs</h2>
          <div className="space-y-4">
            {articleData.faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <div className="text-gray-700 mt-2" dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      {articleData.customerReviews && articleData.customerReviews.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {articleData.customerReviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <p className="italic text-gray-700">&quot;{review.review}&quot;</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="font-bold">
                    {review.name} {review.location && <span>from {review.location}</span>}
                  </p>
                  {review.rating > 0 && <p className="text-yellow-500">Rating: {review.rating} / 5</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Conclusion */}
      {articleData.conclusion && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Conclusion</h2>
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: articleData.conclusion }} />
        </section>
      )}

      {/* Official Website Link */}
      {articleData.officialWebsite && (
        <section className="mb-8 text-center">
          <a
            href={articleData.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Visit Official Website
          </a>
        </section>
      )}
    </div>
  )
}

export default ArticleWrapper
