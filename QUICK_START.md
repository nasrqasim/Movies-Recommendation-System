# 🚀 Quick Start Guide

## Running the Website - Easy Steps

### For Beginners (Simplest Method)

#### **Windows Users:**

1. **Double-click** the file named `start.bat`
2. That's it! Your browser will open automatically

#### **Mac/Linux Users:**

1. Open Terminal
2. Navigate to the project folder:
   ```bash
   cd "path/to/your/project"
   ```
3. Make the script executable (first time only):
   ```bash
   chmod +x start.sh
   ```
4. Run the script:
   ```bash
   ./start.sh
   ```

### Using Command Line (All Operating Systems)

1. Open Terminal/Command Prompt
2. Navigate to the project folder:
   ```bash
   cd "path/to/your/project"
   ```
3. Run this command:
   ```bash
   npm run start:open
   ```

The script will:
- ✅ Check if dependencies are installed
- ✅ Start the Next.js development server
- ✅ Wait for the server to be ready
- ✅ Automatically open your browser at http://localhost:3000

### What Happens Next?

1. Your default browser will open automatically
2. You'll see the **AI Movie Recommendation System** homepage
3. The server will **automatically reload** when you make code changes
4. To stop the server, press **Ctrl+C** in the terminal

### Troubleshooting

#### "Node modules not found"
- The script will automatically run `npm install` for you
- Wait for it to complete, then the server will start

#### "Port 3000 already in use"
- Another application is using port 3000
- Close other Next.js servers, or change the port in the script

#### Browser doesn't open automatically
- No problem! Just manually open: http://localhost:3000

#### Script doesn't work
- Make sure Node.js is installed: `node --version`
- Make sure you're in the project folder
- Try running manually: `npm run dev`

### Video Tutorial (Conceptual)

1. Open your project folder
2. Find `start.bat` (Windows) or `start.sh` (Mac/Linux)
3. Double-click or run it
4. Wait for browser to open
5. Start using the website!

---

**Need Help?** Check the main README.md for detailed documentation.

