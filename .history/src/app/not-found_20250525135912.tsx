import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
      <p className="text-gray-600 mb-6">The article you&apos;re looking for doesn't exist or has been removed.</p>
      <Link
        href="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        Return to Home
      </Link>
    </div>
  )
}
