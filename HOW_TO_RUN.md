# 🚀 How to Run the Website - Step by Step Guide

## Quick Start (Easiest Method)

### Step 1: Install Dependencies (First Time Only)

Open Terminal/Command Prompt and run:

```bash
npm install
```

This installs all required packages including the `open` package for browser automation.

### Step 2: Run the Script

Simply run this command:

```bash
node run_website.js
```

That's it! The script will:
- ✅ Start the Next.js development server
- ✅ Wait for it to be ready
- ✅ Automatically open Google Chrome to http://localhost:3000
- ✅ Keep running and auto-reload when you make changes

### Step 3: Stop the Server

Press `Ctrl+C` in the terminal to stop the server when you're done.

---

## Detailed Instructions

### Prerequisites

Before running the script, make sure you have:

1. **Node.js installed** (version 18 or higher)
   - Check by running: `node --version`
   - Download from: https://nodejs.org/

2. **npm installed** (comes with Node.js)
   - Check by running: `npm --version`

3. **All dependencies installed**
   - Run: `npm install`
   - This only needs to be done once (or when package.json changes)

### Running the Script

#### Method 1: Using the Node.js Script (Recommended)

```bash
node run_website.js
```

#### Method 2: Using npm Script

Add this to your `package.json` scripts section:
```json
"start:open": "node run_website.js"
```

Then run:
```bash
npm run start:open
```

#### Method 3: Windows Batch File

Double-click `start.bat` (if available)

#### Method 4: Mac/Linux Shell Script

```bash
chmod +x start.sh
./start.sh
```

### What Happens When You Run the Script?

1. **Server Starts**: Next.js development server starts on port 3000
2. **Wait Check**: Script waits for server to be ready (checks every 500ms)
3. **Browser Opens**: Google Chrome opens automatically to http://localhost:3000
4. **Auto-Reload**: Server watches for file changes and automatically reloads

### Features

- ✅ **Cross-Platform**: Works on Windows, Mac, and Linux
- ✅ **Automatic Browser**: Opens Chrome automatically
- ✅ **Error Handling**: Clear error messages if something goes wrong
- ✅ **Progress Indication**: Shows dots while waiting for server
- ✅ **Graceful Shutdown**: Press Ctrl+C to stop cleanly

### Troubleshooting

#### Problem: "Cannot find module 'open'"

**Solution:**
```bash
npm install
```

#### Problem: "Port 3000 is already in use"

**Solution:**
- Stop any other Next.js servers running
- Or change the PORT in `run_website.js` (line 24)

#### Problem: "Chrome doesn't open automatically"

**Solution:**
- The script will show a message with the URL
- Open your browser manually and go to: http://localhost:3000
- Or change BROWSER to 'default' in `run_website.js` (line 26)

#### Problem: "Server did not start within expected time"

**Solution:**
- Check if npm dependencies are installed: `npm install`
- Check for errors in the terminal output
- Make sure you're in the correct project directory

#### Problem: "npm is not recognized"

**Solution:**
- Make sure Node.js is installed correctly
- Restart your terminal/command prompt
- Add Node.js to your system PATH

### Customization

You can customize the script by editing `run_website.js`:

- **Change Port**: Modify `const PORT = 3000;` (line 24)
- **Change Browser**: Modify `const BROWSER = 'chrome';` (line 26)
  - Options: `'chrome'`, `'firefox'`, or `'default'`
- **Change Wait Time**: Modify `const MAX_WAIT_TIME = 30000;` (line 23)

### For Semester Project Presentation

1. **Before Presentation:**
   ```bash
   npm install  # Make sure everything is installed
   ```

2. **During Presentation:**
   ```bash
   node run_website.js
   ```
   The browser will open automatically - impressive! 🎉

3. **Show Features:**
   - Search for movies
   - Show recommendations
   - Explain how it works

4. **When Done:**
   Press `Ctrl+C` to stop

---

## Video Walkthrough Steps

1. Open Terminal/Command Prompt
2. Navigate to project folder: `cd "path/to/project"`
3. Run: `npm install` (first time only)
4. Run: `node run_website.js`
5. Browser opens automatically!
6. Start using the website

---

## Support

If you encounter any issues:

1. Check the error message in the terminal
2. Read the troubleshooting section above
3. Make sure all prerequisites are installed
4. Check the main README.md for more information

---

**Happy Coding! 🎬✨**

