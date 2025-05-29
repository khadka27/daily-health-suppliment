"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/Components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { Block } from "@/types/article"
import BlockEditor from "./block-editor"

interface SectionEditorProps {
  sections?: Block[][]
  onChange: (sections: Block[][]) => void
  articleId?: string
}

const SectionEditor: React.FC<SectionEditorProps> = ({ sections = [], onChange, articleId = "" }) => {
  const [localSections, setLocalSections] = useState<Block[][]>(sections)

  useEffect(() => {
    setLocalSections(sections)
  }, [sections])

  const addSection = useCallback(() => {
    const newBlock: Block = {
      id: uuidv4(),
      type: "text",
      content: "",
      order: 1,
      articleId: articleId,
      newBlock: { ingredients: 0, value: 0, manufacturer: 0, safety: 0 },
    }
    const newSection: Block[] = [newBlock]
    const newSections = [...localSections, newSection]
    setLocalSections(newSections)
    onChange(newSections)
  }, [localSections, onChange, articleId])

  const deleteSection = useCallback(
    (sectionIndex: number) => {
      const newSections = localSections.filter((_, index) => index !== sectionIndex)
      setLocalSections(newSections)
      onChange(newSections)
    },
    [localSections, onChange],
  )

  const handleSectionChange = useCallback(
    (sectionIndex: number, blocks: Block[]) => {
      const newSections = [...localSections]
      newSections[sectionIndex] = blocks
      setLocalSections(newSections)
      onChange(newSections)
    },
    [localSections, onChange],
  )

  return (
    <div className="space-y-6">
      {localSections.map((section, sectionIndex) => (
        <Card key={sectionIndex} className="border-2 border-dashed">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-lg font-semibold">Section {sectionIndex + 1}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteSection(sectionIndex)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <BlockEditor
              initialBlocks={section}
              onChange={(blocks) => handleSectionChange(sectionIndex, blocks)}
              articleId={articleId}
            />
          </CardContent>
        </Card>
      ))}

      <Button onClick={addSection} variant="outline" className="w-full border-dashed border-2">
        <Plus className="h-4 w-4 mr-2" />
        Add Section
      </Button>
    </div>
  )
}

export default SectionEditor
