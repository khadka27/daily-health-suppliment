export interface Article {
  cta: boolean
  id: string
  title: string
  slug: string
  author: string
  publishDate: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  blocks: Block[]
}

export interface Block {
  newBlock: { ingredients: number; value: number; manufacturer: number; safety: number }
  newBlock: { ingredients: number; value: number; manufacturer: number; safety: number }
  id: string
  type: string
  content?: string
  level?: number
  listType?: string
  imageUrl?: string
  language?: string
  ctaText?: string
  ctaLink?: string
  productName?: string
  overallRating?: number
  ingredientsIntroduction?: string
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
  order: number
  articleId: string
  ratings?: Rating
  pros?: Pros[]
  cons?: Cons[]
  ingredients?: Ingredient[]
  highlights?: Highlight[]
  customFields?: CustomField[]
  ingredientsList?: IngredientItem[]
}

export interface Rating {
  id: string
  ingredients?: number
  value?: number
  manufacturer?: number
  safety?: number
  effectiveness?: number
  blockId: string
}

export interface Pros {
  id: string
  content: string
  order: number
  blockId: string
}

export interface Cons {
  id: string
  content: string
  order: number
  blockId: string
}

export interface Ingredient {
  id: string
  content: string
  order: number
  blockId: string
}

export interface Highlight {
  id: string
  content: string
  order: number
  blockId: string
}

export interface CustomField {
  id: string
  name: string
  value: string
  blockId: string
}

export interface IngredientItem {
  id: string
  number: number
  name: string
  imageUrl: string
  description: string
  studyYear?: string
  studySource?: string
  studyDescription?: string
  blockId: string
}
