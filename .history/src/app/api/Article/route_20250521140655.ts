/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const category = searchParams.get("category")
    const search = searchParams.get("sch")
    const pageParam = searchParams.get("page")
    const page = pageParam ? Number.parseInt(pageParam) : 1
    const limit = 10
    const skip = (page - 1) * limit

    // If ID is provided, fetch a single article with all related data
    if (id) {
      const article = await prisma.article.findUnique({
        where: { id },
        include: {
          blocks: {
            include: {
              ratings: true,
              pros: true,
              cons: true,
              ingredients: true,
              highlights: true,
              customFields: true,
              ingredientsList: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      })

      if (!article) {
        return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, article })
    }

    // Otherwise, fetch a list of articles
    // Count total articles matching the criteria
    const total = await prisma.article.count()

    // Fetch articles with pagination
    const articles = await prisma.article.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limit,
      include: {
        blocks: {
          select: {
            type: true,
            content: true,
          },
          where: {
            type: "paragraph",
          },
          take: 1,
        },
      },
    })

    // Format the articles for the response
    const formattedArticles = articles.map((article: { id: any; title: any; slug: any; blocks: { content: any }[]; imageUrl: any; createdAt: { toISOString: () => any }; updatedAt: { toISOString: () => any } }) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: "Uncategorized", // Default category
      categorySlug: "uncategorized",
      description: article.blocks[0]?.content || "",
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
