/* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     try {
//       // Destructure the incoming request body
//       const {
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

//       // Create a new article in the database
//       const newArticle = await prisma.article.create({
//         data: {
//           title,
//           overview,
//           description,
//           howToTake,
//           benefits,
//           overallRating,
//           ingredientsRating,
//           valueRating,
//           manufacturerRating,
//           safetyRating,
//           brandHighlights,
//           keyIngredients,
//           pros,
//           cons,
//           safety,
//           effectiveness,
//           pricing,
//           manufacturerInfo,
//           howItWorks,
//           ingredients,
//           faqs,
//           customerReviews,
//           conclusion,
//           officialWebsite,
//           productImage,
//           ctaButtons,
//         },
//       });

//       // Return the new article
//       res.status(201).json(newArticle);
//     } catch (error) {
//       console.error("Error creating article:", error);
//       res.status(500).json({ message: "Error creating article", error });
//     }
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }


// src/app/api/article/route.ts
import { NextRequest, NextResponse } from 'next/server';

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