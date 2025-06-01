/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Enhanced types for API responses
interface ArticleResponse {
  id: string
  title: string
  slug: string
  author: string // For backward compatibility
  publishDate: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  category: {
    id: string
    name: string
    slug: string
    description?: string
    parent?: {
      id: string
      name: string
      slug: string
    }
  } | null
  readingTime: number
  wordCount: number
  overview: string
  description: string
  howToTake: string
  safety: string
  effectiveness: string
  howItWorks: string
  conclusion: string
  overallRating: number
  ingredientsRating: number
  valueRating: number
  manufacturerRating: number
  safetyRating: number
  pros: string[]
  cons: string[]
  brandHighlights: string[]
  keyIngredients: string[]
  officialWebsite: string
  pricing: {
    singleBottle: string
    threeBottles: string
    sixBottles: string
  }
  manufacturerInfo: {
    name: string
    location: string
    description: string
  }
  ingredients: Array<{
    name: string
    description: string
    benefits: string
    imageUrl?: string
    studyYear?: string
    studySource?: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
  customerReviews: Array<{
    name: string
    location: string
    rating: number
    review: string
  }>
  blocks: ProcessedBlock[]
  structuredContent: ProcessedBlock[]
}

interface ProcessedBlock {
  id: string
  type: string
  order: number
  content?: string
  level?: number
  imageUrl?: string
  caption?: string
  listType?: string
  author?: string
  language?: string
  productName?: string
  ratings?: Record<string, number>
  highlights?: Array<{ id: string; content: string; order: number }>
  pros?: Array<{ id: string; content: string; order: number }>
  cons?: Array<{ id: string; content: string; order: number }>
  ingredients?: Array<{ id: string; content: string; order: number }>
  introduction?: string
  ingredientsList?: Array<{
    id: string
    name: string
    description: string
    imageUrl: string
    studyYear?: string
    studySource?: string
    studyDescription?: string
  }>
  text?: string
  buttonText?: string
  buttonLink?: string
  backgroundColor?: string
  section?: string
}

// Utility functions for data processing
class ArticleProcessor {
  private blocks: any[]

  constructor(blocks: any[]) {
    this.blocks = blocks
  }

  groupBlocksByType() {
    return {
      paragraphs: this.blocks.filter((b) => b.type === "paragraph"),
      headings: this.blocks.filter((b) => b.type === "heading"),
      images: this.blocks.filter((b) => b.type === "image"),
      lists: this.blocks.filter((b) => b.type === "list"),
      quotes: this.blocks.filter((b) => b.type === "quote"),
      code: this.blocks.filter((b) => b.type === "code"),
      ratings: this.blocks.filter((b) => b.type === "rating"),
      prosCons: this.blocks.filter((b) => b.type === "pros-cons"),
      ingredients: this.blocks.filter((b) => b.type === "ingredients"),
      cta: this.blocks.filter((b) => b.type === "cta"),
    }
  }

  extractRatings() {
    const blocksByType = this.groupBlocksByType()
    const ratingBlock = blocksByType.ratings[0]

    return {
      overall: ratingBlock?.overallRating || 0,
      ingredients: ratingBlock?.ratings?.ingredients || 0,
      value: ratingBlock?.ratings?.value || 0,
      manufacturer: ratingBlock?.ratings?.manufacturer || 0,
      safety: ratingBlock?.ratings?.safety || 0,
      effectiveness: ratingBlock?.ratings?.effectiveness || 0,
    }
  }

  extractListData() {
    const blocksByType = this.groupBlocksByType()

    return {
      pros: blocksByType.prosCons.flatMap((b) => b.pros?.map((p: any) => p.content) || []),
      cons: blocksByType.prosCons.flatMap((b) => b.cons?.map((c: any) => c.content) || []),
      keyIngredients: blocksByType.prosCons.flatMap((b) => b.ingredients?.map((i: any) => i.content) || []),
      brandHighlights: blocksByType.ratings.flatMap((b) => b.highlights?.map((h: any) => h.content) || []),
    }
  }

  extractDetailedIngredients() {
    const blocksByType = this.groupBlocksByType()

    return blocksByType.ingredients.flatMap(
      (b) =>
        b.ingredientsList?.map((i: any) => ({
          name: i.name,
          description: i.description,
          benefits: i.studyDescription || "",
          imageUrl: i.imageUrl,
          studyYear: i.studyYear,
          studySource: i.studySource,
        })) || [],
    )
  }

  getCustomFieldValue(name: string): string {
    for (const block of this.blocks) {
      const field = block.customFields?.find((cf: any) => cf.name === name)
      if (field) return field.value
    }
    return ""
  }

  extractFAQs() {
    const faqs = []
    for (let i = 1; i <= 10; i++) {
      const question = this.getCustomFieldValue(`faq_question_${i}`)
      const answer = this.getCustomFieldValue(`faq_answer_${i}`)
      if (question && answer) {
        faqs.push({ question, answer })
      }
    }
    return faqs
  }

