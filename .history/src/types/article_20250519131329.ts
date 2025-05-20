export interface Block {
  id: string
  type:
    | "paragraph"
    | "heading"
    | "image"
    | "quote"
    | "list"
    | "divider"
    | "code"
    | "html"
    | "cta"
    | "productReview"
    | "prosCons"
    | "productRating"
    | "ingredientsSection"
  content: string
  level?: 1 | 2 | 3 // For headings
  listType?: "ordered" | "unordered" // For lists
  imageUrl?: string // For images
  language?: string // For code blocks
  ctaText?: string // For CTA blocks
  ctaLink?: string // For CTA blocks
  // Product Review specific fields
  productName?: string
  overallRating?: number
  ratings?: {
    ingredients?: number
    value?: number
    manufacturer?: number
    safety?: number
    effectiveness?: number
  }
  highlights?: string[]
  pros?: string[]
  cons?: string[]
  ingredients?: string[]
  howToUse?: string
  price?: string
  verdict?: string
  author?: string
  reviewDate?: string
  medicallyReviewed?: boolean
  factChecked?: boolean
  ctaButtonText?: string
  ctaButtonLink?: string
  backgroundColor?: string
  customFields?: Array<{
    id: string
    name: string
    value: string
  }>
  // Ingredients Section specific fields
  ingredientsIntroduction?: string
  ingredientsList?: Array<{
    id: string
    number: number
    name: string
    imageUrl: string
    description: string
    studyYear?: string
    studySource?: string
    studyDescription?: string
  }>
}

export interface Article {
  id: string
  title: string
  slug: string
  blocks: Block[]
  author: string
  publishDate: string
  imageUrl?: string
}
