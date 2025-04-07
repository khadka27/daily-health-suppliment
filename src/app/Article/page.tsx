import ReviewHeader from "@/Components/ReviewHeader";


export default function Article() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">HealthReviews</span>
            </div>
            <div>
              <button className="p-2 rounded-full bg-black text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReviewHeader/>

      <main className="py-6">
        

        {/* Review content would go here */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="prose max-w-none">
            <p>Full review content would go here...</p>
          </div>
        </div>
      </main>
    </div>
  )
}

