export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // First try to find by ID
    let article = await prisma.article.findUnique({
      where: {
        id: params.id,
      },
      include: {
        blocks: {
          include: {
            ratings: true,
            pros: true,
            cons: true,
            ingredients: true,
            highlights: true,
            customFields: true,
            ingredientsList: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    })

    // If not found by ID, try to find by slug
    if (!article) {
      article = await prisma.article.findUnique({
        where: {
          slug: params.id,
        },
        include: {
          blocks: {
            include: {
              ratings: true,
              pros: true,
              cons: true,
              ingredients: true,
              highlights: true,
              customFields: true,
              ingredientsList: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      })
    }

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Transform the article to include nested data in the expected format
    const transformedArticle = {
      ...article,
      blocks: article.blocks.map((block) => {
        return {
          ...block,
          ratings: block.ratings
            ? {
                ingredients: block.ratings.ingredients,
                value: block.ratings.value,
                manufacturer: block.ratings.manufacturer,
                safety: block.ratings.safety,
                effectiveness: block.ratings.effectiveness,
              }
            : undefined,
          pros: block.pros,
          cons: block.cons,
          ingredients: block.ingredients,
          highlights: block.highlights,
          customFields: block.customFields,
          ingredientsList: block.ingredientsList,
        }
      }),
    }

    return NextResponse.json(transformedArticle)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
