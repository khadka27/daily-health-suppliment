export default function Featured() {
    return (
        <section className="py-12 px-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          
          <h2 className="text-4xl font-semibold text-blue-500 text-center flex-grow font-Poppins">FEATURED ON</h2>
  
          <div className="flex flex-wrap justify-center mt-12 ml-14 gap-16 items-center">
            {/* Fox News */}
            <div className="flex flex-col items-center">
              <img
                src="fox-logo.png"  // Update this with the correct image path
                alt="Fox News"
                className="w-40 h-24 object-contain text-gray-700 bg-transparent"  // Adjust the size for proper alignment
              />
              <span className="text-lg font-semibold mt-4 text-gray-600">Fox News</span>
            </div>
  
            {/* BBC News */}
            <div className="flex flex-col items-center">
              <img
                src="fox-logo.png"  // Update this with the correct image path
                alt="BBC NEWS"
                className="w-40 h-24 object-contain text-gray-700 bg-transparent"  // Adjust the size for proper alignment
              />
              <span className="text-lg font-semibold mt-4 text-gray-600">BBC NEWS</span>
            </div>
  
            {/* CNN */}
            <div className="flex flex-col items-center">
              <img
                src="fox-logo.png"  // Update this with the correct image path
                alt="CNN"
                className="w-40 h-24 object-contain text-gray-700"  // Adjust the size for proper alignment
              />
              <span className="text-lg font-semibold mt-4 text-gray-600">CNN</span>
            </div>
  
            {/* NBC */}
            <div className="flex flex-col items-center">
              <img
                src="fox-logo.png"  // Update this with the correct image path
                alt="NBC"
                className="w-40 h-24 object-contain text-gray-700"  // Adjust the size for proper alignment
              />
              <span className="text-lg font-semibold mt-4 text-gray-600">NBC</span>
            </div>
  
            {/* Bloomberg */}
            <div className="flex flex-col items-center">
              <img
                src="fox-logo.png"  // Update this with the correct image path
                alt="BLOOMBERG"
                className="w-40 h-24 object-contain text-gray-700"  // Adjust the size for proper alignment
              />
              <span className="text-lg font-semibold mt-4 text-gray-600">BLOOMBERG</span>
            </div>
            
          </div>
        </div>
      </section>
    )
  }
  