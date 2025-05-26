import ArticleListing from "@/Components/ArticleListing"
import { Suspense } from "react"

export default function ArticleListingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
              <div className="space-y-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b pb-6 sm:pb-8">
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
          </div>
        }
      >
        <ArticleListing />
      </Suspense>
    </div>
  )
}
