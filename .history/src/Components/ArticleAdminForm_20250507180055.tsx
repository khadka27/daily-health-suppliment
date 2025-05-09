"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Save, X } from "lucide-react"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

interface ArticleData {
  id: string
  title: string
  overview: string
  description: string
  howToTake: string
  benefits: {
    title: string
    description: string
  }[]
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
  howItWorks: string
  ingredients: {
    name: string
    description: string
    benefits: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  customerReviews: {
    name: string
    location: string
    rating: number
    review: string
  }[]
  conclusion: string
  officialWebsite: string
  productImage: string
  cta: {
    heading: string
    content: string
    buttonText: string
    buttonUrl: string
    backgroundColor: string
  }
}

export default function ArticleAdminForm() {
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(false)
  const [editorLoaded, setEditorLoaded] = useState(false)
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
    cta: {
      heading: "Try Superconductor Slim Today!",
      content:
        "<p>Experience the benefits of our premium supplement. Order now and start your journey to better health!</p>",
      buttonText: "Order Now",
      buttonUrl: "#order",
      backgroundColor: "#4f46e5",
    },
  })

  // Load CKEditor dynamically on client-side only
  useEffect(() => {
    setEditorLoaded(true)
  }, [])

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

  // Handle CKEditor content change
  const handleEditorChange = (data: string) => {
    setFormData({
      ...formData,
      cta: {
        ...formData.cta,
        content: data,
      },
    })
  }

  // Handle array field changes
  const handleArrayChange = (index: number, field: keyof ArticleData, value: string) => {
    const updatedArray = [...(formData[field] as string[])]
    updatedArray[index] = value
    setFormData({
      ...formData,
      [field]: updatedArray,
    })
  }

  // Handle complex object array changes
  const handleObjectArrayChange = (
    index: number,
    field: keyof ArticleData,
    property: string,
    value: string | number,
  ) => {
    const updatedArray = [...(formData[field] as any[])]
    updatedArray[index] = {
      ...updatedArray[index],
      [property]: value,
    }
    setFormData({
      ...formData,
      [field]: updatedArray,
    })
  }

  // Add item to array
  const addArrayItem = (field: keyof ArticleData, template: any) => {
    const updatedArray = [...(formData[field] as any[])]
    updatedArray.push(template)
    setFormData({
      ...formData,
      [field]: updatedArray,
    })
  }

  // Remove item from array
  const removeArrayItem = (field: keyof ArticleData, index: number) => {
    const updatedArray = [...(formData[field] as any[])]
    updatedArray.splice(index, 1)
    setFormData({
      ...formData,
      [field]: updatedArray,
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // In a real application, you would send this data to your API
      console.log("Submitting form data:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      alert("Article saved successfully!")
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 mb-6 border-b">
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
                    <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">
                      Article ID
                    </label>
                    <input
                      id="id"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      placeholder="Unique ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

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

                <div>
                  <label htmlFor="howToTake" className="block text-sm font-medium text-gray-700 mb-1">
                    How To Take
                  </label>
                  <textarea
                    id="howToTake"
                    name="howToTake"
                    value={formData.howToTake}
                    onChange={handleInputChange}
                    placeholder="Instructions on how to take the product"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="productImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image URL
                  </label>
                  <input
                    id="productImage"
                    name="productImage"
                    value={formData.productImage}
                    onChange={handleInputChange}
                    placeholder="URL to product image"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="officialWebsite" className="block text-sm font-medium text-gray-700 mb-1">
                    Official Website
                  </label>
                  <input
                    id="officialWebsite"
                    name="officialWebsite"
                    value={formData.officialWebsite}
                    onChange={handleInputChange}
                    placeholder="URL to official website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Benefits Tab */}
              <div className={`space-y-4 ${activeTab !== "benefits" ? "hidden" : ""}`}>
                <h3 className="text-lg font-medium">Product Benefits</h3>
                <p className="text-sm text-gray-500">Add all the benefits of the product</p>

                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="border p-4 rounded-md relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => removeArrayItem("benefits", index)}
                      disabled={formData.benefits.length <= 1}
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label
                          htmlFor={`benefits.${index}.title`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Benefit Title
                        </label>
                        <input
                          type="text"
                          value={benefit.title}
                          onChange={(e) => handleObjectArrayChange(index, "benefits", "title", e.target.value)}
                          placeholder="Benefit Title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`benefits.${index}.description`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Benefit Description
                        </label>
                        <textarea
                          value={benefit.description}
                          onChange={(e) => handleObjectArrayChange(index, "benefits", "description", e.target.value)}
                          placeholder="Benefit Description"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => addArrayItem("benefits", { title: "", description: "" })}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Benefit
                </button>
              </div>

              {/* Ratings Tab */}
              <div className={`space-y-4 ${activeTab !== "ratings" ? "hidden" : ""}`}>
                <h3 className="text-lg font-medium">Product Ratings</h3>
                <p className="text-sm text-gray-500">Set ratings for different aspects of the product (0-5)</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="overallRating" className="block text-sm font-medium text-gray-700 mb-1">
                      Overall Rating
                    </label>
                    <input
                      id="overallRating"
                      type="number"
                      name="overallRating"
                      value={formData.overallRating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="Overall Rating (0-5)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="ingredientsRating" className="block text-sm font-medium text-gray-700 mb-1">
                      Ingredients Rating
                    </label>
                    <input
                      id="ingredientsRating"
                      type="number"
                      name="ingredientsRating"
                      value={formData.ingredientsRating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="Ingredients Rating (0-5)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="valueRating" className="block text-sm font-medium text-gray-700 mb-1">
                      Value Rating
                    </label>
                    <input
                      id="valueRating"
                      type="number"
                      name="valueRating"
                      value={formData.valueRating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="Value Rating (0-5)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="manufacturerRating" className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturer Rating
                    </label>
                    <input
                      id="manufacturerRating"
                      type="number"
                      name="manufacturerRating"
                      value={formData.manufacturerRating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="Manufacturer Rating (0-5)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="safetyRating" className="block text-sm font-medium text-gray-700 mb-1">
                      Safety Rating
                    </label>
                    <input
                      id="safetyRating"
                      type="number"
                      name="safetyRating"
                      value={formData.safetyRating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      placeholder="Safety Rating (0-5)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Highlights Tab */}
              <div className={`space-y-4 ${activeTab !== "highlights" ? "hidden" : ""}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Brand Highlights */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Brand Highlights</h3>
                    <p className="text-sm text-gray-500">Key highlights about the brand</p>

                    {formData.brandHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => handleArrayChange(index, "brandHighlights", e.target.value)}
                          placeholder="Brand highlight"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => removeArrayItem("brandHighlights", index)}
                          disabled={formData.brandHighlights.length <= 1}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => addArrayItem("brandHighlights", "")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Highlight
                    </button>
                  </div>

                  {/* Key Ingredients */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Key Ingredients</h3>
                    <p className="text-sm text-gray-500">Main ingredients in the product</p>

                    {formData.keyIngredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) => handleArrayChange(index, "keyIngredients", e.target.value)}
                          placeholder="Key ingredient"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => removeArrayItem("keyIngredients", index)}
                          disabled={formData.keyIngredients.length <= 1}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => addArrayItem("keyIngredients", "")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Ingredient
                    </button>
                  </div>
                </div>

                <div className="my-6 border-t border-gray-200"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pros */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Pros</h3>
                    <p className="text-sm text-gray-500">Positive aspects of the product</p>

                    {formData.pros.map((pro, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={pro}
                          onChange={(e) => handleArrayChange(index, "pros", e.target.value)}
                          placeholder="Product pro"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => removeArrayItem("pros", index)}
                          disabled={formData.pros.length <= 1}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => addArrayItem("pros", "")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Pro
                    </button>
                  </div>

                  {/* Cons */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Cons</h3>
                    <p className="text-sm text-gray-500">Negative aspects of the product</p>

                    {formData.cons.map((con, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={con}
                          onChange={(e) => handleArrayChange(index, "cons", e.target.value)}
                          placeholder="Product con"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => removeArrayItem("cons", index)}
                          disabled={formData.cons.length <= 1}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => addArrayItem("cons", "")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Con
                    </button>
                  </div>
                </div>
              </div>

              {/* Ingredients Tab */}
              <div className={`space-y-4 ${activeTab !== "ingredients" ? "hidden" : ""}`}>
                <h3 className="text-lg font-medium">Detailed Ingredients</h3>
                <p className="text-sm text-gray-500">Add detailed information about each ingredient</p>

                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="border p-4 rounded-md relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => removeArrayItem("ingredients", index)}
                      disabled={formData.ingredients.length <= 1}
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label
                          htmlFor={`ingredients.${index}.name`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Ingredient Name
                        </label>
                        <input
                          type="text"
                          value={ingredient.name}
                          onChange={(e) => handleObjectArrayChange(index, "ingredients", "name", e.target.value)}
                          placeholder="Ingredient Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`ingredients.${index}.description`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          value={ingredient.description}
                          onChange={(e) => handleObjectArrayChange(index, "ingredients", "description", e.target.value)}
                          placeholder="Ingredient Description"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`ingredients.${index}.benefits`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Benefits
                        </label>
                        <textarea
                          value={ingredient.benefits}
                          onChange={(e) => handleObjectArrayChange(index, "ingredients", "benefits", e.target.value)}
                          placeholder="Ingredient Benefits"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => addArrayItem("ingredients", { name: "", description: "", benefits: "" })}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Ingredient
                </button>
              </div>

              {/* Details Tab */}
              <div className={`space-y-4 ${activeTab !== "details" ? "hidden" : ""}`}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="safety" className="block text-sm font-medium text-gray-700 mb-1">
                      Safety
                    </label>
                    <textarea
                      id="safety"
                      name="safety"
                      value={formData.safety}
                      onChange={handleInputChange}
                      placeholder="Safety information"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="effectiveness" className="block text-sm font-medium text-gray-700 mb-1">
                      Effectiveness
                    </label>
                    <textarea
                      id="effectiveness"
                      name="effectiveness"
                      value={formData.effectiveness}
                      onChange={handleInputChange}
                      placeholder="Effectiveness information"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="howItWorks" className="block text-sm font-medium text-gray-700 mb-1">
                      How It Works
                    </label>
                    <textarea
                      id="howItWorks"
                      name="howItWorks"
                      value={formData.howItWorks}
                      onChange={handleInputChange}
                      placeholder="How the product works"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="conclusion" className="block text-sm font-medium text-gray-700 mb-1">
                      Conclusion
                    </label>
                    <textarea
                      id="conclusion"
                      name="conclusion"
                      value={formData.conclusion}
                      onChange={handleInputChange}
                      placeholder="Article conclusion"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="border p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-4">Pricing Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="pricing.singleBottle" className="block text-sm font-medium text-gray-700 mb-1">
                          Single Bottle Price
                        </label>
                        <input
                          id="pricing.singleBottle"
                          name="pricing.singleBottle"
                          value={formData.pricing.singleBottle}
                          onChange={handleInputChange}
                          placeholder="e.g. $69"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="pricing.threeBottles" className="block text-sm font-medium text-gray-700 mb-1">
                          Three Bottles Price
                        </label>
                        <input
                          id="pricing.threeBottles"
                          name="pricing.threeBottles"
                          value={formData.pricing.threeBottles}
                          onChange={handleInputChange}
                          placeholder="e.g. $59/bottle ($177 total)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="pricing.sixBottles" className="block text-sm font-medium text-gray-700 mb-1">
                          Six Bottles Price
                        </label>
                        <input
                          id="pricing.sixBottles"
                          name="pricing.sixBottles"
                          value={formData.pricing.sixBottles}
                          onChange={handleInputChange}
                          placeholder="e.g. $49/bottle ($294 total)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-4">Manufacturer Information</h3>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="manufacturerInfo.name" className="block text-sm font-medium text-gray-700 mb-1">
                          Manufacturer Name
                        </label>
                        <input
                          id="manufacturerInfo.name"
                          name="manufacturerInfo.name"
                          value={formData.manufacturerInfo.name}
                          onChange={handleInputChange}
                          placeholder="Manufacturer name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="manufacturerInfo.location"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Manufacturer Location
                        </label>
                        <input
                          id="manufacturerInfo.location"
                          name="manufacturerInfo.location"
                          value={formData.manufacturerInfo.location}
                          onChange={handleInputChange}
                          placeholder="e.g. Tallmadge, Ohio, USA"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="manufacturerInfo.description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Manufacturer Description
                        </label>
                        <textarea
                          id="manufacturerInfo.description"
                          name="manufacturerInfo.description"
                          value={formData.manufacturerInfo.description}
                          onChange={handleInputChange}
                          placeholder="About the manufacturer"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQs Tab */}
              <div className={`space-y-4 ${activeTab !== "faqs" ? "hidden" : ""}`}>
                <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
                <p className="text-sm text-gray-500">Add FAQs about the product</p>

                {formData.faqs.map((faq, index) => (
                  <div key={index} className="border p-4 rounded-md relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => removeArrayItem("faqs", index)}
                      disabled={formData.faqs.length <= 1}
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label
                          htmlFor={`faqs.${index}.question`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Question
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleObjectArrayChange(index, "faqs", "question", e.target.value)}
                          placeholder="FAQ Question"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`faqs.${index}.answer`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Answer
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleObjectArrayChange(index, "faqs", "answer", e.target.value)}
                          placeholder="FAQ Answer"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => addArrayItem("faqs", { question: "", answer: "" })}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add FAQ
                </button>
              </div>

              {/* Reviews Tab */}
              <div className={`space-y-4 ${activeTab !== "reviews" ? "hidden" : ""}`}>
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                <p className="text-sm text-gray-500">Add customer reviews for the product</p>

                {formData.customerReviews.map((review, index) => (
                  <div key={index} className="border p-4 rounded-md relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => removeArrayItem("customerReviews", index)}
                      disabled={formData.customerReviews.length <= 1}
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`customerReviews.${index}.name`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={review.name}
                          onChange={(e) => handleObjectArrayChange(index, "customerReviews", "name", e.target.value)}
                          placeholder="Customer Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`customerReviews.${index}.location`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Customer Location
                        </label>
                        <input
                          type="text"
                          value={review.location}
                          onChange={(e) =>
                            handleObjectArrayChange(index, "customerReviews", "location", e.target.value)
                          }
                          placeholder="e.g. New York, NY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor={`customerReviews.${index}.rating`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Rating (1-5)
                        </label>
                        <input
                          type="number"
                          value={review.rating}
                          onChange={(e) =>
                            handleObjectArrayChange(index, "customerReviews", "rating", Number(e.target.value))
                          }
                          min="1"
                          max="5"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor={`customerReviews.${index}.review`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Review
                        </label>
                        <textarea
                          value={review.review}
                          onChange={(e) => handleObjectArrayChange(index, "customerReviews", "review", e.target.value)}
                          placeholder="Customer Review"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => addArrayItem("customerReviews", { name: "", location: "", rating: 5, review: "" })}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Review
                </button>
              </div>

              {/* CTA Tab */}
              <div className={`space-y-4 ${activeTab !== "cta" ? "hidden" : ""}`}>
                <h3 className="text-lg font-medium">Call to Action Section</h3>
                <p className="text-sm text-gray-500">
                  Configure the call to action section that appears at the end of the article
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="cta.heading" className="block text-sm font-medium text-gray-700 mb-1">
                      CTA Heading
                    </label>
                    <input
                      id="cta.heading"
                      name="cta.heading"
                      value={formData.cta.heading}
                      onChange={handleInputChange}
                      placeholder="Call to Action Heading"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="cta.content" className="block text-sm font-medium text-gray-700 mb-1">
                      CTA Content
                    </label>
                    {editorLoaded ? (
                      <div className="border border-gray-300 rounded-md overflow-hidden">
                        <CKEditor
                          editor={ClassicEditor}
                          data={formData.cta.content}
                          onChange={(event, editor) => {
                            const data = editor.getData()
                            handleEditorChange(data)
                          }}
                        />
                      </div>
                    ) : (
                      <textarea
                        id="cta.content"
                        name="cta.content"
                        value={formData.cta.content}
                        onChange={handleInputChange}
                        placeholder="Call to Action Content"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cta.buttonText" className="block text-sm font-medium text-gray-700 mb-1">
                        Button Text
                      </label>
                      <input
                        id="cta.buttonText"
                        name="cta.buttonText"
                        value={formData.cta.buttonText}
                        onChange={handleInputChange}
                        placeholder="Button Text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="cta.buttonUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Button URL
                      </label>
                      <input
                        id="cta.buttonUrl"
                        name="cta.buttonUrl"
                        value={formData.cta.buttonUrl}
                        onChange={handleInputChange}
                        placeholder="Button URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cta.backgroundColor" className="block text-sm font-medium text-gray-700 mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="cta.backgroundColor"
                        name="cta.backgroundColor"
                        value={formData.cta.backgroundColor}
                        onChange={handleInputChange}
                        className="h-10 w-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        name="cta.backgroundColor"
                        value={formData.cta.backgroundColor}
                        onChange={handleInputChange}
                        placeholder="e.g. #4f46e5"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-md font-medium mb-2">Preview</h4>
                    <div className="p-6 rounded-lg border" style={{ backgroundColor: formData.cta.backgroundColor }}>
                      <div className="max-w-3xl mx-auto text-center text-white">
                        <h3 className="text-2xl font-bold mb-4">{formData.cta.heading}</h3>
                        <div
                          className="mb-6 prose prose-sm max-w-none prose-invert"
                          dangerouslySetInnerHTML={{ __html: formData.cta.content }}
                        />
                        <button
                          type="button"
                          className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                        >
                          {formData.cta.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                    cta: {
                      heading: "Try Superconductor Slim Today!",
                      content:
                        "<p>Experience the benefits of our premium supplement. Order now and start your journey to better health!</p>",
                      buttonText: "Order Now",
                      buttonUrl: "#order",
                      backgroundColor: "#4f46e5",
                    },
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
          </form>
        </div>
      </div>
    </div>
  )
}
