'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticles, deleteArticle } from '@/store/articleSlice';

export default function ArticleList() {
  const router = useRouter();
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
    router.push(`/admin/article/${id}`);
  };
  
  const handleCreate = () => {
    router.push('/admin/article/new');
  };
  
  if (status === 'loading' && articles.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (status === 'failed') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Articles</h2>
          <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </button>
        </div>
        
        <div className="p-6">
          {articles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No articles found. Create your first article!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{article.overallRating}/5</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(article.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Pencil className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}