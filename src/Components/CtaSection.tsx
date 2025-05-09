/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { PlusCircle, X } from "lucide-react"

interface CTAProps {
  formData: any
  setFormData: (data: any) => void
}

export default function CTASection({ formData, setFormData }: CTAProps) {
  // Handle object array changes
  const handleObjectArrayChange = (index: number, field: string, property: string, value: string | number) => {
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
  const addArrayItem = (field: string, template: any) => {
    const updatedArray = [...(formData[field] as any[])]
    updatedArray.push(template)
    setFormData({
      ...formData,
      [field]: updatedArray,
    })
  }

  // Remove item from array
  const removeArrayItem = (field: string, index: number) => {
    const updatedArray = [...(formData[field] as any[])]
    updatedArray.splice(index, 1)
    setFormData({
      ...formData,
      [field]: updatedArray,
    })
  }

  return (
    <div className={`space-y-4`}>
      <h3 className="text-lg font-medium">Call to Action</h3>
      <p className="text-sm text-gray-500">Add call-to-action buttons for the product</p>

      {formData.ctaButtons.map((cta: any, index: number) => (
        <div key={index} className="border p-4 rounded-md relative">
          <button
            type="button"
            className="absolute top-2 right-2 text-red-500"
            onClick={() => removeArrayItem("ctaButtons", index)}
            disabled={formData.ctaButtons.length <= 1}
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`ctaButtons.${index}.text`} className="block text-sm font-medium text-gray-700 mb-1">
                Button Text
              </label>
              <input
                type="text"
                value={cta.text}
                onChange={(e) => handleObjectArrayChange(index, "ctaButtons", "text", e.target.value)}
                placeholder="e.g. Buy Now"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor={`ctaButtons.${index}.url`} className="block text-sm font-medium text-gray-700 mb-1">
                Button URL
              </label>
              <input
                type="text"
                value={cta.url}
                onChange={(e) => handleObjectArrayChange(index, "ctaButtons", "url", e.target.value)}
                placeholder="e.g. https://example.com/buy"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor={`ctaButtons.${index}.type`} className="block text-sm font-medium text-gray-700 mb-1">
                Button Type
              </label>
              <select
                value={cta.type}
                onChange={(e) => handleObjectArrayChange(index, "ctaButtons", "type", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>

            <div>
              <label htmlFor={`ctaButtons.${index}.position`} className="block text-sm font-medium text-gray-700 mb-1">
                Display Position
              </label>
              <select
                value={cta.position}
                onChange={(e) => handleObjectArrayChange(index, "ctaButtons", "position", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="top">Top</option>
                <option value="middle">Middle</option>
                <option value="bottom">Bottom</option>
                <option value="floating">Floating</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor={`ctaButtons.${index}.description`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                value={cta.description}
                onChange={(e) => handleObjectArrayChange(index, "ctaButtons", "description", e.target.value)}
                placeholder="Short text to display near the button"
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
        onClick={() =>
          addArrayItem("ctaButtons", {
            text: "Buy Now",
            url: "",
            type: "primary",
            position: "bottom",
            description: "",
          })
        }
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add CTA Button
      </button>
    </div>
  )
}
