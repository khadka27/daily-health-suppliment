import type { Metadata } from "next";
import Image from "next/image";
import { ArticleRenderer } from "@/components/article-renderer";
import { notFound } from "next/navigation";
import type { Article } from "@/types/article";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/articles/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description:
      article.blocks[0]?.content || "Read this article on our website",
    openGraph: {
      images: article.imageUrl ? [article.imageUrl] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-20 py-8 max-w-6xl">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {article.imageUrl && (
          <div className="aspect-video w-full overflow-hidden">
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

        <div className="p-6 md:p-8">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
            {article.title}
          </h1>

          <div className="text-gray-600 mb-8 font-bold text-lg border-b pb-4 border-gray-100">
            By <span className="text-indigo-600">{article.author}</span> •{" "}
            {new Date(article.publishDate).toLocaleDateString()}
          </div>

          <ArticleRenderer blocks={article.blocks} />
        </div>
      </article>
    </div>
  );
}
