import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const category = searchParams.get("category")
    const search = searchParams.get("sch")
    const pageParam = searchParams.get("page")
    const page = pageParam ? Number.parseInt(pageParam) : 1
    const limit = 10
    const skip = (page - 1) * limit

    // If ID is provided, fetch a single article
    if (id) {
      const article = await prisma.article.findUnique({
        where: { id },
      })

      if (!article) {
        return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true, article })
    }

    // Otherwise, fetch a list of articles with filters
    const whereClause: any = {}

    if (category) {
      whereClause.categorySlug = category
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Count total articles matching the criteria
    const total = await prisma.article.count({
      where: whereClause,
    })

    // Fetch articles with pagination
    const articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: "desc",
      },
      skip,
      take: limit,
    })

    // Format the articles for the response
    const formattedArticles = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: article.category || "Uncategorized",
      categorySlug: article.categorySlug || "uncategorized",
      description: article.description,
      image: article.featuredImage || "/placeholder.svg",
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
      },
      { status: 500 },
    )
  }
}
