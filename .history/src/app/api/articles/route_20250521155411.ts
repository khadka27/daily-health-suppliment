/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import { PrismaClient } from "@prisma/client"

// Use PrismaClient with connection pooling for better performance

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    if (!body.author) {
      return NextResponse.json({ error: "Author is required" }, { status: 400 })
    }

    // Generate slug if not provided
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")

    // Create the article with proper error handling
    const article = await prisma.article.create({
      data: {
        id: uuidv4(),
        title: body.title,
        slug: slug,
        author: body.author,
        publishDate: new Date(body.publishDate || Date.now()),
        imageUrl: body.imageUrl,
        blocks: {
          create: Array.isArray(body.blocks)
            ? body.blocks.map((block: any, index: number) => {
                // Base block data
                const blockData: any = {
                  id: block.id || uuidv4(),
                  type: block.type || "paragraph",
                  content: block.content || "",
                  order: index,
                  // Add other common fields
                  level: block.level,
                  listType: block.listType,
                  imageUrl: block.imageUrl,
                  language: block.language,
                  ctaText: block.ctaText,
                  ctaLink: block.ctaLink,
                  productName: block.productName,
                  overallRating: block.overallRating,
                  ingredientsIntroduction: block.ingredientsIntroduction,
                  howToUse: block.howToUse,
                  price: block.price,
                  verdict: block.verdict,
                  author: block.author,
                  reviewDate: block.reviewDate,
                  medicallyReviewed: block.medicallyReviewed,
                  factChecked: block.factChecked,
                  ctaButtonText: block.ctaButtonText,
                  ctaButtonLink: block.ctaButtonLink,
                  backgroundColor: block.backgroundColor,
                }

                // Handle nested relations
                if (block.ratings) {
                  blockData.ratings = {
                    create: {
                      id: uuidv4(),
                      ingredients: block.ratings.ingredients,
                      value: block.ratings.value,
                      manufacturer: block.ratings.manufacturer,
                      safety: block.ratings.safety,
                      effectiveness: block.ratings.effectiveness,
                    },
                  }
                }

                // Handle pros
                if (block.pros && block.pros.length > 0) {
                  blockData.pros = {
                    create: block.pros.map((pro: any, i: number) => ({
                      id: pro.id || uuidv4(),
                      content: pro.content || "",
                      order: i,
                    })),
                  }
                }

                // Handle cons
                if (block.cons && block.cons.length > 0) {
                  blockData.cons = {
                    create: block.cons.map((con: any, i: number) => ({
                      id: con.id || uuidv4(),
                      content: con.content || "",
                      order: i,
                    })),
                  }
                }

                // Handle ingredients
                if (block.ingredients && block.ingredients.length > 0) {
                  blockData.ingredients = {
                    create: block.ingredients.map((ingredient: any, i: number) => ({
                      id: ingredient.id || uuidv4(),
                      content: ingredient.content || "",
                      order: i,
                    })),
                  }
                }

                // Handle highlights
                if (block.highlights && block.highlights.length > 0) {
                  blockData.highlights = {
                    create: block.highlights.map((highlight: any, i: number) => ({
                      id: highlight.id || uuidv4(),
                      content: highlight.content || "",
                      order: i,
                    })),
                  }
                }

                // Handle custom fields
                if (block.customFields && block.customFields.length > 0) {
                  blockData.customFields = {
                    create: block.customFields.map((field: any) => ({
                      id: field.id || uuidv4(),
                      name: field.name || "",
                      value: field.value || "",
                    })),
                  }
                }

                // Handle ingredients list
                if (block.ingredientsList && block.ingredientsList.length > 0) {
                  blockData.ingredientsList = {
                    create: block.ingredientsList.map((item: any) => ({
                      id: item.id || uuidv4(),
                      number: item.number || 0,
                      name: item.name || "",
                      imageUrl: item.imageUrl || "",
                      description: item.description || "",
                      studyYear: item.studyYear,
                      studySource: item.studySource,
                      studyDescription: item.studyDescription,
                    })),
                  }
                }

                return blockData
              })
            : [],
        },
      },
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

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      {
        error: "Failed to create article",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = 10
    const skip = (page - 1) * limit

    // Buscar artigos paginados
    const [total, articles] = await Promise.all([
      prisma.article.count(),
      prisma.article.findMany({
        skip,
        take: limit,
        orderBy: { publishDate: "desc" },
      }),
    ])

    const totalPages = Math.ceil(total / limit)

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
    return NextResponse.json({
      success: false,
      message: "Failed to fetch articles",
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}