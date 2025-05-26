import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    // First try to find by slug
    let article = await prisma.article.findUnique({
      where: {
        slug: params.slug,
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

    // If not found by slug, try to find by ID
    if (!article) {
      article = await prisma.article.findUnique({
        where: {
          id: params.slug,
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
    }

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Transform the article to include nested data in the expected format
    const transformedArticle = {
      ...article,
      blocks: article.blocks.map((block) => {
        return {
          ...block,
          ratings: block.ratings
            ? {
                ingredients: block.ratings.ingredients || null,
                value: block.ratings.value || null,
                manufacturer: block.ratings.manufacturer || null,
                safety: block.ratings.safety || null,
                effectiveness: block.ratings.effectiveness || null,
              }
            : undefined,
          pros: block.pros || [],
          cons: block.cons || [],
          ingredients: block.ingredients || [],
          highlights: block.highlights || [],
          customFields: block.customFields || [],
          ingredientsList: block.ingredientsList || [],
        }
      }),
    }

    return NextResponse.json(transformedArticle)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
