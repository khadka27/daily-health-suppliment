import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArticleRenderer } from "@/components/article-renderer"
import type { Article } from "@/types/article"
import Image from "next/image"
import { User, Calendar, Folder, ArrowLeft, Edit } from "lucide-react"

async function getArticle(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/articles/${slug}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const article: Article | null = await getArticle(resolvedParams.slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <div className="flex justify-between items-center">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to articles
            </Link>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/articles/edit/${resolvedParams.slug}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Article
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Featured Image */}
        {article.imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-xl mb-8 shadow-lg">
            <Image
              src={article.imageUrl || "/placeholder.svg"}
              alt={article.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {/* Article Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Category Badge */}
          {article.category && (
            <div className="mb-4">
              <Badge variant="secondary" className="inline-flex items-center gap-1">
                <Folder className="w-3 h-3" />
                {article.category.name}
              </Badge>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300">
            {/* Author */}
            {article.user && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{article.user.name}</span>
                {article.user.role === "ADMINISTRATOR" && (
                  <Badge variant="outline" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            )}

            {/* Publish Date */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(article.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Reading Time Estimate */}
            <div className="text-sm">
              {Math.max(
                1,
                Math.ceil(
                  article.blocks.reduce((acc, block) => {
                    if (block.content) {
                      return acc + block.content.split(" ").length
                    }
                    return acc
                  }, 0) / 200,
                ),
              )}{" "}
              min read
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            <ArticleRenderer blocks={article.blocks} />
          </div>
        </div>

        {/* Article Footer */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated:{" "}
              {new Date(article.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/articles">View All Articles</Link>
              </Button>

              {article.category && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/articles?category=${article.category.slug}`}>More in {article.category.name}</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
