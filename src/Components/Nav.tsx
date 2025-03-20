"use client"
import Image from "next/image"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, Search, X } from "lucide-react"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Create refs with proper typing
  const searchRef = useRef<HTMLDivElement | null>(null)
  const searchBarRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // Close search when clicked outside (as a fallback)
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Focus the search input when opened
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchOpen])

  return (
    <div>
      <nav className="flex items-center justify-between p-2 shadow-md bg-white">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Image src="/dailySupplementLogo.png" alt="Logo" width={320} height={52} className="h-20 w-80 ml-8" />
        </div>

        <div className="flex items-center space-x-6 text-m">
          <a href="#" className="text-lg hover:text-green-500 hover:text-xl transition-all duration-200">
            Home
          </a>

          <div className="relative group">
            <button className="flex items-center space-x-1 hover:text-green-500 py-2 text-base hover:text-lg transition-all duration-200">
              <span>REVIEWS</span> <ChevronDown size={16} />
            </button>
            <div className="absolute left-0 top-full pt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-white border border-black shadow-md rounded-md overflow-hidden">
                <a
                  href="#"
                  className="block p-3 hover:bg-gray-100 hover:text-green-500 hover:text-lg transition-all duration-200"
                >
                  Review 1
                </a>
                <a
                  href="#"
                  className="block p-3 hover:bg-gray-100 hover:text-green-500 hover:text-lg transition-all duration-200"
                >
                  Review 2
                </a>
                <a
                  href="#"
                  className="block p-3 hover:bg-gray-100 hover:text-green-500 hover:text-lg transition-all duration-200"
                >
                  Review 3
                </a>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center space-x-1 hover:text-green-500 py-2 text-base hover:text-lg transition-all duration-200">
              <span>MEN'S AND WOMEN'S HEALTH</span> <ChevronDown size={18} />
            </button>
            <div className="absolute left-0 top-full pt-1 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-white border border-black shadow-md rounded-md overflow-hidden">
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Male Enhancement
                </a>
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Female Enhancement
                </a>
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Sexual Health
                </a>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center space-x-1 hover:text-green-500 py-2 text-base hover:text-lg transition-all duration-200">
              <span>General Health</span> <ChevronDown size={16} />
            </button>
            <div className="absolute left-0 top-full pt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-white border border-black shadow-md rounded-md overflow-hidden">
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Bladder Control
                </a>
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Body Building
                </a>
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Immune Support
                </a>
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Weight Management
                </a>
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center space-x-1 hover:text-green-500 py-2 text-base hover:text-lg transition-all duration-200">
              <span>Beauty & Skin Care</span> <ChevronDown size={16} />
            </button>
            <div className="absolute left-0 top-full pt-1 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div className="bg-white border border-black shadow-md rounded-md overflow-hidden">
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Acne
                </a>
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Eye Cream
                </a>
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Anti-Aging
                </a>
                <a href="#" className="block p-3 hover:text-green-500 hover:text-lg transition-all duration-200">
                  Moisturizers
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mr-10 relative">
          <button className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 text-lg hover:text-xl transition-all duration-200">
            Subscribe
          </button>
          <div className="relative cursor-pointer" ref={searchRef}>
            <Search
              size={24}
              className="cursor-pointer text-gray-500 hover:text-green-500 transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />
          </div>
        </div>
      </nav>

      {/* Search bar below navbar with reduced width */}
      {isSearchOpen && (
        <div
          ref={searchBarRef}
          className="w-6xl h-20 bg-white border-t border-b border-gray-200 shadow-md transition-all duration-300 py-4 flex justify-center"
          onMouseLeave={() => setIsSearchOpen(false)}
        >
          <div className="max-w-4xl h-15 w-full px-4 flex items-center">
            <div className="relative flex-1">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for health topics, products, or reviews..."
                className="w-full h-10 p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              />
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="ml-2 p-3 text-gray-500 hover:text-gray-700" onClick={() => setIsSearchOpen(false)}>
              <X size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

