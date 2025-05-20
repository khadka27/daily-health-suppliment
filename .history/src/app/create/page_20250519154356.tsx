"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { SectionEditor } from "@/components/block-editor/section-editor"
import { ArticleRenderer } from "@/components/article-renderer"
import { ProductSetupWizard } from "@/components/product-setup-wizard"
import { X } from "lucide-react"
import type { Article, Block } from "@/types/article"

export default function CreateArticlePage() {
  const router = useRouter()
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSetupWizard, setShowSetupWizard] = useState(true)
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [sections, setSections] = useState<Block[][]>([])
  const [isUploading, setIsUploading] = useState(false)

  // Flatten sections into blocks for saving and preview
  const flattenSections = (): Block[] => {
    return sections.flat()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview the image locally
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return imageUrl

    setIsUploading(true)
    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", imageFile)

      // Upload the image to your API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.url // Return the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image. Using URL instead if provided.",
        variant: "destructive",
      })
      return imageUrl // Fallback to the URL if upload fails
    } finally {
      setIsUploading(false)
    }
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

      // Upload the image if there is one
      const finalImageUrl = imageFile ? await uploadImage() : imageUrl

      const article: Partial<Article> = {
        title,
        slug: title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
        blocks: flattenSections(),
        author,
        publishDate: new Date().toISOString(),
        imageUrl: finalImageUrl || undefined,
      }

      const response = await fetch("/api/articles", {
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

  const clearImage = () => {
    setImageUrl("")
    setImageFile(null)
  }

  if (showSetupWizard) {
    return (
      <div className="container mx-auto px-12 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create Product Review</h1>
        </div>

        <ProductSetupWizard onComplete={handleSetupComplete} onCancel={() => router.push("/")} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-20 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Create Product Review</h1>
        <Button onClick={() => setIsPreview(!isPreview)}>{isPreview ? "Edit" : "Preview"}</Button>
      </div>

      {isPreview ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            {imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6">
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt={title}
                  width={1200}
                  height={675}
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
              <Label htmlFor="featuredImage">Featured Image</Label>
              <div className="grid gap-4">
                {imageUrl ? (
                  <div className="relative">
                    <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt="Featured image"
                        width={1200}
                        height={675}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/abstract-geometric-pattern.png"
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="imageUpload">Upload Image</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="imageUrl">Or Enter Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Enter image URL (optional)"
                      />
                    </div>
                  </div>
                )}
              </div>
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

          <div className="flex flex-wrap gap-4">
            <Button type="submit" disabled={isSubmitting || isUploading} className="min-w-[120px]">
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
