"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  Trash2,
  MoveUp,
  MoveDown,
  GripVertical,
  Plus,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  Heading2,
  ImageIcon,
  List,
  Quote,
  Code,
  FileCode,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "@/Components/ui/use-toast"
import { BlockTypeIndicator } from "./block-type-indicator"
import { BlockConverter } from "./block-converter"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { BlockContent } from "./block-content"
import type { Block } from "@/types/article"

interface BlockEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
  activeBlockId: string | null
  onBlockSelect: (blockId: string) => void
}

export function BlockEditor({ 
  blocks, 
  onChange, 
  activeBlockId, 
  onBlockSelect 
}: BlockEditorProps) {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  const [collapsedBlocks, setCollapsedBlocks] = useState<Record<string, boolean>>({})
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Add a new block
  const addBlock = (type: string, index: number) => {
    const newBlock: Block = {
      id: uuidv4(),
      type: type as any,
      content: "",
      order: index + 1
    }

    // Set default values based on block type
    if (type === "heading") {
      newBlock.level = 2
    } else if (type === "list") {
      newBlock.listType = "unordered"
    } else if (type === "code") {
      newBlock.language = "javascript"
    }

    const updatedBlocks = [...blocks]
    updatedBlocks.splice(index + 1, 0, newBlock)

    // Update order for all blocks
    const reorderedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }))

    onChange(reorderedBlocks)
    
    // Set the new block as active
    setTimeout(() => {
      onBlockSelect(newBlock.id)
    }, 100)
  }

  // Update a block
  const updateBlock = (updatedBlock: Block) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === updatedBlock.id ? updatedBlock : block
    )
    onChange(updatedBlocks)
  }

  // Delete a block
  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You need at least one block in your article",
        variant: "destructive",
      })
      return
    }
    
    const updatedBlocks = blocks.filter((block) => block.id !== id)
    
    // Update order for all blocks
    const reorderedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }))
    
    onChange(reorderedBlocks)
    
    // If the deleted block was active, select another block
    if (activeBlockId === id && updatedBlocks.length > 0) {
      onBlockSelect(updatedBlocks[0].id)
    }
  }

  // Move a block up or down
  const moveBlock = (id: string, direction: "up" | "down") => {
    const blockIndex = blocks.findIndex((block) => block.id === id)
    if (
      (direction === "up" && blockIndex === 0) ||
      (direction === "down" && blockIndex === blocks.length - 1)
    ) {
      return
    }

    const newIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1
    const updatedBlocks = [...blocks]
    const [movedBlock] = updatedBlocks.splice(blockIndex, 1)
    updatedBlocks.splice(newIndex, 0, movedBlock)

    // Update order for all blocks
    const reorderedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }))

    onChange(reorderedBlocks)
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData("text/plain", blockId)
    setDraggedBlockId(blockId)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDropTargetIndex(index)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    const blockId = e.dataTransfer.getData("text/plain")
    const sourceIndex = blocks.findIndex((block) => block.id === blockId)
    
    if (sourceIndex === -1) return
    
    const updatedBlocks = [...blocks]
    const [movedBlock] = updatedBlocks.splice(sourceIndex, 1)
    updatedBlocks.splice(targetIndex, 0, movedBlock)
    
    // Update order for all blocks
    const reorderedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }))
    
    onChange(reorderedBlocks)
    setDraggedBlockId(null)
    setDropTargetIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedBlockId(null)
    setDropTargetIndex(null)
  }

  // Toggle block collapse
  const toggleBlockCollapse = (blockId: string) => {
    setCollapsedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }))
  }

  // Scroll to active block when it changes
  useEffect(() => {
    if (activeBlockId && blockRefs.current[activeBlockId]) {
      blockRefs.current[activeBlockId]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [activeBlockId])

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
      // The onBlockClick function was not defined.  This is a likely candidate for onBlockSelect
      if (onBlockSelect) {
        onBlockSelect(newBlock.id)
      }
    }, 100)
  }

  const updateBlockInner = (id: string, updates: Partial<Block>) => {
    const updatedBlocks = blocks.map((block) =>
      block.id === id ? { ...block, ...updates } : block
    );
    onChange(updatedBlocks);
  };

  const deleteBlockInner = (id: string) => {
    const updatedBlocks = blocks.filter((block) => block.id !== id);
    
    // Update order for all blocks
    const reorderedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }));
    
    onChange(reorderedBlocks);
    
    // If the deleted block was active, select another block
    if (activeBlockId === id && updatedBlocks.length > 0) {
      onBlockSelect(updatedBlocks[0].id);
    }
  };

  const moveBlockInner = (id: string, direction: "up" | "down") => {
    const blockIndex = blocks.findIndex((block) => block.id === id);
    if (
      (direction === "up" && blockIndex === 0) ||
      (direction === "down" && blockIndex === blocks.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? blockIndex - 1 : blockIndex + 1;
    const updatedBlocks = [...blocks];
    const [movedBlock] = updatedBlocks.splice(blockIndex, 1);
    updatedBlocks.splice(newIndex, 0, movedBlock);

    // Update order for all blocks
    const reorderedBlocks = updatedBlocks.map((block, idx) => ({
      ...block,
      order: idx,
    }));

    onChange(reorderedBlocks);
  };

  const handleDragStartInner = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData("text/plain", blockId);
  };

  const handleDragOverInner = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDropInner = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
  };

  const handleDragEndInner = () => {
  };

  const toggleBlockCollapseInner = (blockId: string) => {
    setCollapsedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const moveBlockToPosition = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, movedBlock)
    onChange(newBlocks)
  }

  const handleDragStartOld = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id)
    e.dataTransfer.effectAllowed = "move"

    // Add a delay to set a visual cue for the dragged element
    setTimeout(() => {
    }, 0)
  }

  const handleDragEndOld = () => {
    // Remove visual cues

    setDraggedBlockId(null)
    setDropTargetIndex(null)
  }

  const handleDragOverOld = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"

  }

  const handleDropOld = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()

    setDraggedBlockId(null)
    setDropTargetIndex(null)
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

    try {
      const userPrompt = prompt

      if (!userPrompt) {
        return
      }

      // Simulate AI generation with a timeout
      // In a real app, you would call an API here
      try {
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
          updateBlockInner(blockId, updates)
          break
        default:
          generatedContent = `Generated content about ${userPrompt}`
      }

      if (block.type !== "productReview") {
        updateBlockInner(blockId, { content: generatedContent })
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
    }
  }
