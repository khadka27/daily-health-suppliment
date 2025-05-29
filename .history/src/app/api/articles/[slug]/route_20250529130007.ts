import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Article } from "@/types/article"

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), "data")
    const filePath = path.join(dataDirectory, "articles.json")

    // Create data directory and file if they don't exist
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true })
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]), "utf8")
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const articles: Article[] = JSON.parse(fileContents)

    return NextResponse.json(articles)
  } catch (error) {
    console.error("Error reading articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const article = await request.json()

    // Validate required fields
    if (!article.title || !article.author || !article.blocks || article.blocks.length === 0) {
      return NextResponse.json({ error: "Title, author, and content are required" }, { status: 400 })
    }

    // Generate a unique ID
    article.id = Date.now().toString()

    // Ensure slug is set
    if (!article.slug) {
      article.slug = article.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    }

    // Set publish date if not provided
    if (!article.publishDate) {
      article.publishDate = new Date().toISOString()
    }

    const dataDirectory = path.join(process.cwd(), "data")
    const filePath = path.join(dataDirectory, "articles.json")

    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true })
    }

    // Read existing articles or create empty array if file doesn't exist
    let articles: Article[] = []
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8")
      articles = JSON.parse(fileContents)
    }

    // Add new article
    articles.push(article as Article)

    // Write updated articles back to file
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
