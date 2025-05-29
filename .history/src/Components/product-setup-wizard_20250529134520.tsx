"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Cmponents/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Block } from "@/types/article"

interface ProductSetupWizardProps {
  onComplete: (productName: string, sections: Block[][]) => void
  onCancel: () => void
}

export function ProductSetupWizard({ onComplete, onCancel }: ProductSetupWizardProps) {
  const [productName, setProductName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generateSections = (name: string): Block[][] => {
    // Define all the headings we want to use
    const headings = [
      "Overview",
      "How Does " + name + " Rate According to Our Experts?",
      "Key Ingredients",
      "About the Brand",
      "How Does " + name + " Work?",
      name + " Key Ingredients – Are they Safe and Effective?",
      "How to Use " + name + "?",
      "What to Expect When Taking " + name + "?",
      "Benefits of " + name,
      "Safety of " + name,
      "How Effective is " + name + "?",
      name + " Price",
      "Customer Reviews",
      name + " Review – FAQs",
      name + " Review – Conclusion",
      "Where To Find It?",
      "Write a Review",
    ]

    // Create sections with headings and content blocks
    const sections: Block[][] = []

    headings.forEach((heading, index) => {
      const section: Block[] = [
        {
          id: uuidv4(),
          type: "heading",
          level: 2,
          content: heading,
          order: 0,
          articleId: "",
          pros: [],
          cons: [],
          ingredients: [],
          highlights: [],
          customFields: [],
          ingredientsList: [],
        },
      ]

      // Add product rating section after the "How Does X Rate According to Our Experts?" heading
      if (heading === "How Does " + name + " Rate According to Our Experts?") {
        section.push({
          id: uuidv4(),
          type: "rating",
          content: "",
          productName: name,
          order: 1,
          articleId: "",
          ratings: {
            id: uuidv4(),
            blockId: "",
            ingredients: 4.7,
            value: 4.6,
            manufacturer: 4.8,
            safety: 4.8,
            effectiveness: 4.7,
          },
          highlights: [
            {
              id: uuidv4(),
              content: "Made with clinically-tested, powerfully effective ingredients.",
              order: 1,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "Manufactured in the USA",
              order: 2,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "Made in GMP-certified facilities to ensure product safety and quality",
              order: 3,
              blockId: "",
            },
          ],
          ctaButtonText: "SHOP NOW",
          ctaButtonLink: "#",
          pros: [],
          cons: [],
          ingredients: [],
          customFields: [],
          ingredientsList: [],
        })
      }
      // Add pros and cons section after the "Key Ingredients" heading
      else if (heading === "Key Ingredients") {
        section.push({
          id: uuidv4(),
          type: "pros-cons",
          content: "",
          order: 1,
          articleId: "",
          pros: [
            {
              id: uuidv4(),
              content: "Clinically validated and doctor-approved",
              order: 1,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "Available without a prescription",
              order: 2,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "Supported by a 60-day money-back guarantee to ensure customer satisfaction",
              order: 3,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "Ships with discreet packaging and secure checkout for customer privacy",
              order: 4,
              blockId: "",
            },
          ],
          cons: [
            {
              id: uuidv4(),
              content: "The product is available only online and is not sold in physical stores",
              order: 1,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "It may require repetition for maximum effect after 4-6 weeks",
              order: 2,
              blockId: "",
            },
          ],
          ingredients: [
            {
              id: uuidv4(),
              content: "Vitamin A",
              order: 1,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "Zinc",
              order: 2,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "Eurycoma Longifolia",
              order: 3,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "L-Arginine",
              order: 4,
              blockId: "",
            },
            {
              id: uuidv4(),
              content: "Pumpkin Seed Extract",
              order: 5,
              blockId: "",
            },
          ],
          highlights: [],
          customFields: [],
          ingredientsList: [],
        })
      }
      // Add ingredients section after the "Key Ingredients – Are they Safe and Effective?" heading
      else if (heading === name + " Key Ingredients – Are they Safe and Effective?") {
        section.push({
          id: uuidv4(),
          type: "ingredients",
          content: "",
          productName: name,
          order: 1,
          articleId: "",
          ingredientsIntroduction: `${name} (975mg) features natural ingredients known to support male performance, reproductive health, and hormonal balance. Its ingredients include:`,
          ingredientsList: [
            {
              id: uuidv4(),
              number: 1,
              name: "Vitamin A",
              imageUrl: "/placeholder.svg?height=150&width=150",
              description:
                "Vitamin A plays a foundational role in male reproductive health, especially in the production and maturation of sperm cells. It supports healthy testicular function and is required for spermatogenesis, the process by which the body produces sperm.",
              studyYear: "2010",
              studySource: "The Journal of Clinical Investigation",
              studyDescription:
                "emphasized that retinoic acid (a form of Vitamin A) is essential for germ cell development and male fertility regulation. Deficiency in Vitamin A has been associated with impaired sperm production and reduced testicular function.",
              blockId: "",
            },
            {
              id: uuidv4(),
              number: 2,
              name: "Zinc",
              imageUrl: "/placeholder.svg?height=150&width=150",
              description:
                "Zinc is one of the most critical minerals for male sexual health. It plays a direct role in testosterone production, sperm quality, and fertility. Low zinc levels are linked to reduced testosterone and poor semen parameters, including sperm count and motility.",
              studyYear: "2020",
              studySource: "International Journal of Molecular Science",
              studyDescription:
                "noted that zinc supplementation improved sperm motility, concentration, and morphology in men with infertility issues. Zinc also helps reduce oxidative stress in the testes, which can protect sperm DNA from damage.",
              blockId: "",
            },
            {
              id: uuidv4(),
              number: 3,
              name: "Eurycoma Longifolia (Tongkat Ali)",
              imageUrl: "/placeholder.svg?height=150&width=150",
              description:
                "Also known as Tongkat Ali, this traditional herbal extract is included for its ability to support male vitality. Research shows that daily supplementation significantly increased available testosterone levels and reduced cortisol, the body's primary stress hormone.",
              studyYear: "2021",
              studySource: "Journal of the International Society of Sports Nutrition",
              studyDescription:
                "found that daily supplementation significantly increased available testosterone levels and reduced cortisol, the body's primary stress hormone. Benefits observed also included improved libido and muscle strength.",
              blockId: "",
            },
          ],
          pros: [],
          cons: [],
          ingredients: [],
          highlights: [],
          customFields: [],
        })
      }
      // Add empty paragraph for other sections
      else {
        section.push({
          id: uuidv4(),
          type: "paragraph",
          content: `This section will contain detailed information about ${heading.toLowerCase()}.`,
          order: 1,
          articleId: "",
          pros: [],
          cons: [],
          ingredients: [],
          highlights: [],
          customFields: [],
          ingredientsList: [],
        })
      }

      sections.push(section)

      // Add CTA button after every 4 sections
      if ((index + 1) % 4 === 0 && index < headings.length - 1) {
        sections.push([
          {
            id: uuidv4(),
            type: "cta",
            content: "",
            ctaText: `Ready to try ${name}? Check the best price and exclusive offers.`,
            ctaButtonText: "Check Best Price",
            ctaButtonLink: "#",
            backgroundColor: "#2563eb",
            order: 0,
            articleId: "",
            pros: [],
            cons: [],
            ingredients: [],
            highlights: [],
            customFields: [],
            ingredientsList: [],
          },
        ])
      }
    })

    return sections
  }

  const handleSubmit = () => {
    if (!productName.trim()) {
      return
    }

    setIsSubmitting(true)
    const sections = generateSections(productName)
    onComplete(productName, sections)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Product Review Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name (e.g. Alpha Labs Male Enhancement)"
              onKeyDown={(e) => {
                if (e.key === "Enter" && productName.trim()) {
                  handleSubmit()
                }
              }}
            />
          </div>
          <div className="text-sm text-gray-600">
            <p>This will generate a comprehensive product review template with:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>17 pre-structured sections</li>
              <li>Product ratings and highlights</li>
              <li>Pros and cons analysis</li>
              <li>Detailed ingredient breakdown</li>
              <li>Call-to-action buttons</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!productName.trim() || isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Review Template"}
        </Button>
      </CardFooter>
    </Card>
  )
}
