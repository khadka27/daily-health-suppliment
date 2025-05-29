"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  PlusCircle,
  ImageIcon,
  Quote,
  List,
  Minus,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  GripVertical,
  Code,
  FileCode,
  ExternalLink,
  Star,
  Plus,
  AlignLeft,
  Heading2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/Components/ui/use-toast"
import type { Block } from "@/types/article"
import { BlockTypeIndicator } from "./block-type-indicator"
import { BlockConverter } from "./block-converter"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { ImageUploader } from "@/components/image-uploader"
import { HorizontalToc } from "@/components/horizontal-toc"
import { ProsConsSection } from "@/components/pros-cons-section"
import { ProductRatingSection } from "@/components/product-rating-section"
import { IngredientsSection } from "@/components/ingredients-section"

interface BlockEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [activeBlock, setActiveBlock] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [showDragHandleMenu, setShowDragHandleMenu] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string>("")
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Generate TOC items from section blocks
  const tocItems = blocks
    .filter((block) => block.type === "heading" && block.level === 2)
    .map((block) => ({
      id: block.id,
      title: block.content,
    }))

  // Add default sections if not present in blocks
  const defaultSections = [
    "Overview",
    "What is It?",
    "Rating",
    "Pros",
    "Cons",
    "Brand",
    "How Does It Work?",
    "Ingredients",
    "How to Use?",
    "What to Expect?",
    "Benefits",
    "Safety",
    "How Effective is It?",
    "Price",
    "Reviews",
    "FAQ's",
    "Conclusion",
  ]

  const allTocItems =
    tocItems.length > 0
      ? tocItems
      : defaultSections.map((title, index) => ({
          id: `section-${index}`,
          title,
        }))

  // Scroll to section when TOC item is clicked
  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = blockRefs.current[id]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    } else {
      // If section doesn't exist, create it
      const sectionTitle = allTocItems.find((item) => item.id === id)?.title || ""
      if (sectionTitle) {
        addSectionHeading(sectionTitle, blocks.length)
      }
    }
  }

  const addSectionHeading = (title: string, index: number) => {
    const newBlock: Block = {
      id: uuidv4(),
      type: "heading",
      level: 2,
      content: title,
    }

    const newBlocks = [...blocks]
    newBlocks.splice(index, 0, newBlock)
    onChange(newBlocks)

    // Focus the new block after it's added
    setTimeout(() => {
      setActiveBlock(newBlock.id)
    }, 100)
  }

  const addBlock = (type: Block["type"], index: number) => {
    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: "",
    }

    if (type === "heading") {
      newBlock.level = 2
    }

    if (type === "list") {
      newBlock.listType = "unordered"
    }

    if (type === "code") {
      newBlock.language = "javascript"
    }

    if (type === "cta") {
      newBlock.ctaText = "Learn More"
      newBlock.ctaLink = "https://example.com"
    }

    if (type === "productReview") {
      newBlock.productName = "Product Name"
      newBlock.overallRating = 4.5
      newBlock.ratings = {
        ingredients: 4.7,
        value: 4.6,
        manufacturer: 4.8,
        safety: 4.8,
      }
      newBlock.highlights = ["Feature 1", "Feature 2", "Feature 3"]
      newBlock.pros = ["Pro 1", "Pro 2", "Pro 3"]
      newBlock.cons = ["Con 1", "Con 2"]
      newBlock.ingredients = ["Ingredient 1", "Ingredient 2"]
      newBlock.howToUse = "Usage instructions go here."
      newBlock.price = "$49.99"
      newBlock.verdict = "Overall verdict goes here."
      newBlock.ctaButtonText = "Shop Now"
      newBlock.ctaButtonLink = "https://example.com/product"
      newBlock.customFields = []
    }

    if (type === "productRating") {
      newBlock.productName = "Alpha Labs Male Enhancement"
      newBlock.ratings = {
        ingredients: 4.7,
        value: 4.6,
        manufacturer: 4.8,
        safety: 4.8,
        effectiveness: 4.7,
      }
      newBlock.highlights = [
        "Made with clinically-tested, powerfully effective ingredients.",
        "Manufactured in the USA",
        "Made in GMP-certified facilities to ensure product safety and quality",
      ]
      newBlock.ctaButtonText = "SHOP NOW"
      newBlock.ctaButtonLink = "#"
    }

    if (type === "ingredientsSection") {
      newBlock.productName = "Alpha Labs Male Enhancement"
      newBlock.ingredientsIntroduction =
        "Alpha Labs Male Enhancement (975mg) features natural ingredients known to support male performance, reproductive health, and hormonal balance. Its ingredients include:"
      newBlock.ingredientsList = [
        {
          id: "ing1",
          number: 1,
          name: "Vitamin A",
          imageUrl: "/placeholder-f2tcl.png",
          description:
            "Vitamin A plays a foundational role in male reproductive health, especially in the production and maturation of sperm cells. It supports healthy testicular function and is required for spermatogenesis, the process by which the body produces sperm.",
          studyYear: "2010",
          studySource: "The Journal of Clinical Investigation",
          studyDescription:
            "emphasized that retinoic acid (a form of Vitamin A) is essential for germ cell development and male fertility regulation. Deficiency in Vitamin A has been associated with impaired sperm production and reduced testicular function.",
        },
        {
          id: "ing2",
          number: 2,
          name: "Zinc",
          imageUrl: "/zinc-rich-foods.png",
          description:
            "Zinc is one of the most critical minerals for male sexual health. It plays a direct role in testosterone production, sperm quality, and fertility. As noted in our Alpha EnhanceX Review, zinc supplementation can help improve testosterone levels and enhance sexual function. Low zinc levels are linked to reduced testosterone and poor semen parameters, including sperm count and motility.",
          studyYear: "2020",
          studySource: "International Journal of Molecular Science",
          studyDescription:
            "noted that zinc supplementation improved sperm motility, concentration, and morphology in men with infertility issues. Zinc also helps reduce oxidative stress in the testes, which can protect sperm DNA from damage.",
        },
      ]
    }

    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    onChange(newBlocks)

    // Focus the new block after it's added
    setTimeout(() => {
      setActiveBlock(newBlock.id)
    }, 100)
  }

  const updateBlock = (id: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map((block) => (block.id === id ? { ...block, ...updates } : block))
    onChange(newBlocks)
  }

  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You need at least one block in your section",
        variant: "destructive",
      })
      return
    }

    const index = blocks.findIndex((block) => block.id === id)
    const newBlocks = blocks.filter((block) => block.id !== id)
    onChange(newBlocks)

    // Focus the previous block or the next one if there's no previous
    const nextActiveIndex = Math.max(0, index - 1)
    setTimeout(() => {
      setActiveBlock(newBlocks[nextActiveIndex]?.id || null)
    }, 100)
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((block) => block.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === blocks.length - 1)) {
      return
    }

    const newBlocks = [...blocks]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const [movedBlock] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, movedBlock)
    onChange(newBlocks)
  }

  const moveBlockToPosition = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, movedBlock)
    onChange(newBlocks)
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id)
    e.dataTransfer.effectAllowed = "move"
    setDraggedBlock(id)

    // Add a delay to set a visual cue for the dragged element
    setTimeout(() => {
      if (blockRefs.current[id]) {
        blockRefs.current[id]?.classList.add("opacity-50")
      }
    }, 0)
  }

  const handleDragEnd = () => {
    // Remove visual cues
    if (draggedBlock && blockRefs.current[draggedBlock]) {
      blockRefs.current[draggedBlock]?.classList.remove("opacity-50")
    }

    setDraggedBlock(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

    if (dragOverIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()

    const id = e.dataTransfer.getData("text/plain")
    const fromIndex = blocks.findIndex((block) => block.id === id)

    if (fromIndex !== -1) {
      moveBlockToPosition(fromIndex, toIndex)
    }

    setDraggedBlock(null)
    setDragOverIndex(null)
  }

  const handlePaste = (e: React.ClipboardEvent, blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    // If pasting into a code or HTML block, let the default behavior happen
    if (block.type === "code" || block.type === "html") {
      return
    }

    // Get the clipboard data
    const text = e.clipboardData.getData("text/plain")
    const html = e.clipboardData.getData("text/html")

    // Check if it looks like code (has multiple lines with indentation or special characters)
    const looksLikeCode =
      text.includes("{") ||
      text.includes("}") ||
      text.includes("<") ||
      text.includes(">") ||
      text.includes(";") ||
      text.split("\n").some((line) => line.startsWith("  ") || line.startsWith("\t"))

    // Check if it looks like HTML
    const looksLikeHtml =
      html.includes("<div") ||
      html.includes("<p") ||
      html.includes("<span") ||
      html.includes("<a") ||
      html.includes("<table") ||
      html.includes("<ul") ||
      html.includes("<ol") ||
      html.includes("<li")

    // Check if it looks like a heading (short text that ends with no punctuation)
    const looksLikeHeading =
      text.length < 100 && !text.includes("\n") && !text.endsWith(".") && !text.endsWith("!") && !text.endsWith("?")

    // Check if it looks like a list (lines starting with - or * or numbers)
    const looksLikeList = text
      .split("\n")
      .some((line) => line.trim().startsWith("-") || line.trim().startsWith("*") || /^\d+\./.test(line.trim()))

    if (looksLikeCode && window.confirm("This looks like code. Create a code block?")) {
      e.preventDefault()
      const newBlock: Block = {
        id: uuidv4(),
        type: "code",
        content: text,
        language: "javascript", // Default language
      }

      const index = blocks.findIndex((b) => b.id === blockId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      onChange(newBlocks)
    } else if (looksLikeHtml && window.confirm("This looks like HTML. Create an HTML block?")) {
      e.preventDefault()
      const newBlock: Block = {
        id: uuidv4(),
        type: "html",
        content: html,
      }

      const index = blocks.findIndex((b) => b.id === blockId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      onChange(newBlocks)
    } else if (looksLikeHeading && window.confirm("This looks like a heading. Create a heading block?")) {
      e.preventDefault()
      const newBlock: Block = {
        id: uuidv4(),
        type: "heading",
        content: text,
        level: 2, // Default to h2
      }

      const index = blocks.findIndex((b) => b.id === blockId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      onChange(newBlocks)
    } else if (looksLikeList && window.confirm("This looks like a list. Create a list block?")) {
      e.preventDefault()
      // Clean up the list items
      const listItems = text
        .split("\n")
        .map((line) =>
          line
            .trim()
            .replace(/^[-*]\s+/, "")
            .replace(/^\d+\.\s+/, ""),
        )
        .filter((item) => item.length > 0)
        .join("\n")

      const newBlock: Block = {
        id: uuidv4(),
        type: "list",
        content: listItems,
        listType: text.includes("1.") ? "ordered" : "unordered",
      }

      const index = blocks.findIndex((b) => b.id === blockId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      onChange(newBlocks)
    }
  }

  const generateAIContent = async (blockId: string, prompt = "") => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    setIsGenerating(true)

    try {
      let userPrompt = prompt

      if (!userPrompt) {
        userPrompt = window.prompt("What content would you like to generate?", "")
        if (!userPrompt) {
          setIsGenerating(false)
          return
        }
      }

      // Simulate AI generation with a timeout
      // In a real app, you would call an API here
      await new Promise((resolve) => setTimeout(resolve, 1500))

      let generatedContent = ""

      switch (block.type) {
        case "paragraph":
          generatedContent = `This is an AI-generated paragraph about ${userPrompt}. It would typically contain several sentences exploring the topic in detail, providing information, insights, and perhaps some analysis. The content would be tailored to match the user's request while maintaining a natural, flowing style that reads well.`
          break
        case "heading":
          generatedContent = `${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}`
          break
        case "quote":
          generatedContent = `"The best way to predict the future is to create it." — Someone famous on ${userPrompt}`
          break
        case "list":
          generatedContent = `Item 1 about ${userPrompt}\nItem 2 about ${userPrompt}\nItem 3 about ${userPrompt}`
          break
        case "code":
          generatedContent = `// Example code related to ${userPrompt}\nfunction example() {\n  console.log("This is a sample code about ${userPrompt}");\n  return "Hello, world!";\n}`
          break
        case "html":
          generatedContent = `<div style="padding: 20px; background-color: #f8f9fa; border-radius: 5px;">\n  <h3 style="color: #333;">Generated HTML about ${userPrompt}</h3>\n  <p>This is a sample HTML content about ${userPrompt}.</p>\n</div>`
          break
        case "productReview":
          const updates: Partial<Block> = {
            productName: `${userPrompt} Product`,
            highlights: [
              `Premium quality ${userPrompt}`,
              `Advanced features for ${userPrompt}`,
              `Best-in-class ${userPrompt} performance`,
            ],
            pros: [`Excellent ${userPrompt} quality`, `Great value for money`, `Durable and reliable`],
            cons: [`Slightly higher price than competitors`, `Limited color options`],
            ingredients: [
              `Main ingredient for ${userPrompt}`,
              `Supporting ingredient for ${userPrompt}`,
              `Natural extracts for ${userPrompt}`,
            ],
            howToUse: `To use this ${userPrompt} product, simply apply as directed once daily for best results.`,
            verdict: `After thorough testing, we found this ${userPrompt} product to be highly effective and worth the investment for those serious about quality.`,
            ratings: {
              effectiveness: 4.7,
              value: 4.6,
              manufacturer: 4.8,
              safety: 4.8,
            },
          }
          updateBlock(blockId, updates)
          break
        default:
          generatedContent = `Generated content about ${userPrompt}`
      }

      if (block.type !== "productReview") {
        updateBlock(blockId, { content: generatedContent })
      }

      toast({
        title: "Content generated",
        description: "AI-generated content has been added to your block",
      })
    } catch (error) {
      console.error("Error generating content:", error)
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const convertBlockType = (id: string, newType: Block["type"]) => {
    const block = blocks.find((b) => b.id === id)
    if (!block) return

    const updates: Partial<Block> = { type: newType }

    // Set default values for the new block type
    if (newType === "heading") {
      updates.level = 2
    } else if (newType === "list") {
      updates.listType = "unordered"
    } else if (newType === "code") {
      updates.language = "javascript"
    } else if (newType === "cta") {
      updates.ctaText = "Learn More"
      updates.ctaLink = "https://example.com"
    } else if (newType === "productReview") {
      updates.productName = "Product Name"
      updates.overallRating = 4.5
      updates.ratings = {
        ingredients: 4.7,
        value: 4.6,
        manufacturer: 4.8,
        safety: 4.8,
      }
      updates.highlights = ["Feature 1", "Feature 2", "Feature 3"]
      updates.pros = ["Pro 1", "Pro 2", "Pro 3"]
      updates.cons = ["Con 1", "Con 2"]
      updates.ingredients = ["Ingredient 1", "Ingredient 2"]
      updates.howToUse = "Usage instructions go here."
      updates.price = "$49.99"
      updates.verdict = "Overall verdict goes here."
      updates.ctaButtonText = "Shop Now"
      updates.ctaButtonLink = "https://example.com/product"
      updates.customFields = []
    }

    updateBlock(id, updates)
  }

  const addPro = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const pros = [...(block.pros || []), "New pro point"]
    updateBlock(blockId, { pros })
  }

  const updatePro = (blockId: string, index: number, text: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.pros) return

    const pros = [...block.pros]
    pros[index] = text
    updateBlock(blockId, { pros })
  }

  const removePro = (blockId: string, index: number) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.pros) return

    const pros = block.pros.filter((_, i) => i !== index)
    updateBlock(blockId, { pros })
  }

  const addCon = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const cons = [...(block.cons || []), "New con point"]
    updateBlock(blockId, { cons })
  }

  const updateCon = (blockId: string, index: number, text: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.cons) return

    const cons = [...block.cons]
    cons[index] = text
    updateBlock(blockId, { cons })
  }

  const removeCon = (blockId: string, index: number) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.cons) return

    const cons = block.cons.filter((_, i) => i !== index)
    updateBlock(blockId, { cons })
  }

  const addIngredient = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const ingredients = [...(block.ingredients || []), "New ingredient"]
    updateBlock(blockId, { ingredients })
  }

  const updateIngredient = (blockId: string, index: number, text: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.ingredients) return

    const ingredients = [...block.ingredients]
    ingredients[index] = text
    updateBlock(blockId, { ingredients })
  }

  const removeIngredient = (blockId: string, index: number) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.ingredients) return

    const ingredients = block.ingredients.filter((_, i) => i !== index)
    updateBlock(blockId, { ingredients })
  }

  const addHighlight = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const highlights = [...(block.highlights || []), "New highlight"]
    updateBlock(blockId, { highlights })
  }

  const updateHighlight = (blockId: string, index: number, text: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.highlights) return

    const highlights = [...block.highlights]
    highlights[index] = text
    updateBlock(blockId, { highlights })
  }

  const removeHighlight = (blockId: string, index: number) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.highlights) return

    const highlights = block.highlights.filter((_, i) => i !== index)
    updateBlock(blockId, { highlights })
  }

  const addCustomField = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const customFields = [...(block.customFields || []), { id: uuidv4(), name: "New Field", value: "Field Value" }]
    updateBlock(blockId, { customFields })
  }

  const updateCustomField = (blockId: string, fieldId: string, updates: { name?: string; value?: string }) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.customFields) return

    const customFields = block.customFields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field))
    updateBlock(blockId, { customFields })
  }

  const removeCustomField = (blockId: string, fieldId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.customFields) return

    const customFields = block.customFields.filter((field) => field.id !== fieldId)
    updateBlock(blockId, { customFields })
  }

  // Focus the block when it becomes active
  useEffect(() => {
    if (activeBlock && blockRefs.current[activeBlock]) {
      const element = blockRefs.current[activeBlock]
      const inputElement = element?.querySelector("input, textarea") as HTMLElement
      if (inputElement) {
        inputElement.focus()
      }
    }
  }, [activeBlock])

  // Helper function to render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-yellow-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    )
  }

  // Add a new section from the default sections
  const addDefaultSection = (title: string) => {
    // Check if section already exists
    const existingSection = blocks.find(
      (block) => block.type === "heading" && block.level === 2 && block.content === title,
    )

    if (existingSection) {
      // Scroll to existing section
      scrollToSection(existingSection.id)
      return
    }

    // Add new section at the end
    addSectionHeading(title, blocks.length)
  }

  return (
    <TooltipProvider>
      <div className="space-y-1">
        {/* Horizontal Table of Contents */}
        <div className="mb-6 bg-white sticky top-0 z-10 shadow-sm">
          <HorizontalToc items={allTocItems} activeId={activeSection} onItemClick={scrollToSection} />

          <div className="flex justify-end p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {defaultSections.map((section, index) => (
                  <DropdownMenuItem key={index} onClick={() => addDefaultSection(section)}>
                    <Heading2 className="h-4 w-4 mr-2" />
                    {section}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {blocks.map((block, index) => (
          <div key={block.id} className="relative">
            {/* Floating add button between blocks */}
            <div
              className="absolute left-1/2 -top-3 transform -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-6 w-6 rounded-full bg-white shadow-md">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={() => addBlock("paragraph", index - 1)}>
                    <AlignLeft className="h-4 w-4 mr-2" />
                    <span>Paragraph</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("heading", index - 1)}>
                    <Heading2 className="h-4 w-4 mr-2" />
                    <span>Heading</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("image", index - 1)}>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    <span>Image</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("quote", index - 1)}>
                    <Quote className="h-4 w-4 mr-2" />
                    <span>Quote</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("list", index - 1)}>
                    <List className="h-4 w-4 mr-2" />
                    <span>List</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("code", index - 1)}>
                    <Code className="h-4 w-4 mr-2" />
                    <span>Code</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("html", index - 1)}>
                    <FileCode className="h-4 w-4 mr-2" />
                    <span>HTML</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("cta", index - 1)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span>Call to Action</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("productReview", index - 1)}>
                    <Star className="h-4 w-4 mr-2" />
                    <span>Product Review</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("productRating", index - 1)}>
                    <Star className="h-4 w-4 mr-2" />
                    <span>Product Rating</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("divider", index - 1)}>
                    <Minus className="h-4 w-4 mr-2" />
                    <span>Divider</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("prosCons", index - 1)}>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <ThumbsDown className="h-4 w-4 mr-2" />
                    </div>
                    <span>Pros & Cons</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("ingredientsSection", index - 1)}>
                    <Star className="h-4 w-4 mr-2" />
                    <span>Ingredients Section</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div
              ref={(el) => {
                blockRefs.current[block.id] = el

                // If this is a heading, register it as a section
                if (block.type === "heading" && block.level === 2) {
                  blockRefs.current[block.id] = el
                }
              }}
              className={`relative group ${activeBlock === block.id ? "ring-2 ring-blue-500 rounded-md" : ""} 
                       ${dragOverIndex === index ? "border-t-4 border-blue-500" : ""}`}
              onClick={() => setActiveBlock(block.id)}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onKeyDown={(e) => {
                // Alt+Arrow Up/Down to move blocks
                if (e.altKey) {
                  if (e.key === "ArrowUp" && index > 0) {
                    e.preventDefault()
                    moveBlock(block.id, "up")
                  } else if (e.key === "ArrowDown" && index < blocks.length - 1) {
                    e.preventDefault()
                    moveBlock(block.id, "down")
                  }
                }
              }}
              tabIndex={0} // Make the div focusable for keyboard events
              id={block.id}
            >
              <div className="border border-gray-200 hover:border-gray-300 transition-colors mb-2 rounded-md">
                <div className="p-2">
                  {/* Drag handle with plus sign */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseEnter={() => setShowDragHandleMenu(block.id)}
                    onMouseLeave={() => setShowDragHandleMenu(null)}
                  >
                    <div className="relative">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      {showDragHandleMenu === block.id && (
                        <div className="absolute left-full ml-2 bg-white shadow-md rounded-md p-1 z-20">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addBlock("paragraph", index)
                                }}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p>Add field</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <div className="mt-1">
                      <BlockTypeIndicator type={block.type} />
                    </div>
                  </div>

                  <div className="ml-6">
                    <div className="mb-2">
                      <BlockConverter block={block} onConvert={(type) => convertBlockType(block.id, type)} />
                    </div>
                    {/* Block content based on type */}
                    {block.type === "paragraph" && (
                      <Textarea
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Type paragraph content..."
                        className="min-h-[100px] resize-y"
                        onPaste={(e) => handlePaste(e, block.id)}
                      />
                    )}

                    {block.type === "heading" && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <select
                            value={block.level || 2}
                            onChange={(e) => updateBlock(block.id, { level: Number(e.target.value) as 1 | 2 | 3 })}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          >
                            <option value={1}>H1</option>
                            <option value={2}>H2</option>
                            <option value={3}>H3</option>
                          </select>
                          <Input
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="Heading text..."
                            className="flex-1 text-lg font-bold"
                            onPaste={(e) => handlePaste(e, block.id)}
                          />
                        </div>
                      </div>
                    )}

                    {block.type === "image" && (
                      <div className="space-y-4">
                        <ImageUploader
                          initialImage={block.imageUrl}
                          onImageChange={(imageData) => updateBlock(block.id, { imageUrl: imageData })}
                        />
                        <Input
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Image caption (optional)..."
                          onPaste={(e) => handlePaste(e, block.id)}
                        />
                      </div>
                    )}

                    {block.type === "quote" && (
                      <div className="border-l-4 border-gray-300 pl-4">
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Enter quote text..."
                          className="italic min-h-[80px] resize-y"
                          onPaste={(e) => handlePaste(e, block.id)}
                        />
                      </div>
                    )}

                    {block.type === "list" && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <select
                            value={block.listType || "unordered"}
                            onChange={(e) =>
                              updateBlock(block.id, { listType: e.target.value as "ordered" | "unordered" })
                            }
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          >
                            <option value="unordered">Bullet List</option>
                            <option value="ordered">Numbered List</option>
                          </select>
                        </div>
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Enter list items, one per line..."
                          className="min-h-[100px] resize-y"
                          onPaste={(e) => handlePaste(e, block.id)}
                        />
                      </div>
                    )}

                    {block.type === "code" && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 mb-2">
                          <select
                            value={block.language || "javascript"}
                            onChange={(e) => updateBlock(block.id, { language: e.target.value })}
                            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                          >
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="csharp">C#</option>
                            <option value="php">PHP</option>
                            <option value="ruby">Ruby</option>
                            <option value="go">Go</option>
                            <option value="rust">Rust</option>
                            <option value="swift">Swift</option>
                            <option value="kotlin">Kotlin</option>
                            <option value="sql">SQL</option>
                            <option value="json">JSON</option>
                            <option value="xml">XML</option>
                            <option value="markdown">Markdown</option>
                            <option value="bash">Bash</option>
                            <option value="plaintext">Plain Text</option>
                          </select>
                        </div>
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder={`Enter ${block.language || "code"} here...`}
                          className="min-h-[150px] resize-y font-mono text-sm"
                          onPaste={(e) => handlePaste(e, block.id)}
                        />
                      </div>
                    )}

                    {block.type === "html" && (
                      <div className="space-y-2">
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Enter HTML code here..."
                          className="min-h-[150px] resize-y font-mono text-sm"
                        />
                        <div className="p-2 border rounded-md bg-gray-50">
                          <p className="text-xs text-gray-500 mb-2">Preview:</p>
                          <div
                            className="p-2 border rounded-md bg-white"
                            dangerouslySetInnerHTML={{ __html: block.content }}
                          />
                        </div>
                      </div>
                    )}

                    {block.type === "divider" && (
                      <div className="py-2">
                        <hr className="border-t-2 border-gray-200" />
                      </div>
                    )}

                    {block.type === "cta" && (
                      <div className="space-y-4 p-4 border rounded-md bg-gray-50">
                        <div className="space-y-2">
                          <Label htmlFor={`cta-text-${block.id}`}>Button Text</Label>
                          <Input
                            id={`cta-text-${block.id}`}
                            value={block.ctaText || ""}
                            onChange={(e) => updateBlock(block.id, { ctaText: e.target.value })}
                            placeholder="Enter button text..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`cta-link-${block.id}`}>Button Link</Label>
                          <Input
                            id={`cta-link-${block.id}`}
                            value={block.ctaLink || ""}
                            onChange={(e) => updateBlock(block.id, { ctaLink: e.target.value })}
                            placeholder="Enter button link..."
                          />
                        </div>
                        <div className="pt-2">
                          <p className="text-xs text-gray-500 mb-2">Preview:</p>
                          <div className="flex justify-center p-2 border rounded-md bg-white">
                            <a
                              href={block.ctaLink || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                              onClick={(e) => e.preventDefault()}
                            >
                              {block.ctaText || "Call to Action"}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === "prosCons" && (
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor={`ingredients-${block.id}`}>Key Ingredients (one per line)</Label>
                          <Textarea
                            id={`ingredients-${block.id}`}
                            value={block.ingredients?.join("\n") || ""}
                            onChange={(e) => {
                              const ingredients = e.target.value.split("\n").filter((item) => item.trim() !== "")
                              updateBlock(block.id, { ingredients })
                            }}
                            placeholder="Enter ingredients, one per line..."
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`pros-${block.id}`}>Pros (one per line)</Label>
                            <Textarea
                              id={`pros-${block.id}`}
                              value={block.pros?.join("\n") || ""}
                              onChange={(e) => {
                                const pros = e.target.value.split("\n").filter((item) => item.trim() !== "")
                                updateBlock(block.id, { pros })
                              }}
                              placeholder="Enter pros, one per line..."
                              className="min-h-[150px]"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`cons-${block.id}`}>Cons (one per line)</Label>
                            <Textarea
                              id={`cons-${block.id}`}
                              value={block.cons?.join("\n") || ""}
                              onChange={(e) => {
                                const cons = e.target.value.split("\n").filter((item) => item.trim() !== "")
                                updateBlock(block.id, { cons })
                              }}
                              placeholder="Enter cons, one per line..."
                              className="min-h-[150px]"
                            />
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-500 mb-2">Preview:</p>
                          <div className="border rounded-md p-4 bg-white">
                            <ProsConsSection
                              pros={block.pros || []}
                              cons={block.cons || []}
                              ingredients={block.ingredients || []}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === "productRating" && (
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor={`product-name-${block.id}`}>Product Name</Label>
                          <Input
                            id={`product-name-${block.id}`}
                            value={block.productName || ""}
                            onChange={(e) => updateBlock(block.id, { productName: e.target.value })}
                            placeholder="Enter product name..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Overall Rating</Label>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={block.ratings?.effectiveness || 0}
                              onChange={(e) =>
                                updateBlock(block.id, {
                                  ratings: {
                                    ...block.ratings,
                                    effectiveness: Number.parseFloat(e.target.value),
                                  },
                                })
                              }
                              placeholder="0.0 - 5.0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Ingredients Rating</Label>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={block.ratings?.ingredients || 0}
                              onChange={(e) =>
                                updateBlock(block.id, {
                                  ratings: {
                                    ...block.ratings,
                                    ingredients: Number.parseFloat(e.target.value),
                                  },
                                })
                              }
                              placeholder="0.0 - 5.0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Value Rating</Label>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={block.ratings?.value || 0}
                              onChange={(e) =>
                                updateBlock(block.id, {
                                  ratings: {
                                    ...block.ratings,
                                    value: Number.parseFloat(e.target.value),
                                  },
                                })
                              }
                              placeholder="0.0 - 5.0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Manufacturer Rating</Label>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={block.ratings?.manufacturer || 0}
                              onChange={(e) =>
                                updateBlock(block.id, {
                                  ratings: {
                                    ...block.ratings,
                                    manufacturer: Number.parseFloat(e.target.value),
                                  },
                                })
                              }
                              placeholder="0.0 - 5.0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Safety Rating</Label>
                            <Input
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={block.ratings?.safety || 0}
                              onChange={(e) =>
                                updateBlock(block.id, {
                                  ratings: {
                                    ...block.ratings,
                                    safety: Number.parseFloat(e.target.value),
                                  },
                                })
                              }
                              placeholder="0.0 - 5.0"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`highlights-${block.id}`}>Brand Highlights (one per line)</Label>
                          <Textarea
                            id={`highlights-${block.id}`}
                            value={block.highlights?.join("\n") || ""}
                            onChange={(e) => {
                              const highlights = e.target.value.split("\n").filter((item) => item.trim() !== "")
                              updateBlock(block.id, { highlights })
                            }}
                            placeholder="Enter brand highlights, one per line..."
                            className="min-h-[100px]"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`cta-text-${block.id}`}>CTA Button Text</Label>
                            <Input
                              id={`cta-text-${block.id}`}
                              value={block.ctaButtonText || ""}
                              onChange={(e) => updateBlock(block.id, { ctaButtonText: e.target.value })}
                              placeholder="Enter button text..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`cta-link-${block.id}`}>CTA Button Link</Label>
                            <Input
                              id={`cta-link-${block.id}`}
                              value={block.ctaButtonLink || ""}
                              onChange={(e) => updateBlock(block.id, { ctaButtonLink: e.target.value })}
                              placeholder="Enter button link..."
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`image-url-${block.id}`}>Product Image URL (optional)</Label>
                          <Input
                            id={`image-url-${block.id}`}
                            value={block.imageUrl || ""}
                            onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                            placeholder="Enter image URL..."
                          />
                          {block.imageUrl && (
                            <div className="mt-2 w-40 h-40 overflow-hidden rounded-md bg-gray-100">
                              <img
                                src={block.imageUrl || "/placeholder.svg"}
                                alt="Product"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "/generic-product-bottle.png"
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-500 mb-2">Preview:</p>
                          <div className="border rounded-md p-4 bg-white">
                            <ProductRatingSection
                              productName={block.productName || "Product Name"}
                              overallRating={block.ratings?.effectiveness || 4.7}
                              ingredientsRating={block.ratings?.ingredients || 4.7}
                              valueRating={block.ratings?.value || 4.6}
                              manufacturerRating={block.ratings?.manufacturer || 4.8}
                              safetyRating={block.ratings?.safety || 4.8}
                              highlights={block.highlights || []}
                              imageUrl={block.imageUrl}
                              ctaText={block.ctaButtonText}
                              ctaLink={block.ctaButtonLink}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === "ingredientsSection" && (
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label htmlFor={`product-name-${block.id}`}>Product Name</Label>
                          <Input
                            id={`product-name-${block.id}`}
                            value={block.productName || ""}
                            onChange={(e) => updateBlock(block.id, { productName: e.target.value })}
                            placeholder="Enter product name..."
                          />
                        </div>

                        <IngredientsSection
                          productName={block.productName || "Product Name"}
                          introduction={block.ingredientsIntroduction || ""}
                          ingredients={block.ingredientsList || []}
                          isEditing={true}
                          onChange={(ingredients) => updateBlock(block.id, { ingredientsList: ingredients })}
                          onIntroductionChange={(intro) => updateBlock(block.id, { ingredientsIntroduction: intro })}
                        />

                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-500 mb-2">Preview:</p>
                          <div className="border rounded-md p-4 bg-white">
                            <IngredientsSection
                              productName={block.productName || "Product Name"}
                              introduction={block.ingredientsIntroduction || ""}
                              ingredients={block.ingredientsList || []}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Other block types would go here */}
                  </div>
                </div>
              </div>

              {/* Block controls */}
              <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white"
                      onClick={() => moveBlock(block.id, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                      <span className="sr-only">Move up</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Move up (Alt+↑)</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white"
                      onClick={() => moveBlock(block.id, "down")}
                      disabled={index === blocks.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                      <span className="sr-only">Move down</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Move down (Alt+↓)</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white"
                  onClick={() => deleteBlock(block.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>

              {/* AI generation button */}
              <Button
                variant="outline"
                size="icon"
                className="absolute -right-12 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => generateAIContent(block.id)}
                disabled={isGenerating}
              >
                <Sparkles className="h-4 w-4" />
                <span className="sr-only">Generate AI content</span>
              </Button>
            </div>
          </div>
        ))}

        {/* Add first block if no blocks exist */}
        {blocks.length === 0 && (
          <div className="flex justify-center p-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <span>Add your first block</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => addBlock("paragraph", -1)}>
                  <AlignLeft className="h-4 w-4 mr-2" />
                  <span>Paragraph</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock("heading", -1)}>
                  <Heading2 className="h-4 w-4 mr-2" />
                  <span>Heading</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock("image", -1)}>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  <span>Image</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock("productReview", -1)}>
                  <Star className="h-4 w-4 mr-2" />
                  <span>Product Review</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addBlock("ingredientsSection", -1)}>
                  <Star className="h-4 w-4 mr-2" />
                  <span>Ingredients Section</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Drop zone at the end */}
        {blocks.length > 0 && (
          <div
            className={`h-16 border-2 border-dashed rounded-md flex items-center justify-center ${
              dragOverIndex === blocks.length ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
            onDragOver={(e) => handleDragOver(e, blocks.length)}
            onDrop={(e) => handleDrop(e, blocks.length)}
          >
            <span className="text-gray-400">Drop block here</span>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
