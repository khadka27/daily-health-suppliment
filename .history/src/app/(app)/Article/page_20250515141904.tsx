import ArticleWrapper from "@/Components/ArticleWrapper";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  return <ArticleWrapper id={(await params.id} />
}

