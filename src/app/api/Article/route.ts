/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/article/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("Received article data");

    // Destructure the incoming request data
    const {
      id,
      title,
      overview,
      description,
      howToTake,
      benefits,
      overallRating,
      ingredientsRating,
      valueRating,
      manufacturerRating,
      safetyRating,
      brandHighlights,
      keyIngredients,
      pros,
      cons,
      safety,
      effectiveness,
      pricing,
      manufacturerInfo,
      howItWorks,
      ingredients,
      faqs,
      customerReviews,
      conclusion,
      officialWebsite,
      productImage,
      ctaButtons,
    } = data;

    // Generate slug from title
    const slug = title
      ? title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
      : "";

    // Convert string ratings to numbers
    const articleData = {
      title,
      overview,
      description,
      howToTake,
      benefits,
      // Convert all ratings from strings to floats
      overallRating: parseFloat(overallRating) || 0,
      ingredientsRating: parseFloat(ingredientsRating) || 0,
      valueRating: parseFloat(valueRating) || 0,
      manufacturerRating: parseFloat(manufacturerRating) || 0,
      safetyRating: parseFloat(safetyRating) || 0,
      brandHighlights,
      keyIngredients,
      pros,
      cons,
      safety,
      effectiveness,
      pricing,
      manufacturerInfo,
      howItWorks,
      ingredients,
      faqs,
      // Make sure customerReviews has numeric ratings
      customerReviews: Array.isArray(customerReviews)
        ? customerReviews.map((review) => ({
            ...review,
            rating:
              typeof review.rating === "string"
                ? parseFloat(review.rating) || 0
                : review.rating,
          }))
        : customerReviews,
      conclusion,
      officialWebsite,
      productImage,
      ctaButtons,
      // Add the required fields that are missing
      slug,
      content: description || "", // Using description as content or empty string if not available
    };

    let article;

    if (id) {
      // Update existing article
      article = await prisma.article.update({
        where: { id },
        data: articleData,
      });
    } else {
      // Create a new article
      article = await prisma.article.create({
        data: articleData,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Article saved successfully",
      id: article.id,
    });
  } catch (error) {
    console.error("Error saving article:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error saving article",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

// Add a GET handler to fetch articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const search = searchParams.get("sch");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    // If an ID is provided, fetch a single article
    if (id) {
      const article = await prisma.article.findUnique({
        where: { id },
      });

      if (!article) {
        return NextResponse.json(
          { success: false, message: "Article not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, article });
    }

    // Otherwise, fetch a list of articles with pagination
    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = limitParam ? parseInt(limitParam) : 10;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};

    // We need to handle the category filter differently since we don't have categorySlug
    // For now, we'll search in the title
    if (category) {
      where.title = { contains: category, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Query for articles with pagination
    const [articles, totalCount] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          productImage: true,
          updatedAt: true,
          createdAt: true,
          overview: true,
        },
      }),
      prisma.article.count({ where }),
    ]);

    // Format the articles for the frontend
    const formattedArticles = articles.map((article) => ({
      id: article.id,
      title: article.title,
      // Generate a slug from the title for display purposes
      slug: article.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-"),
      description: article.description,
      image: article.productImage,
      // Without categorySlug, we'll use 'uncategorized' as default
      categorySlug: "uncategorized",
      category: "Uncategorized",
      updatedAt: article.updatedAt?.toISOString(),
      createdAt: article.createdAt?.toISOString(),
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      articles: formattedArticles,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching articles",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
