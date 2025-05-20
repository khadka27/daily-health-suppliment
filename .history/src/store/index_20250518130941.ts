import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import articlesReducer from './features/articles/articlesSlice'

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
  },
  // Redux Toolkit includes redux-thunk by default
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
// convenience hook for components
export const useAppDispatch = () => useDispatch<AppDispatch>()
