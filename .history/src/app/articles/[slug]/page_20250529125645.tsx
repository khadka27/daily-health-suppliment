import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArticleRenderer } from "@/Components/article-renderer"
import type { Article } from "@/types/article"

async function getArticle(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/articles/${slug}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return null
  }

  return res.json()
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article: Article | null = await getArticle(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          ← Back to all articles
        </Link>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/edit/${params.slug}`}>Edit</Link>
          </Button>
        </div>
      </div>

      {article.imageUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

      <div className="flex items-center text-gray-600 mb-8">
        <span>By {article.author}</span>
        <span className="mx-2">•</span>
        <span>{new Date(article.publishDate).toLocaleDateString()}</span>
      </div>

      <ArticleRenderer blocks={article.blocks} />
    </main>
  )
}