\
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

    updateBlockInner(id, updates)
  }

  const addPro = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const pros = [...(block.pros || []), "New pro point"]
    updateBlockInner(blockId, { pros })
  }

  const updatePro = (blockId: string, index: number, text: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.pros) return

    const pros = [...block.pros]
    pros[index] = text
    updateBlockInner(blockId, { pros })
  }

  const removePro = (blockId: string, index: number) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.pros) return

    const pros = block.pros.filter((_, i) => i !== index)
    updateBlockInner(blockId, { pros })
  }

  const addCon = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const cons = [...(block.cons || []), "New con point"]
    updateBlockInner(blockId, { cons })
  }

  const updateCon = (blockId: string, index: number, text: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.cons) return

    const cons = [...block.cons]
    cons[index] = text
    updateBlockInner(blockId, { cons })
  }

  const removeCon = (blockId: string, index: number) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.cons) return

    const cons = block.cons.filter((_, i) => i !== index)
    updateBlockInner(blockId, { cons })
  }

  const addIngredient = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const ingredients = [...(block.ingredients || []), "New ingredient"]
    updateBlockInner(blockId, { ingredients })
  }

  const updateIngredient = (blockId: string, index: number, text: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.ingredients) return

    const ingredients = [...block.ingredients]
    ingredients[index] = text
    updateBlockInner(blockId, { ingredients })
  }

  const removeIngredient = (blockId: string, index: number) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.ingredients) return

    const ingredients = block.ingredients.filter((_, i) => i !== index)
    updateBlockInner(blockId, { ingredients })
  }

  const addHighlight = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const highlights = [...(block.highlights || []), "New highlight"]
    updateBlockInner(blockId, { highlights })
  }

  const updateHighlight = (blockId: string, index: number, text: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.highlights) return

    const highlights = [...block.highlights]
    highlights[index] = text
    updateBlockInner(blockId, { highlights })
  }

  const removeHighlight = (blockId: string, index: number) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.highlights) return

    const highlights = block.highlights.filter((_, i) => i !== index)
    updateBlockInner(blockId, { highlights })
  }

  const addCustomField = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview") return

    const customFields = [...(block.customFields || []), { id: uuidv4(), name: "New Field", value: "Field Value" }]
    updateBlockInner(blockId, { customFields })
  }

  const updateCustomField = (blockId: string, fieldId: string, updates: { name?: string; value?: string }) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.customFields) return

    const customFields = block.customFields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field))
    updateBlockInner(blockId, { customFields })
  }

  const removeCustomField = (blockId: string, fieldId: string) => {
    const block = blocks.find((b) => b.id === blockId)
    if (!block || block.type !== "productReview" || !block.customFields) return

    const customFields = block.customFields.filter((field) => field.id !== fieldId)
    updateBlockInner(blockId, { customFields })
  }

  // Focus the block when it becomes active
  useEffect(() => {
    if (activeBlockId && blockRefs.current[activeBlockId]) {
      const element = blockRefs.current[activeBlockId]
      const inputElement = element?.querySelector("input, textarea") as HTMLElement
      if (inputElement) {
        inputElement.focus()
      }
    }
  }, [activeBlockId])

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`block-${sectionId}`)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {blocks.map((block, index) => {
          const isActive = activeBlockId === block.id
          const isCollapsed = collapsedBlocks[block.id]
          
          return (
            <div
              key={block.id}
              id={`block-${block.id}`}
              ref={(el) => (blockRefs.current[block.id] = el)}
              className={cn(
                "relative group bg-white rounded-lg border transition-all duration-200",
                isActive 
                  ? "border-blue-400 shadow-md" 
                  : "border-gray-200 shadow-sm hover:border-gray-300",
                draggedBlockId === block.id && "opacity-50",
                dropTargetIndex === index && "border-t-2 border-blue-500"
              )}
              onClick={() => onBlockSelect(block.id)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
            >
              {/* Block Header */}
              <div 
                className={cn(
                  "flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg",
                  isActive && "bg-blue-50"
                )}
                draggable
                onDragStart={(e) => handleDragStart(e, block.id)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab mr-2" />
                  <BlockTypeIndicator type={block.type} level={block.level} />
                  <span className="text-sm font-medium ml-2">
                    {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                    {block.type === "heading" && block.level && ` ${block.level}`}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBlockCollapse(block.id)
                        }}
                      >
                        {isCollapsed ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isCollapsed ? "Expand" : "Collapse"}</TooltipContent>
                  </Tooltip>
                  
                  <BlockConverter
                    block={block}
                    onConvert={(type) => {
                      updateBlock({
                        ...block,
                        type: type as any
                      })
                    }}
                  />
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          moveBlock(block.id, "up")
                        }}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Move up</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          moveBlock(block.id, "down")
                        }}
                        disabled={index === blocks.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Move down</TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteBlock(block.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              {/* Block Content */}
              {!isCollapsed && (
                <div className="p-4">
                  <BlockContent
                    block={block}
                    onChange={updateBlock}
                    isActive={isActive}
                  />
                </div>
              )}
              
              {/* Add Block Button */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 hidden group-hover:block z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full bg-white shadow-sm border-gray-200 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      <span className="text-xs">Add Block</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem onClick={() => addBlock("paragraph", index)}>
                      <AlignLeft className="h-4 w-4 mr-2" />
                      <span>Paragraph</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("heading", index)}>
                      <Heading2 className="h-4 w-4 mr-2" />
                      <span>Heading</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("image", index)}>
                      <ImageIcon className="h-4 w-4 mr-2" />
                      <span>Image</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("list", index)}>
                      <List className="h-4 w-4 mr-2" />
                      <span>List</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("quote", index)}>
                      <Quote className="h-4 w-4 mr-2" />
                      <span>Quote</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("code", index)}>
                      <Code className="h-4 w-4 mr-2" />
                      <span>Code</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addBlock("html", index)}>
                      <FileCode className="h-4 w-4 mr-2" />
                      <span>HTML</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
        
        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">No content blocks yet. Add your first block to get started.</p>
            <Button onClick={() => addBlock("heading", -1)}>
              <Plus className="h-4 w-4 mr-1" />
              Add First Block
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
