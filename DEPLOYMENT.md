# Deployment Guide - AI Movie Recommendation System

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Generate Dataset** (if needed)
   ```bash
   python scripts/generate_dataset.py
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Deploying to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? (Press Enter for default or enter a name)
   - Directory? (Press Enter for `./`)
   - Override settings? **No**

5. Your app will be deployed and you'll get a URL!

### Option 2: Deploy via GitHub

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)

3. Click **"Add New Project"**

4. Import your GitHub repository

5. Vercel will automatically:
   - Detect Next.js
   - Install dependencies
   - Build the project
   - Deploy it

6. Click **"Deploy"** and wait for the build to complete

7. Your app will be live at `https://your-project.vercel.app`

## Important Notes

### Dataset File

- The `dataset/movies_15000.csv` file **must** be included in your repository
- Make sure it's committed to Git:
  ```bash
  git add dataset/movies_15000.csv
  git commit -m "Add dataset"
  ```

### Environment Variables

- No environment variables are required for this project
- All configuration is handled in code

### Build Settings

Vercel automatically detects Next.js and uses these settings:
- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install` (or `yarn install`)

### File Size Limits

- The dataset file (~1-2 MB) is well within Vercel's limits
- Maximum file size on Vercel: 50 MB

## Troubleshooting

### Build Fails

If the build fails, check:
1. All dependencies are listed in `package.json`
2. TypeScript compiles without errors: `npx tsc --noEmit`
3. Dataset file exists at `dataset/movies_15000.csv`

### API Routes Not Working

1. Ensure API routes are in `app/api/` directory
2. Check that file names match route names
3. Verify API routes export proper HTTP methods (GET, POST, etc.)

### Dataset Not Found

1. Verify `dataset/movies_15000.csv` exists
2. Check file path in `lib/recommendation.ts`
3. Ensure file is committed to Git repository

## Performance Optimization

### Caching

The recommendation system uses in-memory caching:
- Movies are loaded once and cached
- TF-IDF matrix is computed once and reused
- This ensures fast API response times

### Dataset Size

- Current dataset: 15,000 movies
- Memory usage: ~50-100 MB (estimated)
- Vercel serverless functions support up to 1 GB memory

### Response Times

- Initial load: 2-5 seconds (includes dataset loading)
- Subsequent requests: <500ms (cached)
- Recommended: Use Vercel's edge caching for better performance

## Custom Domain

1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (can take up to 24 hours)

## Monitoring

- Vercel Dashboard shows:
  - Build logs
  - Deployment history
  - Function logs
  - Analytics (if enabled)

## Support

For issues or questions:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)
3. Review project README.md

---

**Happy Deploying! 🚀**

