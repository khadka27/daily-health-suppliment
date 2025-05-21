/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const article = await prisma.article.findUnique({
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

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await request.json()

    // First, find the article to update
    const existingArticle = await prisma.article.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        blocks: true,
      },
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: {
        id: existingArticle.id,
      },
      data: {
        title: body.title,
        slug: body.slug,
        author: body.author,
        imageUrl: body.imageUrl,
        // Delete all existing blocks and recreate them
        blocks: {
          deleteMany: {},
          create: body.blocks.map((block: any, index: number) => {
            // Base block data
            const blockData: any = {
              id: block.id || uuidv4(),
              type: block.type,
              content: block.content,
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

            // Handle nested relations (same as in POST)
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
                  content: pro.content,
                  order: i,
                })),
              }
            }

            // Handle cons
            if (block.cons && block.cons.length > 0) {
              blockData.cons = {
                create: block.cons.map((con: any, i: number) => ({
                  id: con.id || uuidv4(),
                  content: con.content,
                  order: i,
                })),
              }
            }

            // Handle ingredients
            if (block.ingredients && block.ingredients.length > 0) {
              blockData.ingredients = {
                create: block.ingredients.map((ingredient: any, i: number) => ({
                  id: ingredient.id || uuidv4(),
                  content: ingredient.content,
                  order: i,
                })),
              }
            }

            // Handle highlights
            if (block.highlights && block.highlights.length > 0) {
              blockData.highlights = {
                create: block.highlights.map((highlight: any, i: number) => ({
                  id: highlight.id || uuidv4(),
                  content: highlight.content,
                  order: i,
                })),
              }
            }

            // Handle custom fields
            if (block.customFields && block.customFields.length > 0) {
              blockData.customFields = {
                create: block.customFields.map((field: any) => ({
                  id: field.id || uuidv4(),
                  name: field.name,
                  value: field.value,
                })),
              }
            }

            // Handle ingredients list
            if (block.ingredientsList && block.ingredientsList.length > 0) {
              blockData.ingredientsList = {
                create: block.ingredientsList.map((item: any) => ({
                  id: item.id || uuidv4(),
                  number: item.number,
                  name: item.name,
                  imageUrl: item.imageUrl,
                  description: item.description,
                  studyYear: item.studyYear,
                  studySource: item.studySource,
                  studyDescription: item.studyDescription,
                })),
              }
            }

            return blockData
          }),
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

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const article = await prisma.article.delete({
      where: {
        slug: params.slug,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
