<<<<<<< HEAD
/* eslint-disable react/no-unescaped-entities */
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { SectionEditor } from "@/Components/block-editor/section-editor"
import { ArticleRenderer } from "@/Components/article-renderer"
import Image from "next/image"
=======
"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { SectionEditor } from "@/components/block-editor/section-editor";
import { ArticleRenderer } from "@/components/article-renderer";
import { ProductSetupWizard } from "@/components/product-setup-wizard";
import type { Article, Block } from "@/types/article";
import Image from "next/image";
>>>>>>> 8df71d7009f28e459d30985dc6deb02e2a890a03

// Updated Block and Article type definitions
interface Block {
  id: string
  type:
    | "paragraph"
    | "heading"
    | "image"
    | "quote"
    | "list"
    | "code"
    | "html"
    | "divider"
    | "cta"
    | "productReview"
    | "productRating"
    | "prosCons"
    | "ingredientsSection"
  content: string
  level?: 1 | 2 | 3
  listType?: "ordered" | "unordered"
  language?: string
  imageUrl?: string
  ctaText?: string
  ctaLink?: string
  productName?: string
  overallRating?: number
  ratings?: {
    ingredients?: number
    value?: number
    manufacturer?: number
    safety?: number
    effectiveness?: number
  }
  highlights?: string[]
  pros?: string[]
  cons?: string[]
  ingredients?: string[]
  ingredientsList?: Array<{
    id: string
    number: number
    name: string
    imageUrl: string
    description: string
    studyYear: string
    studySource: string
    studyDescription: string
  }>
  ingredientsIntroduction?: string
  howToUse?: string
  price?: string
  verdict?: string
  ctaButtonText?: string
  ctaButtonLink?: string
  customFields?: Array<{ id: string; name: string; value: string }>
}

interface Article {
  id: string
  title: string
  slug: string
  author: string
  imageUrl?: string
  blocks: Block[]
  publishDate: string
  createdAt: string
  updatedAt: string
}

