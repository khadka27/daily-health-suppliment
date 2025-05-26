import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { transformArticleForResponse, transformArticlesForListing } from "@/lib/transformers"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const pageParam = searchParams.get("page")
    const limitParam = searchParams.get("limit")
    
    const page = pageParam ? parseInt(pageParam, 10) : 1
    const limit = limitParam ? parseInt(limitParam, 10) : 10
    const skip = (page - 1) * limit

    // If ID is provided, fetch a single article with all related data
    if (id) {
      const article = await fetchArticleById(id)
      
      if (!article) {
        return NextResponse.json(
          { success: false, message: "Article not found" }, 
          { status: 404 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        article: transformArticleForResponse(article) 
      })
    }

    // Build the where clause for filtering articles
    const where = buildWhereClause(category, search)

    // Count total articles matching the criteria
    const total = await prisma.article.count({ where })
    const totalPages = Math.ceil(total / limit)

    // Fetch articles with pagination
    const articles = await prisma.article.findMany({
      where,
      take: limit,
      skip,
      orderBy: { updatedAt: "desc" },
      include: {
        blocks: {
          include: {
            customFields: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      articles: transformArticlesForListing(articles),
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch articles",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// Helper functions
async function fetchArticleById(id: string) {
  return prisma.article.findUnique({
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
}

function buildWhereClause(category: string | null, search: string | null) {
  const where: any = {}
  
  if (category) {
    where.blocks = {
      some: {
        customFields: {
          some: {
            name: "category",
            value: category,
          },
        },
      },
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { blocks: { some: { content: { contains: search, mode: "insensitive" } } } },
    ]
  }
  
  return where
}
