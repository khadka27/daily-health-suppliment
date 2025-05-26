import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    // Check if we already have articles
    const articleCount = await prisma.article.count()

    if (articleCount > 0) {
      return NextResponse.json({
        success: true,
        message: "Database already has articles",
        count: articleCount,
      })
    }

    // Create some sample articles
    const articles = []

    for (let i = 1; i <= 5; i++) {
      const articleId = uuidv4()
      const article = await prisma.article.create({
        data: {
          id: articleId,
          title: `Sample Article ${i}`,
          slug: `sample-article-${i}`,
          author: "John Doe",
          publishDate: new Date(Date.now() - i * 86400000), // Each article 1 day older
          imageUrl: `/placeholder.svg?height=400&width=400&query=article${i}`,
          blocks: {
            create: [
              {
                id: uuidv4(),
                type: "heading",
                content: `Sample Article ${i} Heading`,
                level: 1,
                order: 0,
              },
              {
                id: uuidv4(),
                type: "paragraph",
                content: `This is a sample article ${i} with some content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.`,
                order: 1,
              },
              {
                id: uuidv4(),
                type: "paragraph",
                content:
                  "This is another paragraph with more content. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                order: 2,
              },
            ],
          },
        },
      })

      articles.push(article)
    }

    return NextResponse.json({
      success: true,
      message: "Sample articles created successfully",
      count: articles.length,
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
