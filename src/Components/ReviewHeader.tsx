import Link from "next/link";
import Image from "next/image";
import {
  InfoIcon as InfoCircle,
  Star,
  Edit,
  FileText,
  HelpCircle,
} from "lucide-react";

export default function ReviewHeader() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Advertising Disclosure */}
      <div className="py-4">
        <div className="flex items-center text-orange-500">
          <span className="font-medium">Advertising Disclosure</span>
          <InfoCircle className="ml-1 h-4 w-4" />
        </div>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 py-4">
        <Link href="/" className="text-gray-900 hover:underline">
          Home
        </Link>
        <span className="text-gray-500">&gt;</span>
        <Link href="/reviews" className="text-gray-900 hover:underline">
          Reviews
        </Link>
        <span className="text-gray-500">&gt;</span>
        <Link
          href="/reviews/male-enhancement"
          className="text-gray-900 hover:underline"
        >
          Male Enhancement Reviews
        </Link>
      </nav>

      {/* Review Title */}
      <div className="py-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Maverick Male Enhancement Review: Does It Maximize Stamina?
        </h1>
      </div>

      {/* Product Description */}
      <div className="py-4">
        <p className="text-lg text-gray-700">
          Maverick is a male enhancement supplement designed to promote stronger
          erections, enhance libido, and increase penis size with cutting-edge
          VI-PEX technology.
        </p>
      </div>

      {/* Author Info and Review Stats */}
      <div className="mt-8 bg-sky-200 rounded-lg">
        <div className="grid md:grid-cols-2 gap-4 p-6">
          {/* Author Information */}
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt=""
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <div className="space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Written By </span>
                  <Link
                    href="/authors/consumer-health-digest"
                    className="text-blue-500 hover:underline"
                  >
                    Consumer Health Digest Staff
                  </Link>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Reviewed by </span>
                  <Link
                    href="/authors/terry-ramos"
                    className="text-blue-500 hover:underline"
                  >
                    Terry Ramos, CPT
                  </Link>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Updated: </span>
                  <span>2025, Mar 19</span>
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center text-blue-500">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full mr-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm">Medically Cited</span>
                </div>
                <div className="flex items-center text-blue-500">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full mr-1">
                    <span className="text-xs">✓</span>
                  </div>
                  <span className="text-sm">Fact Checked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Review Actions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
              <div className="flex flex-col items-center">
                <div className="flex items-center text-orange-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-2 text-lg font-medium">0 Reviews</span>
                </div>
                <div className="text-gray-700">1 out of 5</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
              <div className="flex items-center text-orange-500">
                <FileText className="h-5 w-5" />
                <span className="ml-2 font-medium">Specs</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
              <div className="flex items-center text-orange-500">
                <HelpCircle className="h-5 w-5" />
                <span className="ml-2 font-medium">Ask a Question</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
              <div className="flex items-center text-orange-500">
                <Edit className="h-5 w-5" />
                <span className="ml-2 font-medium">Write a Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
