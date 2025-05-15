<<<<<<< HEAD
"use client"
import ArticleListing from '@/Components/ArticleListing'
import React, { Suspense } from 'react'

export default function ArticleListingPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading articles...</div>}>
      <ArticleListing/>
=======
import ArticleListing from "@/Components/ArticleListing";
import { Suspense } from "react";

export default function ArticleListingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={<div className="p-8 text-center">Loading articles...</div>}
      >
        <ArticleListing />
>>>>>>> 9524fced3873d626b046fcff0cfcac2ebfa11c45
      </Suspense>
    </div>
  );
}
