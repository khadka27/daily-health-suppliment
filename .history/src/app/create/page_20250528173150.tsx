"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { toast } from "@/Components/ui/use-toast"
import SectionEditor from "@/Components/block-editor/section-editor"
import { ArticleRenderer } from "@/Components/article-renderer"
import { ProductSetupWizard } from "@/Components/product-setup-wizard"
import type { Article, Block } from "@/types/article"

export default function CreateArticlePage() {
  const router = useRouter()
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSetupWizard, setShowSetupWizard] = useState(true)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [sections, setSections] = useState<Block[][]>([])

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

      const article: Partial<Article> = {
        title,
        slug: title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
        author,
        publishDate: new Date().toISOString(),
        imageUrl: imageUrl || undefined,
        // Add other required fields with default values
        description: "",
        howToTake: "",
        safety: "",
        effectiveness: "",
        howItWorks: "",
        conclusion: "",
        officialWebsite: "",
        overallRating: 0,
        ingredientsRating: 0,
        valueRating: 0,
        manufacturerRating: 0,
        safetyRating: 0,
        pros: [],
        cons: [],
        brandHighlights: [],
        keyIngredients: [],
        pricing: {
          singleBottle: "",
          threeBottles: "",
          sixBottles: "",
        },
        manufacturerInfo: {
          name: "",
          location: "",
          description: "",
        },
        ingredients: [],
        faqs: [],
        customerReviews: [],
      }

      const response = await fetch("/api/article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      })

      if (!response.ok) {
        throw new Error("Failed to create article")
      }

      toast({
        title: "Success",
        description: "Article created successfully",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error creating article:", error)
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
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
    <div className="container mx-auto px-4 py-8">
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
                  width={800}
                  height={400}
                  className="w-full h-full object-cover"
                />
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
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/abstract-geometric-placeholder.png"
                    }}
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm">
              <p className="font-medium text-blue-800">Product Review Editor Tips:</p>
              <ul className="list-disc pl-5 mt-2 text-blue-700 space-y-1">
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
      )}
    </div>
  )
}
