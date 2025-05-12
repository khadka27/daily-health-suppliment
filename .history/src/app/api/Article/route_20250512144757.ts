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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    const skip = (page - 1) * limit;

    // Build where clause based on search parameters
    let whereClause: any = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { overview: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get count for pagination
    const totalCount = await prisma.article.count({
      where: whereClause
    });

    // Get articles with pagination
    const articles = await prisma.article.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        overview: true,
        description: true,
        productImage: true,
        createdAt: true,
        updatedAt: true,
        // Add any other fields you want to include in the listing
      }
    });

    // Format the response to match your frontend expectations
    const formattedArticles = articles.map(article => {
      // Generate a slug from the title
      const slug = article.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      return {
        id: article.id,
        title: article.title,
        slug,
        category: "Supplement Reviews", // You might want to add a category field to your schema
        categorySlug: "supplement-reviews",
        description: article.overview || article.description.substring(0, 200) + "...",
        image: article.productImage || "/placeholder.svg?height=200&width=200",
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      articles: formattedArticles,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching articles', error: String(error) },
      { status: 500 }
    );
  }
}