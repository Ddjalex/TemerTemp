// Simple redirect to our actual CommonJS application
const { spawn } = require('child_process');
const path = require('path');

const appPath = path.join(process.cwd(), 'app.cjs');

console.log('Starting Temer Properties application...');

const child = spawn('node', [appPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'development'
  }
});

child.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code || 0);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});