// src/app/api/article/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log('Received article data');
    
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
        ? customerReviews.map(review => ({
            ...review,
            rating: typeof review.rating === 'string' 
              ? parseFloat(review.rating) || 0 
              : review.rating
          }))
        : customerReviews,
      conclusion,
      officialWebsite,
      productImage,
      ctaButtons,
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
      message: 'Article saved successfully',
      id: article.id
    });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error saving article', 
        error: String(error) 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (id) {
      // Get a specific article by ID
      const article = await prisma.article.findUnique({
        where: { id },
      });
      
      if (!article) {
        return NextResponse.json(
          { success: false, message: 'Article not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, article });
    } else {
      // Get all articles
      const articles = await prisma.article.findMany({
        orderBy: { updatedAt: 'desc' },
      });
      
      return NextResponse.json({ success: true, articles });
    }
  } catch (error) {
    console.error('Error fetching article(s):', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching article(s)', error: String(error) },
      { status: 500 }
    );
  }
}