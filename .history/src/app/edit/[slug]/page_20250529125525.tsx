"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { SectionEditor } from "@/components/block-editor/section-editor"
import { ArticleRenderer } from "@/components/article-renderer"
import type { Article, Block } from "@/types/article"
import Image from "next/image"

// Helper function to group blocks into sections
const groupBlocksIntoSections = (blocks: Block[]): Block[][] => {
  const sections: Block[][] = []
  let currentSection: Block[] = []

  blocks.forEach((block) => {
    // Start a new section if this is a level 2 heading and we already have blocks
    if (block.type === "heading" && block.level === 2 && currentSection.length > 0) {
      sections.push([...currentSection])
      currentSection = [block]
    } else {
      currentSection.push(block)
    }
  })

  // Add the last section if it has blocks
  if (currentSection.length > 0) {
    sections.push(currentSection)
  }

  // If no sections were created, create a default one
  if (sections.length === 0) {
    sections.push([
      {
        id: uuidv4(),
        type: "heading",
        level: 2,
        content: "Overview",
      },
      {
        id: uuidv4(),
        type: "paragraph",
        content: "",
      },
    ])
  }

  return sections
}

export default function EditArticlePage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [sections, setSections] = useState<Block[][]>([])
  const [originalSlug, setOriginalSlug] = useState("")

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.slug}`)

        if (!response.ok) {
          throw new Error("Failed to fetch article")
        }

        const article: Article = await response.json()

        setTitle(article.title)
        setAuthor(article.author)
        setImageUrl(article.imageUrl || "")

        // Convert old CTA format to block if needed
        if (article.cta && !article.blocks.some((block) => block.type === "cta")) {
          article.blocks.push({
            id: crypto.randomUUID(),
            type: "cta",
            content: "",
            ctaText: article.cta.text,
            ctaLink: article.cta.link,
          })
        }

        // Group blocks into sections
        setSections(groupBlocksIntoSections(article.blocks || []))
        setOriginalSlug(article.slug)
      } catch (error) {
        console.error("Error fetching article:", error)
        toast({
          title: "Error",
          description: "Failed to fetch article. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [params.slug])

  // Flatten sections into blocks for saving and preview
  const flattenSections = (): Block[] => {
    return sections.flat()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !author || sections.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add some content",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const newSlug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")

      const article: Partial<Article> = {
        title,
        slug: newSlug,
        blocks: flattenSections(),
        author,
        imageUrl: imageUrl || undefined,
      }

      const response = await fetch(`/api/articles/${originalSlug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      })

      if (!response.ok) {
        throw new Error("Failed to update article")
      }

      toast({
        title: "Success",
        description: "Article updated successfully",
      })

      // If the slug changed, redirect to the new URL
      if (newSlug !== originalSlug) {
        router.push(`/articles/${newSlug}`)
      } else {
        router.push(`/articles/${originalSlug}`)
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating article:", error)
      toast({
        title: "Error",
        description: "Failed to update article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/articles/${originalSlug}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete article")
      }

      toast({
        title: "Success",
        description: "Article deleted successfully",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error deleting article:", error)
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading article...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Article</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsPreview(!isPreview)}>{isPreview ? "Edit" : "Preview"}</Button>
        </div>
      </div>

      {isPreview ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            {imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <Image src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            <h1 className="text-4xl font-bold mb-4">{title}</h1>

            <div className="text-gray-600 mb-8">
              By {author || "Author"} • {new Date().toLocaleDateString()}
            </div>

            <ArticleRenderer blocks={flattenSections()} />
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Featured Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL (optional)"
              />
              {imageUrl && (
                <div className="mt-2 aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Featured image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/abstract-geometric-placeholder.png"
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm">
                <p className="font-medium text-blue-800">Section Editor Tips:</p>
                <ul className="list-disc pl-5 mt-2 text-blue-700 space-y-1">
                  <li>Drag and drop entire sections to reposition them</li>
                  <li>Each section starts with a heading and can contain multiple blocks</li>
                  <li>Click the + button at the bottom of a section to add a new section</li>
                  <li>All blocks within a section move together when you drag the section</li>
                  <li>Use the up/down buttons on the left side to reorder sections</li>
                </ul>
              </div>
              <SectionEditor sections={sections} onChange={setSections} />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update Article"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href={`/articles/${originalSlug}`}>Cancel</Link>
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} className="ml-auto">
              Delete Article
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
