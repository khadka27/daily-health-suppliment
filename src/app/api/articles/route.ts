/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageParam = searchParams.get("page")
    const page = pageParam ? Number.parseInt(pageParam, 10) : 1
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const limit = 10
    const skip = (page - 1) * limit

    const where: any = {}

    if (category) {
      where.blocks = {
        some: {
          customFields: {
            some: { name: "category", value: category },
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

    const total = await prisma.article.count({ where })
    const totalPages = Math.ceil(total / limit)

    const articles = await prisma.article.findMany({
      where,
      take: limit,
      skip,
      orderBy: { updatedAt: "desc" },
      include: {
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

    const transformedArticles = articles.map((article) => ({
      id: article.id.toString(),
      title: article.title,
      slug: article.slug,
      author: article.author,
      publishDate: article.publishDate,
      imageUrl: article.imageUrl,
      description: article.blocks.find((block) => block.type === "paragraph")?.content || "",
      category: "Review", // Default category
      categorySlug: "review",
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
    const article = await request.json()

    // Validate required fields
    if (!article.title || !article.author || !article.blocks) {
      return NextResponse.json({ error: "Title, author, and blocks are required" }, { status: 400 })
    }

    // Ensure slug is set
    if (!article.slug) {
      article.slug = article.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    }

    // Create the article with all its related data
    const createdArticle = await prisma.article.create({
      data: {
        title: article.title,
        author: article.author,
        slug: article.slug,
        imageUrl: article.imageUrl || null,
        publishDate: article.publishDate ? new Date(article.publishDate) : new Date(),
        blocks: {
          create: article.blocks.map((block: any, index: number) => ({
            type: block.type,
            content: block.content || null,
            level: block.level || null,
            listType: block.listType || null,
            imageUrl: block.imageUrl || null,
            language: block.language || null,
            ctaText: block.ctaText || null,
            ctaLink: block.ctaLink || null,
            productName: block.productName || null,
            overallRating: block.overallRating || null,
            ingredientsIntroduction: block.ingredientsIntroduction || null,
            howToUse: block.howToUse || null,
            price: block.price || null,
            verdict: block.verdict || null,
            author: block.author || null,
            reviewDate: block.reviewDate || null,
            medicallyReviewed: block.medicallyReviewed || null,
            factChecked: block.factChecked || null,
            ctaButtonText: block.ctaButtonText || null,
            ctaButtonLink: block.ctaButtonLink || null,
            backgroundColor: block.backgroundColor || null,
            order: index,
            // Create related records
            pros:
              block.pros && block.pros.length > 0
                ? {
                    create: block.pros.map((pro: any, proIndex: number) => ({
                      content: pro.content,
                      order: proIndex,
                    })),
                  }
                : undefined,
            cons:
              block.cons && block.cons.length > 0
                ? {
                    create: block.cons.map((con: any, conIndex: number) => ({
                      content: con.content,
                      order: conIndex,
                    })),
                  }
                : undefined,
            ingredients:
              block.ingredients && block.ingredients.length > 0
                ? {
                    create: block.ingredients.map((ingredient: any, ingIndex: number) => ({
                      content: ingredient.content,
                      order: ingIndex,
                    })),
                  }
                : undefined,
            highlights:
              block.highlights && block.highlights.length > 0
                ? {
                    create: block.highlights.map((highlight: any, hlIndex: number) => ({
                      content: highlight.content,
                      order: hlIndex,
                    })),
                  }
                : undefined,
            ingredientsList:
              block.ingredientsList && block.ingredientsList.length > 0
                ? {
                    create: block.ingredientsList.map((item: any) => ({
                      number: item.number || 1,
                      name: item.name,
                      imageUrl: item.imageUrl || "/placeholder.svg",
                      description: item.description || "",
                      studyYear: item.studyYear || null,
                      studySource: item.studySource || null,
                      studyDescription: item.studyDescription || null,
                    })),
                  }
                : undefined,
            ratings: block.ratings
              ? {
                  create: {
                    ingredients: block.ratings.ingredients || null,
                    value: block.ratings.value || null,
                    manufacturer: block.ratings.manufacturer || null,
                    safety: block.ratings.safety || null,
                    effectiveness: block.ratings.effectiveness || null,
                  },
                }
              : undefined,
            customFields:
              block.customFields && block.customFields.length > 0
                ? {
                    create: block.customFields.map((field: any) => ({
                      name: field.name,
                      value: field.value,
                    })),
                  }
                : undefined,
          })),
        },
      },
      include: {
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

    return NextResponse.json(createdArticle, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
