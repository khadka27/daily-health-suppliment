import type { Article, Block } from "@prisma/client"

type ArticleWithBlocks = Article & {
  blocks: (Block & {
    ratings: any
    pros: any[]
    cons: any[]
    ingredients: any[]
    highlights: any[]
    customFields: any[]
    ingredientsList: any[]
  })[]
}

export function transformArticleForResponse(article: ArticleWithBlocks) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    author: article.author,
    publishDate: article.publishDate,
    imageUrl: article.imageUrl,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,

    // Extract data from blocks based on their types
    overview: getBlockContentByType(article.blocks, "overview"),
    description: getBlockContentByType(article.blocks, "description"),
    howToTake: getBlockContentByType(article.blocks, "howToTake"),
    safety: getBlockContentByType(article.blocks, "safety"),
    effectiveness: getBlockContentByType(article.blocks, "effectiveness"),
    howItWorks: getBlockContentByType(article.blocks, "howItWorks"),
    conclusion: getBlockContentByType(article.blocks, "conclusion"),
    officialWebsite: getBlockCtaLinkByType(article.blocks, "officialWebsite"),

    // Get ratings
    ratings: {
      overall: getBlockRating(article.blocks, "effectiveness"),
      ingredients: getBlockRating(article.blocks, "ingredients"),
      value: getBlockRating(article.blocks, "value"),
      manufacturer: getBlockRating(article.blocks, "manufacturer"),
      safety: getBlockRating(article.blocks, "safety"),
    },

    // Get pros and cons
    pros: getBlockArrayContent(article.blocks, "pros"),
    cons: getBlockArrayContent(article.blocks, "cons"),

    // Get brand highlights
    brandHighlights: getBlockArrayContent(article.blocks, "highlights"),

    // Get key ingredients
    keyIngredients: getBlockArrayContent(article.blocks, "ingredients"),

    // Get pricing information from custom fields
    pricing: {
      singleBottle: getCustomFieldValue(article.blocks, "singleBottlePrice"),
      threeBottles: getCustomFieldValue(article.blocks, "threeBottlesPrice"),
      sixBottles: getCustomFieldValue(article.blocks, "sixBottlesPrice"),
    },

    // Get manufacturer info
    manufacturerInfo: {
      name: getCustomFieldValue(article.blocks, "manufacturerName"),
      location: getCustomFieldValue(article.blocks, "manufacturerLocation"),
      description: getCustomFieldValue(article.blocks, "manufacturerDescription"),
    },

    // Get detailed ingredients list
    ingredients: article.blocks
      .flatMap((block) => block.ingredientsList || [])
      .map((ingredient) => ({
        name: ingredient.name,
        description: ingredient.description,
        benefits: ingredient.studyDescription || "",
      })),

    // Get FAQs from custom fields
    faqs: getFaqs(article.blocks),

    // Get customer reviews from custom fields
    customerReviews: getCustomerReviews(article.blocks),
  }
}

export function transformArticlesForListing(articles: any[]) {
  return articles.map((article) => {
    // Find the description block
    const descriptionBlock = article.blocks.find((block: any) => block.type === "description")

    // Find the category from custom fields
    const categoryField = article.blocks
      .flatMap((block: any) => block.customFields)
      .find((field: any) => field?.name === "category")

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
}

// Helper functions
function getBlockContentByType(blocks: any[], type: string): string {
  return blocks.find((block) => block.type === type)?.content || ""
}

function getBlockCtaLinkByType(blocks: any[], type: string): string {
  return blocks.find((block) => block.type === type)?.ctaLink || ""
}

function getBlockRating(blocks: any[], ratingType: string): number {
  return blocks.find(block => block.ratings)?\
    .ratings?.[ratingType] || 0
}

function getBlockArrayContent(blocks: any[], arrayType: string): string[] {
  return blocks
    .filter((block) => block[arrayType] && block[arrayType].length > 0)
    .flatMap((block) => block[arrayType].map((item: any) => item.content))
}

function getCustomFieldValue(blocks: any[], fieldName: string): string {
  return (
    blocks.flatMap((block) => block.customFields || []).find((field: any) => field?.name === fieldName)?.value || ""
  )
}

function getFaqs(blocks: any[]) {
  return blocks
    .filter((block) => block.type === "faq")
    .map((block) => ({
      question: block.customFields?.find((field: any) => field.name === "question")?.value || "",
      answer: block.customFields?.find((field: any) => field.name === "answer")?.value || "",
    }))
}

function getCustomerReviews(blocks: any[]) {
  return blocks
    .filter((block) => block.type === "review")
    .map((block) => ({
      name: block.customFields?.find((field: any) => field.name === "reviewerName")?.value || "",
      location: block.customFields?.find((field: any) => field.name === "reviewerLocation")?.value || "",
      rating: Number(block.customFields?.find((field: any) => field.name === "rating")?.value || "0"),
      review: block.content || "",
    }))
}
