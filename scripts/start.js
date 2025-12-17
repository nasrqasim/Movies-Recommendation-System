/**
 * Cross-platform script to start Next.js dev server and open browser
 * Works on Windows, Mac, and Linux
 * 
 * Usage: node scripts/start.js
 */

const { spawn, exec } = require('child_process');
const http = require('http');
const os = require('os');

const PORT = 3000;
const URL = `http://localhost:${PORT}`;

/**
 * Check if server is ready by making HTTP request
 */
function checkServerReady(callback) {
  const req = http.get(URL, (res) => {
    callback(true);
  });

  req.on('error', () => {
    callback(false);
  });

  req.setTimeout(1000, () => {
    req.destroy();
    callback(false);
  });
}

/**
 * Wait for server to be ready
 */
function waitForServer(callback, maxAttempts = 30, attempt = 0) {
  if (attempt >= maxAttempts) {
    console.error('❌ Server did not start within expected time');
    process.exit(1);
  }

  checkServerReady((ready) => {
    if (ready) {
      console.log('✅ Server is ready!');
      callback();
    } else {
      process.stdout.write('.');
      setTimeout(() => {
        waitForServer(callback, maxAttempts, attempt + 1);
      }, 1000);
    }
  });
}

/**
 * Open browser based on operating system
 */
function openBrowser() {
  const platform = os.platform();
  let command;

  if (platform === 'win32') {
    // Windows
    command = `start ${URL}`;
  } else if (platform === 'darwin') {
    // macOS
    command = `open ${URL}`;
  } else {
    // Linux and others
    command = `xdg-open ${URL}`;
  }

  exec(command, (error) => {
    if (error) {
      console.error('⚠️  Could not open browser automatically. Please open manually:');
      console.log(`   ${URL}`);
    } else {
      console.log(`🌐 Opening browser at ${URL}`);
    }
  });
}

/**
 * Start the Next.js development server
 */
function startDevServer() {
  console.log('🚀 Starting Next.js development server...');
  console.log('   (This may take a few seconds)');
  console.log('   Waiting for server');

  // Determine if we should use npm or yarn
  const useYarn = process.argv.includes('--yarn');
  const packageManager = useYarn ? 'yarn' : 'npm';
  const args = ['run', 'dev'];

  // Spawn the dev server process
  const devServer = spawn(packageManager, args, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
  });

  // Handle process errors
  devServer.on('error', (error) => {
    console.error('❌ Error starting dev server:', error.message);
    console.log('\n💡 Try running: npm install');
    process.exit(1);
  });

  // Handle process exit
  devServer.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\n❌ Dev server exited with code ${code}`);
    }
    process.exit(code);
  });

  // Wait for server to be ready, then open browser
  setTimeout(() => {
    waitForServer(() => {
      console.log('\n');
      openBrowser();
      console.log('\n📝 Server is running. Press Ctrl+C to stop.');
      console.log('🔄 The page will auto-reload when you make changes.\n');
    });
  }, 2000); // Wait 2 seconds before checking
}

// Start the development server
startDevServer();

