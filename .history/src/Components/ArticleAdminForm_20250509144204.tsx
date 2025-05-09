"use client"

import type React from "react"
import { useState } from "react"
import { X, PlusCircle, Save } from "lucide-react"

interface ArticleFormData {
  title: string
  slug: string
  content: string
  status: "draft" | "published" | "archived"
  customerReviews: { name: string; location: string; rating: number; review: string }[]
}

const ArticleAdminForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("content")
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    slug: "",
    content: "",
    status: "draft",
    customerReviews: [{ name: "", location: "", rating: 5, review: "" }],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleObjectArrayChange = (
    index: number,
    arrayName: keyof ArticleFormData,
    key: keyof ArticleFormData["customerReviews"][0],
    value: any,
  ) => {
    const newArray = [...formData[arrayName]!]
    ;(newArray as any)[index][key] = value
    setFormData({ ...formData, [arrayName]: newArray } as any)
  }

  const addArrayItem = (arrayName: keyof ArticleFormData, newItem: any) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName]!, newItem] } as any)
  }

  const removeArrayItem = (arrayName: keyof ArticleFormData, index: number) => {
    const newArray = [...formData[arrayName]!]
    newArray.splice(index, 1)
    setFormData({ ...formData, [arrayName]: newArray } as any)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("content")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "content"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "reviews"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "settings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Content Tab */}
      <div className={`space-y-4 ${activeTab !== "content" ? "hidden" : ""}`}>
        <h3 className="text-lg font-medium">Article Content</h3>
        <p className="text-sm text-gray-500">Write the content for the article</p>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Reviews Tab */}
      <div className={`space-y-4 ${activeTab !== "reviews" ? "hidden" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
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
                      onChange={(e) => handleObjectArrayChange(index, "customerReviews", "location", e.target.value)}
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

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-sm border border-blue-200 flex flex-col justify-between h-fit sticky top-4">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-800">Ready to Publish?</h3>
              <p className="text-sm text-blue-700">
                Your comprehensive product review is almost ready to help customers make informed decisions.
              </p>
              <div className="bg-white p-4 rounded-md border border-blue-200">
                <h4 className="font-medium text-gray-800 mb-2">Review Checklist:</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> Product details
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> Benefits & highlights
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> Ratings & reviews
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span> Pricing information
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Publish Review
              </button>
              <button
                type="button"
                className="w-full bg-white hover:bg-gray-50 text-blue-600 border border-blue-300 py-2 px-4 rounded-md font-medium transition-colors"
              >
                Preview Article
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tab */}
      <div className={`space-y-4 ${activeTab !== "settings" ? "hidden" : ""}`}>
        <h3 className="text-lg font-medium">Article Settings</h3>
        <p className="text-sm text-gray-500">Manage article settings</p>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default ArticleAdminForm
