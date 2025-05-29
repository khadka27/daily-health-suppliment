/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    const article = await prisma.article.findUnique({
      where: { slug },
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

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error reading article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    const updatedArticle = await request.json()

    // Find the existing article
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Delete all existing blocks and their relations
    await prisma.block.deleteMany({
      where: { articleId: existingArticle.id },
    })

    // Update the article with new data
    const result = await prisma.article.update({
      where: { id: existingArticle.id },
      data: {
        title: updatedArticle.title,
        author: updatedArticle.author,
        imageUrl: updatedArticle.imageUrl || null,
        slug: updatedArticle.slug || slug,
        blocks: {
          create: updatedArticle.blocks.map((block: any, index: number) => ({
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

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    const article = await prisma.article.findUnique({
      where: { slug },
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Delete the article (cascade will handle related records)
    await prisma.article.delete({
      where: { id: article.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
