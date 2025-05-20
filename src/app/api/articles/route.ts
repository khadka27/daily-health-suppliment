import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
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

    // Transform the data to match the expected format
    const transformedArticles = articles.map((article) => {
      return {
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
    })

    return NextResponse.json(transformedArticles)
  } catch (error) {
    console.error("Error reading articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
