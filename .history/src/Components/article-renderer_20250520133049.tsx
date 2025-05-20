"use client"

import { useState, useEffect, useRef } from "react"
import type { Block } from "@/types/article"
import { Star } from "lucide-react"
import { ProductReviewTemplate } from "./product-review-template"
import { HorizontalToc } from "./horizontal-toc"
import { ProsConsSection } from "./pros-cons-section"
import { ProductRatingSection } from "./product-rating-section"
import { IngredientsSection } from "./ingredients-section"
import Image from "next/image"

interface ArticleRendererProps {
  blocks: Block[]
}

export function ArticleRenderer({ blocks }: ArticleRendererProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Generate TOC items from section blocks
  const tocItems = blocks
    .filter((block) => block.type === "heading" && block.level === 2)
    .map((block) => ({
      id: block.id,
      title: block.content,
    }))

  // Add default sections if not present in blocks
  const defaultSections = [
    "Overview",
    "What is It?",
    "Rating",
    "Pros",
    "Cons",
    "Brand",
    "How Does It Work?",
    "Ingredients",
    "How to Use?",
    "What to Expect?",
    "Benefits",
    "Safety",
    "How Effective is It?",
    "Price",
    "Reviews",
    "FAQ's",
    "Conclusion",
  ]

  const allTocItems =
    tocItems.length > 0
      ? tocItems
      : defaultSections.map((title, index) => ({
          id: `section-${index}`,
          title,
        }))

  // Scroll to section when TOC item is clicked
  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = sectionRefs.current[id]
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      // Find the section that is currently in view
      const currentSection = Object.entries(sectionRefs.current)
        .filter(([_, ref]) => ref !== null)
        .sort(([_, refA], [__, refB]) => {
          const offsetA = refA?.offsetTop || 0
          const offsetB = refB?.offsetTop || 0
          return offsetB - offsetA
        })
        .find(([_, ref]) => (ref?.offsetTop || 0) <= scrollPosition)

      if (currentSection) {
        setActiveSection(currentSection[0])
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Helper function to render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-4 h-4 text-yellow-400" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    )
  }

  return (
    <div className="prose max-w-none">
      <HorizontalToc items={allTocItems} activeId={activeSection} onItemClick={scrollToSection} />

      {blocks.map((block) => (
        <div
          key={block.id}
          className="mb-6"
          ref={(el) => {
            if (block.type === "heading" && block.level === 2) {
              sectionRefs.current[block.id] = el
            }
          }}
          id={block.id}
        >
          {block.type === "paragraph" && <p>{block.content}</p>}

          {block.type === "heading" && (
            <>
              {block.level === 1 && <h1>{block.content}</h1>}
              {block.level === 2 && <h2>{block.content}</h2>}
              {block.level === 3 && <h3>{block.content}</h3>}
            </>
          )}

          {block.type === "image" && (
            <figure className="my-8">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src={block.imageUrl || "/placeholder.svg"}
                  alt={block.content || "Image"}
                  className="w-full h-auto"
                />
              </div>
              {block.content && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">{block.content}</figcaption>
              )}
            </figure>
          )}

          {block.type === "quote" && (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic">{block.content}</blockquote>
          )}

          {block.type === "list" && (
            <>
              {block.listType === "ordered" ? (
                <ol className="list-decimal pl-5">
                  {block.content.split("\n").map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              ) : (
                <ul className="list-disc pl-5">
                  {block.content.split("\n").map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </>
          )}

          {block.type === "divider" && <hr className="my-8 border-t-2 border-gray-200" />}

          {block.type === "code" && (
            <div className="my-6">
              <div className="bg-gray-800 rounded-md overflow-hidden">
                <div className="px-4 py-2 text-xs text-gray-200 bg-gray-700 border-b border-gray-600">
                  {block.language || "javascript"}
                </div>
                <pre className="p-4 text-sm text-gray-100 overflow-x-auto">
                  <code>{block.content}</code>
                </pre>
              </div>
            </div>
          )}

          {block.type === "html" && (
            <div className="my-6">
              <div dangerouslySetInnerHTML={{ __html: block.content }} />
            </div>
          )}

          {block.type === "cta" && (
            <div className="bg-gray-100 p-6 rounded-lg my-8 text-center">
              <a
                href={block.ctaLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                {block.ctaText || "Call to Action"}
              </a>
            </div>
          )}

          {block.type === "prosCons" && (
            <ProsConsSection pros={block.pros || []} cons={block.cons || []} ingredients={block.ingredients || []} />
          )}

          {block.type === "productRating" && (
            <ProductRatingSection
              productName={block.productName || "Product Name"}
              overallRating={block.ratings?.effectiveness || 4.7}
              ingredientsRating={block.ratings?.ingredients || 4.7}
              valueRating={block.ratings?.value || 4.6}
              manufacturerRating={block.ratings?.manufacturer || 4.8}
              safetyRating={block.ratings?.safety || 4.8}
              highlights={block.highlights || []}
              imageUrl={block.imageUrl}
              ctaText={block.ctaButtonText}
              ctaLink={block.ctaButtonLink}
            />
          )}

          {block.type === "ingredientsSection" && (
            <IngredientsSection
              productName={block.productName || "Product Name"}
              introduction={block.ingredientsIntroduction || ""}
              ingredients={block.ingredientsList || []}
            />
          )}

          {block.type === "productReview" && (
            <ProductReviewTemplate
              productName={block.productName || "Product Name"}
              overallRating={block.overallRating || 0}
              imageUrl={block.imageUrl}
              description={block.content}
              pros={block.pros || []}
              cons={block.cons || []}
              ingredients={block.ingredients || []}
              howToUse={block.howToUse}
              effectiveness={block.ratings?.effectiveness || 0}
              safety={block.ratings?.safety || 0}
              value={block.ratings?.value || 0}
              price={block.price}
              verdict={block.verdict}
              customFields={block.customFields}
              ctaButtonText={block.ctaButtonText}
              ctaButtonLink={block.ctaButtonLink}
              backgroundColor={block.backgroundColor}
              author={block.author}
              reviewDate={block.reviewDate}
              medicallyReviewed={block.medicallyReviewed}
              factChecked={block.factChecked}
            />
          )}
        </div>
      ))}
    </div>
  )
}
