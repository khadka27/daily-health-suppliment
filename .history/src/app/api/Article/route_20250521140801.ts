import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

// Create a new Prisma client instance directly in this file for testing
const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log("API route called with URL:", request.url)
    
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const page = searchParams.get("page") ? parseInt(searchParams.get("page") as string, 10) : 1
    const limit = 10
    const skip = (page - 1) * limit
    
    console.log("Search params:", { id, page, limit, skip })

    // First, let's try a simple query to check if Prisma is working
    try {
      const count = await prisma.article.count()
      console.log("Article count:", count)
    } catch (countError) {
      console.error("Error counting articles:", countError)
      return NextResponse.json({
        success: false,
        message: "Database connection error",
        error: countError instanceof Error ? countError.message : String(countError),
        location: "count query"
      }, { status: 500 })
    }

    // If ID is provided, fetch a single article
    if (id) {
      try {
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
            updatedAt: true
          }
        })

        if (!article) {
          return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true, article })
      } catch (findError) {
        console.error("Error finding article by ID:", findError)
        return NextResponse.json({
          success: false,
          message: "Error finding article",
          error: findError instanceof Error ? findError.message : String(findError),
          location: "findUnique"
        }, { status: 500 })
      }
    }

    // Otherwise, fetch a list of articles with minimal data
    try {
      // Simplified query without any complex relations or filtering
      const articles = await prisma.article.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          author: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          updatedAt: "desc"
        },
        skip,
        take: limit
      })

      console.log(`Found ${articles.length} articles`)

      // Format the articles for the response
      const formattedArticles = articles.map((article: { id: any; title: any; slug: any; imageUrl: any; createdAt: { toISOString: () => any }; updatedAt: { toISOString: () => any } }) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: "Uncategorized", // Default category
        categorySlug: "uncategorized",
        description: "Article description placeholder", // Placeholder description
        image: article.imageUrl || "/placeholder.svg",
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt.toISOString()
      }))

      // Get total count for pagination
      const total = await prisma.article.count()
      const totalPages = Math.ceil(total / limit)

      return NextResponse.json({
        success: true,
        articles: formattedArticles,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      })
    } catch (findManyError) {
      console.error("Error finding articles:", findManyError)
      return NextResponse.json({
        success: false,
        message: "Error finding articles",
        error: findManyError instanceof Error ? findManyError.message : String(findManyError),
        location: "findMany"
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Unhandled API error:", error)
    return NextResponse.json({
      success: false,
      message: "An unhandled error occurred",
      error: error instanceof Error ? error.message : String(error),
      location: "top-level"
    }, { status: 500 })
  }
}
