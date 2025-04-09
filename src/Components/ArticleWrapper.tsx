"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ReviewHeader from "@/Components/ReviewHeader"
import ArticleContent from "@/Components/ArticleContent"

export default function ArticleWrapper({ id }: { id: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [articleExists, setArticleExists] = useState(true)

  useEffect(() => {
    // Simulate checking if article exists
    const checkArticle = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, let's say articles with IDs 1-4 exist
        const validIds = ["1", "2", "3", "4"]
        const exists = validIds.includes(id)

        setArticleExists(exists)
        setIsLoading(false)

        // If article doesn't exist, redirect to 404
        if (!exists) {
          router.push("/not-found")
        }
      } catch (error) {
        console.error("Error checking article:", error)
        setIsLoading(false)
        setArticleExists(false)
      }
    }

    checkArticle()
  }, [id, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!articleExists) {
    return null // Will be redirected to 404 page
  }

  return (
    <div className="min-h-screen bg-white">
      <ReviewHeader id={id} />

      <main className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleContent id={id} />
        </div>
      </main>
    </div>
  )
}

