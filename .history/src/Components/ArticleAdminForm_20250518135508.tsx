/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Save, X } from 'lucide-react';
import CTASection from "./CtaSection";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchArticles, 
  fetchArticleById, 
  saveArticle, 
  updateCurrentArticle, 
  resetArticleState 
} from "@/store/articleSlice";
import type { Article } from "@/store/articleSlice";

export default function ArticleAdminForm({ articleId }: { articleId?: string }) {
  const [activeTab, setActiveTab] = useState("basic");
  
  const dispatch = useAppDispatch();
  const { currentArticle, status, error } = useAppSelector((state) => state.articles);
  
  // Initialize form data from Redux state or with default values
  const [formData, setFormData] = useState<Article>(
    currentArticle || {
      id: "",
      title: "",
      overview: "",
      description: "",
      howToTake: "",
      benefits: [{ title: "", description: "" }],
      overallRating: 0,
      ingredientsRating: 0,
      valueRating: 0,
      manufacturerRating: 0,
      safetyRating: 0,
      brandHighlights: [""],
      keyIngredients: [""],
      pros: [""],
      cons: [""],
      safety: "",
      effectiveness: "",
      pricing: {
        singleBottle: "",
        threeBottles: "",
        sixBottles: "",
      },
      manufacturerInfo: {
        name: "",
        location: "",
        description: "",
      },
      howItWorks: "",
      ingredients: [{ name: "", description: "", benefits: "" }],
      faqs: [{ question: "", answer: "" }],
      customerReviews: [{ name: "", location: "", rating: 5, review: "" }],
      conclusion: "",
      officialWebsite: "",
      productImage: "",
      ctaButtons: [
        {
          text: "Buy Now",
          url: "",
          type: "primary",
          position: "bottom",
          description: "",
        },
      ],
    }
  );

  // Fetch article data if articleId is provided
  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
    } else {
      dispatch(resetArticleState());
    }
    
    // Cleanup function
    return () => {
      dispatch(resetArticleState());
    };
  }, [dispatch, articleId]);

  // Update local form state when Redux state changes
  useEffect(() => {
    if (currentArticle) {
      setFormData(currentArticle);
    }
  }, [currentArticle]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Detect if this field should be treated as a number
    const isNumberField =
      name.includes("Rating") ||
      (name.includes(".") && name.split(".")[1].includes("rating"));

    // Set the appropriate value based on field type
    const processedValue = isNumberField ? parseFloat(value) || 0 : value;

    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      const updatedFormData = {
        ...formData,
        [parent]: {
          ...(formData[parent as keyof Article] as Record<string, any>),
          [child]: processedValue,
        },
      };
      
      setFormData(updatedFormData);
      dispatch(updateCurrentArticle(updatedFormData));
    } else {
      const updatedFormData = {
        ...formData,
        [name]: processedValue,
      };
      
      setFormData(updatedFormData);
      dispatch(updateCurrentArticle(updatedFormData));
    }
  };

  // Handle array field changes
  const handleArrayChange = (
    index: number,
    field: keyof Article,
    value: string
  ) => {
    const updatedArray = [...(formData[field] as string[])];
    updatedArray[index] = value;
    
    const updatedFormData = {
      ...formData,
      [field]: updatedArray,
    };
    
    setFormData(updatedFormData);
    dispatch(updateCurrentArticle(updatedFormData));
  };

  // Handle object array changes
  const handleObjectArrayChange = (
    index: number,
    field: keyof Article,
    property: string,
    value: string | number
  ) => {
    // Process rating values from string to number if needed
    const processedValue =
      typeof value === "string" && property.includes("rating")
        ? parseFloat(value) || 0
        : value;

    const updatedArray = [...(formData[field] as any[])];
    updatedArray[index] = {
      ...updatedArray[index],
      [property]: processedValue,
    };
    
    const updatedFormData = {
      ...formData,
      [field]: updatedArray,
    };
    
    setFormData(updatedFormData);
    dispatch(updateCurrentArticle(updatedFormData));
  };

  // Add item to array
  const addArrayItem = (field: keyof Article, template: any) => {
    const updatedArray = [...(formData[field] as any[])];
    updatedArray.push(template);
    
    const updatedFormData = {
      ...formData,
      [field]: updatedArray,
    };
    
    setFormData(updatedFormData);
    dispatch(updateCurrentArticle(updatedFormData));
  };

  // Remove item from array
  const removeArrayItem = (field: keyof Article, index: number) => {
    const updatedArray = [...(formData[field] as any[])];
    updatedArray.splice(index, 1);
    
    const updatedFormData = {
      ...formData,
      [field]: updatedArray,
    };
    
    setFormData(updatedFormData);
    dispatch(updateCurrentArticle(updatedFormData));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(saveArticle(formData));
  };

  const isLoading = status === 'loading';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Article Content Management</h2>
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          )}
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tabs */}
            <div className="w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-6 border-b">
                {[
                  "basic",
                  "benefits",
                  "ratings",
                  "highlights",
                  "ingredients",
                  "details",
                  "faqs",
                  "reviews",
                  "cta",
                ].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-4 text-center capitalize ${
                      activeTab === tab
                        ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Basic Info Tab */}
              <div
                className={`space-y-4 ${activeTab !== "basic" ? "hidden" : ""}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Product Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Rest of the basic tab fields... */}
                {/* (Keep your existing form fields, just update the handlers) */}
              </div>

              {/* Other tabs... */}
              {/* (Keep your existing tabs and form fields) */}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  dispatch(resetArticleState());
                  setFormData({
                    id: "",
                    title: "",
                    overview: "",
                    description: "",
                    // Reset all other fields...
                    // (Include all the default values from your original form)
                  } as Article);
                }}
                disabled={isLoading}
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}