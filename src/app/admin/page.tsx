"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Eye, Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Article {
  id: string
  title: string
  slug: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  publishDate: string
  imageUrl?: string
  category?: {
    id: string
    name: string
    slug: string
  }
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchArticles()
    fetchCategories()
    fetchUsers()
  }, [currentPage, searchTerm, selectedCategory, selectedUser])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedUser && { userId: selectedUser }),
      })

      const response = await fetch(`/api/articles?${params}`)
      const data = await response.json()

      if (data.success) {
        setArticles(data.articles)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch articles",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching articles:", error)
      toast({
        title: "Error",
        description: "Failed to fetch articles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      if (data.success) {
        setCategories(data.allCategories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      if (data.success) {
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleDelete = async (articleId: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Article deleted successfully",
        })
        fetchArticles()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete article",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedUser("")
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles Management</h1>
        <Button asChild>
          <Link href="/admin/articles/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Article
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.role.toLowerCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Articles Found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first article.</p>
              <Button asChild>
                <Link href="/admin/articles/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Article
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          articles.map((article) => (
            <Card key={article.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {article.imageUrl && (
                      <div className="w-24 h-16 flex-shrink-0">
                        <Image
                          src={article.imageUrl || "/placeholder.svg"}
                          alt={article.title}
                          width={96}
                          height={64}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">By: {article.user.name}</span>
                        {article.user.role === "ADMINISTRATOR" && (
                          <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Admin
                          </span>
                        )}
                        <span className="mx-2">•</span>
                        <span>Published: {new Date(article.publishDate).toLocaleDateString()}</span>
                        {article.category && (
                          <>
                            <span className="mx-2">•</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {article.category.name}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Last updated: {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/articles/${article.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/articles/edit/${article.slug}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(article.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
