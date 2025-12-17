# AI Movie Recommendation System

**Made by: Nasrullah Qasim**

A complete, production-ready AI-based Movie Recommendation Web Application using content-based filtering. This system recommends movies from Hollywood, Bollywood, and Lollywood industries based on movie content similarity.

## 🎬 Project Overview

This AI Movie Recommendation System uses **content-based filtering** with **TF-IDF vectorization** and **cosine similarity** to recommend movies. Unlike collaborative filtering, this approach analyzes movie content (genres, descriptions, keywords) to find similar movies without requiring user interaction history.

## ✨ Features

- 🎯 **Content-Based Filtering**: Recommends movies based on content similarity
- 🌍 **Multi-Industry Support**: Movies from Hollywood, Bollywood, and Lollywood
- 🔍 **Smart Search**: Enter any movie title to get personalized recommendations
- 📊 **TF-IDF Vectorization**: Advanced text processing for accurate recommendations
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🚀 **Vercel Ready**: Optimized for deployment on Vercel

## 🛠️ Technologies Used

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**

### Backend & AI
- **Next.js API Routes**
- **TF-IDF Vectorization**
- **Cosine Similarity Algorithm**
- **CSV Data Processing**

### Dataset
- **15,000 Movies** (Hollywood, Bollywood, Lollywood)
- CSV format with comprehensive movie information

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Grok API Key** from [x.ai/api](https://x.ai/api) (optional - falls back to sample data if not provided)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-movie-recommendation-system
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Grok API key:

```
GROK_API_KEY=your_grok_api_key_here
```

**Getting a Grok API Key:**
1. Visit [https://x.ai/api](https://x.ai/api)
2. Sign up or log in to your X account
3. Navigate to API settings
4. Generate a new API key
5. Copy the key and add it to `.env.local`

**Note:** If you don't have a Grok API key, the application will use sample movie data as a fallback.

### 3. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 4. Run the Development Server

#### Option 1: Quick Start (Recommended) 🚀

**Windows Users:**
- Double-click `start.bat` file, OR
- Run in terminal: `start.bat`

**Mac/Linux Users:**
- Run in terminal: `chmod +x start.sh && ./start.sh`

**Cross-Platform (All OS):**
- Run in terminal: `npm run start:open` or `node scripts/start.js`

This will automatically:
- Start the Next.js development server
- Wait for it to be ready
- Open your default browser to http://localhost:3000

#### Option 2: Manual Start

```bash
npm run dev
```

Then manually open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option 3: Using Yarn

```bash
yarn dev
# or
node scripts/start.js --yarn
```

### 5. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
ai-movie-recommendation-system/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── recommend/           # Movie recommendation endpoint
│   │   ├── industries/          # Industry filter endpoint
│   │   └── genres/              # Genre filter endpoint
│   ├── about/                   # About page
│   ├── contact/                 # Contact page
│   ├── credits/                 # Credits page
│   ├── genres/                  # Genres page
│   ├── how-it-works/           # How it works page
│   ├── industries/              # Industries page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                  # React components
│   ├── Footer.tsx               # Footer component
│   ├── MovieCard.tsx            # Movie card component
│   └── Navigation.tsx           # Navigation component
├── dataset/                     # Movie dataset
│   └── movies_15000.csv        # 15,000 movies dataset
├── lib/                         # Utility libraries
│   └── recommendation.ts        # Recommendation algorithm
├── scripts/                     # Utility scripts
│   └── generate_dataset.py     # Dataset generation script
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.js          # Tailwind CSS config
└── README.md                    # This file
```

## 🎯 How It Works

### 1. Dynamic Movie Data Fetching

The system fetches movie data dynamically from the Grok API:

- **API Integration**: Uses Grok's chat completion API to retrieve movie information
- **Fallback System**: If API is unavailable or unconfigured, uses sample movie data
- **Caching**: Caches fetched movies for 1 hour to optimize performance
- **Real-time Search**: Searches Grok API for movies not found in cache

### 2. Content-Based Filtering

The system uses content-based filtering, which means it analyzes the actual content of movies rather than user preferences:

- **Feature Extraction**: Combines movie title, genre, and overview into a single text
- **Vectorization**: Converts text into numerical vectors using TF-IDF
- **Similarity Calculation**: Measures similarity between movies using cosine similarity
- **Recommendation**: Returns top 10 most similar movies

### 3. TF-IDF Vectorization

TF-IDF (Term Frequency-Inverse Document Frequency) converts text into numerical vectors:

- **Term Frequency (TF)**: How often a word appears in a document
- **Inverse Document Frequency (IDF)**: How rare a word is across all documents
- **TF-IDF Score**: Combines both to identify important words

### 4. Cosine Similarity

Cosine similarity measures the angle between two vectors:

- Movies with similar content have vectors pointing in similar directions
- Higher similarity scores indicate more similar movies
- Efficient for high-dimensional text data

## 📄 API Endpoints

### GET /api/recommend

Get movie recommendations based on a movie title.

**Query Parameters:**
- `title` (required): Movie title to get recommendations for
- `num` (optional): Number of recommendations (default: 10, max: 50)

**Example:**
```
GET /api/recommend?title=Inception&num=10
```

**Response:**
```json
{
  "success": true,
  "input_movie": "Inception",
  "recommendations": [
    {
      "movie_id": 123,
      "title": "Similar Movie",
      "industry": "Hollywood",
      "genre": "Action Sci-Fi",
      "language": "English",
      "release_year": 2010,
      "overview": "Movie description...",
      "similarity_score": 0.8523
    }
  ],
  "count": 10
}
```

### GET /api/industries

Get movies filtered by industry.

**Query Parameters:**
- `industry` (required): Industry name (Hollywood, Bollywood, or Lollywood)

**Example:**
```
GET /api/industries?industry=Hollywood
```

### GET /api/genres

Get movies filtered by genre.

**Query Parameters:**
- `genre` (required): Genre name (Action, Romance, Drama, etc.)

**Example:**
```
GET /api/genres?genre=Action
```

## 🌐 Pages

### Home Page (/)
- Hero section with search functionality
- Movie recommendation results
- Featured industries section

### About Page (/about)
- Project overview
- How AI is used
- Educational purpose

### How It Works (/how-it-works)
- Step-by-step explanation of the recommendation process
- Technical details about TF-IDF and cosine similarity

### Industries Page (/industries)
- Filter movies by industry (Hollywood, Bollywood, Lollywood)
- Browse movies from each industry

### Genres Page (/genres)
- Filter movies by genre
- Explore movies across all industries by genre

### Contact Page (/contact)
- Contact form
- Social media links

### Credits Page (/credits)
- Copyright information
- Developer credits
- Dataset information

## 🚀 Deployment on Vercel

### Method 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and your app will be deployed!

### Method 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and deploy

### Important Notes for Vercel Deployment

1. **Environment Variables**: Add your Grok API key in Vercel's environment variables:
   - Go to your project settings → Environment Variables
   - Add `GROK_API_KEY` with your API key value
   - Redeploy your application

2. **API Configuration**: 
   - Next.js API routes work out of the box on Vercel
   - Grok API calls are made server-side for security
   - The application includes fallback sample data if API is unavailable

3. **Build Settings**: No additional configuration needed - Vercel auto-detects Next.js!

## 📊 Movie Data Structure

Movies fetched from Grok API contain the following fields:

- `movie_id`: Unique identifier for each movie
- `title`: Movie title
- `industry`: Industry (Hollywood, Bollywood, Lollywood)
- `genre`: Movie genres (space-separated)
- `language`: Primary language
- `release_year`: Year of release
- `overview`: Movie description/overview

## 🎓 Educational Purpose

This project is created for **educational purposes** and demonstrates:

- Content-based recommendation systems
- TF-IDF vectorization
- Cosine similarity algorithms
- Web application development with Next.js
- AI/ML integration in web applications

## 👤 Developer

**Nasrullah Qasim**

- Developer and Creator of this AI Movie Recommendation System

## 📝 License

© 2025 Nasrullah Qasim. All Rights Reserved.

This project is for educational purposes only. The dataset is provided for AI experimentation and learning.

## ⚠️ Disclaimer

- The dataset includes movies from multiple industries for educational use
- No copyright infringement is intended
- Movie titles and descriptions are used solely for educational purposes
- This project does not claim ownership of any movie intellectual property

## 🤝 Contributing

This is an educational project. Feel free to explore, learn, and adapt the code for your own projects.

## 📧 Contact

For questions or suggestions, please visit the [Contact Page](/contact) or reach out through the contact form.

---

**Enjoy discovering movies with AI! 🎬✨**
