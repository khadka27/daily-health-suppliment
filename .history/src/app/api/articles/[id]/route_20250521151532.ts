import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // First try to find by ID
    let article = await prisma.article.findUnique({
      where: {
        id: params.id,
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

    // If not found by ID, try to find by slug
    if (!article) {
      article = await prisma.article.findUnique({
        where: {
          slug: params.id,
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
      blocks: article.blocks.map((block: { ratings: { ingredients: any; value: any; manufacturer: any; safety: any; effectiveness: any }; pros: any; cons: any; ingredients: any; highlights: any; customFields: any; ingredientsList: any }) => {
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
