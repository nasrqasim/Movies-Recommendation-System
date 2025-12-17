export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Search a Movie (or Keyword)",
      description: "Enter the title of a movie you like — or a keyword like love, fight, romance, or history.",
      icon: "🔍"
    },
    {
      number: 2,
      title: "Analyze Movie Data",
      description: "The system processes movie attributes such as genre, keywords, and descriptions to understand what you’re looking for.",
      icon: "🧠"
    },
    {
      number: 3,
      title: "Find Similarities",
      description: "AI logic compares movies and identifies similarities across themes, genres, and story signals.",
      icon: "📊"
    },
    {
      number: 4,
      title: "Generate Recommendations",
      description: "A list of relevant movies is generated based on your search. You can also filter by industry (Hollywood/Bollywood/Lollywood).",
      icon: "🎬"
    },
    {
      number: 5,
      title: "Watch or Explore",
      description: "Open external links for details or search availability on third‑party platforms. (Availability depends on those platforms.)",
      icon: "🍿"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h1>
          <p className="text-xl text-gray-600">
            Simple. Fast. Intelligent.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4"></div>
        </div>

        {/* Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-2xl font-bold">
                      {step.icon}
                    </div>
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                        Step {step.number}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-blue-600 to-purple-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Details</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Content-Based Filtering</h3>
              <p className="text-gray-700">
                AI Movie Rec analyzes the content of movies (genres, overviews, keywords) rather than relying on user tracking.
                This keeps recommendations transparent and explainable.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">TF-IDF Vectorization</h3>
              <p className="text-gray-700">
                We use TF‑IDF to convert text into vectors so we can compare movies by the words and themes that matter.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Cosine Similarity</h3>
              <p className="text-gray-700">
                Cosine similarity helps us measure how close two movies are in “meaning space” based on their content vectors.
              </p>
            </div>
          </div>
        </div>

        {/* Why This Approach */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4">Why This Approach?</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>No deep learning required - simple and efficient</li>
            <li>Works immediately without user interaction history</li>
            <li>Transparent and explainable recommendations</li>
            <li>Perfect for educational purposes</li>
            <li>Fast and scalable for large datasets</li>
          </ul>
          <p className="mt-6 text-blue-100">
            This simple yet powerful content-based filtering approach demonstrates how AI can enhance 
            user experience in media discovery without complex neural networks.
          </p>
        </div>
      </div>
    </div>
  )
}

