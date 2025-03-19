"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality here
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="w-full py-2 flex flex-col items-center">
      

      {/* Search bar */}
      <div className="w-full max-w-xl mb-4">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-r-md hover:bg-green-600 transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {/* Product review count */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium text-blue-500">7,856 Product Review & Articles</h2>
      </div>

      {/* Description */}
      <div className="max-w-2xl text-center mb-6">
        <p className="text-gray-700 text-lg">
          Millions of people use Consumer Health Digest to read the best product reviews to make better decisions of
          choosing the quality health products the internet has to offer.{" "}
          <Link href="/how-we-review" className="text-blue-500 hover:underline font-medium">
            FIND OUT HOW WE REVIEW!
          </Link>
        </p>
      </div>

      {/* Community count */}
      <div className="text-center">
        <p className="text-lg">
          <span className="font-semibold">Follow Us:</span> 5,695,260 community members
        </p>
      </div>
    </div>
  )
}

