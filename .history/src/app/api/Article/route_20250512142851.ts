// pages/api/article.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// Export named functions for each HTTP method instead of a default export
export async function POST(request: NextRequest) {
  try {
    // Log for debugging
    console.log('POST request received at app/api/article');
    
    const data = await request.json();
    console.log('Request data received:', typeof data);
    
    // Simple success response for testing
    return NextResponse.json({ 
      success: true, 
      message: 'Article received successfully', 
      id: 'test-id-123' 
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request', error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'GET endpoint is working' });
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     try {
//       // Destructure the incoming request body
//       const {
//         id,
//         title,
//         overview,
//         description,
//         howToTake,
//         benefits,
//         overallRating,
//         ingredientsRating,
//         valueRating,
//         manufacturerRating,
//         safetyRating,
//         brandHighlights,
//         keyIngredients,
//         pros,
//         cons,
//         safety,
//         effectiveness,
//         pricing,
//         manufacturerInfo,
//         howItWorks,
//         ingredients,
//         faqs,
//         customerReviews,
//         conclusion,
//         officialWebsite,
//         productImage,
//         ctaButtons,
//       } = req.body;

//       // Check if we're updating an existing article or creating a new one
//       let article;
      
//       if (id) {
//         // Update existing article
//         article = await prisma.article.update({
//           where: { id },
//           data: {
//             title,
//             overview,
//             description,
//             howToTake,
//             benefits,
//             overallRating,
//             ingredientsRating,
//             valueRating,
//             manufacturerRating,
//             safetyRating,
//             brandHighlights,
//             keyIngredients,
//             pros,
//             cons,
//             safety,
//             effectiveness,
//             pricing,
//             manufacturerInfo,
//             howItWorks,
//             ingredients,
//             faqs,
//             customerReviews,
//             conclusion,
//             officialWebsite,
//             productImage,
//             ctaButtons,
//           },
//         });
//       } else {
//         // Create a new article
//         article = await prisma.article.create({
//           data: {
//             title,
//             overview,
//             description,
//             howToTake,
//             benefits,
//             overallRating,
//             ingredientsRating,
//             valueRating,
//             manufacturerRating,
//             safetyRating,
//             brandHighlights,
//             keyIngredients,
//             pros,
//             cons,
//             safety,
//             effectiveness,
//             pricing,
//             manufacturerInfo,
//             howItWorks,
//             ingredients,
//             faqs,
//             customerReviews,
//             conclusion,
//             officialWebsite,
//             productImage,
//             ctaButtons,
//           },
//         });
//       }

//       // Return the article
//       res.status(201).json(article);
//     } catch (error) {
//       console.error("Error saving article:", error);
//       res.status(500).json({ message: "Error saving article", error });
//     }
//   } else if (req.method === "GET") {
//     // Handle GET request if needed (e.g., fetching a specific article)
//     try {
//       const { id } = req.query;
      
//       if (id) {
//         const article = await prisma.article.findUnique({
//           where: { id: String(id) },
//         });
        
//         if (!article) {
//           return res.status(404).json({ message: "Article not found" });
//         }
        
//         return res.status(200).json(article);
//       } else {
//         // Return all articles if no ID is provided
//         const articles = await prisma.article.findMany();
//         return res.status(200).json(articles);
//       }
//     } catch (error) {
//       console.error("Error fetching article:", error);
//       res.status(500).json({ message: "Error fetching article", error });
//     }
//   } else {
//     res.setHeader("Allow", ["GET", "POST"]);
//     res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }
// }