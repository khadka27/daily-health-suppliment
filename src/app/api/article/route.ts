import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "Article ID is required" }, { status: 400 })
    }

    const article = await prisma.article.findUnique({
      where: { id },
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
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
    }

    // Group blocks by type for easier processing
    const blocksByType = {
      paragraphs: article.blocks.filter((b) => b.type === "paragraph"),
      headings: article.blocks.filter((b) => b.type === "heading"),
      images: article.blocks.filter((b) => b.type === "image"),
      ratings: article.blocks.filter((b) => b.type === "rating"),
      prosCons: article.blocks.filter((b) => b.type === "pros-cons"),
      ingredients: article.blocks.filter((b) => b.type === "ingredients"),
      cta: article.blocks.filter((b) => b.type === "cta"),
    }

    // Extract ratings from rating blocks
    const ratingBlock = blocksByType.ratings[0] // Use the first rating block if available
    const ratings = {
      overall: ratingBlock?.overallRating || 0,
      ingredients: ratingBlock?.ratings?.ingredients || 0,
      value: ratingBlock?.ratings?.value || 0,
      manufacturer: ratingBlock?.ratings?.manufacturer || 0,
      safety: ratingBlock?.ratings?.safety || 0,
      effectiveness: ratingBlock?.ratings?.effectiveness || 0,
    }

    // Extract pros and cons
    const pros = blocksByType.prosCons.flatMap((b) => b.pros.map((p) => p.content))
    const cons = blocksByType.prosCons.flatMap((b) => b.cons.map((c) => c.content))

    // Extract key ingredients
    const keyIngredients = blocksByType.prosCons.flatMap((b) => b.ingredients.map((i) => i.content))

    // Extract brand highlights
    const brandHighlights = blocksByType.ratings.flatMap((b) => b.highlights.map((h) => h.content))

    // Extract detailed ingredients
    const detailedIngredients = blocksByType.ingredients.flatMap((b) =>
      b.ingredientsList.map((i) => ({
        name: i.name,
        description: i.description,
        benefits: i.studyDescription || "",
        imageUrl: i.imageUrl,
        studyYear: i.studyYear,
        studySource: i.studySource,
      })),
    )

    // Extract custom fields for additional data
    const getCustomFieldValue = (name: string) => {
      for (const block of article.blocks) {
        const field = block.customFields.find((cf) => cf.name === name)
        if (field) return field.value
      }
      return ""
    }

    // Extract FAQs from custom fields
    const faqs = []
    for (let i = 1; i <= 10; i++) {
      // Assume max 10 FAQs
      const question = getCustomFieldValue(`faq_question_${i}`)
      const answer = getCustomFieldValue(`faq_answer_${i}`)
      if (question && answer) {
        faqs.push({ question, answer })
      }
    }

    // Extract customer reviews from custom fields
    const customerReviews = []
    for (let i = 1; i <= 5; i++) {
      // Assume max 5 reviews
      const name = getCustomFieldValue(`review_name_${i}`)
      const location = getCustomFieldValue(`review_location_${i}`)
      const rating = getCustomFieldValue(`review_rating_${i}`)
      const review = getCustomFieldValue(`review_text_${i}`)

      if (name && review) {
        customerReviews.push({
          name,
          location,
          rating: rating ? Number.parseFloat(rating) : 0,
          review,
        })
      }
    }

    // Create a structured content array with all blocks in order
    const structuredContent = article.blocks.map((block) => {
      const baseBlock = {
        id: block.id,
        type: block.type,
        order: block.order,
      }

      switch (block.type) {
        case "heading":
          return {
            ...baseBlock,
            level: block.level || 2,
            content: block.content || "",
          }
        case "paragraph":
          return {
            ...baseBlock,
            content: block.content || "",
            section: block.customFields.find((cf) => cf.name === "section")?.value || "general",
          }
        case "image":
          return {
            ...baseBlock,
            imageUrl: block.imageUrl || "",
            caption: block.content || "",
          }
        case "rating":
          return {
            ...baseBlock,
            productName: block.productName || "",
            ratings: block.ratings || {},
            highlights: block.highlights || [],
          }
        case "pros-cons":
          return {
            ...baseBlock,
            pros: block.pros || [],
            cons: block.cons || [],
            ingredients: block.ingredients || [],
          }
        case "ingredients":
          return {
            ...baseBlock,
            productName: block.productName || "",
            introduction: block.ingredientsIntroduction || "",
            ingredientsList: block.ingredientsList || [],
          }
        case "cta":
          return {
            ...baseBlock,
            text: block.ctaText || "",
            buttonText: block.ctaButtonText || "",
            buttonLink: block.ctaButtonLink || "",
            backgroundColor: block.backgroundColor || "",
          }
        default:
          return {
            ...baseBlock,
            content: block.content || "",
          }
      }
    })

    // Transform the article data to match the expected format in ArticleWrapper
    const transformedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      author: article.author,
      publishDate: article.publishDate.toISOString(),
      imageUrl: article.imageUrl || "",
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),

      // Extract content sections
      overview:
        blocksByType.paragraphs.find((b) =>
          b.customFields.some((cf) => cf.name === "section" && cf.value === "overview"),
        )?.content || "",

      description:
        blocksByType.paragraphs.find((b) =>
          b.customFields.some((cf) => cf.name === "section" && cf.value === "description"),
        )?.content || "",

      howToTake:
        blocksByType.paragraphs.find((b) =>
          b.customFields.some((cf) => cf.name === "section" && cf.value === "howToTake"),
        )?.content || "",

      safety:
        blocksByType.paragraphs.find((b) => b.customFields.some((cf) => cf.name === "section" && cf.value === "safety"))
          ?.content || "",

      effectiveness:
        blocksByType.paragraphs.find((b) =>
          b.customFields.some((cf) => cf.name === "section" && cf.value === "effectiveness"),
        )?.content || "",

      howItWorks:
        blocksByType.paragraphs.find((b) =>
          b.customFields.some((cf) => cf.name === "section" && cf.value === "howItWorks"),
        )?.content || "",

      conclusion:
        blocksByType.paragraphs.find((b) =>
          b.customFields.some((cf) => cf.name === "section" && cf.value === "conclusion"),
        )?.content || "",

      // Ratings
      overallRating: ratings.overall,
      ingredientsRating: ratings.ingredients,
      valueRating: ratings.value,
      manufacturerRating: ratings.manufacturer,
      safetyRating: ratings.safety,

      // Lists
      pros,
      cons,
      brandHighlights,
      keyIngredients,

      // Structured data
      officialWebsite: getCustomFieldValue("officialWebsite"),

      pricing: {
        singleBottle: getCustomFieldValue("priceSingleBottle"),
        threeBottles: getCustomFieldValue("priceThreeBottles"),
        sixBottles: getCustomFieldValue("priceSixBottles"),
      },

      manufacturerInfo: {
        name: getCustomFieldValue("manufacturerName"),
        location: getCustomFieldValue("manufacturerLocation"),
        description: getCustomFieldValue("manufacturerDescription"),
      },

      // Detailed data
      ingredients: detailedIngredients,
      faqs,
      customerReviews,

      // Add the structured content for flexible rendering
      structuredContent,
    }

    return NextResponse.json({ success: true, article: transformedArticle })
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch article" }, { status: 500 })
  }
}
