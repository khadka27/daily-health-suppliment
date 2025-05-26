import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("API route called")

    // Get search parameters
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const pageParam = searchParams.get("page")
    const page = pageParam ? Number.parseInt(pageParam) : 1
    const limit = 10
    const skip = (page - 1) * limit

    console.log("Search params:", { id, page, limit, skip })

    // If ID is provided, fetch a single article
    if (id) {
      const article = await prisma.article.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          slug: true,
          author: true,
          publishDate: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!article) {
        return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, article })
    }

    // Count total articles
    const total = await prisma.article.count()

    // Fetch articles with pagination - simplified query
    const articles = await prisma.article.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        author: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limit,
    })

    console.log(`Found ${articles.length} articles`)

    // Format the articles for the response
    const formattedArticles = articles.map((article: { id: any; title: any; slug: any; imageUrl: any; createdAt: { toISOString: () => any }; updatedAt: { toISOString: () => any } }) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: "Uncategorized", // Default category
      categorySlug: "uncategorized",
      description: "Article from database", // Simple description
      image: article.imageUrl || "/placeholder.svg",
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    }))

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      articles: formattedArticles,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching articles",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
