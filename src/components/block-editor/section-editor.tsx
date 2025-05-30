/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { PlusCircle, Trash2, MoveUp, MoveDown, GripVertical, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/hooks/use-toast"
import type { Block } from "@/types/article"
import { BlockEditor } from "./block-editor"

interface SectionEditorProps {
  sections: Block[][]
  onChange: (sections: Block[][]) => void
}

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  const [draggedSection, setDraggedSection] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [copiedSection, setCopiedSection] = useState<Block[] | null>(null)
  const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  const addSection = (index: number) => {
    const newHeading: Block = {
      id: uuidv4(),
      type: "heading",
      level: 2,
      content: "New Section",
      order: 0,
      articleId: "",
      pros: [],
      cons: [],
      ingredients: [],
      highlights: [],
      customFields: [],
      ingredientsList: [],
    }

    const newParagraph: Block = {
      id: uuidv4(),
      type: "paragraph",
      content: "",
      order: 1,
      articleId: "",
      pros: [],
      cons: [],
      ingredients: [],
      highlights: [],
      customFields: [],
      ingredientsList: [],
    }

    const newSection = [newHeading, newParagraph]
    const newSections = [...sections]
    newSections.splice(index + 1, 0, newSection)
    onChange(newSections)
  }

  const updateSection = (index: number, blocks: Block[]) => {
    const newSections = [...sections]
    newSections[index] = blocks
    onChange(newSections)
  }

  const deleteSection = (index: number) => {
    if (sections.length <= 1) {
      toast({
        title: "Cannot delete",
        description: "You need at least one section",
        variant: "destructive",
      })
      return
    }
    const newSections = [...sections]
    newSections.splice(index, 1)
    onChange(newSections)
  }

  const moveSection = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === sections.length - 1)) {
      return
    }

    const newSections = [...sections]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const [movedSection] = newSections.splice(index, 1)
    newSections.splice(newIndex, 0, movedSection)
    onChange(newSections)
  }

  const moveSectionToPosition = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    const newSections = [...sections]
    const [movedSection] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, movedSection)
    onChange(newSections)
  }

  const copySection = (index: number) => {
    // Deep clone the section to avoid reference issues
    const sectionToClone = sections[index].map((block) => ({
      ...block,
      id: uuidv4(), // Generate new IDs for the blocks
      pros: block.pros.map((pro) => ({ ...pro, id: uuidv4() })),
      cons: block.cons.map((con) => ({ ...con, id: uuidv4() })),
      ingredients: block.ingredients.map((ingredient) => ({ ...ingredient, id: uuidv4() })),
      highlights: block.highlights.map((highlight) => ({ ...highlight, id: uuidv4() })),
      customFields: block.customFields.map((field) => ({ ...field, id: uuidv4() })),
      ingredientsList: block.ingredientsList.map((ingredient) => ({ ...ingredient, id: uuidv4() })),
      ratings: block.ratings ? { ...block.ratings, id: uuidv4() } : undefined,
    }))

    setCopiedSection(sectionToClone)
    toast({
      title: "Section copied",
      description: "You can now paste this section anywhere",
    })
  }

  const pasteSection = (index: number) => {
    if (!copiedSection) return

    const newSections = [...sections]
    newSections.splice(index + 1, 0, copiedSection)
    onChange(newSections)

    toast({
      title: "Section pasted",
      description: "The copied section has been pasted",
    })
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString())
    e.dataTransfer.effectAllowed = "move"
    setDraggedSection(index)

    // Add a delay to set a visual cue for the dragged element
    setTimeout(() => {
      if (sectionRefs.current[index]) {
        sectionRefs.current[index]?.classList.add("opacity-50")
      }
    }, 0)
  }

  const handleDragEnd = () => {
    // Remove visual cues
    if (draggedSection !== null && sectionRefs.current[draggedSection]) {
      sectionRefs.current[draggedSection]?.classList.remove("opacity-50")
    }

    setDraggedSection(null)
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

    const fromIndex = Number.parseInt(e.dataTransfer.getData("text/plain"), 10)
    if (isNaN(fromIndex) || fromIndex === toIndex) return

    moveSectionToPosition(fromIndex, toIndex)

    setDraggedSection(null)
    setDragOverIndex(null)
  }

  const getSectionTitle = (section: Block[]) => {
    const headingBlock = section.find((block) => block.type === "heading")
    return headingBlock?.content || "Untitled Section"
  }

  return (
    <TooltipProvider>
      <div className="space-y-1">
        {sections.map((section, index) => (
          <div key={`section-${index}`} className="relative group">
            {/* Floating add button between sections */}
            <div
              className="absolute left-1/2 -top-3 transform -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="flex space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-white shadow-md"
                      onClick={() => addSection(index - 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new section</p>
                  </TooltipContent>
                </Tooltip>

                {copiedSection && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-white shadow-md"
                        onClick={() => pasteSection(index - 1)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        </svg>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Paste copied section</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            <div
              ref={(el) => { sectionRefs.current[index] = el }}
              className={`relative ${dragOverIndex === index ? "border-t-4 border-blue-500" : ""}`}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              tabIndex={0}
            >
              <Card className="border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors mb-2">
                <CardHeader className="pb-2">
                  {/* Drag handle */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>

                  <CardTitle className="text-sm text-gray-600 ml-6">
                    Section {index + 1}: {getSectionTitle(section)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 ml-6">
                  <BlockEditor blocks={section} onChange={(blocks) => updateSection(index, blocks)} />
                </CardContent>
              </Card>

              {/* Section controls */}
              <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white"
                      onClick={() => moveSection(index, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Move section up</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white"
                      onClick={() => moveSection(index, "down")}
                      disabled={index === sections.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Move section down</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white"
                      onClick={() => copySection(index)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Copy section</p>
                  </TooltipContent>
                </Tooltip>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-white"
                  onClick={() => deleteSection(index)}
                  disabled={sections.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add first section if none exist */}
        {sections.length === 0 && (
          <div className="flex justify-center p-8">
            <Button variant="outline" onClick={() => addSection(-1)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Add your first section</span>
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
