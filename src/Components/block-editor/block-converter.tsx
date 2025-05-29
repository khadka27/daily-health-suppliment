"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BlockTypeIndicator } from "./block-type-indicator"
import type { Block } from "@/types/article"

interface BlockConverterProps {
  block: Block
  onConvert: (type: Block["type"]) => void
}

export function BlockConverter({ block, onConvert }: BlockConverterProps) {
  const [open, setOpen] = useState(false)

  const handleConvert = (type: Block["type"]) => {
    if (type === block.type) return
    onConvert(type)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          <BlockTypeIndicator type={block.type} />
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuItem
          onClick={() => handleConvert("paragraph")}
          className={block.type === "paragraph" ? "bg-gray-100" : ""}
        >
          <BlockTypeIndicator type="paragraph" />
          <span className="ml-2">Paragraph</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleConvert("heading")}
          className={block.type === "heading" ? "bg-gray-100" : ""}
        >
          <BlockTypeIndicator type="heading" />
          <span className="ml-2">Heading</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleConvert("image")}
          className={block.type === "image" ? "bg-gray-100" : ""}
        >
          <BlockTypeIndicator type="image" />
          <span className="ml-2">Image</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleConvert("quote")}
          className={block.type === "quote" ? "bg-gray-100" : ""}
        >
          <BlockTypeIndicator type="quote" />
          <span className="ml-2">Quote</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConvert("list")} className={block.type === "list" ? "bg-gray-100" : ""}>
          <BlockTypeIndicator type="list" />
          <span className="ml-2">List</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConvert("code")} className={block.type === "code" ? "bg-gray-100" : ""}>
          <BlockTypeIndicator type="code" />
          <span className="ml-2">Code</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConvert("html")} className={block.type === "html" ? "bg-gray-100" : ""}>
          <BlockTypeIndicator type="html" />
          <span className="ml-2">HTML</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConvert("cta")} className={block.type === "cta" ? "bg-gray-100" : ""}>
          <BlockTypeIndicator type="cta" />
          <span className="ml-2">Call to Action</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleConvert("productReview")}
          className={block.type === "productReview" ? "bg-gray-100" : ""}
        >
          <BlockTypeIndicator type="productReview" />
          <span className="ml-2">Product Review</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleConvert("divider")}
          className={block.type === "divider" ? "bg-gray-100" : ""}
        >
          <BlockTypeIndicator type="divider" />
          <span className="ml-2">Divider</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleConvert("ingredientsSection")}
          className={block.type === "ingredientsSection" ? "bg-gray-100" : ""}
        >
          <BlockTypeIndicator type="ingredientsSection" />
          <span className="ml-2">Ingredients Section</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
