"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { ArticleData } from "@/types" // Make sure to define the types correctly

const ArticleContent = () => {
  const [articleData, setArticleData] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const { id } = router.query // Extract the article ID from the URL query parameters

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        setLoading(true)
        try {
          const response = await fetch(`/api/article?id=${id}`) // API call with the article ID
          const data = await response.json()

          if (data.success) {
            setArticleData(data.article)
          } else {
            // Handle the error (article not found)
            console.error('Error fetching article:', data.message)
          }
        } catch (error) {
          console.error('Error fetching article:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchArticle()
    }
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!articleData) {
    return <div>No article found</div>
  }

  return (
    <div className="article-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Article Title */}
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-4">{articleData.title}</h1>

      {/* Article Overview */}
      <section id="overview" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Overview</h2>
        <p className="text-gray-700">{articleData.overview}</p>
      </section>

      {/* Article Description */}
      <section id="description" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Description</h2>
        <p className="text-gray-700">{articleData.description}</p>
      </section>

      {/* How to Take the Product */}
      <section id="how-to-take" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">How to Take {articleData.title}</h2>
        <p className="text-gray-700">{articleData.howToTake}</p>
      </section>

      {/* Benefits */}
      <section id="benefits" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Benefits</h2>
        <ul className="list-disc pl-5 space-y-2">
          {articleData.benefits.map((benefit, index) => (
            <li key={index} className="text-gray-700">
              <strong>{benefit.title}: </strong>{benefit.description}
            </li>
          ))}
        </ul>
      </section>

      {/* Ratings Section */}
      <section id="ratings" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Ratings</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Overall Rating:</span>
            <span className="font-semibold">{articleData.overallRating} / 5</span>
          </div>
          <div className="flex justify-between">
            <span>Ingredients Rating:</span>
            <span className="font-semibold">{articleData.ingredientsRating} / 5</span>
          </div>
          <div className="flex justify-between">
            <span>Value Rating:</span>
            <span className="font-semibold">{articleData.valueRating} / 5</span>
          </div>
          <div className="flex justify-between">
            <span>Manufacturer Rating:</span>
            <span className="font-semibold">{articleData.manufacturerRating} / 5</span>
          </div>
          <div className="flex justify-between">
            <span>Safety Rating:</span>
            <span className="font-semibold">{articleData.safetyRating} / 5</span>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section id="ingredients" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Ingredients</h2>
        <ul className="list-disc pl-5 space-y-2">
          {articleData.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700">
              <strong>{ingredient.name}:</strong> {ingredient.description} <br />
              <span className="text-gray-600">Benefits: {ingredient.benefits}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Pros and Cons */}
      <section id="pros-cons" className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div id="pros">
          <h3 className="text-xl font-bold text-green-600 mb-3">Pros</h3>
          <ul className="list-disc pl-5 space-y-2">
            {articleData.pros.map((pro, index) => (
              <li key={index} className="text-gray-700">{pro}</li>
            ))}
          </ul>
        </div>

        <div id="cons">
          <h3 className="text-xl font-bold text-red-600 mb-3">Cons</h3>
          <ul className="list-disc pl-5 space-y-2">
            {articleData.cons.map((con, index) => (
              <li key={index} className="text-gray-700">{con}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Safety Information */}
      <section id="safety" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Safety</h2>
        <p className="text-gray-700">{articleData.safety}</p>
      </section>

      {/* Effectiveness */}
      <section id="effectiveness" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Effectiveness</h2>
        <p className="text-gray-700">{articleData.effectiveness}</p>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Pricing</h2>
        <div className="text-gray-700">
          <p><strong>1 Bottle: </strong>{articleData.pricing.singleBottle}</p>
          <p><strong>3 Bottles: </strong>{articleData.pricing.threeBottles}</p>
          <p><strong>6 Bottles: </strong>{articleData.pricing.sixBottles}</p>
        </div>
      </section>

      {/* Manufacturer Information */}
      <section id="manufacturer" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Manufacturer</h2>
        <p className="text-gray-700">
          <strong>{articleData.manufacturerInfo.name}</strong> is located in {articleData.manufacturerInfo.location}.
          {articleData.manufacturerInfo.description}
        </p>
      </section>

      {/* Conclusion */}
      <section id="conclusion" className="mb-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Conclusion</h2>
        <p className="text-gray-700">{articleData.conclusion}</p>
      </section>

      {/* Official Website */}
      <section id="website" className="mb-6 text-center">
        <a
          href={articleData.officialWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700"
        >
          Visit Official Website
        </a>
      </section>
    </div>
  )
}

export default ArticleContent
