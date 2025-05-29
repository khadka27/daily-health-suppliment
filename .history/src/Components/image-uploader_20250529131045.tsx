"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/Components/ui/button"

interface ImageUploaderProps {
  initialImage?: string
  onImageChange: (imageData: string) => void
}

export function ImageUploader({ initialImage, onImageChange }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewUrl(result)
      onImageChange(result)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-auto max-h-64 object-contain rounded-md border border-gray-200"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-sm text-gray-600">Uploading image...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Drag and drop an image here, or click to select</p>
              <p className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, GIF, WebP</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
