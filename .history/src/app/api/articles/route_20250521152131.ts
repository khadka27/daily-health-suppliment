import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Build the where clause based on search parameters
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get total count for pagination
    const total = await prisma.article.count({ where })

    // Get articles with pagination - with more careful error handling
    try {
      const articles = await prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishDate: "desc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          author: true,
          publishDate: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
          blocks: {
            where: {
              type: "paragraph",
            },
            take: 1,
            orderBy: {
              order: "asc",
            },
            select: {
              content: true,
            },
          },
        },
      })

      // Transform articles to include a description from the first paragraph block
      const transformedArticles = articles.map((article) => {
        const firstParagraph = article.blocks[0]

        return {
          id: article.id,
          title: article.title,
          slug: article.slug,
          author: article.author,
          publishDate: article.publishDate,
          imageUrl: article.imageUrl,
          updatedAt: article.updatedAt,
          description: firstParagraph ? firstParagraph.content?.substring(0, 200) + "..." : "",
        }
      })

      return NextResponse.json({
        success: true,
        articles: transformedArticles,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      })
    } catch (dbError) {
      console.error("Database query error:", dbError)
      return NextResponse.json(
        {
          success: false,
          message: "Error querying the database",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch articles",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
