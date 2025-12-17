#!/bin/bash
# Shell script to start Next.js and open browser (Mac/Linux)
# Usage: chmod +x start.sh && ./start.sh

echo ""
echo "========================================"
echo "  AI Movie Recommendation System"
echo "  Starting Development Server..."
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Node modules not found. Installing dependencies..."
    npm install
    echo ""
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Start the dev server using the Node.js script
echo "Starting Next.js development server..."
echo "This will open your browser automatically."
echo ""
echo "Press Ctrl+C to stop the server."
echo ""

node scripts/start.js

