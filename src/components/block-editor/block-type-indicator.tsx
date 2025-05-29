import {
  Type,
  ImageIcon,
  Quote,
  List,
  Minus,
  Code,
  FileCode,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown,
  BarChart,
  Pill,
} from "lucide-react"
import type { Block } from "@/types/article"

interface BlockTypeIndicatorProps {
  type: Block["type"]
}

export function BlockTypeIndicator({ type }: BlockTypeIndicatorProps) {
  switch (type) {
    case "paragraph":
      return <Type className="h-4 w-4 text-gray-500" />
    case "heading":
      return <Type className="h-4 w-4 text-gray-500 font-bold" />
    case "image":
      return <ImageIcon className="h-4 w-4 text-gray-500" />
    case "quote":
      return <Quote className="h-4 w-4 text-gray-500" />
    case "list":
      return <List className="h-4 w-4 text-gray-500" />
    case "divider":
      return <Minus className="h-4 w-4 text-gray-500" />
    case "code":
      return <Code className="h-4 w-4 text-gray-500" />
    case "html":
      return <FileCode className="h-4 w-4 text-gray-500" />
    case "cta":
      return <ExternalLink className="h-4 w-4 text-gray-500" />
    case "productReview":
      return <Star className="h-4 w-4 text-gray-500" />
    case "prosCons":
      return (
        <div className="flex">
          <ThumbsUp className="h-4 w-4 text-gray-500 mr-1" />
          <ThumbsDown className="h-4 w-4 text-gray-500" />
        </div>
      )
    case "productRating":
      return <BarChart className="h-4 w-4 text-gray-500" />
    case "ingredientsSection":
      return <Pill className="h-4 w-4 text-gray-500" />
    default:
      return null
  }
}
