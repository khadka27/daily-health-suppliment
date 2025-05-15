import ArticleWrapper from "@/Components/ArticleWrapper";

export default function ArticlePage({ params }: { params: { id: string } }) {
  return <ArticleWrapper id={params.id} />
}

