/* eslint-disable @typescript-eslint/no-explicit-any */
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

    // Build the where clause for filtering
    const where: any = {}
    if (category) {
      where.categorySlug = category
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Count total articles matching the criteria
    const total = await prisma.article.count({ where })
    const totalPages = Math.ceil(total / limit)

    // Fetch articles with pagination
    const articles = await prisma.article.findMany({
      where,
      take: limit,
      skip,
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      articles,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch articles" }, { status: 500 })
  }
}
