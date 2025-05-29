"use client"

import React, { JSX } from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

// Define types for structured content
interface BaseBlock {
  id: string
  type: string
  order: number
}

interface HeadingBlock extends BaseBlock {
  level: number
  content: string
}

interface ParagraphBlock extends BaseBlock {
  content: string
  section?: string
}

interface ImageBlock extends BaseBlock {
  imageUrl: string
  caption: string
}

interface RatingBlock extends BaseBlock {
  productName: string
  ratings: {
    ingredients?: number
    value?: number
    manufacturer?: number
    safety?: number
    effectiveness?: number
  }
  highlights: Array<{
    id: string
    content: string
    order: number
  }>
}

interface ProsConsBlock extends BaseBlock {
  pros: Array<{
    id: string
    content: string
    order: number
  }>
  cons: Array<{
    id: string
    content: string
    order: number
  }>
  ingredients: Array<{
    id: string
    content: string
    order: number
  }>
}

interface IngredientsBlock extends BaseBlock {
  productName: string
  introduction: string
  ingredientsList: Array<{
    id: string
    number: number
    name: string
    imageUrl: string
    description: string
    studyYear?: string
    studySource?: string
    studyDescription?: string
  }>
}

interface CtaBlock extends BaseBlock {
  text: string
  buttonText: string
  buttonLink: string
  backgroundColor: string
}

type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | RatingBlock
  | ProsConsBlock
  | IngredientsBlock
  | CtaBlock

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
    imageUrl?: string
    studyYear?: string
    studySource?: string
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
  structuredContent: ContentBlock[]
}

interface ArticleWrapperProps {
  id: string
}

