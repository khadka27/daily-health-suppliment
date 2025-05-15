import ArticleWrapper from "@/Components/ArticleWrapper";

export default async function ArticlePage({ params }: { params: Pr{ id: string } }) {
  return <ArticleWrapper id={params.id} />
}

