// pages/api/articles/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const data = req.body;

      const newArticle = await prisma.article.create({
        data: {
          title: data.title,
          overview: data.overview,
          description: data.description,
          howToTake: data.howToTake,
          benefits: data.benefits,
          overallRating: data.overallRating,
          ingredientsRating: data.ingredientsRating,
          valueRating: data.valueRating,
          manufacturerRating: data.manufacturerRating,
          safetyRating: data.safetyRating,
          brandHighlights: data.brandHighlights,
          keyIngredients: data.keyIngredients,
          pros: data.pros,
          cons: data.cons,
          safety: data.safety,
          effectiveness: data.effectiveness,
          pricing: data.pricing,
          manufacturerInfo: data.manufacturerInfo,
          howItWorks: data.howItWorks,
          ingredients: data.ingredients,
          faqs: data.faqs,
          customerReviews: data.customerReviews,
          conclusion: data.conclusion,
          officialWebsite: data.officialWebsite,
          productImage: data.productImage,
          ctaButtons: data.ctaButtons,
        },
      });

      res.status(201).json(newArticle);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Error creating article", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
