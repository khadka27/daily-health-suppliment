"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/Components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import type { Block as BlockType } from "@/types/article"

interface BlockProps {
  block: BlockType
  onBlockChange: (block: BlockType, updatedProps: Partial<BlockType>) => void
  onDelete: (id: string) => void
}

const Block: React.FC<BlockProps> = ({ block, onBlockChange, onDelete }) => {
  const [localContent, setLocalContent] = useState(block.content || "")

  const handleContentChange = (content: string) => {
    setLocalContent(content)
    onBlockChange(block, { content })
  }

  const handleTypeChange = (type: string) => {
    onBlockChange(block, { type })
  }

  const renderBlockEditor = () => {
    switch (block.type) {
      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor={`content-${block.id}`}>Content</Label>
            <Textarea
              id={`content-${block.id}`}
              value={localContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter your text content..."
              rows={4}
            />
          </div>
        )

      case "heading":
        return (
          <div className="space-y-2">
            <Label htmlFor={`heading-${block.id}`}>Heading Text</Label>
            <Input
              id={`heading-${block.id}`}
              value={localContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter heading text..."
            />
          </div>
        )

      case "image":
        return (
          <div className="space-y-2">
            <Label htmlFor={`image-${block.id}`}>Image URL</Label>
            <Input
              id={`image-${block.id}`}
              value={localContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter image URL..."
            />
            {localContent && (
              <div className="mt-2">
                <img
                  src={localContent || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full h-auto rounded border"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={`content-${block.id}`}>Content</Label>
            <Textarea
              id={`content-${block.id}`}
              value={localContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Enter content..."
              rows={3}
            />
          </div>
        )
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor={`type-${block.id}`}>Block Type:</Label>
          <Select value={block.type} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="heading">Heading</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="list">List</SelectItem>
              <SelectItem value="quote">Quote</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(block.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>{renderBlockEditor()}</CardContent>
    </Card>
  )
}

export default Block
