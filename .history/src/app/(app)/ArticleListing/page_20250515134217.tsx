"use client"
import ArticleListing from '@/Components/ArticleListing'
import React from 'react'

export default function ArticleListingPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading articles...</div>}></Suspense>
      <ArticleListing/>
    </div>
  )
}
