/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, CheckCircle, X, ExternalLink, MessageCircle } from "lucide-react"

interface ArticleData {
  id: string
  title: string
  overview: string
  description: string
  howToTake: string
  benefits: {
    title: string
    description: string
  }[]
  overallRating: number
  ingredientsRating: number
  valueRating: number
  manufacturerRating: number
  safetyRating: number
  brandHighlights: string[]
  keyIngredients: string[]
  pros: string[]
  cons: string[]
  safety: string
  effectiveness: string
  pricing: {
    singleBottle: string
    threeBottles: string
    sixBottles: string
  }
  manufacturerInfo: {
    name: string
    location: string
    description: string
  }
  howItWorks: string
  ingredients: {
    name: string
    description: string
    benefits: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  customerReviews: {
    name: string
    location: string
    rating: number
    review: string
  }[]
  conclusion: string
  officialWebsite: string
  productImage: string
}

interface ArticleContentProps {
  id: string | undefined
}

const ArticleContent: React.FC<ArticleContentProps> = ({ id }) => {
  const [articleData, setArticleData] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeSection, setActiveSection] = useState<string>("overview")
  const [reviewRating, setReviewRating] = useState<number>(0)
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    headline: "",
    review: "",
  })

  useEffect(() => {
    // In a real application, you would fetch the article data based on the ID
    const fetchArticleData = async () => {
      try {
        // Simulate API call with a shorter delay to show loading state
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data based on the screenshot
        const mockData: ArticleData = {
          id: id || "3",
          title: "Superconductor Slim",
          overview:
            "You're not alone if you're having trouble slimming down to your goal weight with diet and exercise. Busy lifestyles can make sticking to a healthy diet difficult, slowing down progress. What if there were a natural solution to help speed up your efforts?",
          description:
            "Superconductor Slim is a natural liquid supplement with 5 potent bioactive ingredients that support a healthy metabolism. With consistent use, the formula helps speed up fat burning and promote rapid weight loss, especially when combined with a healthy, balanced diet and regular exercise.",
          howToTake:
            "Superconductor Slim is a liquid supplement meant to be taken orally daily. Follow the directions on the label carefully, and do not exceed the maximum dosage unless directed by a healthcare practitioner. In addition, to support healthy weight management, take the product along with following a balanced, moderate-calorie diet and exercising regularly.",
          benefits: [
            {
              title: "Supports Weight Management",
              description:
                "The ingredients in Superconductor Slim speed up the metabolism to help promote fat burning and rapid weight management.",
            },
            {
              title: "Reduces Inflammation",
              description:
                "The formula has antioxidants that lower oxidative stress and promote body-wide repair, supporting overall metabolic health.",
            },
            {
              title: "Enhances Increased Energy Levels",
              description:
                "Superconductor Slim speeds up the burning of calories to help boost energy and support increased physical activity.",
            },
            {
              title: "Helps Suppress Appetite",
              description:
                "The Superconductor Slim formula contains ingredients that help suppress hunger, helping to reduce daily caloric intake and support weight management.",
            },
            {
              title: "Supports Digestive Health",
              description:
                "The formula contains prebiotic fiber in some products, fiber which helps feed probiotics bacteria in the gut to balance the microbiome and support digestive health.",
            },
          ],
          overallRating: 4.6,
          ingredientsRating: 4.6,
          valueRating: 4.5,
          manufacturerRating: 4.6,
          safetyRating: 4.6,
          brandHighlights: [
            "The brand manufacturer is based in the USA.",
            "They provide significant discounts on bulk orders.",
            "The company offers a 365-day money-back guarantee.",
            "They offer fast shipping for U.S and international orders.",
          ],
          keyIngredients: [
            "Egyptian Blue Vervain",
            "Eleuthero Root",
            "Lady's Mantle Herb",
            "Licorice Root",
            "Pure Peppermint Oil",
          ],
          pros: [
            "The ingredients are all-natural and plant-based.",
            "The formula is free of GMOs, stimulants, and toxic additives.",
            "Superconductor Slim is vegetarian-friendly.",
            "The ingredients are non-habit forming.",
            "Superconductor Slim is an easy-to-swallow liquid formula.",
          ],
          cons: [
            "Superconductor Slim is only available for purchase online.",
            "The company does not provide samples of the supplement.",
          ],
          safety:
            "Superconductor Slim consists of natural, plant-based, vegetarian-friendly ingredients and has no GMOs, stimulants, toxic chemicals, or additives. As there could be health or medication interactions, it's important to consult with a healthcare practitioner before taking Superconductor Slim, especially if you have any medical conditions or are taking medications.",
          effectiveness:
            "The Superconductor Slim formula includes five potent bioactive ingredients that work together to support metabolic health and help promote fat burning. As we have shown, there is scientific support for the weight management benefits of each extract, which should make it an effective solution. In most cases, based on the highly positive user feedback, the majority of customers also believe it helps to support health and fat burning.",
          pricing: {
            singleBottle: "$69",
            threeBottles: "$59/bottle ($177 total)",
            sixBottles: "$49/bottle + free shipping (included) ($294 total)",
          },
          manufacturerInfo: {
            name: "Superconductor Slim",
            location: "Tallmadge, Ohio, USA",
            description:
              "This organization's mission is to offer all-natural solutions to support metabolic health and weight management, and Superconductor Slim is its flagship product. It values using natural, premium-sourced ingredients and manufactures all products safely in the USA.",
          },
          howItWorks:
            "Superconductor Slim contains a potent blend of five extracts that work synergistically to support metabolic health. It is high in antioxidants that target and destroy free radicals in your system, lowering oxidative stress to promote body-wide healing.",
          ingredients: [
            {
              name: "Egyptian Blue Vervain",
              description:
                "The Verbena officinalis plant is rich in multiple bioactive compounds with antioxidant properties, helping to lower oxidative stress and repair cellular damage.",
              benefits:
                "It supports the metabolism and weight management, and also offers potential benefits to brain, nerve, and heart health.",
            },
            {
              name: "Eleuthero Root",
              description:
                "Also called Siberian ginseng, this plant has potent antioxidants and bioactive compounds that support metabolic health, helping to improve energy levels. It also helps lower stress, increase energy levels, and heighten mental and physical performance.",
              benefits:
                "An 8-week study published in The Chinese Journal of Physiology concluded that supplementation with eleuthero root helped stimulate metabolism, boost endurance, and support cardiovascular health.",
            },
            {
              name: "Licorice Root",
              description:
                "The Glycyrrhiza glabra plant has prebiotic fiber, which feeds probiotics in the gut to balance the microbiome and support digestive health. It also helps slow digestion to curb hunger and cravings for a potentially lower daily calorie intake.",
              benefits:
                "In addition, there is support for its ability to help decrease body fat mass. A 2-month study of healthy adults published in the Journal of Endocrinological Investigation found that the daily consumption of licorice root helps decrease body fat mass.",
            },
          ],
          faqs: [
            {
              question: "What is Unique About Superconductor Slim?",
              answer:
                "Superconductor Slim contains all-natural ingredients that are highly valued by many for their metabolism-boosting and weight-loss properties. The formula is unique in the market, and unlike many brands, the company offers an outstanding 365-day money-back guarantee.",
            },
            {
              question: "How Long Does it Take to Work?",
              answer:
                "Most customers begin to notice results within a few days, but generally, it takes a few weeks for the Superconductor Slim ingredients to build up in your system and produce fat-burning and weight loss effects.",
            },
            {
              question: "What is the Return Policy?",
              answer:
                "The manufacturer offers a 365-day money-back guarantee on Superconductor Slim. Contact customer service if you're dissatisfied with your results. Send the bottles back (empty or not) to the manufacturer, and you'll get a full refund of the purchase price.",
            },
            {
              question: "Who Should Take It?",
              answer:
                "Superconductor Slim is designed for adults over 18 who want to combine a healthy diet and lifestyle with a potent natural supplement to speed up weight loss results. Before taking it, consult with a healthcare practitioner for approval.",
            },
          ],
          customerReviews: [
            {
              name: "Sarah",
              location: "New York, NY",
              rating: 5,
              review:
                "I was really struggling to lose weight, even with diet and hitting the gym a couple of times a week. A friend recommended Superconductor Slim, and within two weeks of taking it, my energy levels were higher. After a few more weeks, I've 18 pounds down and feeling amazing! Superconductor Slim!",
            },
            {
              name: "Tom",
              location: "San Diego, CA",
              rating: 5,
              review:
                "Finally, a weight loss supplement that works! The pounds are flying off, my energy levels are up every day, and I feel great. I highly recommend Superconductor Slim!",
            },
          ],
          conclusion:
            "Superconductor Slim contains a unique, potent natural blend of extracts that have scientific support for their ability to boost metabolism, curb hunger, enhance digestive health, increase energy, and support weight management. It comes in an easy-to-take liquid form and is backed by a stellar 365-day guarantee.",
          officialWebsite: "https://example.com/superconductor-slim",
          productImage: "/placeholder.svg?height=300&width=100",
        }

        setArticleData(mockData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching article data:", error)
        setLoading(false)
      }
    }

    if (id) {
      fetchArticleData()
    }
  }, [id])

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (!articleData) {
    return <div className="text-red-500 font-medium">Error: No article data found.</div>
  }

  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    // Scroll to the section with a slight delay to ensure DOM is updated
    setTimeout(() => {
      const element = document.getElementById(section)
      if (element) {
        const yOffset = -180 // Increased offset to ensure section is well below any fixed headers
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: "smooth" })
      }
    }, 150) // Slightly longer delay to ensure everything is ready
  }

  const handleReviewFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setReviewForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingClick = (rating: number) => {
    setReviewRating(rating)
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would submit the review to your backend
    console.log({ ...reviewForm, rating: reviewRating })
    alert("Thank you for your review!")
    setReviewForm({ name: "", email: "", headline: "", review: "" })
    setReviewRating(0)
  }

  return (
    <div className="space-y-8">
      {/* In This Review Navigation */}
      <div className="border-b border-gray-300">
        <h1 className="text-lg font-bold mb-2">In This Review</h1>
        <div className="flex flex-wrap gap-2 pb-3 text-sm">
          <Link
            href="#what-is-it"
            className="text-blue-500 hover:underline"
            onClick={() => handleSectionClick("what-is-it")}
          >
            What is it?
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="#rate" className="text-blue-500 hover:underline" onClick={() => handleSectionClick("rate")}>
            Rate
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="#pros" className="text-blue-500 hover:underline" onClick={() => handleSectionClick("pros")}>
            Pros
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="#cons" className="text-blue-500 hover:underline" onClick={() => handleSectionClick("cons")}>
            Cons
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="#manufacturer"
            className="text-blue-500 hover:underline"
            onClick={() => handleSectionClick("manufacturer")}
          >
            Manufacturer
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="#how-it-works"
            className="text-blue-500 hover:underline"
            onClick={() => handleSectionClick("how-it-works")}
          >
            How Does It Work?
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="#ingredients"
            className="text-blue-500 hover:underline"
            onClick={() => handleSectionClick("ingredients")}
          >
            Ingredients
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="#how-to-take"
            className="text-blue-500 hover:underline"
            onClick={() => handleSectionClick("how-to-take")}
          >
            How to Take It?
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="#benefits"
            className="text-blue-500 hover:underline"
            onClick={() => handleSectionClick("benefits")}
          >
            Benefits
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="#side-effects"
            className="text-blue-500 hover:underline"
            onClick={() => handleSectionClick("side-effects")}
          >
            Side Effects
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="#safety" className="text-blue-500 hover:underline" onClick={() => handleSectionClick("safety")}>
            Safety
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="#effectiveness"
            className="text-blue-500 hover:underline"
            onClick={() => handleSectionClick("effectiveness")}
          >
            How Effective is it?
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="#price" className="text-blue-500 hover:underline" onClick={() => handleSectionClick("price")}>
            Product Price
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="#faqs" className="text-blue-500 hover:underline" onClick={() => handleSectionClick("faqs")}>
            FAQs
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="#reviews" className="text-blue-500 hover:underline" onClick={() => handleSectionClick("reviews")}>
            Customer Reviews
          </Link>
          <span className="text-gray-400">|</span>
          <Link
            href="#conclusion"
            className="text-blue-500 hover:underline"
            onClick={() => handleSectionClick("conclusion")}
          >
            Conclusion
          </Link>
        </div>
      </div>

      {/* Overview Section */}
      <section id="overview" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Overview</h2>
        <p className="text-gray-700 mb-4">{articleData.overview}</p>
        <p className="text-gray-700 mb-4">
          <span className="font-bold">{articleData.title}</span> is a powerful herbal supplement that could help.
          Infused with 5 potent extracts that help stimulate the metabolism, this supplement can increase in
          fat-burning, weight loss, and energy levels.
        </p>
        <p className="text-gray-700 mb-4">
          Does Superconductor Slim work as well as the manufacturer claims, and is it the answer to your weight loss
          struggles? In this review, we examine the ingredients and product details closely to help you decide if this
          plant-based weight loss aid is right for you.
        </p>
      </section>

      {/* What is Superconductor Slim Section */}
      <section id="what-is-it" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">What is {articleData.title}?</h2>
        <p className="text-gray-700 mb-4">{articleData.description}</p>
        <p className="text-gray-700 mb-4">
          The Superconductor Slim formula also helps suppress appetite, keeping you feeling full so you take in fewer
          daily calories, and it supports heightened energy levels for a possible increase in physical activity. The
          formula may also help balance the gut microbiome to support healthy digestion.
        </p>
        <p className="text-gray-700 mb-4">
          The formula comes in an easy-to-take liquid form and contains no stimulants, GMOs, or toxic additives. Made
          safely by a U.S. manufacturer, with consistent intake, Superconductor Slim supports healthy weight management
          and helps boost confidence.
        </p>
      </section>

      {/* How to Take Superconductor Slim Section */}
      <section id="how-to-take" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">How to Take {articleData.title}?</h2>
        <p className="text-gray-700 mb-4">{articleData.howToTake}</p>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Benefits of {articleData.title}</h2>
        <p className="text-gray-700 mb-4">
          These are the primary <span className="font-bold">{articleData.title} benefits</span>:
        </p>

        <ul className="space-y-3">
          {articleData.benefits.map((benefit, index) => (
            <li key={index} className="ml-5">
              <p className="font-bold">- {benefit.title}:</p>
              <p className="text-gray-700">{benefit.description}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Rating Section */}
      <section id="rate" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          How Does {articleData.title} Rate According to Our Experts?
        </h2>

        {/* Overall Rating Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">Overall Rating:</span>
            <span className="font-bold">{articleData.overallRating}/5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${(articleData.overallRating / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Product Image and Ratings */}
          <div className="md:w-1/3">
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-48">
                <Image
                  src={articleData.productImage || "/placeholder.svg"}
                  alt={articleData.title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <Star className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm">Ingredients</span>
                </div>
                <span className="font-bold text-blue-500">{articleData.ingredientsRating}/5</span>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <Star className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm">Value for Cost</span>
                </div>
                <span className="font-bold text-blue-500">{articleData.valueRating}/5</span>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <Star className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm">Manufacturer</span>
                </div>
                <span className="font-bold text-blue-500">{articleData.manufacturerRating}/5</span>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-1 rounded-full mr-2">
                    <Star className="w-4 h-4 text-blue-500" />
                  </div>
                  <span className="text-sm">Safety</span>
                </div>
                <span className="font-bold text-blue-500">{articleData.safetyRating}/5</span>
              </div>
            </div>

            <a
              href={articleData.officialWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 bg-red-600 hover:bg-red-700 text-white text-center py-2 px-4 rounded-md font-bold transition-colors"
            >
              SHOP NOW
            </a>
          </div>

          {/* Brand Highlights */}
          <div className="md:w-2/3 bg-[#f5f9e8] p-5 rounded-md">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Brand Highlights</h3>
            <ul className="space-y-2">
              {articleData.brandHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-gray-500 mr-2">-</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Ingredients */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3">Key Ingredients</h3>
          <div className="border border-gray-300 rounded-md p-3">
            <div className="flex flex-wrap gap-3">
              {articleData.keyIngredients.map((ingredient, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-gray-500 mr-2">-</span>
                  <span>{ingredient}</span>
                  {index < articleData.keyIngredients.length - 1 && <span className="ml-2 text-gray-300">|</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pros and Cons Section */}
      <section id="pros-cons" className="scroll-mt-40 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div id="pros">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-xl font-bold text-green-600">Pros</h3>
          </div>
          <ul className="space-y-2">
            {articleData.pros.map((pro, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-500 mr-2">-</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div id="cons">
          <div className="flex items-center mb-3">
            <X className="w-6 h-6 text-red-600 mr-2" />
            <h3 className="text-xl font-bold text-red-600">Cons</h3>
          </div>
          <ul className="space-y-2">
            {articleData.cons.map((con, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-500 mr-2">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Safety of {articleData.title}</h2>
        <p className="text-gray-700 mb-4">{articleData.safety}</p>
      </section>

      {/* Effectiveness Section */}
      <section id="effectiveness" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">How Effective is {articleData.title}?</h2>
        <p className="text-gray-700 mb-4">{articleData.effectiveness}</p>
      </section>

      {/* Pricing Section */}
      <section id="price" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">How Much Does {articleData.title} Cost?</h2>
        <p className="text-gray-700 mb-4">
          <span className="font-bold">{articleData.title}</span> is for sale on the official website only, and we highly
          recommend purchasing from the manufacturer directly to avoid counterfeit products on the market.
        </p>
        <p className="text-gray-700 mb-4">
          The company offers significant discounts on bulk purchases, and shipping is included in all orders of 6
          bottles or more. This is the price list:
        </p>

        <ul className="space-y-2 mb-4">
          <li className="flex items-start">
            <span className="text-gray-500 mr-2">•</span>
            <span>
              1 Bottle - <span className="font-bold">{articleData.pricing.singleBottle}</span> + shipping
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-500 mr-2">•</span>
            <span>
              3 Bottles - <span className="font-bold">{articleData.pricing.threeBottles}</span> + shipping
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-gray-500 mr-2">•</span>
            <span>
              6 Bottles - <span className="font-bold">{articleData.pricing.sixBottles}</span>
            </span>
          </li>
        </ul>

        <p className="text-gray-700 mb-4">
          All packages come with complimentary shipping. The more you buy, Package 1 offers the lowest price per bottle,
          saving you over 30% off the regular price of $99. The official website often runs special offers.
        </p>

        <div className="bg-blue-500 text-white p-4 rounded-md text-center mb-6">
          <p className="font-medium mb-2">You can BUY it directly from the</p>
          <Link
            href={articleData.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md font-bold transition-colors"
          >
            Official Website
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* About the Manufacturer */}
      <section id="manufacturer" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">About the Manufacturer</h2>
        <p className="text-gray-700 mb-4">
          The manufacturer is a company with the same name as the product,{" "}
          <span className="font-bold">{articleData.manufacturerInfo.name}</span>, headquartered in{" "}
          {articleData.manufacturerInfo.location}.
        </p>
        <p className="text-gray-700 mb-4">{articleData.manufacturerInfo.description}</p>

        <div className="bg-blue-500 text-white p-4 rounded-md text-center">
          <p className="font-medium mb-2">You can BUY it directly from the</p>
          <Link
            href={articleData.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md font-bold transition-colors"
          >
            Official Website
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* How Does It Work */}
      <section id="how-it-works" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">How Does {articleData.title} Work?</h2>
        <p className="text-gray-700 mb-4">{articleData.howItWorks}</p>
        <p className="text-gray-700 mb-4">
          To address metabolic damage, speeding up function to help promote rapid fat burning and support weight loss. A
          review and meta-analysis published in{" "}
          <span className="italic">Oxidative Medicine and Cellular Longevity</span> found support for the benefits of
          antioxidants in lowering oxidative stress and enhancing anti-obesity properties.
        </p>
        <p className="text-gray-700 mb-4">
          In addition, Superconductor Slim contains some prebiotic fiber, which feeds healthy probiotics in the gut so
          they can proliferate and balance the microbiome.
        </p>
        <p className="text-gray-700 mb-4">
          This supports digestive health, and the fiber also slows digestion to help keep you feeling full for longer.
          The formula also helps suppress appetite to lower daily caloric intake, and it also supports heightened energy
          levels for increased physical activity.
        </p>
        <p className="text-gray-700 mb-4">
          A review in <span className="italic">Food Science and Nutrition</span> explains, &quot;Dietary fibers prevent
          obesity through reduction of hunger and prolongation of satiety.&quot;
        </p>
        <p className="text-gray-700 mb-4">
          A number of mechanical and endocrine signals from the gastrointestinal tract are stimulated by fibers and
          their fermentation products, reach regions of the brain involved in the regulation of appetite, and ultimately
          reduce food intake.
        </p>
      </section>

      {/* Ingredients Section */}
      <section id="ingredients" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">
          {articleData.title} Ingredients – Are they Safe and Effective?
        </h2>
        <p className="text-gray-700 mb-4">These are the primary active Superconductor Slim ingredients:</p>

        <div className="space-y-6">
          {articleData.ingredients.map((ingredient, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold text-blue-600 mb-2">{ingredient.name}</h3>
              <p className="text-gray-700 mb-3">{ingredient.description}</p>
              <p className="text-gray-700 mb-3">{ingredient.benefits}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">{articleData.title} Review - FAQs</h2>

        <div className="space-y-6">
          {articleData.faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                <span className="text-blue-500 mr-2">Q:</span>
                {faq.question}
              </h3>
              <p className="text-gray-700 mb-3 pl-6">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">What Do Customers Say?</h2>

        <div className="space-y-6 mb-8">
          {articleData.customerReviews.map((review, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-gray-700 italic mb-2 text-lg">&quot;{review.review}&quot;</p>
              <p className="text-base text-gray-500">
                - {review.name} from {review.location}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
            Customer Reviews for {articleData.title}
          </h3>

          <div className="flex items-center mb-6">
            <div className="relative w-24 h-36 mr-4">
              <Image
                src={articleData.productImage || "/placeholder.svg"}
                alt={articleData.title}
                fill
                className="object-contain"
              />
            </div>

            <div>
              <h4 className="text-lg font-bold text-blue-600 mb-2">Review this Product</h4>
              <p className="text-sm text-gray-600 mb-2">Share a review and share your experience with others.</p>
              <div className="flex items-center">
                <span className="mr-2 text-sm font-medium">Customer Reviews & Ratings:</span>
                <span className="text-2xl font-bold text-red-500">1</span>
                <span className="text-sm text-gray-500 mx-1">out of</span>
                <span className="text-lg font-bold">5</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-500 text-white text-center py-2 px-4 rounded-md mb-6">
            <Link href="#write-review" className="font-bold" onClick={() => handleSectionClick("write-review")}>
              Write a Review
            </Link>
          </div>

          <form id="write-review" className="space-y-4" onSubmit={handleReviewSubmit}>
            <p className="text-base text-gray-500">
              Your email address will not be published. Required fields are marked *
            </p>

            <div>
              <label htmlFor="headline" className="block text-base font-medium mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                id="headline"
                name="headline"
                value={reviewForm.headline}
                onChange={handleReviewFormChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">YOUR RATING: *</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => handleRatingClick(star)} className="p-1">
                    <Star
                      className={`w-5 h-5 ${reviewRating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-base font-medium mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={reviewForm.name}
                  onChange={handleReviewFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-base font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={reviewForm.email}
                  onChange={handleReviewFormChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="review" className="block text-base font-medium mb-1">
                Your Review *
              </label>
              <textarea
                id="review"
                name="review"
                value={reviewForm.review}
                onChange={handleReviewFormChange}
                rows={6}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              ></textarea>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="privacy" className="mr-2" required />
              <label htmlFor="privacy" className="text-base text-gray-600">
                I agree to the Privacy Policy and Terms of Service
              </label>
            </div>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md transition-colors"
            >
              SUBMIT REVIEW
            </button>
          </form>
        </div>
      </section>

      {/* Conclusion Section */}
      <section id="conclusion" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">{articleData.title} Review - Conclusion</h2>
        <p className="text-gray-700 mb-4">{articleData.conclusion}</p>
        <p className="text-gray-700 mb-4">
          While this may rate formula for to <span className="font-bold">Superconductor Slim review</span> on the
          official website as of yet, the independent online feedback is overwhelmingly positive, with many users
          reporting significant fat loss, increased energy, and improved confidence and well-being.
        </p>
        <p className="text-gray-700 mb-4">
          Delivered by most users, and the company manufactures safely in the USA. Before taking Superconductor Slim,
          consult with a healthcare practitioner for approval.
        </p>
      </section>

      {/* Where To Find It Section */}
      <section id="where-to-find" className="scroll-mt-40 pt-4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Where To Find It?</h2>
        <p className="text-gray-700 mb-4">
          You can BUY it directly from the{" "}
          <Link href={articleData.officialWebsite} className="text-blue-500 font-bold hover:underline">
            Official Website
          </Link>
        </p>

        <div className="text-xs text-gray-500 mt-8 border-t pt-4">
          <p>
            Product claims are provided for informational purposes only and should only be relied upon after careful
            research by the consumer and their healthcare provider. The statements on this website have not been
            evaluated by the FDA. The information on this page is not medical advice. Your results can vary.
          </p>
        </div>
      </section>

      {/* Consumer Health Digest Logo */}
      <div className="border-t border-gray-300 pt-6 mt-8">
        <div className="flex items-center">
          <div className="bg-green-500 text-white px-2 py-1 rounded-md mr-2">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-green-600 font-bold text-lg">Consumer Health Digest</h3>
            <p className="text-xs text-gray-500">LAST UPDATED: APRIL 2, 2023</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleContent
