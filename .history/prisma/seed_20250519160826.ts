import { PrismaClient } from "@prisma/client"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // Create a sample article
  const article = await prisma.article.create({
    data: {
      id: uuidv4(),
      title: "Getting Started with Block-Based Editing",
      slug: "getting-started-with-block-based-editing",
      author: "Content Expert",
      publishDate: new Date("2023-05-15"),
      imageUrl: "/block-editor-interface.png",
      blocks: {
        create: [
          {
            id: uuidv4(),
            type: "heading",
            content: "Getting Started with Block-Based Editing",
            level: 1,
            order: 0,
          },
          {
            id: uuidv4(),
            type: "paragraph",
            content:
              "Block-based editing is revolutionizing the way we create and manage content on the web. Instead of working with a single large text field, block editors allow you to build your content piece by piece, with each piece (or block) serving a specific purpose.",
            order: 1,
          },
          {
            id: uuidv4(),
            type: "heading",
            content: "What are Content Blocks?",
            level: 2,
            order: 2,
          },
          {
            id: uuidv4(),
            type: "paragraph",
            content:
              "Content blocks are modular units of content that can be added, removed, and rearranged within your document. Common block types include paragraphs, headings, images, quotes, lists, and more specialized blocks like tables, code snippets, or embeds.",
            order: 3,
          },
          {
            id: uuidv4(),
            type: "image",
            imageUrl: "/content-blocks-diagram.png",
            content: "Different types of content blocks that can be used in a block editor",
            order: 4,
          },
          {
            id: uuidv4(),
            type: "heading",
            content: "Benefits of Block-Based Editing",
            level: 2,
            order: 5,
          },
          {
            id: uuidv4(),
            type: "list",
            listType: "unordered",
            content:
              "Flexibility in content structure\nEasier visual organization\nConsistent formatting\nBetter content reusability\nImproved editing experience",
            order: 6,
          },
          {
            id: uuidv4(),
            type: "quote",
            content:
              "Block-based editing is not just a trend; it's the future of content creation on the web. It empowers content creators to think visually while maintaining structural integrity.",
            order: 7,
          },
          {
            id: uuidv4(),
            type: "heading",
            content: "Getting Started",
            level: 2,
            order: 8,
          },
          {
            id: uuidv4(),
            type: "paragraph",
            content:
              "To get started with block-based editing, simply click the '+' button to add a new block. You can choose from various block types depending on the content you want to create. Once added, you can edit the block's content, move it up or down, or delete it if needed.",
            order: 9,
          },
          {
            id: uuidv4(),
            type: "paragraph",
            content:
              "As you become more familiar with block-based editing, you'll discover how it can streamline your content creation process and help you build more engaging, visually appealing content.",
            order: 10,
          },
          {
            id: uuidv4(),
            type: "cta",
            content: "",
            ctaText: "Try Block Editing Now",
            ctaLink: "https://example.com/block-editor",
            order: 11,
          },
        ],
      },
    },
  })

  console.log(`Created article with ID: ${article.id}`)
  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
