import ArticleWrapper from "@/components/ArticleWrapper"

export default async function ArticlePage({
  params,
}: {
  params:Promise< { id: string }>
}) {
  return (
    <div className="min-h-screen bg-white">
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleWrapper id={(await params).id} />
        </div>
      </main>
    </div>
  )
}
