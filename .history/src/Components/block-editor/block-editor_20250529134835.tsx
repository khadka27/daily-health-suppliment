"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  PlusCircle,
  ImageIcon,
  Trash2,
  MoveUp,
  MoveDown,
  Sparkles,
  GripVertical,
  ExternalLink,
  Star,
  Plus,
  AlignLeft,
  Heading2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import type { Block } from "@/types/article"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BlockEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  articleId?: string
}

export function BlockEditor({ blocks, onChange, articleId = "" }: BlockEditorProps) {
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
      title: block.content || "Untitled",
    }))

  // Add default sections if not present in blocks
  const defaultSections = [
    "Overview",
    "What is It?",
    "Rating",
    "Pros & Cons",
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
      order: index,
      articleId,
      pros: [],
      cons: [],
      ingredients: [],
      highlights: [],
      customFields: [],
      ingredientsList: [],
    }

    const newBlocks = [...blocks]
    newBlocks.splice(index, 0, newBlock)
    // Update order for all blocks
    newBlocks.forEach((block, idx) => {
      block.order = idx
    })
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
      order: index + 1,
      articleId,
      pros: [],
      cons: [],
      ingredients: [],
      highlights: [],
      customFields: [],
      ingredientsList: [],
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
      newBlock.ctaButtonText = "Click Here"
      newBlock.ctaButtonLink = "https://example.com"
      newBlock.backgroundColor = "#2563eb"
    }

    if (type === "rating") {
      newBlock.productName = "Product Name"
      newBlock.ratings = {
        id: uuidv4(),
        blockId: newBlock.id,
        ingredients: 4.7,
        value: 4.6,
        manufacturer: 4.8,
        safety: 4.8,
        effectiveness: 4.7,
      }
      newBlock.highlights = [
        {
          id: uuidv4(),
          content: "Made with clinically-tested, powerfully effective ingredients.",
          order: 1,
          blockId: newBlock.id,
        },
        {
          id: uuidv4(),
          content: "Manufactured in the USA",
          order: 2,
          blockId: newBlock.id,
        },
        {
          id: uuidv4(),
          content: "Made in GMP-certified facilities to ensure product safety and quality",
          order: 3,
          blockId: newBlock.id,
        },
      ]
      newBlock.ctaButtonText = "SHOP NOW"
      newBlock.ctaButtonLink = "#"
    }

    if (type === "pros-cons") {
      newBlock.pros = [
        {
          id: uuidv4(),
          content: "Clinically validated and doctor-approved",
          order: 1,
          blockId: newBlock.id,
        },
        {
          id: uuidv4(),
          content: "Available without a prescription",
          order: 2,
          blockId: newBlock.id,
        },
      ]
      newBlock.cons = [
        {
          id: uuidv4(),
          content: "Available only online",
          order: 1,
          blockId: newBlock.id,
        },
      ]
      newBlock.ingredients = [
        {
          id: uuidv4(),
          content: "Vitamin A",
          order: 1,
          blockId: newBlock.id,
        },
        {
          id: uuidv4(),
          content: "Zinc",
          order: 2,
          blockId: newBlock.id,
        },
      ]
    }

    if (type === "ingredients") {
      newBlock.productName = "Product Name"
      newBlock.ingredientsIntroduction =
        "This product features natural ingredients known to support health and wellness."
      newBlock.ingredientsList = [
        {
          id: uuidv4(),
          number: 1,
          name: "Vitamin A",
          imageUrl: "/placeholder.svg?height=150&width=150",
          description: "Essential vitamin that supports various bodily functions.",
          studyYear: "2020",
          studySource: "Journal of Nutrition",
          studyDescription: "Studies show the importance of Vitamin A for overall health.",
          blockId: newBlock.id,
        },
      ]
    }

    const newBlocks = [...blocks]
    newBlocks.splice(index + 1, 0, newBlock)
    // Update order for all blocks
    newBlocks.forEach((block, idx) => {
      block.order = idx
    })
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
    // Update order for remaining blocks
    newBlocks.forEach((block, idx) => {
      block.order = idx
    })
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
    // Update order for all blocks
    newBlocks.forEach((block, idx) => {
      block.order = idx
    })
    onChange(newBlocks)
  }

  const moveBlockToPosition = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, movedBlock)
    // Update order for all blocks
    newBlocks.forEach((block, idx) => {
      block.order = idx
    })
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

  const generateAIContent = async (blockId: string, prompt = "") => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    setIsGenerating(true)

    try {
      let userPrompt = prompt

      if (!userPrompt) {
        userPrompt = window.prompt("What content would you like to generate?", "") ?? ""
        if (!userPrompt) {
          setIsGenerating(false)
          return
        }
      }

      // Simulate AI generation with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      let generatedContent = ""

      switch (block.type) {
        case "paragraph":
          generatedContent = `This is an AI-generated paragraph about ${userPrompt}. It provides detailed information and insights about the topic, maintaining a natural and informative style.`
          break
        case "heading":
          generatedContent = `${userPrompt.charAt(0).toUpperCase() + userPrompt.slice(1)}`
          break
        case "quote":
          generatedContent = `"The best way to understand ${userPrompt} is through experience and knowledge." — Expert Opinion`
          break
        case "list":
          generatedContent = `Key point about ${userPrompt}\nImportant aspect of ${userPrompt}\nBenefit of ${userPrompt}`
          break
        case "code":
          generatedContent = `// Example code related to ${userPrompt}\nfunction example() {\n  console.log("This demonstrates ${userPrompt}");\n  return true;\n}`
          break
        default:
          generatedContent = `Generated content about ${userPrompt}`
      }

      updateBlock(blockId, { content: generatedContent })

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

  // Helper functions for managing pros, cons, and ingredients
  const addProsConsItem = (blockId: string, type: "pros" | "cons" | "ingredients", content: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    const newItem = {
      id: uuidv4(),
      content,
      order: (block[type]?.length || 0) + 1,
      blockId,
    }

    const updatedItems = [...(block[type] || []), newItem]
    updateBlock(blockId, { [type]: updatedItems })
  }

  const updateProsConsItem = (
    blockId: string,
    type: "pros" | "cons" | "ingredients",
    itemId: string,
    content: string,
  ) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    const updatedItems = (block[type] || []).map((item: any) => (item.id === itemId ? { ...item, content } : item))
    updateBlock(blockId, { [type]: updatedItems })
  }

  const removeProsConsItem = (blockId: string, type: "pros" | "cons" | "ingredients", itemId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block) return

    const updatedItems = (block[type] || []).filter((item: any) => item.id !== itemId)
    updateBlock(blockId, { [type]: updatedItems })
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

  return (
    <TooltipProvider>
      <div className="space-y-1">
        {/* Horizontal Table of Contents */}
        <div className="mb-6 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex flex-wrap gap-2 p-4 border-b">
            {allTocItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "outline"}
                size="sm"
                onClick={() => scrollToSection(item.id)}
                className="text-xs"
              >
                {item.title}
              </Button>
            ))}
          </div>

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
                  <DropdownMenuItem key={index} onClick={() => addSectionHeading(section, blocks.length)}>
                    <Heading2 className="h-4 w-4 mr-2" />
                    {section}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {blocks.map((block, index) => (
          <div key={block.id} className="relative group">
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
                  <DropdownMenuItem onClick={() => addBlock("rating", index - 1)}>
                    <Star className="h-4 w-4 mr-2" />
                    <span>Product Rating</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("pros-cons", index - 1)}>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <ThumbsDown className="h-4 w-4 mr-2" />
                    </div>
                    <span>Pros & Cons</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("ingredients", index - 1)}>
                    <Star className="h-4 w-4 mr-2" />
                    <span>Ingredients</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addBlock("cta", index - 1)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <span>Call to Action</span>
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
              className={`relative ${activeBlock === block.id ? "ring-2 ring-blue-500 rounded-md" : ""} 
                       ${dragOverIndex === index ? "border-t-4 border-blue-500" : ""}`}
              onClick={() => setActiveBlock(block.id)}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, block.id)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              tabIndex={0}
              id={block.id}
            >
              <div className="border border-gray-200 hover:border-gray-300 transition-colors mb-2 rounded-md">
                <div className="p-4">
                  {/* Drag handle */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="ml-6">
                    {/* Block content based on type */}
                    {block.type === "paragraph" && (
                      <Textarea
                        value={block.content || ""}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        placeholder="Type paragraph content..."
                        className="min-h-[100px] resize-y"
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
                            value={block.content || ""}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="Heading text..."
                            className="flex-1 text-lg font-bold"
                          />
                        </div>
                      </div>
                    )}

                    {block.type === "image" && (
                      <div className="space-y-4">
                        <Input
                          value={block.imageUrl || ""}
                          onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                          placeholder="Image URL..."
                        />
                        <Input
                          value={block.content || ""}
                          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                          placeholder="Image caption (optional)..."
                        />
                        {block.imageUrl && (
                          <div className="mt-2">
                            <img
                              src={block.imageUrl || "/placeholder.svg"}
                              alt={block.content || "Image"}
                              className="max-w-full h-auto rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {block.type === "rating" && (
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label>Product Name</Label>
                          <Input
                            value={block.productName || ""}
                            onChange={(e) => updateBlock(block.id, { productName: e.target.value })}
                            placeholder="Enter product name..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Effectiveness Rating</Label>
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
                                    id: block.ratings?.id || uuidv4(),
                                    blockId: block.id,
                                    effectiveness: Number.parseFloat(e.target.value),
                                  },
                                })
                              }
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
                                    id: block.ratings?.id || uuidv4(),
                                    blockId: block.id,
                                    ingredients: Number.parseFloat(e.target.value),
                                  },
                                })
                              }
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
                                    id: block.ratings?.id || uuidv4(),
                                    blockId: block.id,
                                    value: Number.parseFloat(e.target.value),
                                  },
                                })
                              }
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
                                    id: block.ratings?.id || uuidv4(),
                                    blockId: block.id,
                                    safety: Number.parseFloat(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Brand Highlights</Label>
                          <div className="space-y-2">
                            {block.highlights.map((highlight, idx) => (
                              <div key={highlight.id} className="flex gap-2">
                                <Input
                                  value={highlight.content}
                                  onChange={(e) => {
                                    const updatedHighlights = block.highlights.map((h) =>
                                      h.id === highlight.id ? { ...h, content: e.target.value } : h,
                                    )
                                    updateBlock(block.id, { highlights: updatedHighlights })
                                  }}
                                  placeholder="Enter highlight..."
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => {
                                    const updatedHighlights = block.highlights.filter((h) => h.id !== highlight.id)
                                    updateBlock(block.id, { highlights: updatedHighlights })
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              onClick={() => {
                                const newHighlight = {
                                  id: uuidv4(),
                                  content: "New highlight",
                                  order: block.highlights.length + 1,
                                  blockId: block.id,
                                }
                                updateBlock(block.id, { highlights: [...block.highlights, newHighlight] })
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Highlight
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === "pros-cons" && (
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Pros</Label>
                            <div className="space-y-2">
                              {block.pros.map((pro) => (
                                <div key={pro.id} className="flex gap-2">
                                  <Input
                                    value={pro.content}
                                    onChange={(e) => updateProsConsItem(block.id, "pros", pro.id, e.target.value)}
                                    placeholder="Enter pro..."
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeProsConsItem(block.id, "pros", pro.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                onClick={() => addProsConsItem(block.id, "pros", "New pro point")}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Pro
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Cons</Label>
                            <div className="space-y-2">
                              {block.cons.map((con) => (
                                <div key={con.id} className="flex gap-2">
                                  <Input
                                    value={con.content}
                                    onChange={(e) => updateProsConsItem(block.id, "cons", con.id, e.target.value)}
                                    placeholder="Enter con..."
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeProsConsItem(block.id, "cons", con.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                onClick={() => addProsConsItem(block.id, "cons", "New con point")}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Con
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Key Ingredients</Label>
                          <div className="space-y-2">
                            {block.ingredients.map((ingredient) => (
                              <div key={ingredient.id} className="flex gap-2">
                                <Input
                                  value={ingredient.content}
                                  onChange={(e) =>
                                    updateProsConsItem(block.id, "ingredients", ingredient.id, e.target.value)
                                  }
                                  placeholder="Enter ingredient..."
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeProsConsItem(block.id, "ingredients", ingredient.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              variant="outline"
                              onClick={() => addProsConsItem(block.id, "ingredients", "New ingredient")}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Ingredient
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === "ingredients" && (
                      <div className="space-y-4 border rounded-md p-4">
                        <div className="space-y-2">
                          <Label>Product Name</Label>
                          <Input
                            value={block.productName || ""}
                            onChange={(e) => updateBlock(block.id, { productName: e.target.value })}
                            placeholder="Enter product name..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Introduction</Label>
                          <Textarea
                            value={block.ingredientsIntroduction || ""}
                            onChange={(e) => updateBlock(block.id, { ingredientsIntroduction: e.target.value })}
                            placeholder="Enter introduction text..."
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="space-y-4">
                          <Label>Ingredients List</Label>
                          {block.ingredientsList.map((ingredient, idx) => (
                            <div key={ingredient.id} className="border rounded-md p-4 space-y-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <Input
                                  value={ingredient.name}
                                  onChange={(e) => {
                                    const updatedIngredients = block.ingredientsList.map((ing) =>
                                      ing.id === ingredient.id ? { ...ing, name: e.target.value } : ing,
                                    )
                                    updateBlock(block.id, { ingredientsList: updatedIngredients })
                                  }}
                                  placeholder="Ingredient name..."
                                />
                                <Input
                                  value={ingredient.imageUrl}
                                  onChange={(e) => {
                                    const updatedIngredients = block.ingredientsList.map((ing) =>
                                      ing.id === ingredient.id ? { ...ing, imageUrl: e.target.value } : ing,
                                    )
                                    updateBlock(block.id, { ingredientsList: updatedIngredients })
                                  }}
                                  placeholder="Image URL..."
                                />
                              </div>
                              <Textarea
                                value={ingredient.description}
                                onChange={(e) => {
                                  const updatedIngredients = block.ingredientsList.map((ing) =>
                                    ing.id === ingredient.id ? { ...ing, description: e.target.value } : ing,
                                  )
                                  updateBlock(block.id, { ingredientsList: updatedIngredients })
                                }}
                                placeholder="Description..."
                                className="min-h-[60px]"
                              />
                              <div className="flex gap-2">
                                <Input
                                  value={ingredient.studyYear || ""}
                                  onChange={(e) => {
                                    const updatedIngredients = block.ingredientsList.map((ing) =>
                                      ing.id === ingredient.id ? { ...ing, studyYear: e.target.value } : ing,
                                    )
                                    updateBlock(block.id, { ingredientsList: updatedIngredients })
                                  }}
                                  placeholder="Study year..."
                                />
                                <Input
                                  value={ingredient.studySource || ""}
                                  onChange={(e) => {
                                    const updatedIngredients = block.ingredientsList.map((ing) =>
                                      ing.id === ingredient.id ? { ...ing, studySource: e.target.value } : ing,
                                    )
                                    updateBlock(block.id, { ingredientsList: updatedIngredients })
                                  }}
                                  placeholder="Study source..."
                                />
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const updatedIngredients = block.ingredientsList.filter(
                                    (ing) => ing.id !== ingredient.id,
                                  )
                                  updateBlock(block.id, { ingredientsList: updatedIngredients })
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            onClick={() => {
                              const newIngredient = {
                                id: uuidv4(),
                                number: block.ingredientsList.length + 1,
                                name: "New Ingredient",
                                imageUrl: "/placeholder.svg?height=150&width=150",
                                description: "Description of the ingredient...",
                                blockId: block.id,
                              }
                              updateBlock(block.id, { ingredientsList: [...block.ingredientsList, newIngredient] })
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Ingredient
                          </Button>
                        </div>
                      </div>
                    )}

                    {block.type === "cta" && (
                      <div className="space-y-4 p-4 border rounded-md bg-gray-50">
                        <div className="space-y-2">
                          <Label>CTA Text</Label>
                          <Input
                            value={block.ctaText || ""}
                            onChange={(e) => updateBlock(block.id, { ctaText: e.target.value })}
                            placeholder="Enter CTA text..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Button Text</Label>
                          <Input
                            value={block.ctaButtonText || ""}
                            onChange={(e) => updateBlock(block.id, { ctaButtonText: e.target.value })}
                            placeholder="Enter button text..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Button Link</Label>
                          <Input
                            value={block.ctaButtonLink || ""}
                            onChange={(e) => updateBlock(block.id, { ctaButtonLink: e.target.value })}
                            placeholder="Enter button link..."
                          />
                        </div>
                      </div>
                    )}
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
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Move up</p>
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
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Move down</p>
                  </TooltipContent>
                </Tooltip>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white"
                  onClick={() => deleteBlock(block.id)}
                >
                  <Trash2 className="h-4 w-4" />
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
                <DropdownMenuItem onClick={() => addBlock("rating", -1)}>
                  <Star className="h-4 w-4 mr-2" />
                  <span>Product Rating</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
