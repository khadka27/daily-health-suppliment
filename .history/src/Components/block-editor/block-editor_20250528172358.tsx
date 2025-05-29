"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

import type { Block as BlockType } from "@/types/article" // Import the Block type

interface BlockEditorProps {
  initialBlocks?: BlockType[]
  onChange: (blocks: BlockType[]) => void
}

const BlockEditor: React.FC<BlockEditorProps> = ({ initialBlocks = [], onChange }) => {
  const [blocks, setBlocks] = useState<BlockType[]>(initialBlocks)

  const addBlock = useCallback(() => {
    const newBlock: BlockType = {
      id: uuidv4(),
      type: "text", // Default block type
      content: "",
      newBlock: { ingredients: 0, value: 0, manufacturer: 0, safety: 0 }, // default values, adjust as needed
      order: blocks.length, // or another logic for ordering
      articleId: "", // or provide a valid articleId if available
    }
    setBlocks([...blocks, newBlock])
    onChange([...blocks, newBlock])
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
    <div>
      {blocks.map((block) => (
        <Block key={block.id} block={block} onBlockChange={handleBlockChange} onDelete={deleteBlock} />
      ))}
      <button onClick={addBlock}>Add Block</button>
    </div>
  )
}

export default BlockEditor
