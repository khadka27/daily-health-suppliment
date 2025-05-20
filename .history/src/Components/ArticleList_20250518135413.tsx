'use client';

import { useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticles, deleteArticle } from '@/store/articleSlice';

interface ArticleListProps {
  onEditArticle?: (id: string) => void;
}

export default function ArticleList({ onEditArticle }: ArticleListProps) {
  const dispatch = useAppDispatch();
  const { articles, status, error } = useAppSelector((state) => state.articles);
  
  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      dispatch(deleteArticle(id));
    }
  };
  
  const handleEdit = (id: string) => {
    if (onEditArticle) {
      onEditArticle(id);
    }
  };
  
  // Rest of the component remains the same...
}