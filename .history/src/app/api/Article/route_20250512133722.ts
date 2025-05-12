import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Destructure the incoming request body
      const {
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
      } = req.body;

      // Create a new article in the database
      const newArticle = await prisma.article.create({
        data: {
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
        },
      });

      // Return the new article
      res.status(201).json(newArticle);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Error creating article", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