// Mock ProductSetupWizard component
const ProductSetupWizard = ({
  onComplete,
  onCancel,
}: {
  onComplete: (productName: string, generatedSections: Block[][]) => void
  onCancel: () => void
}) => {
  const [productName, setProductName] = useState("")
  const [productType, setProductType] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!productName.trim()) {
      toast({
        title: "Product name required",
        description: "Please enter a product name to continue",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate sample sections for the product review
    const generatedSections: Block[][] = [
      [
        {
          id: crypto.randomUUID(),
          type: "heading",
          level: 2,
          content: "Overview",
        },
        {
          id: crypto.randomUUID(),
          type: "paragraph",
          content: `${productName} is a revolutionary product that has been gaining attention in the market. In this comprehensive review, we'll explore its features, benefits, and whether it lives up to the hype.`,
        },
      ],
      [
        {
          id: crypto.randomUUID(),
          type: "heading",
          level: 2,
          content: "What is it?",
        },
        {
          id: crypto.randomUUID(),
          type: "paragraph",
          content: `${productName} is designed to provide users with an innovative solution for their needs. The product combines cutting-edge technology with user-friendly design to deliver exceptional results.`,
        },
      ],
      [
        {
          id: crypto.randomUUID(),
          type: "heading",
          level: 2,
          content: "Pros & Cons",
        },
        {
          id: crypto.randomUUID(),
          type: "prosCons",
          content: "",
          ingredients: ["High-quality materials", "Advanced technology", "User-friendly design"],
          pros: ["Excellent build quality", "Easy to use", "Great value for money", "Reliable performance"],
          cons: ["Slightly expensive", "Limited color options", "Requires regular maintenance"],
        },
      ],
      [
        {
          id: crypto.randomUUID(),
          type: "heading",
          level: 2,
          content: "Conclusion",
        },
        {
          id: crypto.randomUUID(),
          type: "paragraph",
          content: `After thorough testing and evaluation, ${productName} proves to be a solid choice for users looking for quality and reliability. While it may have some minor drawbacks, the overall experience is positive and we recommend it for most users.`,
        },
        {
          id: crypto.randomUUID(),
          type: "cta",
          content: "",
          ctaText: `Get ${productName} Now`,
          ctaLink: "https://example.com/product",
        },
      ],
    ]

    setIsGenerating(false)
    onComplete(productName, generatedSections)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Product Setup Wizard</h2>
            <p className="text-gray-600">
              Let's create a comprehensive product review article. We'll generate a structured outline based on your
              product information.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter the product name..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product Type</Label>
              <select
                id="productType"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select product type...</option>
                <option value="supplement">Health Supplement</option>
                <option value="skincare">Skincare Product</option>
                <option value="fitness">Fitness Equipment</option>
                <option value="tech">Technology Product</option>
                <option value="home">Home & Garden</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
              {isGenerating ? "Generating Article Structure..." : "Generate Article Structure"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              <strong>What happens next:</strong>
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>We'll create a structured article outline with relevant sections</li>
              <li>You can customize and edit all content after generation</li>
              <li>Add your own images, ratings, and detailed information</li>
              <li>Preview and publish when ready</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CreateArticlePage() {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(true);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sections, setSections] = useState<Block[][]>([]);

  // Flatten sections into blocks for saving and preview
  const flattenSections = (): Block[] => {
    return sections.flat();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || sections.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add some content",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const article: Partial<Article> = {
        title,
        slug: title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
        blocks: flattenSections(),
        author,
        publishDate: new Date().toISOString(),
        imageUrl: imageUrl || undefined,
      };

      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      });

      if (!response.ok) {
        throw new Error("Failed to create article");
      }

      const createdArticle = await response.json()

      toast({
        title: "Success",
        description: "Article created successfully",
      });

<<<<<<< HEAD
      // Redirect to the created article
      router.push(`/articles/${createdArticle.slug}`)
      router.refresh()

    } catch (error) {
      console.error("Error creating article:", error);
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetupComplete = (
    productName: string,
    generatedSections: Block[][]
  ) => {
    setTitle(`${productName} Review: Is It Worth It?`);
    setSections(generatedSections);
    setShowSetupWizard(false);
  };

  const handleSkipWizard = () => {
    // Create a basic structure for manual article creation
    const basicSections: Block[][] = [
      [
        {
          id: crypto.randomUUID(),
          type: "heading",
          level: 2,
          content: "Introduction",
        },
        {
          id: crypto.randomUUID(),
          type: "paragraph",
          content: "",
        },
      ],
    ]
    setSections(basicSections)
    setShowSetupWizard(false)
  }

  if (showSetupWizard) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Article</h1>
          <Button variant="outline" onClick={handleSkipWizard}>
            Skip Wizard
          </Button>
        </div>

        <ProductSetupWizard
          onComplete={handleSetupComplete}
          onCancel={() => router.push("/")}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Article</h1>
        <div className="flex space-x-2">
<<<<<<< HEAD
          <Button variant="outline" onClick={() => setShowSetupWizard(true)}>
            Restart Wizard
          </Button>
          <Button onClick={() => setIsPreview(!isPreview)}>{isPreview ? "Edit" : "Preview"}</Button>
=======
          <Button onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? "Edit" : "Preview"}
          </Button>
>>>>>>> 8df71d7009f28e459d30985dc6deb02e2a890a03
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
<<<<<<< HEAD
                  width={800}
                  height={400}
=======
>>>>>>> 8df71d7009f28e459d30985dc6deb02e2a890a03
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
                    width={800}
                    height={400}
                    className="w-full h-full object-cover"
                    onError={(e) => {
<<<<<<< HEAD
                      e.currentTarget.src = "/placeholder.svg?height=400&width=800"
=======
                      e.currentTarget.src =
                        "/abstract-geometric-placeholder.png";
>>>>>>> 8df71d7009f28e459d30985dc6deb02e2a890a03
                    }}
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm">
<<<<<<< HEAD
              <p className="font-medium text-blue-800">Article Editor Tips:</p>
              <ul className="list-disc pl-5 mt-2 text-blue-700 space-y-1">
                <li>Drag and drop entire sections to reposition them</li>
                <li>Use the copy button to duplicate sections</li>
                <li>Add different block types like images, quotes, lists, and product reviews</li>
                <li>All blocks within a section move together when you drag the section</li>
                <li>Use the up/down buttons on the left side to reorder sections</li>
                <li>Click the AI sparkle button to generate content for any block</li>
=======
              <p className="font-medium text-blue-800">
                Product Review Editor Tips:
              </p>
              <ul className="list-disc pl-5 mt-2 text-blue-700 space-y-1">
                <li>Drag and drop entire sections to reposition them</li>
                <li>Use the copy button to duplicate sections</li>
                <li>
                  CTA buttons are automatically added after every 3 sections
                </li>
                <li>
                  All blocks within a section move together when you drag the
                  section
                </li>
                <li>
                  Use the up/down buttons on the left side to reorder sections
                </li>
>>>>>>> 8df71d7009f28e459d30985dc6deb02e2a890a03
              </ul>
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <SectionEditor sections={sections} onChange={setSections} />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Article..." : "Create Article"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
