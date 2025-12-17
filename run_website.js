/**
 * ================================================================
 * AI Movie Recommendation System - Auto-Start Script
 * ================================================================
 * 
 * This script automatically:
 * 1. Starts the Next.js development server
 * 2. Waits for the server to be ready
 * 3. Opens Google Chrome browser to http://localhost:3000
 * 4. The server automatically reloads when you make code changes
 * 
 * Usage:
 *   node run_website.js
 * 
 * Works on: Windows, Mac, and Linux
 * ================================================================
 */

const { spawn } = require('child_process');
const http = require('http');

// Try to require 'open' package, with fallback if not installed
let open;
try {
  open = require('open');
} catch (error) {
  console.warn('⚠️  Warning: "open" package not found. Install it with: npm install open');
  open = null;
}

// Configuration
const PORT = 3000;
const URL = `http://localhost:${PORT}`;
const MAX_WAIT_TIME = 30000; // 30 seconds max wait
const CHECK_INTERVAL = 500; // Check every 500ms
const BROWSER = 'chrome'; // Use 'chrome', 'firefox', or 'default'

/**
 * Check if the server is ready by making an HTTP request
 * @returns {Promise<boolean>} True if server is ready
 */
function checkServerReady() {
  return new Promise((resolve) => {
    const req = http.get(URL, (res) => {
      resolve(true);
      req.destroy();
    });

    req.on('error', () => {
      resolve(false);
    });

    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Wait for the server to be ready
 * @returns {Promise<void>}
 */
async function waitForServer() {
  console.log('⏳ Waiting for server to start...');
  const startTime = Date.now();

  while (Date.now() - startTime < MAX_WAIT_TIME) {
    const isReady = await checkServerReady();
    
    if (isReady) {
      console.log('✅ Server is ready!');
      return;
    }

    // Show progress
    process.stdout.write('.');
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }

  throw new Error('Server did not start within the expected time');
}

/**
 * Open the browser to the local development URL
 */
async function openBrowser() {
  // If 'open' package is not available, use native method
  if (!open) {
    return openBrowserNative();
  }

  try {
    console.log(`\n🌐 Opening ${BROWSER === 'chrome' ? 'Google Chrome' : 'browser'}...`);
    
    // Determine browser app name based on OS
    const isWindows = process.platform === 'win32';
    const isMac = process.platform === 'darwin';
    
    let appName;
    if (BROWSER === 'chrome') {
      if (isWindows) {
        appName = 'chrome';
      } else if (isMac) {
        appName = 'google chrome';
      } else {
        appName = 'google-chrome';
      }
    }
    
    // Open browser with the specified application
    await open(URL, {
      app: BROWSER === 'chrome' ? { name: appName } : undefined
    });
    
    console.log(`✅ Browser opened at ${URL}\n`);
  } catch (error) {
    console.log(`⚠️  Could not open ${BROWSER} automatically.`);
    console.log(`   Trying native method...`);
    openBrowserNative();
  }
}

/**
 * Open browser using native OS commands (fallback method)
 */
function openBrowserNative() {
  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';
  
  let command;
  if (isWindows) {
    // Windows: try Chrome first, fallback to default browser
    command = `start chrome "${URL}" || start "" "${URL}"`;
  } else if (isMac) {
    // macOS: try Chrome first, fallback to default browser
    command = `open -a "Google Chrome" "${URL}" || open "${URL}"`;
  } else {
    // Linux: try Chrome, Chromium, or default browser
    command = `xdg-open "${URL}" || google-chrome "${URL}" || chromium-browser "${URL}"`;
  }
  
  const { exec } = require('child_process');
  exec(command, (error) => {
    if (error) {
      console.log(`⚠️  Could not open browser automatically.`);
      console.log(`   Please open your browser manually and go to: ${URL}\n`);
    } else {
      console.log(`✅ Browser opened at ${URL}\n`);
    }
  });
}

/**
 * Start the Next.js development server
 */
function startDevServer() {
  console.log('🚀 Starting Next.js development server...\n');

  // Determine the command based on OS
  const isWindows = process.platform === 'win32';
  const command = isWindows ? 'npm.cmd' : 'npm';
  const args = ['run', 'dev'];

  // Spawn the development server process
  const devServer = spawn(command, args, {
    stdio: 'inherit', // Pass through stdout, stderr, stdin
    shell: false,
    cwd: process.cwd(), // Run in current directory
  });

  // Handle process errors
  devServer.on('error', (error) => {
    console.error('❌ Error starting development server:');
    console.error(`   ${error.message}\n`);
    console.log('💡 Make sure you have:');
    console.log('   1. Installed Node.js (https://nodejs.org/)');
    console.log('   2. Run "npm install" to install dependencies');
    console.log('   3. Are in the correct project directory\n');
    process.exit(1);
  });

  // Handle process exit
  devServer.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\n❌ Development server exited with code ${code}\n`);
    }
  });

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Stopping development server...');
    devServer.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    devServer.kill();
    process.exit(0);
  });

  return devServer;
}

/**
 * Main function - orchestrates the entire process
 */
async function main() {
  console.log('\n========================================');
  console.log('  AI Movie Recommendation System');
  console.log('  Development Server Starter');
  console.log('========================================\n');

  try {
    // Step 1: Start the development server
    const devServer = startDevServer();

    // Step 2: Wait a bit for the server to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Wait for server to be ready
    await waitForServer();

    // Step 4: Open the browser
    await openBrowser();

    // Step 5: Show helpful information
    console.log('📝 Next.js Development Server is running!');
    console.log('   - The server will automatically reload when you make code changes');
    console.log('   - Press Ctrl+C to stop the server\n');
    console.log('   Happy coding! 🎬✨\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure port 3000 is not already in use');
    console.log('   2. Check if Node.js and npm are installed correctly');
    console.log('   3. Try running "npm install" to ensure dependencies are installed');
    console.log('   4. Check the terminal output above for more details\n');
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});

