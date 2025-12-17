export default function Credits() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Credits & Copyright
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto"></div>
        </div>

        <div className="space-y-8">
          {/* Copyright Section */}
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Copyright Notice</h2>
            <p className="text-lg text-gray-800 mb-4">
              © 2025 <strong>Nasrullah Qasim</strong>. All Rights Reserved.
            </p>
            <p className="text-gray-700">
              This AI Movie Recommendation System and its source code are the intellectual property 
              of Nasrullah Qasim. All rights to the design, implementation, and functionality of 
              this application are reserved.
            </p>
          </section>

          {/* Dataset Section */}
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dataset Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              This dataset of <strong>15,000 movies</strong> is for <strong>educational use only</strong>. 
              The dataset includes movies from Hollywood, Bollywood, and Lollywood industries and is 
              included for AI experimentation and learning purposes.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
              <p className="text-yellow-800">
                <strong>Important:</strong> No copyright infringement is intended. All movie titles, 
                descriptions, and related information in this dataset are used solely for educational 
                and demonstration purposes. This project does not claim ownership of any movie titles 
                or intellectual property belonging to film studios or production companies.
              </p>
            </div>
          </section>

          {/* Developer Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Developed by Nasrullah Qasim</h2>
            <p className="leading-relaxed mb-4">
              This AI Movie Recommendation System was conceptualized, designed, and developed by 
              <strong> Nasrullah Qasim</strong>. The project showcases expertise in:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Machine Learning and AI algorithms</li>
              <li>Web application development</li>
              <li>Content-based filtering systems</li>
              <li>Full-stack development with Next.js and TypeScript</li>
              <li>UI/UX design with modern frameworks</li>
            </ul>
          </section>

          {/* Technologies Used */}
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technologies & Libraries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Frontend</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Next.js 14 (App Router)</li>
                  <li>React 18</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Backend & AI</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Next.js API Routes</li>
                  <li>TF-IDF Vectorization</li>
                  <li>Cosine Similarity</li>
                  <li>Content-Based Filtering</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Educational Purpose */}
          <section className="bg-white p-8 rounded-lg shadow-md border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Purpose</h2>
            <p className="text-gray-700 leading-relaxed">
              This project is designed and developed for <strong>educational and learning purposes</strong>. 
              It serves as a demonstration of how AI and machine learning can be applied to create 
              practical recommendation systems. Students, developers, and enthusiasts are welcome to 
              explore the codebase and learn from the implementation.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Disclaimer</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              This application is provided "as is" without warranty of any kind. The dataset and 
              recommendations are for educational purposes only. The developer, Nasrullah Qasim, 
              does not guarantee the accuracy of movie recommendations or the completeness of the 
              dataset. Users should verify any information independently.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

