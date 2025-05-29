"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import type { Block as BlockType } from "@/types/article"
import Block from "./block"

interface BlockEditorProps {
  initialBlocks?: BlockType[]
  onChange: (blocks: BlockType[]) => void
}

const BlockEditor: React.FC<BlockEditorProps> = ({ initialBlocks = [], onChange }) => {
  const [blocks, setBlocks] = useState<BlockType[]>(initialBlocks)

  const addBlock = useCallback(() => {
    const newBlock: BlockType = {
      id: uuidv4(),
      type: "text",
      content: "",
      pros: {},
    }
    const newBlocks = [...blocks, newBlock]
    setBlocks(newBlocks)
    onChange(newBlocks)
  }, [blocks, onChange])

  const deleteBlock = useCallback(
    (id: string) => {
      const newBlocks = blocks.filter((block) => block.id !== id)
      setBlocks(newBlocks)
      onChange(newBlocks)
    },
    [blocks, onChange],
  )

  const handleBlockChange = useCallback(
    (block: BlockType, updatedProps: Partial<BlockType>) => {
      const newBlocks = blocks.map((b) => {
        if (b.id === block.id) {
          return { ...b, ...updatedProps }
        }
        return b
      })
      setBlocks(newBlocks)
      onChange(newBlocks)
    },
    [blocks, onChange],
  )

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <Block key={block.id} block={block} onBlockChange={handleBlockChange} onDelete={deleteBlock} />
      ))}
      <Button onClick={addBlock} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Block
      </Button>
    </div>
  )
}

export default BlockEditor
