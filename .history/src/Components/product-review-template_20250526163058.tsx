"use client"

import { useState } from "react"
import { Star, Check, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ProductReviewTemplateProps {
  productName: string
  overallRating: number
  imageUrl?: string
  description?: string
  pros?: string[]
  cons?: string[]
  ingredients?: string[]
  howToUse?: string
  effectiveness?: number
  safety?: number
  value?: number
  price?: string
  verdict?: string
  customFields?: Array<{
    id: string
    name: string
    value: string
  }>
  ctaButtonText?: string
  ctaButtonLink?: string
  backgroundColor?: string
  author?: string
  reviewDate?: string
  medicallyReviewed?: boolean
  factChecked?: boolean
}

export function ProductReviewTemplate({
  productName,
  overallRating,
  imageUrl,
  description,
  pros = [],
  cons = [],
  ingredients = [],
  howToUse,
  effectiveness = 0,
  safety = 0,
  value = 0,
  price,
  verdict,
  customFields = [],
  ctaButtonText = "Check Best Price",
  ctaButtonLink = "#",
  backgroundColor = "#f0f9ff",
  author = "Editorial Team",
  reviewDate = new Date().toLocaleDateString(),
  medicallyReviewed = false,
  factChecked = false,
}: ProductReviewTemplateProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Helper function to render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-yellow-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    )
  }

  // Helper function to render rating bar
  const renderRatingBar = (rating: number, label: string) => {
    const percentage = (rating / 5) * 100

    return (
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-medium">{rating}/5</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-8 border rounded-lg overflow-hidden" style={{ backgroundColor }}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">{productName} Review</h2>
          <div className="flex items-center">
            <span className="text-lg font-bold mr-2">{overallRating}</span>
            {renderStars(overallRating)}
          </div>
        </div>
      </div>

      {/* Author info and verification */}
      <div className="bg-gray-100 p-3 border-b flex flex-wrap items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          {author && (
            <div className="flex items-center">
              <span className="font-medium">By:</span>
              <span className="ml-1">{author}</span>
            </div>
          )}
          {reviewDate && (
            <div className="flex items-center">
              <span className="font-medium">Updated:</span>
              <span className="ml-1">{reviewDate}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {medicallyReviewed && (
            <div className="flex items-center text-green-600">
              <Check className="h-4 w-4 mr-1" />
              <span>Medically Reviewed</span>
            </div>
          )}
          {factChecked && (
            <div className="flex items-center text-green-600">
              <Check className="h-4 w-4 mr-1" />
              <span>Fact Checked</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product image */}
          {imageUrl && (
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <div className="sticky top-4">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={productName}
                  className="w-full rounded-lg shadow-md mb-4"
                />
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="mb-4">
                    <div className="text-center font-bold text-lg mb-2">Overall Rating</div>
                    <div className="flex justify-center mb-2">{renderStars(overallRating)}</div>
                    <div className="text-center text-3xl font-bold text-blue-600">{overallRating}/5</div>
                  </div>

                  {price && (
                    <div className="mb-4">
                      <div className="text-center font-bold mb-1">Price</div>
                      <div className="text-center text-xl font-bold text-green-600">{price}</div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
                    onClick={() => window.open(ctaButtonLink, "_blank")}
                  >
                    {ctaButtonText}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Content area */}
          <div className="flex-1">
            {/* Navigation tabs */}
            <div className="border-b mb-6">
              <nav className="flex flex-wrap -mb-px">
                <button
                  className={`inline-flex items-center py-2 px-4 text-sm font-medium border-b-2 ${
                    activeTab === "overview"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`inline-flex items-center py-2 px-4 text-sm font-medium border-b-2 ${
                    activeTab === "ingredients"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("ingredients")}
                >
                  Ingredients
                </button>
                <button
                  className={`inline-flex items-center py-2 px-4 text-sm font-medium border-b-2 ${
                    activeTab === "usage" ? "border-blue-600 text-blue-600" : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("usage")}
                >
                  How to Use
                </button>
                <button
                  className={`inline-flex items-center py-2 px-4 text-sm font-medium border-b-2 ${
                    activeTab === "ratings"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("ratings")}
                >
                  Ratings
                </button>
                <button
                  className={`inline-flex items-center py-2 px-4 text-sm font-medium border-b-2 ${
                    activeTab === "verdict"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("verdict")}
                >
                  Verdict
                </button>
              </nav>
            </div>

            {/* Tab content */}
            <div className="tab-content">
              {/* Overview tab */}
              {activeTab === "overview" && (
                <div>
                  {description && <p className="mb-6">{description}</p>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Pros */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-bold text-green-800 mb-3 flex items-center">
                        <Check className="h-5 w-5 mr-2" />
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-bold text-red-800 mb-3 flex items-center">
                        <X className="h-5 w-5 mr-2" />
                        Cons
                      </h3>
                      <ul className="space-y-2">
                        {cons.map((con, idx) => (
                          <li key={idx} className="flex items-start">
                            <X className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Custom fields */}
                  {customFields.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-lg mb-3">Additional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customFields.map((field) => (
                          <div key={field.id} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                              <Info className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">{field.name}</div>
                              <div className="font-semibold">{field.value}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ingredients tab */}
              {activeTab === "ingredients" && (
                <div>
                  <h3 className="font-bold text-lg mb-4">Key Ingredients</h3>
                  {ingredients.length > 0 ? (
                    <ul className="space-y-4">
                      {ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 mt-1 flex-shrink-0">
                            <span className="text-xs font-bold">{idx + 1}</span>
                          </div>
                          <div>
                            <p>{ingredient}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No ingredient information available.</p>
                  )}
                </div>
              )}

              {/* Usage tab */}
              {activeTab === "usage" && (
                <div>
                  <h3 className="font-bold text-lg mb-4">How to Use {productName}</h3>
                  {howToUse ? (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{howToUse}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No usage information available.</p>
                  )}
                </div>
              )}

              {/* Ratings tab */}
              {activeTab === "ratings" && (
                <div>
                  <h3 className="font-bold text-lg mb-4">Detailed Ratings</h3>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    {renderRatingBar(effectiveness, "Effectiveness")}
                    {renderRatingBar(safety, "Safety")}
                    {renderRatingBar(value, "Value for Money")}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Overall Rating</span>
                        <div className="flex items-center">
                          <span className="font-bold mr-2">{overallRating}/5</span>
                          {renderStars(overallRating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Verdict tab */}
              {activeTab === "verdict" && (
                <div>
                  <h3 className="font-bold text-lg mb-4">Our Verdict</h3>
                  {verdict ? (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                      <p>{verdict}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No verdict available.</p>
                  )}

                  <div className="mt-6 text-center">
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-colors"
                      onClick={() => window.open(ctaButtonLink, "_blank")}
                    >
                      {ctaButtonText}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
