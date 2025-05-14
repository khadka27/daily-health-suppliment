import ArticleListing from "@/Components/ArticleListing";
import { Suspense } from "react";

export default function ArticleListingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={<div className="p-8 text-center">Loading articles...</div>}
      >
        <ArticleListing />
      </Suspense>
    </div>
  );
}