const ArticleWrapper: React.FC<ArticleWrapperProps> = ({ id }) => {
  const [articleData, setArticleData] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayMode, setDisplayMode] = useState<"structured" | "flexible">("structured")

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/article?id=${id}`)

        if (!response.ok) {
          throw new Error(`Error fetching article: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          setArticleData(data.article)

          // If the article has minimal structured content, switch to flexible mode
          if (
            !data.article.overview &&
            !data.article.description &&
            !data.article.howToTake &&
            data.article.structuredContent &&
            data.article.structuredContent.length > 0
          ) {
            setDisplayMode("flexible")
          }
        } else {
          setError(data.message || "Failed to fetch article")
          console.error("Error fetching article:", data.message)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred")
        console.error("Error fetching article:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
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

  if (error || !articleData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Article Not Found</h2>
          <p>
            {error ||
              "We couldn't find the article you're looking for. It may have been removed or the ID is incorrect."}
          </p>
        </div>
      </div>
    )
  }

  // Render a block based on its type
  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "heading":
        const headingBlock = block as HeadingBlock
        const HeadingTag = `h${Math.min(headingBlock.level, 6)}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag
            key={block.id}
            className={`font-bold text-blue-600 mb-4 ${
              headingBlock.level === 1 ? "text-3xl" : headingBlock.level === 2 ? "text-2xl" : "text-xl"
            }`}
          >
            {headingBlock.content}
          </HeadingTag>
        )

      case "paragraph":
        const paragraphBlock = block as ParagraphBlock
        return (
          <div
            key={block.id}
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{ __html: paragraphBlock.content }}
          />
        )

      case "image":
        const imageBlock = block as ImageBlock
        return (
          <div key={block.id} className="mb-6 text-center">
            <Image
              src={imageBlock.imageUrl || "/placeholder.svg"}
              alt={imageBlock.caption || "Image"}
              width={800}
              height={400}
              className="mx-auto rounded-lg shadow-md"
            />
            {imageBlock.caption && <p className="text-gray-600 mt-2 text-sm">{imageBlock.caption}</p>}
          </div>
        )

      case "rating":
        const ratingBlock = block as RatingBlock
        return (
          <div key={block.id} className="mb-8">
            {ratingBlock.productName && (
              <h3 className="text-xl font-semibold mb-3">{ratingBlock.productName} Ratings</h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ratingBlock.ratings.ingredients && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Ingredients:</span> {ratingBlock.ratings.ingredients} / 5
                  </p>
                </div>
              )}
              {ratingBlock.ratings.value && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Value:</span> {ratingBlock.ratings.value} / 5
                  </p>
                </div>
              )}
              {ratingBlock.ratings.manufacturer && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Manufacturer:</span> {ratingBlock.ratings.manufacturer} / 5
                  </p>
                </div>
              )}
              {ratingBlock.ratings.safety && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Safety:</span> {ratingBlock.ratings.safety} / 5
                  </p>
                </div>
              )}
              {ratingBlock.ratings.effectiveness && (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Effectiveness:</span> {ratingBlock.ratings.effectiveness} / 5
                  </p>
                </div>
              )}
            </div>

            {ratingBlock.highlights && ratingBlock.highlights.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Highlights</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {ratingBlock.highlights.map((highlight) => (
                    <li key={highlight.id} className="text-gray-700">
                      {highlight.content}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )

      case "pros-cons":
        const prosConsBlock = block as ProsConsBlock
        return (
          <div key={block.id} className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Pros and Cons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {prosConsBlock.pros.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-600 mb-2">Pros</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {prosConsBlock.pros.map((pro) => (
                      <li key={pro.id} className="text-gray-700">
                        {pro.content}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {prosConsBlock.cons.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-red-600 mb-2">Cons</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {prosConsBlock.cons.map((con) => (
                      <li key={con.id} className="text-gray-700">
                        {con.content}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {prosConsBlock.ingredients.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Key Ingredients</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {prosConsBlock.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="text-gray-700">
                      {ingredient.content}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )

      case "ingredients":
        const ingredientsBlock = block as IngredientsBlock
        return (
          <div key={block.id} className="mb-8">
            <h3 className="text-xl font-semibold mb-3">
              {ingredientsBlock.productName ? `${ingredientsBlock.productName} Ingredients` : "Ingredients"}
            </h3>

            {ingredientsBlock.introduction && <p className="text-gray-700 mb-4">{ingredientsBlock.introduction}</p>}

            <div className="space-y-4">
              {ingredientsBlock.ingredientsList.map((ingredient) => (
                <div key={ingredient.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    {ingredient.imageUrl && (
                      <div className="mr-4 flex-shrink-0">
                        <Image
                          src={ingredient.imageUrl || "/placeholder.svg"}
                          alt={ingredient.name}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-lg">{ingredient.name}</h4>
                      <p className="text-gray-700 mt-1">{ingredient.description}</p>

                      {(ingredient.studyYear || ingredient.studySource) && (
                        <div className="mt-2 text-sm text-gray-600">
                          {ingredient.studyYear && <span>Study ({ingredient.studyYear}): </span>}
                          {ingredient.studySource && <span>{ingredient.studySource}</span>}
                          {ingredient.studyDescription && <p className="mt-1">{ingredient.studyDescription}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "cta":
        const ctaBlock = block as CtaBlock
        return (
          <div
            key={block.id}
            className="mb-8 p-6 rounded-lg text-center"
            style={{ backgroundColor: ctaBlock.backgroundColor || "#f3f4f6" }}
          >
            {ctaBlock.text && <p className="text-lg mb-4">{ctaBlock.text}</p>}
            {ctaBlock.buttonText && ctaBlock.buttonLink && (
              <a
                href={ctaBlock.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {ctaBlock.buttonText}
              </a>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Flexible content view that renders all blocks in order
  const renderFlexibleContent = () => {
    return <div className="article-content">{articleData.structuredContent.map((block) => renderBlock(block))}</div>
  }

  // Check if the article has minimal structured content
  const hasMinimalStructuredContent =
    !articleData.overview &&
    !articleData.description &&
    !articleData.howToTake &&
    !articleData.safety &&
    !articleData.effectiveness &&
    !articleData.howItWorks &&
    !articleData.conclusion &&
    (!articleData.pros || articleData.pros.length === 0) &&
    (!articleData.cons || articleData.cons.length === 0) &&
    (!articleData.ingredients || articleData.ingredients.length === 0)

  // If the article has minimal structured content but has blocks, use flexible mode
  if (hasMinimalStructuredContent && articleData.structuredContent.length > 0) {
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

        {/* Render all blocks in order */}
        {renderFlexibleContent()}

        <div className="text-center text-gray-500 text-sm mt-8">
          <p>Last updated: {new Date(articleData.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    )
  }

  // If there's no content at all, show the minimal view
  if (hasMinimalStructuredContent && articleData.structuredContent.length === 0) {
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

        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-md text-center my-8">
          <h2 className="text-xl font-semibold mb-3">Content Coming Soon</h2>
          <p>
            This article is currently being developed. Check back soon for detailed information about{" "}
            {articleData.title}.
          </p>
        </div>

        <div className="text-center text-gray-500 text-sm mt-8">
          <p>Last updated: {new Date(articleData.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    )
  }

  // Toggle between structured and flexible view
  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === "structured" ? "flexible" : "structured")
  }

  // Regular structured content view
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

      {/* Display Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button onClick={toggleDisplayMode} className="text-sm text-blue-600 hover:text-blue-800 underline">
          Switch to {displayMode === "structured" ? "Block View" : "Structured View"}
        </button>
      </div>

      {displayMode === "flexible" ? (
        // Flexible content view
        renderFlexibleContent()
      ) : (
        // Structured content view
        <>
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
          {(articleData.overallRating > 0 ||
            articleData.ingredientsRating > 0 ||
            articleData.valueRating > 0 ||
            articleData.manufacturerRating > 0 ||
            articleData.safetyRating > 0) && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Ratings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articleData.overallRating > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Overall Rating:</span> {articleData.overallRating} / 5
                    </p>
                  </div>
                )}
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
          {(articleData.pricing?.singleBottle ||
            articleData.pricing?.threeBottles ||
            articleData.pricing?.sixBottles) && (
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
          {(articleData.manufacturerInfo?.name ||
            articleData.manufacturerInfo?.location ||
            articleData.manufacturerInfo?.description) && (
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
                    <div className="flex items-start">
                      {ingredient.imageUrl && (
                        <div className="mr-4 flex-shrink-0">
                          <Image
                            src={ingredient.imageUrl || "/placeholder.svg"}
                            alt={ingredient.name}
                            width={80}
                            height={80}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{ingredient.name}</h3>
                        <div
                          className="text-gray-700 mt-2"
                          dangerouslySetInnerHTML={{ __html: ingredient.description }}
                        />
                        {ingredient.benefits && (
                          <p className="text-gray-600 mt-2">
                            <span className="font-medium">Benefits:</span> {ingredient.benefits}
                          </p>
                        )}
                        {(ingredient.studyYear || ingredient.studySource) && (
                          <div className="mt-2 text-sm text-gray-600">
                            {ingredient.studyYear && <span>Study ({ingredient.studyYear}): </span>}
                            {ingredient.studySource && <span>{ingredient.studySource}</span>}
                          </div>
                        )}
                      </div>
                    </div>
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
        </>
      )}

      <div className="text-center text-gray-500 text-sm mt-8">
        <p>Last updated: {new Date(articleData.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default ArticleWrapper
