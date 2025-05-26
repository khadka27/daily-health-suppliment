import ArticleWrapper from "@/Components/ArticleWrapper";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleWrapper slug={params.slug} />
        </div>
      </main>
    </div>
  )
}
