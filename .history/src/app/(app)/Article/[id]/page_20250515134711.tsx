import ArticleWrapper from "@/Components/ArticleWrapper";

<<<<<<< HEAD
import ArticleWrapper from "@/Components/ArticleWrapper"

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
=======
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
>>>>>>> 9524fced3873d626b046fcff0cfcac2ebfa11c45
  return (
    <div className="min-h-screen bg-white">
      <main className="py-6">
        <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleWrapper id={(await params).id} />
        </div>
      </main>
    </div>
  );
}
