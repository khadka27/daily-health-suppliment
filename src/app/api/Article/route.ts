/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/article/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
