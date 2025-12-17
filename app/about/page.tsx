export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About AI Movie Rec
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </div>

        <div className="prose prose-lg max-w-none space-y-8">
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is AI Movie Rec?</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>AI Movie Rec</strong> is a modern movie discovery platform that helps users find movies similar to what they already enjoy.
              Using intelligent similarity-based techniques, the platform analyzes movie features to deliver relevant and meaningful recommendations.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our goal is to make movie discovery simple, enjoyable, and personalized—without unnecessary complexity.
            </p>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why AI Movie Rec?</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Discover similar movies instantly</strong> based on content signals.</li>
              <li><strong>Explore movies across multiple industries</strong> (Hollywood, Bollywood, Lollywood).</li>
              <li><strong>Easy-to-use and intuitive interface</strong> designed for speed.</li>
              <li><strong>Fast and accurate recommendations</strong> tailored to your search.</li>
            </ul>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              To become a trusted platform for discovering movies from different cultures and industries,
              powered by intelligent recommendation systems.
            </p>
          </section>

          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Created by Nasrullah Qasim</h2>
            <p className="leading-relaxed">
              AI Movie Rec is built with modern web technologies and AI-inspired logic to make movie discovery fast and enjoyable.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

