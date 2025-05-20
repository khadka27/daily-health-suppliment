import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

// Define your Article types (shape ≈ your Prisma model)
export interface CustomerReview { rating: number; comment: string; /*…*/ }
export interface Article {
  id: string
  title: string
  overview?: string
  description?: string
  productImage?: string
  slug: string
  createdAt: string
  updatedAt: string
  // add other fields as needed…
}

// API response shapes
interface FetchListResponse {
  success: boolean
  articles: Article[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

interface FetchOneResponse {
  success: boolean
  article: Article
}

interface SaveResponse {
  success: boolean
  id: string
}

// Async thunks
export const fetchArticles = createAsyncThunk<
  FetchListResponse,
  { page?: number; limit?: number; search?: string; category?: string }
>(
  'articles/fetchList',
  async (params) => {
    const query = new URLSearchParams()
    if (params.page) query.set('page', params.page.toString())
    if (params.limit) query.set('limit', params.limit.toString())
    if (params.search) query.set('sch', params.search)
    if (params.category) query.set('category', params.category)
    const res = await fetch(`/api/article?${query.toString()}`)
    return (await res.json()) as FetchListResponse
  }
)

export const fetchArticleById = createAsyncThunk<FetchOneResponse, string>(
  'articles/fetchOne',
  async (id) => {
    const res = await fetch(`/api/article?id=${id}`)
    return (await res.json()) as FetchOneResponse
  }
)

export const saveArticle = createAsyncThunk<SaveResponse, Partial<Article>>(
  'articles/save',
  async (articleData) => {
    const res = await fetch('/api/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    })
    return (await res.json()) as SaveResponse
  }
)

// Slice state
interface ArticlesState {
  list: Article[]
  pagination: FetchListResponse['pagination'] | null
  selected?: Article
  loadingList: boolean
  loadingOne: boolean
  saving: boolean
  error?: string
}

const initialState: ArticlesState = {
  list: [],
  pagination: null,
  selected: undefined,
  loadingList: false,
  loadingOne: false,
  saving: false,
  error: undefined,
}

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = undefined
      state.error = undefined
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchArticles.pending, (state) => {
        state.loadingList = true
        state.error = undefined
      })
      .addCase(fetchArticles.fulfilled, (state, { payload }) => {
        state.loadingList = false
        state.list = payload.articles
        state.pagination = payload.pagination
      })
      .addCase(fetchArticles.rejected, (state, { error }) => {
        state.loadingList = false
        state.error = error.message
      })

      // fetch one
      .addCase(fetchArticleById.pending, (state) => {
        state.loadingOne = true
        state.error = undefined
      })
      .addCase(fetchArticleById.fulfilled, (state, { payload }) => {
        state.loadingOne = false
        state.selected = payload.article
      })
      .addCase(fetchArticleById.rejected, (state, { error }) => {
        state.loadingOne = false
        state.error = error.message
      })

      // save (create or update)
      .addCase(saveArticle.pending, (state) => {
        state.saving = true
        state.error = undefined
      })
      .addCase(saveArticle.fulfilled, (state) => {
        state.saving = false
      })
      .addCase(saveArticle.rejected, (state, { error }) => {
        state.saving = false
        state.error = error.message
      })
  },
})

export const { clearSelected } = articlesSlice.actions
export const selectArticleState = (state: RootState) => state.articles
export default articlesSlice.reducer
