"use client"
import ArticleListing from '@/Components/ArticleListing'
import React, { Suspense } from 'react'

export default function ArticleListingPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading articles...</div>}>
      <ArticleListing/>
      </Suspense>
    </div>
  )
}
