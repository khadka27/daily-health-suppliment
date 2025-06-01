"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { SectionEditor } from "@/components/block-editor/section-editor"
import { ArticleRenderer } from "@/components/article-renderer"
import { ProductSetupWizard } from "@/components/product-setup-wizard"
import { CategorySelector } from "@/components/CategorySelector"
import { UserSelector } from "@/components/UserSelector"
import type { Article, Block } from "@/types/article"
import Image from "next/image"

export default function CreateArticlePage() {
  const router = useRouter()
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSetupWizard, setShowSetupWizard] = useState(true)
  const [title, setTitle] = useState("")
  const [userId, setUserId] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [sections, setSections] = useState<Block[][]>([])

  // Flatten sections into blocks for saving and preview
  const flattenSections = (): Block[] => {
    return sections.flat()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !userId || sections.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add some content",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const article: Partial<Article> = {
        title,
        slug: title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
        blocks: flattenSections(),
        userId,
        publishDate: new Date(),
        imageUrl: imageUrl || undefined,
        categoryId: categoryId || undefined,
      }

      const response = await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create article")
      }

      const createdArticle = await response.json()

      toast({
        title: "Success",
        description: "Article created successfully",
      })

      router.push(`/articleS/${createdArticle.article.slug}`)
      router.refresh()
    } catch (error) {
      console.error("Error creating article:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSetupComplete = (productName: string, generatedSections: Block[][]) => {
    setTitle(`${productName} Review: Is It Worth It?`)
    setSections(generatedSections)
    setShowSetupWizard(false)
  }

  if (showSetupWizard) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create Product Review</h1>
        </div>

        <ProductSetupWizard onComplete={handleSetupComplete} onCancel={() => router.push("/")} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-20 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create Product Review</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsPreview(!isPreview)}>{isPreview ? "Edit" : "Preview"}</Button>
        </div>
      </div>

      {isPreview ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            {imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={title}
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h1 className="text-4xl font-bold mb-4">{title}</h1>

            <div className="text-gray-600 mb-8">Published: {new Date().toLocaleDateString()}</div>

            <ArticleRenderer blocks={flattenSections()} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-6">
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

                <UserSelector
                  value={userId}
                  onValueChange={setUserId}
                  label="User *"
                  placeholder="Select a user"
                  required={true}
                />

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
                        width={1280}
                        height={720}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=720&width=1280"
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-md text-sm dark:bg-blue-900 dark:text-blue-100">
                  <p className="font-medium text-blue-800 dark:text-blue-200">Article Editor Tips:</p>
                  <ul className="list-disc pl-5 mt-2 text-blue-700 dark:text-blue-300 space-y-1">
                    <li>Drag and drop entire sections to reposition them</li>
                    <li>Use the copy button to duplicate sections</li>
                    <li>CTA buttons are automatically added after every 3 sections</li>
                    <li>All blocks within a section move together when you drag the section</li>
                    <li>Use the up/down buttons on the left side to reorder sections</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label>Content *</Label>
                  <SectionEditor sections={sections} onChange={setSections} />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Article"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Article Settings</h3>
                  <div className="space-y-4">
                    <CategorySelector
                      value={categoryId}
                      onValueChange={setCategoryId}
                      label="Category"
                      placeholder="Select category"
                    />

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Publishing</h4>
                      <p className="text-sm text-gray-600">Article will be published immediately upon creation.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowSetupWizard(true)}
                    >
                      Reset Wizard
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setSections([])}
                    >
                      Clear Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
