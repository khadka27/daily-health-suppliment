/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

interface SearchResult {
  id: string
  title: string
  slug: string
  category: string
  categorySlug: string
  description: string
  image: string
  createdAt?: string
  updatedAt?: string
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function ArticleListing() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<SearchResult[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<any>(null)
  const [rawResponse, setRawResponse] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Get search parameters
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string) : 1

  // Check database connection first
  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        const response = await fetch("/api/debug")
        const data = await response.json()
        setDebugInfo(data)
        

        if (!data.success) {
          setError(`Database connection error: ${data.message}`)
          setErrorDetails(data.error)
        }
      } catch (err) {
        console.error("Error checking database connection:", err)
        setError("Failed to check database connection")
        setErrorDetails(err)
      }
    }

    checkDatabaseConnection()
  }, [])

  useEffect(() => {
    const fetchArticles = async () => {
      if (error) return // Don't fetch if there's already an error

      setLoading(true)
      setError(null)
      setErrorDetails(null)
      setRawResponse(null)

      try {
        // Build the query string for API
        const queryParams = new URLSearchParams()
        if (category) queryParams.append("category", category)
        if (search) queryParams.append("sch", search)
        if (page) queryParams.append("page", page.toString())

        console.log("Fetching articles with params:", queryParams.toString())

        // Fetch articles from API
        const response = await fetch(`/api/article?${queryParams.toString()}`)
        console.log("API response status:", response)
        const responseText = await response.text()
        setRawResponse(responseText)

        console.log("Raw API response:", responseText.substring(0, 200) + "...")

        let data
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError)
          throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`)
        }

        if (!response.ok) {
          console.error("API error response:", data)
          throw new Error(
            `Error fetching articles: ${response.status} ${response.statusText}${data.error ? ` - ${data.error}` : ""}`,
          )
        }

        if (!data.success) {
          console.error("API unsuccessful response:", data)
          throw new Error(data.message || "Failed to fetch articles")
        }

        setResults(data.articles)
        setPagination(data.pagination)
      } catch (err) {
        console.error("Error fetching articles:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setErrorDetails(err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [category, search, page, error])

  // Build title based on search parameters
  const getTitle = () => {
    if (search) return `SEARCH RESULTS FOR: "${search}"`
    if (category) return `ARTICLES IN: ${category.replace(/-/g, " ").toUpperCase()}`
    return "LATEST ARTICLES"
  }

  if (loading) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 max-w-7xl mx-auto">
        <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{getTitle()}</h1>

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

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 max-w-7xl mx-auto">
        <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{getTitle()}</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error Loading Articles</h2>
          <p className="mb-4">{error}</p>

          {debugInfo && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Database Connection Info:</h3>
              <div className="p-3 bg-red-100 rounded text-sm overflow-auto">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </div>
          )}

          {errorDetails && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Error Details:</h3>
              <div className="p-3 bg-red-100 rounded text-sm overflow-auto">
                <pre>{JSON.stringify(errorDetails, null, 2)}</pre>
              </div>
            </div>
          )}

          {rawResponse && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Raw API Response:</h3>
              <div className="p-3 bg-red-100 rounded text-sm overflow-auto max-h-40">
                <pre>{rawResponse.substring(0, 500)}...</pre>
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Try Again
            </button>

            <Link
              href="/api/debug"
              target="_blank"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Database Connection
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 max-w-7xl mx-auto">
        <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{getTitle()}</h1>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">No Articles Found</h2>
          <p>
            We couldn&apos;t find any articles matching your criteria. Try adjusting your search terms or browse our
            latest articles.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 max-w-7xl mx-auto">
      <h1 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{getTitle()}</h1>

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
                {result.updatedAt && (
                  <span className="ml-2 text-gray-500">
                    • Updated: {new Date(result.updatedAt).toLocaleDateString()}
                  </span>
                )}
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <Link
              href={`?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(search ? { search } : {}),
                page: "1",
              }).toString()}`}
              className={`px-3 py-1 rounded ${
                pagination.page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              aria-disabled={pagination.page === 1}
              tabIndex={pagination.page === 1 ? -1 : undefined}
            >
              First
            </Link>

            <Link
              href={`?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(search ? { search } : {}),
                page: Math.max(1, pagination.page - 1).toString(),
              }).toString()}`}
              className={`px-3 py-1 rounded ${
                pagination.page === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              aria-disabled={pagination.page === 1}
              tabIndex={pagination.page === 1 ? -1 : undefined}
            >
              &laquo;
            </Link>

            <span className="px-3 py-1">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Link
              href={`?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(search ? { search } : {}),
                page: Math.min(pagination.totalPages, pagination.page + 1).toString(),
              }).toString()}`}
              className={`px-3 py-1 rounded ${
                pagination.page === pagination.totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              aria-disabled={pagination.page === pagination.totalPages}
              tabIndex={pagination.page === pagination.totalPages ? -1 : undefined}
            >
              &raquo;
            </Link>

            <Link
              href={`?${new URLSearchParams({
                ...(category ? { category } : {}),
                ...(search ? { search } : {}),
                page: pagination.totalPages.toString(),
              }).toString()}`}
              className={`px-3 py-1 rounded ${
                pagination.page === pagination.totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              aria-disabled={pagination.page === pagination.totalPages}
              tabIndex={pagination.page === pagination.totalPages ? -1 : undefined}
            >
              Last
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
