/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const category = searchParams.get("category")
    const search = searchParams.get("sch")
    const pageParam = searchParams.get("page")
    const page = pageParam ? Number.parseInt(pageParam) : 1
    const limit = 10
    const skip = (page - 1) * limit

    // If ID is provided, fetch a single article with all related data
    if (id) {
      const article = await prisma.article.findUnique({
        where: { id },
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
        return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
      }

      // Transform the article data into a more usable format for the frontend
      const transformedArticle = {
        id: article.id,
        title: article.title,
        slug: article.slug,
        author: article.author,
        publishDate: article.publishDate,
        imageUrl: article.imageUrl,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        // Extract data from blocks based on their types
        overview: article.blocks.find((block: { type: string }) => block.type === "overview")?.content || "",
        description: article.blocks.find((block: { type: string }) => block.type === "description")?.content || "",
        howToTake: article.blocks.find((block: { type: string }) => block.type === "howToTake")?.content || "",
        safety: article.blocks.find((block: { type: string }) => block.type === "safety")?.content || "",
        effectiveness: article.blocks.find((block: { type: string }) => block.type === "effectiveness")?.content || "",
        howItWorks: article.blocks.find((block: { type: string }) => block.type === "howItWorks")?.content || "",
        conclusion: article.blocks.find((block: { type: string }) => block.type === "conclusion")?.content || "",
        officialWebsite: article.blocks.find((block: { type: string }) => block.type === "officialWebsite")?.ctaLink || "",

        // Get ratings from the ratings block
        overallRating: article.blocks.find((block: { ratings: any }) => block.ratings)?.ratings?.effectiveness || 0,
        ingredientsRating: article.blocks.find((block: { ratings: any }) => block.ratings)?.ratings?.ingredients || 0,
        valueRating: article.blocks.find((block: { ratings: any }) => block.ratings)?.ratings?.value || 0,
        manufacturerRating: article.blocks.find((block: { ratings: any }) => block.ratings)?.ratings?.manufacturer || 0,
        safetyRating: article.blocks.find((block: { ratings: any }) => block.ratings)?.ratings?.safety || 0,

        // Get pros and cons
        pros: article.blocks
          .filter((block: { pros: string | any[] }) => block.pros && block.pros.length > 0)
          .flatMap((block: { pros: any[] }) => block.pros.map((pro: { content: any }) => pro.content)),

        cons: article.blocks
          .filter((block: { cons: string | any[] }) => block.cons && block.cons.length > 0)
          .flatMap((block: { cons: any[] }) => block.cons.map((con: { content: any }) => con.content)),

        // Get brand highlights
        brandHighlights: article.blocks
          .filter((block: { highlights: string | any[] }) => block.highlights && block.highlights.length > 0)
          .flatMap((block: { highlights: any[] }) => block.highlights.map((highlight: { content: any }) => highlight.content)),

        // Get key ingredients
        keyIngredients: article.blocks
          .filter((block: { ingredients: string | any[] }) => block.ingredients && block.ingredients.length > 0)
          .flatMap((block: { ingredients: any[] }) => block.ingredients.map((ingredient: { content: any }) => ingredient.content)),

        // Get pricing information from custom fields
        pricing: {
          singleBottle:
            article.blocks
              .flatMap((block: { customFields: any }) => block.customFields || [])
              .find((field: { name: string }) => field?.name === "singleBottlePrice")?.value || "",
          threeBottles:
            article.blocks
              .flatMap((block: { customFields: any }) => block.customFields || [])
              .find((field: { name: string }) => field?.name === "threeBottlesPrice")?.value || "",
          sixBottles:
            article.blocks
              .flatMap((block: { customFields: any }) => block.customFields || [])
              .find((field: { name: string }) => field?.name === "sixBottlesPrice")?.value || "",
        },

        // Get manufacturer info
        manufacturerInfo: {
          name:
            article.blocks
              .flatMap((block: { customFields: any }) => block.customFields || [])
              .find((field: { name: string }) => field?.name === "manufacturerName")?.value || "",
          location:
            article.blocks
              .flatMap((block: { customFields: any }) => block.customFields || [])
              .find((field: { name: string }) => field?.name === "manufacturerLocation")?.value || "",
          description:
            article.blocks
              .flatMap((block: { customFields: any }) => block.customFields || [])
              .find((field: { name: string }) => field?.name === "manufacturerDescription")?.value || "",
        },

        // Get detailed ingredients list
        ingredients: article.blocks
          .flatMap((block: { ingredientsList: any }) => block.ingredientsList || [])
          .map((ingredient: { name: any; description: any; studyDescription: any }) => ({
            name: ingredient.name,
            description: ingredient.description,
            benefits: ingredient.studyDescription || "",
          })),

        // Get FAQs from custom fields
        faqs: article.blocks
          .filter((block: { type: string }) => block.type === "faq")
          .map((block: { customFields: any[] }) => ({
            question: block.customFields?.find((field: { name: string }) => field.name === "question")?.value || "",
            answer: block.customFields?.find((field: { name: string }) => field.name === "answer")?.value || "",
          })),

        // Get customer reviews from custom fields
        customerReviews: article.blocks
          .filter((block: { type: string }) => block.type === "review")
          .map((block: { customFields: any[]; content: any }) => ({
            name: block.customFields?.find((field: { name: string }) => field.name === "reviewerName")?.value || "",
            location: block.customFields?.find((field: { name: string }) => field.name === "reviewerLocation")?.value || "",
            rating: Number(block.customFields?.find((field: { name: string }) => field.name === "rating")?.value || "0"),
            review: block.content || "",
          })),
      }

      return NextResponse.json({ success: true, article: transformedArticle })
    }

    // Build the where clause for filtering articles
    const where: any = {}
    if (category) {
      where.blocks = {
        some: {
          customFields: {
            some: {
              name: "category",
              value: category,
            },
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

    // Count total articles matching the criteria
    const total = await prisma.article.count({ where })
    const totalPages = Math.ceil(total / limit)

    // Fetch articles with pagination
    const articles = await prisma.article.findMany({
      where,
      take: limit,
      skip,
      orderBy: { updatedAt: "desc" },
      include: {
        blocks: {
          include: {
            customFields: true,
          },
        },
      },
    })

    // Transform the articles data for the listing
    const transformedArticles = articles.map((article: { blocks: any[]; id: any; title: any; slug: any; imageUrl: any; createdAt: any; updatedAt: any }) => {
      // Find the description block
      const descriptionBlock = article.blocks.find((block: { type: string }) => block.type === "description")

      // Find the category from custom fields
      const categoryField = article.blocks
        .flatMap((block: { customFields: any }) => block.customFields)
        .find((field: { name: string }) => field?.name === "category")

      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        category: categoryField?.value || "Uncategorized",
        categorySlug: categoryField?.value?.toLowerCase().replace(/\s+/g, "-") || "uncategorized",
        description: descriptionBlock?.content || "",
        image: article.imageUrl || "",
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      }
    })

    return NextResponse.json({
      success: true,
      articles: transformedArticles,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch articles",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}