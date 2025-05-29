"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button, Card, Input, Space } from "antd"
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import type { Block } from "@/types/article"

interface SectionEditorProps {
  initialBlocks?: Block[]
  onChange: (blocks: Block[]) => void
}

const SectionEditor: React.FC<SectionEditorProps> = ({ initialBlocks = [], onChange }) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)

  const addBlock = useCallback(() => {
    setBlocks((prevBlocks) => [...prevBlocks, { type: "text", content: "", props: {} }])
  }, [])

  const deleteBlock = useCallback((index: number) => {
    setBlocks((prevBlocks) => {
      const newBlocks = [...prevBlocks]
      newBlocks.splice(index, 1)
      return newBlocks
    })
  }, [])

  const handleBlockUpdate = useCallback(
    (block: Block, index: number, updatedProps: Partial<Block>) => {
      setBlocks((prevBlocks) => {
        const newBlocks = [...prevBlocks]
        newBlocks[index] = { ...block, ...updatedProps }
        return newBlocks
      })
      onChange(blocks)
    },
    [blocks, onChange],
  )

  return (
    <div>
      {blocks.map((block, index) => (
        <Card
          key={index}
          title={`Block ${index + 1} (${block.type})`}
          extra={<Button icon={<DeleteOutlined />} onClick={() => deleteBlock(index)} />}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input
              placeholder="Content"
              value={block.content}
              onChange={(e) => handleBlockUpdate(block, index, { content: e.target.value })}
            />
          </Space>
        </Card>
      ))}
      <Button type="dashed" onClick={addBlock} icon={<PlusOutlined />} style={{ width: "100%", marginTop: "16px" }}>
        Add Block
      </Button>
    </div>
  )
}

export default SectionEditor
