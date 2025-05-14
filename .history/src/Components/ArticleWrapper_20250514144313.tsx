/* eslint-disable @typescript-eslint/no-explicit-any */
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

      {/* How to Take the Product */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">How to Take</h2>
        <p className="text-gray-700">{articleData.howToTake}</p>
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

      {/* Ratings Section */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Ratings</h2>
        <p className="text-gray-700">Overall Rating: {articleData.overallRating} / 5</p>
        <p className="text-gray-700">Ingredients Rating: {articleData.ingredientsRating} / 5</p>
        <p className="text-gray-700">Value Rating: {articleData.valueRating} / 5</p>
        <p className="text-gray-700">Manufacturer Rating: {articleData.manufacturerRating} / 5</p>
        <p className="text-gray-700">Safety Rating: {articleData.safetyRating} / 5</p>
      </section>

      {/* Brand Highlights */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Brand Highlights</h2>
        <ul className="list-disc pl-5 space-y-2">
          {articleData.brandHighlights?.map((highlight: string, index: number) => (
            <li key={index} className="text-gray-700">{highlight}</li>
          ))}
        </ul>
      </section>

      {/* Key Ingredients */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Key Ingredients</h2>
        <ul className="list-disc pl-5 space-y-2">
          {articleData.keyIngredients?.map((ingredient: string, index: number) => (
            <li key={index} className="text-gray-700">{ingredient}</li>
          ))}
        </ul>
      </section>

      {/* Pros and Cons */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold text-green-600 mb-3">Pros</h3>
          <ul className="list-disc pl-5 space-y-2">
            {articleData.pros?.map((pro: string, index: number) => (
              <li key={index} className="text-gray-700">{pro}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-red-600 mb-3">Cons</h3>
          <ul className="list-disc pl-5 space-y-2">
            {articleData.cons?.map((con: string, index: number) => (
              <li key={index} className="text-gray-700">{con}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Safety Information */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Safety</h2>
        <p className="text-gray-700">{articleData.safety}</p>
      </section>

      {/* Effectiveness */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Effectiveness</h2>
        <p className="text-gray-700">{articleData.effectiveness}</p>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Pricing</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-gray-700">1 Bottle: {articleData.pricing?.singleBottle}</li>
          <li className="text-gray-700">3 Bottles: {articleData.pricing?.threeBottles}</li>
          <li className="text-gray-700">6 Bottles: {articleData.pricing?.sixBottles}</li>
        </ul>
      </section>

      {/* Manufacturer Information */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Manufacturer</h2>
        <p className="text-gray-700">
          <strong>{articleData.manufacturerInfo?.name}</strong> is located in {articleData.manufacturerInfo?.location}.
          {articleData.manufacturerInfo?.description}
        </p>
      </section>

      {/* How it Works */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">How it Works</h2>
        <p className="text-gray-700">{articleData.howItWorks}</p>
      </section>

      {/* Ingredients Section */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Ingredients</h2>
        <ul className="list-disc pl-5 space-y-2">
          {articleData.ingredients?.map((ingredient: any, index: number) => (
            <li key={index} className="text-gray-700">
              <strong>{ingredient.name}:</strong> {ingredient.description} <br />
              <span className="text-gray-600">Benefits: {ingredient.benefits}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">FAQs</h2>
        {articleData.faqs?.map((faq: any, index: number) => (
          <div key={index}>
            <h3 className="text-lg font-semibold">{faq.question}</h3>
            <p className="text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </section>

      {/* Customer Reviews */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Customer Reviews</h2>
        {articleData.customerReviews?.map((review: any, index: number) => (
          <div key={index} className="border-b pb-4 mb-4">
            <p className="italic">"{review.review}"</p>
            <p className="font-bold">{review.name} from {review.location}</p>
            <p className="text-yellow-500">Rating: {review.rating} / 5</p>
          </div>
        ))}
      </section>

      {/* Conclusion */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Conclusion</h2>
        <p className="text-gray-700">{articleData.conclusion}</p>
      </section>

      {/* Official Website Link */}
      <section>
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Official Website</h2>
        <a
          href={articleData.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Visit Official Website
        </a>
      </section>
    </div>
  )
}

export default ArticleWrapper
