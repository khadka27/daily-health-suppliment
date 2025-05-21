import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        blocks: {
          include: {
            ratings: true,
            pros: { orderBy: { order: "asc" } },
            cons: { orderBy: { order: "asc" } },
            ingredients: { orderBy: { order: "asc" } },
            highlights: { orderBy: { order: "asc" } },
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

    // Transform the data to match the expected format
    const transformedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      author: article.author,
      publishDate: article.publishDate.toISOString(),
      imageUrl: article.imageUrl,
      blocks: article.blocks.map((block) => {
        const transformedBlock: any = {
          id: block.id,
          type: block.type,
          content: block.content || "",
          level: block.level,
          listType: block.listType,
          imageUrl: block.imageUrl,
          language: block.language,
          ctaText: block.ctaText,
          ctaLink: block.ctaLink,
          productName: block.productName,
          overallRating: block.overallRating,
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
          ingredientsIntroduction: block.ingredientsIntroduction,
        }

        if (block.ratings) {
          transformedBlock.ratings = {
            ingredients: block.ratings.ingredients,
            value: block.ratings.value,
            manufacturer: block.ratings.manufacturer,
            safety: block.ratings.safety,
            effectiveness: block.ratings.effectiveness,
          }
        }

        if (block.pros && block.pros.length > 0) {
          transformedBlock.pros = block.pros.map((pro) => pro.content)
        }

        if (block.cons && block.cons.length > 0) {
          transformedBlock.cons = block.cons.map((con) => con.content)
        }

        if (block.ingredients && block.ingredients.length > 0) {
          transformedBlock.ingredients = block.ingredients.map((ingredient) => ingredient.content)
        }

        if (block.highlights && block.highlights.length > 0) {
          transformedBlock.highlights = block.highlights.map((highlight) => highlight.content)
        }

        if (block.customFields && block.customFields.length > 0) {
          transformedBlock.customFields = block.customFields.map((field) => ({
            id: field.id,
            name: field.name,
            value: field.value,
          }))
        }

        if (block.ingredientsList && block.ingredientsList.length > 0) {
          transformedBlock.ingredientsList = block.ingredientsList.map((item) => ({
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

        return transformedBlock
      }),
    }

    return NextResponse.json(transformedArticle)
  } catch (error) {
    console.error("Error reading article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    const updatedArticleData = await request.json()

    // Find the article to update
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
      include: { blocks: true },
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Check if the slug is being changed and if the new slug already exists
    if (updatedArticleData.slug !== slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug: updatedArticleData.slug },
      })

      if (slugExists) {
        return NextResponse.json({ error: "An article with this slug already exists" }, { status: 400 })
      }
    }

    // Start a transaction to update the article and its blocks
    const updatedArticle = await prisma.$transaction(async (tx) => {
      // Delete all existing blocks and related data
      await tx.block.deleteMany({
        where: { articleId: existingArticle.id },
      })

      // Update the article
      const article = await tx.article.update({
        where: { id: existingArticle.id },
        data: {
          title: updatedArticleData.title,
          slug: updatedArticleData.slug,
          author: updatedArticleData.author,
          imageUrl: updatedArticleData.imageUrl,
          blocks: {
            create: updatedArticleData.blocks.map((block: any, index: number) => {
              const blockData: any = {
                type: block.type,
                content: block.content || "",
                level: block.level,
                listType: block.listType,
                imageUrl: block.imageUrl,
                language: block.language,
                ctaText: block.ctaText,
                ctaLink: block.ctaLink,
                productName: block.productName,
                overallRating: block.overallRating,
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
                ingredientsIntroduction: block.ingredientsIntroduction,
                order: index,
              }

              // Add nested relations
              if (block.ratings) {
                blockData.ratings = {
                  create: {
                    ingredients: block.ratings.ingredients,
                    value: block.ratings.value,
                    manufacturer: block.ratings.manufacturer,
                    safety: block.ratings.safety,
                    effectiveness: block.ratings.effectiveness,
                  },
                }
              }

              if (block.pros && block.pros.length > 0) {
                blockData.pros = {
                  create: block.pros.map((content: string, i: number) => ({
                    content,
                    order: i,
                  })),
                }
              }

              if (block.cons && block.cons.length > 0) {
                blockData.cons = {
                  create: block.cons.map((content: string, i: number) => ({
                    content,
                    order: i,
                  })),
                }
              }

              if (block.ingredients && block.ingredients.length > 0) {
                blockData.ingredients = {
                  create: block.ingredients.map((content: string, i: number) => ({
                    content,
                    order: i,
                  })),
                }
              }

              if (block.highlights && block.highlights.length > 0) {
                blockData.highlights = {
                  create: block.highlights.map((content: string, i: number) => ({
                    content,
                    order: i,
                  })),
                }
              }

              if (block.customFields && block.customFields.length > 0) {
                blockData.customFields = {
                  create: block.customFields.map((field: any) => ({
                    name: field.name,
                    value: field.value,
                  })),
                }
              }

              if (block.ingredientsList && block.ingredientsList.length > 0) {
                blockData.ingredientsList = {
                  create: block.ingredientsList.map((item: any) => ({
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

      return article
    })

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    // Find the article to delete
    const article = await prisma.article.findUnique({
      where: { slug },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Delete the article (cascade will delete all related blocks and data)
    await prisma.article.delete({
      where: { id: article.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
