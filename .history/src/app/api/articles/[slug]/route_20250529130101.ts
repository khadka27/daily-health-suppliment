import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Article } from "@/types/article"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    const dataDirectory = path.join(process.cwd(), "data")
    const filePath = path.join(dataDirectory, "articles.json")

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "No articles found" }, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const articles: Article[] = JSON.parse(fileContents)

    const article = articles.find((article) => article.slug === slug)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error reading article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug
    const updatedArticle = await request.json()

    const dataDirectory = path.join(process.cwd(), "data")
    const filePath = path.join(dataDirectory, "articles.json")

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "No articles found" }, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const articles: Article[] = JSON.parse(fileContents)

    const index = articles.findIndex((article) => article.slug === slug)

    if (index === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Preserve the original ID
    updatedArticle.id = articles[index].id

    // Update the article
    articles[index] = updatedArticle

    // Write updated articles back to file
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))

    return NextResponse.json(updatedArticle)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug

    const dataDirectory = path.join(process.cwd(), "data")
    const filePath = path.join(dataDirectory, "articles.json")

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "No articles found" }, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    const articles: Article[] = JSON.parse(fileContents)

    const index = articles.findIndex((article) => article.slug === slug)

    if (index === -1) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Remove the article
    articles.splice(index, 1)

    // Write updated articles back to file
    fs.writeFileSync(filePath, JSON.stringify(articles, null, 2))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
