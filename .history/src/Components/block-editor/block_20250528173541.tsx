"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Minus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import type { Block, Pros, Cons, Ingredient, CustomField, IngredientItem } from "@/types/article"

interface BlockProps {
  block: Block
  onBlockChange: (block: Block, updatedProps: Partial<Block>) => void
  onDelete: (id: string) => void
}

const BlockComponent: React.FC<BlockProps> = ({ block, onBlockChange, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleContentChange = (field: keyof Block, value: any) => {
    onBlockChange(block, { [field]: value })
  }

  const addPro = () => {
    const newPro: Pros = {
      id: uuidv4(),
      content: "",
      order: (block.pros?.length || 0) + 1,
      blockId: block.id,
    }
    const updatedPros = [...(block.pros || []), newPro]
    handleContentChange("pros", updatedPros)
  }

  const removePro = (proId: string) => {
    const updatedPros = block.pros?.filter((pro) => pro.id !== proId) || []
    handleContentChange("pros", updatedPros)
  }

  const updatePro = (proId: string, content: string) => {
    const updatedPros = block.pros?.map((pro) => (pro.id === proId ? { ...pro, content } : pro)) || []
    handleContentChange("pros", updatedPros)
  }

  const addCon = () => {
    const newCon: Cons = {
      id: uuidv4(),
      content: "",
      order: (block.cons?.length || 0) + 1,
      blockId: block.id,
    }
    const updatedCons = [...(block.cons || []), newCon]
    handleContentChange("cons", updatedCons)
  }

  const removeCon = (conId: string) => {
    const updatedCons = block.cons?.filter((con) => con.id !== conId) || []
    handleContentChange("cons", updatedCons)
  }

  const updateCon = (conId: string, content: string) => {
    const updatedCons = block.cons?.map((con) => (con.id === conId ? { ...con, content } : con)) || []
    handleContentChange("cons", updatedCons)
  }

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: uuidv4(),
      content: "",
      order: (block.ingredients?.length || 0) + 1,
      blockId: block.id,
    }
    const updatedIngredients = [...(block.ingredients || []), newIngredient]
    handleContentChange("ingredients", updatedIngredients)
  }

  const removeIngredient = (ingredientId: string) => {
    const updatedIngredients = block.ingredients?.filter((ingredient) => ingredient.id !== ingredientId) || []
    handleContentChange("ingredients", updatedIngredients)
  }

  const updateIngredient = (ingredientId: string, content: string) => {
    const updatedIngredients =
      block.ingredients?.map((ingredient) =>
        ingredient.id === ingredientId ? { ...ingredient, content } : ingredient,
      ) || []
    handleContentChange("ingredients", updatedIngredients)
  }

  const addCustomField = () => {
    const newField: CustomField = {
      id: uuidv4(),
      name: "",
      value: "",
      blockId: block.id,
    }
    const updatedFields = [...(block.customFields || []), newField]
    handleContentChange("customFields", updatedFields)
  }

  const removeCustomField = (fieldId: string) => {
    const updatedFields = block.customFields?.filter((field) => field.id !== fieldId) || []
    handleContentChange("customFields", updatedFields)
  }

  const updateCustomField = (fieldId: string, updates: Partial<CustomField>) => {
    const updatedFields =
      block.customFields?.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)) || []
    handleContentChange("customFields", updatedFields)
  }

  const addIngredientItem = () => {
    const newItem: IngredientItem = {
      id: uuidv4(),
      number: (block.ingredientsList?.length || 0) + 1,
      name: "",
      imageUrl: "",
      description: "",
      blockId: block.id,
    }
    const updatedItems = [...(block.ingredientsList || []), newItem]
    handleContentChange("ingredientsList", updatedItems)
  }

  const removeIngredientItem = (itemId: string) => {
    const updatedItems = block.ingredientsList?.filter((item) => item.id !== itemId) || []
    handleContentChange("ingredientsList", updatedItems)
  }

  const updateIngredientItem = (itemId: string, updates: Partial<IngredientItem>) => {
    const updatedItems =
      block.ingredientsList?.map((item) => (item.id === itemId ? { ...item, ...updates } : item)) || []
    handleContentChange("ingredientsList", updatedItems)
  }

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "−" : "+"}
          </Button>
          <h3 className="text-lg font-semibold">
            Block {block.order} ({block.type})
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(block.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Block Type Selection */}
          <div className="space-y-2">
            <Label>Block Type</Label>
            <Select value={block.type} onValueChange={(value) => handleContentChange("type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="heading">Heading</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="productReview">Product Review</SelectItem>
                <SelectItem value="ingredientsSection">Ingredients Section</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Basic Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={block.content || ""}
              onChange={(e) => handleContentChange("content", e.target.value)}
              placeholder="Enter block content..."
              rows={3}
            />
          </div>

          {/* Heading Level (for heading blocks) */}
          {block.type === "heading" && (
            <div className="space-y-2">
              <Label>Heading Level</Label>
              <Select
                value={block.level?.toString() || "2"}
                onValueChange={(value) => handleContentChange("level", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                  <SelectItem value="5">H5</SelectItem>
                  <SelectItem value="6">H6</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Image URL (for image blocks) */}
          {block.type === "image" && (
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={block.imageUrl || ""}
                onChange={(e) => handleContentChange("imageUrl", e.target.value)}
                placeholder="Enter image URL..."
              />
            </div>
          )}

          {/* Product Review Fields */}
          {block.type === "productReview" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Product Name</Label>
                  <Input
                    value={block.productName || ""}
                    onChange={(e) => handleContentChange("productName", e.target.value)}
                    placeholder="Product name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Overall Rating</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={block.overallRating || ""}
                    onChange={(e) => handleContentChange("overallRating", Number.parseFloat(e.target.value))}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    value={block.price || ""}
                    onChange={(e) => handleContentChange("price", e.target.value)}
                    placeholder="$99.99"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input
                    value={block.ctaButtonText || ""}
                    onChange={(e) => handleContentChange("ctaButtonText", e.target.value)}
                    placeholder="Check Price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>CTA Button Link</Label>
                <Input
                  value={block.ctaButtonLink || ""}
                  onChange={(e) => handleContentChange("ctaButtonLink", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              {/* Pros Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Pros</Label>
                  <Button variant="outline" size="sm" onClick={addPro}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Pro
                  </Button>
                </div>
                {block.pros?.map((pro) => (
                  <div key={pro.id} className="flex items-center space-x-2">
                    <Input
                      value={pro.content}
                      onChange={(e) => updatePro(pro.id, e.target.value)}
                      placeholder="Enter pro..."
                    />
                    <Button variant="ghost" size="sm" onClick={() => removePro(pro.id)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cons Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Cons</Label>
                  <Button variant="outline" size="sm" onClick={addCon}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Con
                  </Button>
                </div>
                {block.cons?.map((con) => (
                  <div key={con.id} className="flex items-center space-x-2">
                    <Input
                      value={con.content}
                      onChange={(e) => updateCon(con.id, e.target.value)}
                      placeholder="Enter con..."
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeCon(con.id)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Ingredients Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Ingredients</Label>
                  <Button variant="outline" size="sm" onClick={addIngredient}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Ingredient
                  </Button>
                </div>
                {block.ingredients?.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center space-x-2">
                    <Input
                      value={ingredient.content}
                      onChange={(e) => updateIngredient(ingredient.id, e.target.value)}
                      placeholder="Enter ingredient..."
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeIngredient(ingredient.id)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Custom Fields */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Custom Fields</Label>
                  <Button variant="outline" size="sm" onClick={addCustomField}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Field
                  </Button>
                </div>
                {block.customFields?.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Input
                      value={field.name}
                      onChange={(e) => updateCustomField(field.id, { name: e.target.value })}
                      placeholder="Field name..."
                      className="w-1/3"
                    />
                    <Input
                      value={field.value}
                      onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                      placeholder="Field value..."
                      className="w-2/3"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeCustomField(field.id)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ingredients Section Fields */}
          {block.type === "ingredientsSection" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Ingredients Introduction</Label>
                <Textarea
                  value={block.ingredientsIntroduction || ""}
                  onChange={(e) => handleContentChange("ingredientsIntroduction", e.target.value)}
                  placeholder="Introduction to ingredients..."
                  rows={3}
                />
              </div>

              {/* Ingredient Items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Ingredient Items</Label>
                  <Button variant="outline" size="sm" onClick={addIngredientItem}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>
                {block.ingredientsList?.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateIngredientItem(item.id, { name: e.target.value })}
                          placeholder="Ingredient name..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image URL</Label>
                        <Input
                          value={item.imageUrl}
                          onChange={(e) => updateIngredientItem(item.id, { imageUrl: e.target.value })}
                          placeholder="Image URL..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <Label>Description</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateIngredientItem(item.id, { description: e.target.value })}
                        placeholder="Ingredient description..."
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>Study Year</Label>
                        <Input
                          value={item.studyYear || ""}
                          onChange={(e) => updateIngredientItem(item.id, { studyYear: e.target.value })}
                          placeholder="2023"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Study Source</Label>
                        <Input
                          value={item.studySource || ""}
                          onChange={(e) => updateIngredientItem(item.id, { studySource: e.target.value })}
                          placeholder="Study source..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Study Description</Label>
                        <Input
                          value={item.studyDescription || ""}
                          onChange={(e) => updateIngredientItem(item.id, { studyDescription: e.target.value })}
                          placeholder="Study description..."
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIngredientItem(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove Item
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default BlockComponent