  extractCustomerReviews() {
    const reviews = []
    for (let i = 1; i <= 5; i++) {
      const name = this.getCustomFieldValue(`review_name_${i}`)
      const location = this.getCustomFieldValue(`review_location_${i}`)
      const rating = this.getCustomFieldValue(`review_rating_${i}`)
      const review = this.getCustomFieldValue(`review_text_${i}`)

      if (name && review) {
        reviews.push({
          name,
          location,
          rating: rating ? Number.parseFloat(rating) : 0,
          review,
        })
      }
    }
    return reviews
  }

  calculateReadingStats() {
    const wordCount = this.blocks
      .filter((b) => b.content)
      .reduce((count, block) => count + (block.content?.split(" ").length || 0), 0)

    return {
      wordCount,
      readingTime: Math.max(1, Math.ceil(wordCount / 200)),
    }
  }

  extractContentSections() {
    const blocksByType = this.groupBlocksByType()

    const findSectionContent = (sectionName: string) => {
      return (
        blocksByType.paragraphs.find((b) =>
          b.customFields?.some((cf: any) => cf.name === "section" && cf.value === sectionName),
        )?.content || ""
      )
    }

    return {
      overview: findSectionContent("overview"),
      description: findSectionContent("description"),
      howToTake: findSectionContent("howToTake"),
      safety: findSectionContent("safety"),
      effectiveness: findSectionContent("effectiveness"),
      howItWorks: findSectionContent("howItWorks"),
      conclusion: findSectionContent("conclusion"),
    }
  }

  processStructuredContent(): ProcessedBlock[] {
    return this.blocks.map((block) => {
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
            section: block.customFields?.find((cf: any) => cf.name === "section")?.value || "general",
          }
        case "image":
          return {
            ...baseBlock,
            imageUrl: block.imageUrl || "",
            caption: block.content || "",
          }
        case "list":
          return {
            ...baseBlock,
            content: block.content || "",
            listType: block.listType || "unordered",
          }
        case "quote":
          return {
            ...baseBlock,
            content: block.content || "",
            author: block.quoteAuthor || "",
          }
        case "code":
          return {
            ...baseBlock,
            content: block.content || "",
            language: block.codeLanguage || "javascript",
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
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ success: false, message: "Article slug is required" }, { status: 400 })
    }

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            parent: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        blocks: {
          include: {
            pros: { orderBy: { order: "asc" } },
            cons: { orderBy: { order: "asc" } },
            ingredients: { orderBy: { order: "asc" } },
            highlights: { orderBy: { order: "asc" } },
            customFields: true,
            ingredientsList: { orderBy: { number: "asc" } },
            ratings: true,
          },
          orderBy: { order: "asc" },
        },
      },
    })

    if (!article) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 })
    }

    // Process article data
    const processor = new ArticleProcessor(article.blocks)
    const ratings = processor.extractRatings()
    const listData = processor.extractListData()
    const detailedIngredients = processor.extractDetailedIngredients()
    const faqs = processor.extractFAQs()
    const customerReviews = processor.extractCustomerReviews()
    const readingStats = processor.calculateReadingStats()
    const contentSections = processor.extractContentSections()
    const structuredContent = processor.processStructuredContent()

    // Build response
    const transformedArticle: ArticleResponse = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      author: article.user.name, // Backward compatibility
      publishDate: article.publishDate.toISOString(),
      imageUrl: article.imageUrl || "",
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),

      // User information
      user: {
        id: article.user.id,
        name: article.user.name,
        email: article.user.email,
        role: article.user.role,
      },

      // Category information
      category: article.category
        ? {
            id: article.category.id,
            name: article.category.name,
            slug: article.category.slug,
            description: article.category.description ?? undefined,
            parent: article.category.parent ?? undefined,
          }
        : null,

      // Reading statistics
      readingTime: readingStats.readingTime,
      wordCount: readingStats.wordCount,

      // Content sections
      ...contentSections,

      // Ratings
      overallRating: ratings.overall,
      ingredientsRating: ratings.ingredients,
      valueRating: ratings.value,
      manufacturerRating: ratings.manufacturer,
      safetyRating: ratings.safety,

      // Lists
      pros: listData.pros,
      cons: listData.cons,
      brandHighlights: listData.brandHighlights,
      keyIngredients: listData.keyIngredients,

      // Structured data
      officialWebsite: processor.getCustomFieldValue("officialWebsite"),

      pricing: {
        singleBottle: processor.getCustomFieldValue("priceSingleBottle"),
        threeBottles: processor.getCustomFieldValue("priceThreeBottles"),
        sixBottles: processor.getCustomFieldValue("priceSixBottles"),
      },

      manufacturerInfo: {
        name: processor.getCustomFieldValue("manufacturerName"),
        location: processor.getCustomFieldValue("manufacturerLocation"),
        description: processor.getCustomFieldValue("manufacturerDescription"),
      },

      // Detailed data
      ingredients: detailedIngredients,
      faqs,
      customerReviews,

      // Structured content
      blocks: structuredContent,
      structuredContent, // Keep both for compatibility
    }

    return NextResponse.json({ success: true, article: transformedArticle })
  } catch (error) {
    console.error("Error fetching article:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch article",
        error: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
