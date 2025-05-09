/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react"
import { useState } from "react"
import { PlusCircle, Trash2, Save, X } from "lucide-react"
import CTASection from "./CtaSection"

interface ArticleData {
  id: string
  title: string
  overview: string
  description: string
  howToTake: string
  benefits: { title: string; description: string }[]
  overallRating: number
  ingredientsRating: number
  valueRating: number
  manufacturerRating: number
  safetyRating: number
  brandHighlights: string[]
  keyIngredients: string[]
  pros: string[]
  cons: string[]
  safety: string
  effectiveness: string
  pricing: { singleBottle: string; threeBottles: string; sixBottles: string }
  manufacturerInfo: { name: string; location: string; description: string }
  howItWorks: string
  ingredients: { name: string; description: string; benefits: string }[]
  faqs: { question: string; answer: string }[]
  customerReviews: { name: string; location: string; rating: number; review: string }[]
  conclusion: string
  officialWebsite: string
  productImage: string
  ctaButtons: { text: string; url: string; type: string; position: string; description: string }[]
}

export default function ArticleAdminForm() {
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ArticleData>({
    id: "",
    title: "",
    overview: "",
    description: "",
    howToTake: "",
    benefits: [{ title: "", description: "" }],
    overallRating: 0,
    ingredientsRating: 0,
    valueRating: 0,
    manufacturerRating: 0,
    safetyRating: 0,
    brandHighlights: [""],
    keyIngredients: [""],
    pros: [""],
    cons: [""],
    safety: "",
    effectiveness: "",
    pricing: {
      singleBottle: "",
      threeBottles: "",
      sixBottles: "",
    },
    manufacturerInfo: {
      name: "",
      location: "",
      description: "",
    },
    howItWorks: "",
    ingredients: [{ name: "", description: "", benefits: "" }],
    faqs: [{ question: "", answer: "" }],
    customerReviews: [{ name: "", location: "", rating: 5, review: "" }],
    conclusion: "",
    officialWebsite: "",
    productImage: "",
    ctaButtons: [{ text: "Buy Now", url: "", type: "primary", position: "bottom", description: "" }],
  })

  // Handle input changes for simple fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof ArticleData] as Record<string, any>),
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Make API call to the backend to save the article
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        alert("Article saved successfully!")
        // Optionally reset form data after successful submission
        setFormData({
          ...formData,
          title: "",
          overview: "",
          description: "",
          // Reset other fields if needed...
        })
      } else {
        alert("Error saving article. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Error saving article. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Article Content Management</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tabs */}
            <div className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-6 border-b">
                {["basic", "benefits", "ratings", "highlights", "ingredients", "details", "faqs", "reviews", "cta"].map(
                  (tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-4 text-center capitalize ${
                        activeTab === tab
                          ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ),
                )}
              </div>

              {/* Basic Info Tab */}
              <div className={`space-y-4 ${activeTab !== "basic" ? "hidden" : ""}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Product Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="overview" className="block text-sm font-medium text-gray-700 mb-1">
                    Overview
                  </label>
                  <textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the product"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the product"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Other input fields (How To Take, Product Image, etc.) */}
                {/* You can include all your existing fields here */}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() =>
                    setFormData({
                      id: "",
                      title: "",
                      overview: "",
                      description: "",
                      howToTake: "",
                      benefits: [{ title: "", description: "" }],
                      overallRating: 0,
                      ingredientsRating: 0,
                      valueRating: 0,
                      manufacturerRating: 0,
                      safetyRating: 0,
                      brandHighlights: [""],
                      keyIngredients: [""],
                      pros: [""],
                      cons: [""],
                      safety: "",
                      effectiveness: "",
                      pricing: {
                        singleBottle: "",
                        threeBottles: "",
                        sixBottles: "",
                      },
                      manufacturerInfo: {
                        name: "",
                        location: "",
                        description: "",
                      },
                      howItWorks: "",
                      ingredients: [{ name: "", description: "", benefits: "" }],
                      faqs: [{ question: "", answer: "" }],
                      customerReviews: [{ name: "", location: "", rating: 5, review: "" }],
                      conclusion: "",
                      officialWebsite: "",
                      productImage: "",
                      ctaButtons: [{ text: "Buy Now", url: "", type: "primary", position: "bottom", description: "" }],
                    })
                  }
                  disabled={loading}
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Article
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
