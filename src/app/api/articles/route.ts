/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageParam = searchParams.get("page")
    const page = pageParam ? Number.parseInt(pageParam, 10) : 1
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const userId = searchParams.get("userId")

    const limit = 10
    const skip = (page - 1) * limit

    const where: any = {}

    if (category) {
      where.categoryId = category
    }

    if (userId) {
      where.userId = userId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { blocks: { some: { content: { contains: search, mode: "insensitive" } } } },
      ]
    }

    const total = await prisma.article.count({ where })
    const totalPages = Math.ceil(total / limit)

    const articles = await prisma.article.findMany({
      where,
      take: limit,
      skip,
      orderBy: { updatedAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        blocks: {
          include: {
            pros: true,
            cons: true,
            ingredients: true,
            highlights: true,
            customFields: true,
            ingredientsList: true,
            ratings: true,
          },
          orderBy: { order: "asc" },
        },
      },
    })

    const transformedArticles = articles.map((article: { id: { toString: () => any }; title: any; slug: any; user: any; publishDate: any; imageUrl: any; blocks: any[]; category: any; createdAt: any; updatedAt: any }) => ({
      id: article.id.toString(),
      title: article.title,
      slug: article.slug,
      user: article.user,
      publishDate: article.publishDate,
      imageUrl: article.imageUrl,
      description: article.blocks.find((block) => block.type === "paragraph")?.content || "",
      category: article.category,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      blocks: article.blocks,
    }))

    return NextResponse.json({
      success: true,
      articles: transformedArticles,
      pagination: { total, page, limit, totalPages },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.userId || !data.blocks || !Array.isArray(data.blocks)) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: title, userId, and blocks are required" },
        { status: 400 },
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    })

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 400 })
    }

    // Generate slug if not provided
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")

    // Create the article with nested blocks
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: slug,
        userId: data.userId,
        publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
        imageUrl: data.imageUrl || null,
        categoryId: data.categoryId || null,
        blocks: {
          create: data.blocks.map((block: any, idx: number) => ({
            type: block.type,
            content: block.content || "",
            order: idx,
            level: block.level || null,
            imageUrl: block.imageUrl || null,
            productName: block.productName || null,
            ingredientsIntroduction: block.ingredientsIntroduction || null,
            ctaText: block.ctaText || null,
            ctaButtonText: block.ctaButtonText || null,
            ctaButtonLink: block.ctaButtonLink || null,
            backgroundColor: block.backgroundColor || null,
            // Create nested relations
            pros: block.pros
              ? {
                  create: block.pros.map((pro: any, proIdx: number) => ({
                    content: pro.content,
                    order: proIdx,
                  })),
                }
              : undefined,
            cons: block.cons
              ? {
                  create: block.cons.map((con: any, conIdx: number) => ({
                    content: con.content,
                    order: conIdx,
                  })),
                }
              : undefined,
            ingredients: block.ingredients
              ? {
                  create: block.ingredients.map((ingredient: any, ingIdx: number) => ({
                    content: ingredient.content,
                    order: ingIdx,
                  })),
                }
              : undefined,
            highlights: block.highlights
              ? {
                  create: block.highlights.map((highlight: any, hlIdx: number) => ({
                    content: highlight.content,
                    order: hlIdx,
                  })),
                }
              : undefined,
            ingredientsList: block.ingredientsList
              ? {
                  create: block.ingredientsList.map((ingredient: any) => ({
                    number: ingredient.number || 1,
                    name: ingredient.name,
                    imageUrl: ingredient.imageUrl || null,
                    description: ingredient.description || "",
                    studyYear: ingredient.studyYear || null,
                    studySource: ingredient.studySource || null,
                    studyDescription: ingredient.studyDescription || null,
                  })),
                }
              : undefined,
            ratings: block.ratings
              ? {
                  create: {
                    ingredients: block.ratings.ingredients || 0,
                    value: block.ratings.value || 0,
                    manufacturer: block.ratings.manufacturer || 0,
                    safety: block.ratings.safety || 0,
                    effectiveness: block.ratings.effectiveness || 0,
                  },
                }
              : undefined,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        blocks: {
          include: {
            pros: true,
            cons: true,
            ingredients: true,
            highlights: true,
            customFields: true,
            ingredientsList: true,
            ratings: true,
          },
          orderBy: { order: "asc" },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        article: {
          ...article,
          id: article.id.toString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ success: false, message: "Failed to create article" }, { status: 500 })
  }
}
