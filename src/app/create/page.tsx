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
import { toast } from "@/Components/ui/use-toast"
import { SectionEditor } from "@/Components/block-editor/section-editor"
import { ArticleRenderer } from "@/Components/article-renderer"
import { ProductSetupWizard } from "@/Components/product-setup-wizard"
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
          <h1 className="text-4xl font-bold">Create Product Review</h1>
        </div>

        <ProductSetupWizard onComplete={handleSetupComplete} onCancel={() => router.push("/")} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-20 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 border-b pb-3 border-gray-200">Create Product Review</h1>
        <Button
          onClick={() => setIsPreview(!isPreview)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
        >
          {isPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {isPreview ? (
        <Card className="mb-8 shadow-lg border border-gray-200">
          <CardContent className="pt-6 px-6 md:px-8">
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

            <h1 className="text-4xl font-extrabold mb-4 text-gray-800">{title}</h1>

            <div className="text-gray-600 mb-8 font-bold text-lg border-b pb-4 border-gray-100">
              By <span className="text-indigo-600">{author || "Author"}</span> • {new Date().toLocaleDateString()}
            </div>

            <ArticleRenderer blocks={flattenSections()} />
          </CardContent>
        </Card>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-8 mb-8 bg-white p-6 rounded-lg shadow-md border border-gray-200"
        >
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-bold text-lg">
                Title *
              </Label>
              <Input
                className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-gray-700 font-bold text-lg">
                Author *
              </Label>
              <Input
                className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuredImage" className="text-gray-700 font-bold text-lg">
                Featured Image
              </Label>
              <div className="grid gap-4">
                {imageUrl ? (
                  <div className="relative group">
                    <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-100 border border-gray-200 shadow-sm transition-all duration-200 hover:shadow-lg">
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
                      className="absolute top-2 right-2 opacity-80 hover:opacity-100 shadow-md transition-all duration-200"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="imageUpload" className="text-gray-700 font-bold text-lg">
                        Upload Image
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md flex-1"
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="imageUrl" className="text-gray-700 font-bold text-lg">
                        Or Enter Image URL
                      </Label>
                      <Input
                        className="border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-md"
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

            <div className="bg-indigo-50 p-5 rounded-md mb-4 text-sm border-l-4 border-indigo-400">
              <p className="font-bold text-lg text-indigo-800 mb-2">Product Review Editor Tips:</p>
              <ul className="list-disc pl-5 mt-2 text-indigo-700 space-y-2">
                <li>Drag and drop entire sections to reposition them</li>
                <li>Use the copy button to duplicate sections</li>
                <li>CTA buttons are automatically added after every 3 sections</li>
                <li>All blocks within a section move together when you drag the section</li>
                <li>Use the up/down buttons on the left side to reorder sections</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-bold text-lg">Content *</Label>
              <SectionEditor sections={sections} onChange={setSections} />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="min-w-[120px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 h-auto"
            >
              {isSubmitting ? "Saving..." : "Save Article"}
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2 h-auto"
            >
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
