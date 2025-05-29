"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
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

    // Create sections with headings and empty paragraphs
    const sections: Block[][] = []

    headings.forEach((heading, index) => {
      const section: Block[] = [
        {
          id: uuidv4(),
          type: "heading",
          level: 2,
          content: heading,
          newBlock: false,
          order: 0,
          articleId: "",
        },
      ]

      // Add product rating section after the "How Does X Rate According to Our Experts?" heading
      if (heading === "How Does " + name + " Rate According to Our Experts?") {
        section.push({
          id: uuidv4(),
          type: "productRating",
          content: "",
          productName: name,
          ratings: {
            ingredients: 4.7,
            value: 4.6,
            manufacturer: 4.8,
            safety: 4.8,
            effectiveness: 4.7,
          },
          highlights: [
            { id: uuidv4(), content: "Made with clinically-tested, powerfully effective ingredients." },
            { id: uuidv4(), content: "Manufactured in the USA" },
            { id: uuidv4(), content: "Made in GMP-certified facilities to ensure product safety and quality" },
          ],
          ctaButtonText: "SHOP NOW",
          ctaButtonLink: "#",
        })
      }
      // Add pros and cons section after the "Key Ingredients" heading
      else if (heading === "Key Ingredients") {
        section.push({
          id: uuidv4(),
          type: "prosCons",
          content: "",
          pros: [
            "Clinically validated and doctor-approved",
            "Available without a prescription",
            "Supported by a 60-day money-back guarantee to ensure customer satisfaction",
            "Ships with discreet packaging and secure checkout for customer privacy",
          ],
          cons: [
            "The product is available only online and is not sold in physical stores",
            "It may require repetition for maximum effect after 4-6 weeks",
          ],
          ingredients: ["Vitamin A", "Zinc", "Eurycoma Longifolia", "L-Arginine", "Pumpkin Seed Extract"],
        })
      }
      // Add ingredients section after the "Key Ingredients" heading
      else if (heading === name + " Key Ingredients – Are they Safe and Effective?") {
        section.push({
          id: uuidv4(),
          type: "ingredientsSection",
          content: "",
          productName: name,
          ingredientsIntroduction: `${name} (975mg) features natural ingredients known to support male performance, reproductive health, and hormonal balance. Its ingredients include:`,
          ingredientsList: [
            {
              id: uuidv4(),
              number: 1,
              name: "Vitamin A",
              imageUrl: "/placeholder-f2tcl.png", // This is used as a placeholder
              description:
                "Vitamin A plays a foundational role in male reproductive health, especially in the production and maturation of sperm cells. It supports healthy testicular function and is required for spermatogenesis, the process by which the body produces sperm.",
              studyYear: "2010",
              studySource: "The Journal of Clinical Investigation",
              studyDescription:
                "emphasized that retinoic acid (a form of Vitamin A) is essential for germ cell development and male fertility regulation. Deficiency in Vitamin A has been associated with impaired sperm production and reduced testicular function.",
            },
            {
              id: uuidv4(),
              number: 2,
              name: "Zinc",
              imageUrl: "/zinc-rich-foods.png",
              description:
                "Zinc is one of the most critical minerals for male sexual health. It plays a direct role in testosterone production, sperm quality, and fertility. As noted in our Alpha EnhanceX Review, zinc supplementation can help improve testosterone levels and enhance sexual function. Low zinc levels are linked to reduced testosterone and poor semen parameters, including sperm count and motility.",
              studyYear: "2020",
              studySource: "International Journal of Molecular Science",
              studyDescription:
                "noted that zinc supplementation improved sperm motility, concentration, and morphology in men with infertility issues. Zinc also helps reduce oxidative stress in the testes, which can protect sperm DNA from damage.",
            },
            {
              id: uuidv4(),
              number: 3,
              name: "Eurycoma Longifolia (Tongkat Ali)",
              imageUrl: "/tongkat-ali-herb.png",
              description:
                "Also known as Tongkat Ali, this traditional herbal extract is included in Alpha Labs Male Enhancement for its ability to support male vitality. Research published in the Journal of the International Society of Sports Nutrition found that daily supplementation significantly increased available testosterone levels and reduced cortisol, the body's primary stress hormone. Benefits observed also included improved libido and muscle strength.",
              studyYear: "2021",
              studySource: "Journal of the International Society of Sports Nutrition",
              studyDescription:
                "found that daily supplementation significantly increased available testosterone levels and reduced cortisol, the body's primary stress hormone. Benefits observed also included improved libido and muscle strength.",
            },
          ],
        })
      }
      // Add empty paragraph for other sections
      else {
        section.push({
          id: uuidv4(),
          type: "paragraph",
          content: "",
        })
      }

      // Add CTA button after every 3 sections
      if (index > 0 && index % 3 === 0) {
        sections.push([
          {
            id: uuidv4(),
            type: "cta",
            content: "",
            ctaText: "Check Best Price",
            ctaLink: "#",
          },
        ])
      }

      sections.push(section)
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
        <CardTitle>Product Review Setup</CardTitle>
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
            />
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
