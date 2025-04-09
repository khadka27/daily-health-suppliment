"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

interface SearchResult {
  id: string
  title: string
  slug: string
  category: string
  categorySlug: string
  description: string
  image: string
}

export default function ArticleListing() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<SearchResult[]>([])

  useEffect(() => {
    // Simulate API call
    const fetchResults = async () => {
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data - ensure IDs match the valid IDs in the Article component
      const mockResults = [
        {
          id: "1",
          title: "Vital Prime Review: Can It Restore Long-Lasting Erections?",
          slug: "vital-prime-review",
          category: "Male Enhancement Reviews",
          categorySlug: "male-enhancement-reviews",
          description:
            "Vital Prime promises stronger, longer-lasting erections by increasing nitric oxide levels, reducing radicals, and improving blood flow with natural ingredients.",
          image: "/placeholder.svg?height=200&width=200",
        },
        {
          id: "2",
          title: "Remedy Meds Review: Does It Really Work for Weight Loss?",
          slug: "remedy-meds-review",
          category: "Weight Loss Reviews",
          categorySlug: "weight-loss-reviews",
          description:
            "Remedy Meds is a prescription-based GLP-1 weight loss program designed to reduce hunger, control cravings, and support fat loss.",
          image: "/placeholder.svg?height=200&width=200",
        },
        {
          id: "3",
          title: "Superconductor Slim Review: Natural Weight Loss Solution?",
          slug: "superconductor-slim-review",
          category: "Weight Loss Reviews",
          categorySlug: "weight-loss-reviews",
          description:
            "Superconductor Slim is a natural liquid supplement with 5 potent bioactive ingredients that support a healthy metabolism and promote weight loss.",
          image: "/placeholder.svg?height=200&width=200",
        },
        {
          id: "4",
          title: "VitaBoost Pro Review: Complete Multivitamin Analysis",
          slug: "vitaboost-pro-review",
          category: "Vitamin Reviews",
          categorySlug: "vitamin-reviews",
          description:
            "VitaBoost Pro is a comprehensive multivitamin formula designed to support overall health, immune function, and energy levels with essential nutrients.",
          image: "/placeholder.svg?height=200&width=200",
        },
      ]

      setResults(mockResults)
      setLoading(false)
    }

    fetchResults()
  }, [])

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 max-w-7xl mx-auto">
        <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">SEARCH RESULTS FOR:</h1>

        <div className="space-y-6 sm:space-y-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b pb-6 sm:pb-8 animate-pulse">
              <div className="flex-shrink-0 w-full sm:w-32 md:w-40 lg:w-48 mx-auto sm:mx-0">
                <div className="border p-1 sm:p-2 inline-block w-full">
                  <div className="bg-gray-200 w-full aspect-square"></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 max-w-7xl mx-auto">
      <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">SEARCH RESULTS FOR:</h1>

      <div className="space-y-6 sm:space-y-8">
        {results.map((result) => (
          <div key={result.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b pb-6 sm:pb-8">
            <div className="flex-shrink-0 w-full sm:w-32 md:w-40 lg:w-48 mx-auto sm:mx-0">
              <Link href={`/Article/${result.id}`} className="block">
                <div className="border p-1 sm:p-2 inline-block w-full">
                  <Image
                    src={result.image || "/placeholder.svg"}
                    alt={result.title}
                    width={200}
                    height={200}
                    className="w-full h-auto object-cover aspect-square"
                  />
                </div>
              </Link>
            </div>

            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                <Link href={`/Article/${result.id}`} className="hover:text-green-500 transition-colors">
                  {result.title}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm mb-2 sm:mb-3">
                Posted in{" "}
                <Link href={`/?category=${result.categorySlug}`} className="text-green-600 hover:underline">
                  {result.category}
                </Link>
              </p>

              <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                {result.description}
              </p>

              <Link
                href={`/Article/${result.id}`}
                className="text-green-600 hover:underline font-medium text-sm sm:text-base"
              >
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

