'use client';

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Save, X } from 'lucide-react';
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { 
  fetchArticleById, 
  saveArticle, 
  updateCurrentArticle, 
  resetArticleState,
  type Article
} from "@/store/articleSlice";

interface ArticleAdminFormProps {
  articleId?: string;
}

// Define default values for all array properties
const defaultFormData: Article = {
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
  customerReviews: [
    { name: "", location: "", rating: 5, review: "" },
  ],
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
};

export default function ArticleAdminForm({ articleId }: ArticleAdminFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const dispatch = useAppDispatch();
  const { currentArticle, status, error } = useAppSelector((state) => state.articles);
  
  // Initialize form data with default values
  const [formData, setFormData] = useState<Article>(defaultFormData);

  // Fetch article data if articleId is provided
  useEffect(() => {
    if (articleId && articleId !== 'new') {
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
      // Ensure all array properties exist by merging with default values
      setFormData({
        ...defaultFormData,
        ...currentArticle,
        // Ensure these arrays are never undefined
        benefits: currentArticle.benefits || defaultFormData.benefits,
        brandHighlights: currentArticle.brandHighlights || defaultFormData.brandHighlights,
        keyIngredients: currentArticle.keyIngredients || defaultFormData.keyIngredients,
        pros: currentArticle.pros || defaultFormData.pros,
        cons: currentArticle.cons || defaultFormData.cons,
        ingredients: currentArticle.ingredients || defaultFormData.ingredients,
        faqs: currentArticle.faqs || defaultFormData.faqs,
        customerReviews: currentArticle.customerReviews || defaultFormData.customerReviews,
        ctaButtons: currentArticle.ctaButtons || defaultFormData.ctaButtons,
      });
    }
  }, [currentArticle]);

  // Validate the form before submission
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Basic validation for required fields
    if (!formData.title) errors.title = "Title is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.overview) errors.overview = "Overview is required";
    
    // Add more validation as needed
    
    setValidationErrors(errors);
    
    // If there are errors, switch to the tab with the first error
    if (Object.keys(errors).length > 0) {
      // Find which tab contains the first error
      if (errors.title || errors.overview || errors.description) {
        setActiveTab("basic");
      } else if (errors.benefits) {
        setActiveTab("benefits");
      }
      // Add more tab switching logic as needed
      
      return false;
    }
    
    return true;
  };

  // Helper function to render validation errors
  const renderError = (field: string) => {
    if (validationErrors[field]) {
      return <p className="text-red-500 text-sm mt-1">{validationErrors[field]}</p>;
    }
    return null;
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      dispatch(updateCurrentArticle({ [name]: processedValue }));
    }
  };

  // Handle array field changes
  const handleArrayChange = (
    index: number,
    field: keyof Article,
    value: string
  ) => {
    // Ensure the array exists
    const array = formData[field] as string[] || [];
    const updatedArray = [...array];
    updatedArray[index] = value;
    
    const updatedFormData = {
      ...formData,
      [field]: updatedArray,
    };
    
    setFormData(updatedFormData);
    dispatch(updateCurrentArticle({ [field]: updatedArray }));
  };

  // Handle object array changes
  const handleObjectArrayChange = (
    index: number,
    field: keyof Article,
    property: string,
    value: string | number
  ) => {
    // Ensure the array exists
    const array = formData[field] as any[] || [];
    
    // Process rating values from string to number if needed
    const processedValue =
      typeof value === "string" && property.includes("rating")
        ? parseFloat(value) || 0
        : value;

    const updatedArray = [...array];
    updatedArray[index] = {
      ...updatedArray[index],
      [property]: processedValue,
    };
    
    const updatedFormData = {
      ...formData,
      [field]: updatedArray,
    };
    
    setFormData(updatedFormData);
    dispatch(updateCurrentArticle({ [field]: updatedArray }));
  };

  // Add item to array
  const addArrayItem = (field: keyof Article, template: any) => {
    // Ensure the array exists
    const array = formData[field] as any[] || [];
    const updatedArray = [...array, template];
    
    const updatedFormData = {
      ...formData,
      [field]: updatedArray,
    };
    
    setFormData(updatedFormData);
    dispatch(updateCurrentArticle({ [field]: updatedArray }));
  };

  // Remove item from array
  const removeArrayItem = (field: keyof Article, index: number) => {
    // Ensure the array exists
    const array = formData[field] as any[] || [];
    const updatedArray = [...array];
    updatedArray.splice(index, 1);
    
    const updatedFormData = {
      ...formData,
      [field]: updatedArray,
    };
    
    setFormData(updatedFormData);
    dispatch(updateCurrentArticle({ [field]: updatedArray }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Remove fields that don't exist in your Prisma schema
    // For example, if slug and content don't exist:
    const { slug, content, ...dataToSubmit } = formData;
    
    dispatch(saveArticle(dataToSubmit));
  };

  const isLoading = status === 'loading';

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">
            {articleId && articleId !== 'new' ? 'Edit Article' : 'Create New Article'}
          </h2>
          {error && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          )}
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Product Title"
                      className={`w-full px-3 py-2 border ${
                        validationErrors.title ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {renderError("title")}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="overview"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Overview
                  </label>
                  <textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    placeholder="Brief overview of the product"
                    rows={3}
                    className={`w-full px-3 py-2 border ${
                      validationErrors.overview ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {renderError("overview")}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the product"
                    rows={4}
                    className={`w-full px-3 py-2 border ${
                      validationErrors.description ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {renderError("description")}
                </div>

                <div>
                  <label
                    htmlFor="howToTake"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    How To Take
                  </label>
                  <textarea
                    id="howToTake"
                    name="howToTake"
                    value={formData.howToTake}
                    onChange={handleInputChange}
                    placeholder="Instructions on how to take the product"
                    rows={3}
                    className={`w-full px-3 py-2 border ${
                      validationErrors.howToTake ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {renderError("howToTake")}
                </div>

                <div>
                  <label
                    htmlFor="productImage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Product Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG or WEBP (MAX. 2MB)
                        </p>
                      </div>
                      <input
                        id="productImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const updatedFormData = {
                                ...formData,
                                productImage: reader.result as string,
                              };
                              setFormData(updatedFormData);
                              dispatch(updateCurrentArticle({ productImage: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>{" "}
                    {formData.productImage && (
                      <div className="relative h-32 w-32">
                        <Image
                          src={formData.productImage || "/placeholder.svg"}
                          alt="Product preview"
                          width={128}
                          height={128}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          className="rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedFormData = {
                              ...formData,
                              productImage: "",
                            };
                            setFormData(updatedFormData);
                            dispatch(updateCurrentArticle({ productImage: "" }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="officialWebsite"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Official Website
                  </label>
                  <input
                    id="officialWebsite"
                    name="officialWebsite"
                    value={formData.officialWebsite}
                    onChange={handleInputChange}
                    placeholder="URL to official website"
                    className={`w-full px-3 py-2 border ${
                      validationErrors.officialWebsite ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {renderError("officialWebsite")}
                </div>
              </div>

              {/* Benefits Tab */}
              <div
                className={`space-y-4 ${
                  activeTab !== "benefits" ? "hidden" : ""
                }`}
              >
                <h3 className="text-lg font-medium">Product Benefits</h3>
                <p className="text-sm text-gray-500">
                  Add all the benefits of the product
                </p>

                {/* Add null check before mapping */}
                {Array.isArray(formData.benefits) && formData.benefits.map((benefit, index) => (
                  <div key={index} className="border p-4 rounded-md relative">
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-red-500"
                      onClick={() => removeArrayItem("benefits", index)}
                      disabled={(formData.benefits?.length || 0) <= 1}
                    >
                      <X className="h-5 w-5" />
                    </button>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label
                          htmlFor={`benefits.${index}.title`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Benefit Title
                        </label>
                        <input
                          type="text"
                          value={benefit.title}
                          onChange={(e) =>
                            handleObjectArrayChange(
                              index,
                              "benefits",
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Benefit Title"
                          className={`w-full px-3 py-2 border ${
                            validationErrors[`benefits.${index}.title`] ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {renderError(`benefits.${index}.title`)}
                      </div>

                      <div>
                        <label
                          htmlFor={`benefits.${index}.description`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Benefit Description
                        </label>
                        <textarea
                          value={benefit.description}
                          onChange={(e) =>
                            handleObjectArrayChange(
                              index,
                              "benefits",
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Benefit Description"
                          rows={2}
                          className={`w-full px-3 py-2 border ${
                            validationErrors[`benefits.${index}.description`] ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {renderError(`benefits.${index}.description`)}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() =>
                    addArrayItem("benefits", { title: "", description: "" })
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Benefit
                </button>
              </div>

              {/* Continue with the rest of your tabs, adding null checks before mapping over arrays */}
              {/* For example: */}
              
              {/* Ratings Tab */}
              <div
                className={`space-y-4 ${
                  activeTab !== "ratings" ? "hidden" : ""
                }`}
              >
                {/* Ratings content */}
              </div>
              
              {/* Highlights Tab */}
              <div
                className={`space-y-4 ${
                  activeTab !== "highlights" ? "hidden" : ""
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Brand Highlights */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Brand Highlights</h3>
                    <p className="text-sm text-gray-500">
                      Key highlights about the brand
                    </p>

                    {/* Add null check before mapping */}
                    {Array.isArray(formData.brandHighlights) && formData.brandHighlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              "brandHighlights",
                              e.target.value
                            )
                          }
                          placeholder="Brand highlight"
                          className={`flex-1 px-3 py-2 border ${
                            validationErrors[`brandHighlights.${index}`] ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() =>
                            removeArrayItem("brandHighlights", index)
                          }
                          disabled={(formData.brandHighlights?.length || 0) <= 1}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => addArrayItem("brandHighlights", "")}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Highlight
                    </button>
                  </div>

                  {/* Continue with other sections */}
                </div>
              </div>
              
              {/* Continue with other tabs */}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  dispatch(resetArticleState());
                  setFormData(defaultFormData);
                  setValidationErrors({});
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