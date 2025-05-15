import ArticleWrapper from "@/Components/ArticleWrapper";

export default asy function ArticlePage({ params }: { params: { id: string } }) {
  return <ArticleWrapper id={params.id} />
}

