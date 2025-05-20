// Add this to your articleSlice.ts file
export const saveArticle = createAsyncThunk(
  'articles/saveArticle',
  async (articleData: Article, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to save article');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);