"use client"

import { useState } from "react"

export default function LatestReview() {
  // State to track the current slide position
  const [slidePosition, setSlidePosition] = useState(0)

  // Array of review data
  const reviews = [
    { title: "Essential Oils : What To Know About Essential Oils?" },
    { title: "Dietitian-Approved Foods To Boost Testosterone Naturally" },
    { title: "Best Low-Carb Vegetables, Recommended By Dietitians" },
    { title: "List Of Low-Calorie Foods – Nutritious Way For Healthy Diet" },
    { title: "10 Superfoods For Better Health" },
    { title: "Healthy Breakfast Ideas For Weight Loss" },
  ]

  // Function to slide left
  const slideLeft = () => {
    if (slidePosition > 0) {
      setSlidePosition(slidePosition - 1)
    }
  }

  // Function to slide right
  const slideRight = () => {
    if (slidePosition < reviews.length - 2) {
      // -2 because we show 2 full items in the middle
      setSlidePosition(slidePosition + 1)
    }
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-2">
          <h2 className="text-4xl font-semibold  text-blue-500">Latest Review</h2>
          <a href="#" className="text-red-600 font-bold flex items-center hover:underline">
            VIEW ALL
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                marginLeft: "-14.5%", // Show 1/4 of the first card
                width: "125%", // Extra width to accommodate partial views
                transform: `translateX(-${slidePosition * 40}%)`, // 40% because each card is 40% of the visible area
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="w-2/5 px-4" // 40% width for each card
                >
                  <div className="bg-white w-96 rounded-lg overflow-hidden shadow-xl mx-auto">
                    <div className="h-72 bg-gray-200"></div>
                    <div className="p-8">
                      <h2 className="font-semibold text-m text-center">{review.title}</h2>
                      <p className="text-gray-600 mt-4 text-center text-lg"></p>
                      <div className="mt-6 flex justify-center"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left Arrow - Positioned relative to the image section */}
          <button
            className={`absolute left-0 top-[36px] bg-white rounded-full p-3 shadow-md z-10 ${
              slidePosition === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
            style={{ top: "calc(36px + 36px)" }} // Position in the middle of the image section
            onClick={slideLeft}
            disabled={slidePosition === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow - Positioned relative to the image section */}
          <button
            className={`absolute right-0 top-[36px] bg-white rounded-full p-3 shadow-md z-10 ${
              slidePosition >= reviews.length - 2 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
            style={{ top: "calc(36px + 36px)" }} // Position in the middle of the image section
            onClick={slideRight}
            disabled={slidePosition >= reviews.length - 2}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

