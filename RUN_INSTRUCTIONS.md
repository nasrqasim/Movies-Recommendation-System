# 🚀 Quick Start Instructions

## Simple 3-Step Process

### Step 1: Install Dependencies (First Time Only)

```bash
npm install
```

This installs all required packages including the `open` package for automatic browser opening.

### Step 2: Run the Script

```bash
node run_website.js
```

OR use the npm shortcut:

```bash
npm run start:open
```

### Step 3: That's It! 🎉

- The Next.js server will start automatically
- Your browser will open to http://localhost:3000
- The page auto-reloads when you make code changes
- Press `Ctrl+C` to stop the server

---

## What the Script Does

1. ✅ Starts Next.js development server (`npm run dev`)
2. ✅ Waits for server to be ready
3. ✅ Automatically opens Google Chrome to http://localhost:3000
4. ✅ Watches for file changes (Next.js hot-reload)
5. ✅ Handles errors gracefully
6. ✅ Works on Windows, Mac, and Linux

---

## Troubleshooting

### "Cannot find module 'open'"
```bash
npm install open
```

### "Port 3000 already in use"
Stop any other servers running on port 3000, or change the port in `run_website.js`

### "Chrome doesn't open"
The script will show the URL - just open it manually in your browser

### "npm is not recognized"
Make sure Node.js is installed: https://nodejs.org/

---

## Customization

Edit `run_website.js` to change:
- **Port**: Change `const PORT = 3000;` (line 27)
- **Browser**: Change `const BROWSER = 'chrome';` (line 30)

---

**Made by Nasrullah Qasim** 🎬

