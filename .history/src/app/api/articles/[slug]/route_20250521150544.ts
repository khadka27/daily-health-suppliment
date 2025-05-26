import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    // Fetch the article with the given slug
    const article = await prisma.article.findUnique({
      where: {
        slug,
      },
      include: {
        blocks: {
          orderBy: {
            order: "asc",
          },
          include: {
            pros: {
              orderBy: {
                order: "asc",
              },
            },
            cons: {
              orderBy: {
                order: "asc",
              },
            },
            ingredients: {
              orderBy: {
                order: "asc",
              },
            },
            highlights: {
              orderBy: {
                order: "asc",
              },
            },
            customFields: true,
            ingredientItems: true,
            rating: true,
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Transform the data to match the expected format
    const transformedArticle = {
      ...article,
      blocks: article.blocks.map((block) => {
        const transformedBlock: any = {
          id: block.id,
          type: block.type,
          content: block.content,
          level: block.level,
          listType: block.listType,
          imageUrl: block.imageUrl,
          language: block.language,
          ctaText: block.ctaText,
          ctaLink: block.ctaLink,
        }

        // Add product review specific fields if they exist
        if (block.type === "productReview") {
          transformedBlock.productName = block.productName
          transformedBlock.overallRating = block.overallRating
          transformedBlock.ingredientsIntroduction = block.ingredientsIntroduction
          transformedBlock.howToUse = block.howToUse
          transformedBlock.price = block.price
          transformedBlock.verdict = block.verdict
          transformedBlock.author = block.author
          transformedBlock.reviewDate = block.reviewDate
          transformedBlock.medicallyReviewed = block.medicallyReviewed
          transformedBlock.factChecked = block.factChecked
          transformedBlock.ctaButtonText = block.ctaButtonText
          transformedBlock.ctaButtonLink = block.ctaButtonLink
          transformedBlock.backgroundColor = block.backgroundColor

          // Add pros if they exist
          if (block.pros && block.pros.length > 0) {
            transformedBlock.pros = block.pros.map((pro) => pro.content)
          }

          // Add cons if they exist
          if (block.cons && block.cons.length > 0) {
            transformedBlock.cons = block.cons.map((con) => con.content)
          }

          // Add ingredients if they exist
          if (block.ingredients && block.ingredients.length > 0) {
            transformedBlock.ingredients = block.ingredients.map((ingredient) => ingredient.content)
          }

          // Add rating if it exists
          if (block.rating) {
            transformedBlock.rating = {
              ingredients: block.rating.ingredients,
              value: block.rating.value,
              manufacturer: block.rating.manufacturer,
              safety: block.rating.safety,
              effectiveness: block.rating.effectiveness,
            }
          }

          // Add custom fields if they exist
          if (block.customFields && block.customFields.length > 0) {
            transformedBlock.customFields = block.customFields.map((field) => ({
              id: field.id,
              name: field.name,
              value: field.value,
            }))
          }
        }

        // Add ingredients section specific fields if they exist
        if (block.type === "ingredientsSection") {
          // Add ingredient items if they exist
          if (block.ingredientItems && block.ingredientItems.length > 0) {
            transformedBlock.ingredientItems = block.ingredientItems.map((item) => ({
              id: item.id,
              number: item.number,
              name: item.name,
              imageUrl: item.imageUrl,
              description: item.description,
              studyYear: item.studyYear,
              studySource: item.studySource,
              studyDescription: item.studyDescription,
            }))
          }
        }

        return transformedBlock
      }),
    }

    return NextResponse.json(transformedArticle)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    const data = await request.json()

    // Check if the article exists
    const existingArticle = await prisma.article.findUnique({
      where: {
        slug,
      },
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Delete all existing blocks and related data
    await prisma.block.deleteMany({
      where: {
        articleId: existingArticle.id,
      },
    })

    // Update the article and create new blocks
    const article = await prisma.article.update({
      where: {
        id: existingArticle.id,
      },
      data: {
        title: data.title,
        slug: data.slug,
        author: data.author,
        publishDate: new Date(data.publishDate),
        imageUrl: data.imageUrl,
        updatedAt: new Date(),
        blocks: {
          create: data.blocks.map((block: any, index: number) => {
            const blockData: any = {
              id: block.id,
              type: block.type,
              content: block.content,
              level: block.level,
              listType: block.listType,
              imageUrl: block.imageUrl,
              language: block.language,
              ctaText: block.ctaText,
              ctaLink: block.ctaLink,
              order: index,
            }

            // Add product review specific fields if they exist
            if (block.type === "productReview") {
              blockData.productName = block.productName
              blockData.overallRating = block.overallRating
              blockData.ingredientsIntroduction = block.ingredientsIntroduction
              blockData.howToUse = block.howToUse
              blockData.price = block.price
              blockData.verdict = block.verdict
              blockData.author = block.author
              blockData.reviewDate = block.reviewDate
              blockData.medicallyReviewed = block.medicallyReviewed
              blockData.factChecked = block.factChecked
              blockData.ctaButtonText = block.ctaButtonText
              blockData.ctaButtonLink = block.ctaButtonLink
              blockData.backgroundColor = block.backgroundColor

              // Add pros if they exist
              if (block.pros && block.pros.length > 0) {
                blockData.pros = {
                  create: block.pros.map((pro: string, proIndex: number) => ({
                    content: pro,
                    order: proIndex,
                  })),
                }
              }

              // Add cons if they exist
              if (block.cons && block.cons.length > 0) {
                blockData.cons = {
                  create: block.cons.map((con: string, conIndex: number) => ({
                    content: con,
                    order: conIndex,
                  })),
                }
              }

              // Add ingredients if they exist
              if (block.ingredients && block.ingredients.length > 0) {
                blockData.ingredients = {
                  create: block.ingredients.map((ingredient: string, ingredientIndex: number) => ({
                    content: ingredient,
                    order: ingredientIndex,
                  })),
                }
              }

              // Add rating if it exists
              if (block.rating) {
                blockData.rating = {
                  create: {
                    ingredients: block.rating.ingredients,
                    value: block.rating.value,
                    manufacturer: block.rating.manufacturer,
                    safety: block.rating.safety,
                    effectiveness: block.rating.effectiveness,
                  },
                }
              }

              // Add custom fields if they exist
              if (block.customFields && block.customFields.length > 0) {
                blockData.customFields = {
                  create: block.customFields.map((field: any) => ({
                    id: field.id,
                    name: field.name,
                    value: field.value,
                  })),
                }
              }
            }

            // Add ingredients section specific fields if they exist
            if (block.type === "ingredientsSection") {
              // Add ingredient items if they exist
              if (block.ingredientItems && block.ingredientItems.length > 0) {
                blockData.ingredientItems = {
                  create: block.ingredientItems.map((item: any) => ({
                    id: item.id,
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
            }

            return blockData
          }),
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
            ingredientItems: true,
            rating: true,
          },
        },
      },
    })

    // Transform the data to match the expected format
    const transformedArticle = {
      ...article,
      blocks: article.blocks.map((block) => {
        const transformedBlock: any = {
          id: block.id,
          type: block.type,
          content: block.content,
          level: block.level,
          listType: block.listType,
          imageUrl: block.imageUrl,
          language: block.language,
          ctaText: block.ctaText,
          ctaLink: block.ctaLink,
        }

        // Add product review specific fields if they exist
        if (block.type === "productReview") {
          transformedBlock.productName = block.productName
          transformedBlock.overallRating = block.overallRating
          transformedBlock.ingredientsIntroduction = block.ingredientsIntroduction
          transformedBlock.howToUse = block.howToUse
          transformedBlock.price = block.price
          transformedBlock.verdict = block.verdict
          transformedBlock.author = block.author
          transformedBlock.reviewDate = block.reviewDate
          transformedBlock.medicallyReviewed = block.medicallyReviewed
          transformedBlock.factChecked = block.factChecked
          transformedBlock.ctaButtonText = block.ctaButtonText
          transformedBlock.ctaButtonLink = block.ctaButtonLink
          transformedBlock.backgroundColor = block.backgroundColor

          // Add pros if they exist
          if (block.pros && block.pros.length > 0) {
            transformedBlock.pros = block.pros.map((pro: any) => pro.content)
          }

          // Add cons if they exist
          if (block.cons && block.cons.length > 0) {
            transformedBlock.cons = block.cons.map((con: any) => con.content)
          }

          // Add ingredients if they exist
          if (block.ingredients && block.ingredients.length > 0) {
            transformedBlock.ingredients = block.ingredients.map((ingredient: any) => ingredient.content)
          }

          // Add rating if it exists
          if (block.rating) {
            transformedBlock.rating = {
              ingredients: block.rating.ingredients,
              value: block.rating.value,
              manufacturer: block.rating.manufacturer,
              safety: block.rating.safety,
              effectiveness: block.rating.effectiveness,
            }
          }

          // Add custom fields if they exist
          if (block.customFields && block.customFields.length > 0) {
            transformedBlock.customFields = block.customFields.map((field: any) => ({
              id: field.id,
              name: field.name,
              value: field.value,
            }))
          }
        }

        // Add ingredients section specific fields if they exist
        if (block.type === "ingredientsSection") {
          // Add ingredient items if they exist
          if (block.ingredientItems && block.ingredientItems.length > 0) {
            transformedBlock.ingredientItems = block.ingredientItems.map((item: any) => ({
              id: item.id,
              number: item.number,
              name: item.name,
              imageUrl: item.imageUrl,
              description: item.description,
              studyYear: item.studyYear,
              studySource: item.studySource,
              studyDescription: item.studyDescription,
            }))
          }
        }

        return transformedBlock
      }),
    }

    return NextResponse.json(transformedArticle)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    // Check if the article exists
    const existingArticle = await prisma.article.findUnique({
      where: {
        slug,
      },
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Delete the article (this will cascade delete all related blocks and data)
    await prisma.article.delete({
      where: {
        id: existingArticle.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
