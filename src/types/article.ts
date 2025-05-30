export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  parent?: Category
  children: Category[]
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  _count?: {
    articles: number
  }
}

export interface Article {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  author: string
  imageUrl?: string
  publishDate: Date
  slug: string
  categoryId?: string
  category?: Category
  blocks: Block[]
}

export interface Block {
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
  pros: Pros[]
  cons: Cons[]
  ingredients: Ingredient[]
  highlights: Highlight[]
  customFields: CustomField[]
  ingredientsList: IngredientItem[]
  ratings?: Rating
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
