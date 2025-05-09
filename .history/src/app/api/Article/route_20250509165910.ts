// pages/api/articles/route.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define the handler for the articles route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check the request method
  if (req.method === 'POST') {
    // Handle POST request to create a new article
    try {
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

      // Create a new article in the database using Prisma
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

      // Respond with the created article
      res.status(201).json(newArticle);
    } catch (error) {
      console.error('Error creating article:', error);
      res.status(500).json({ message: 'Error creating article', error });
    }
  } else if (req.method === 'GET') {
    // Handle GET request to fetch all articles
    try {
      const articles = await prisma.article.findMany();
      res.status(200).json(articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      res.status(500).json({ message: 'Error fetching articles', error });
    }
  } else {
    // If the request method is not POST or GET, return a 405 Method Not Allowed response
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
