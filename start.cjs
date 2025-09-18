#!/usr/bin/env node
// Production startup script for Temer Properties Admin
console.log('🚀 Starting Temer Properties Admin Dashboard...');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

try {
  require('./app.cjs');
} catch (error) {
  console.error('❌ Server startup failed:', error);
  process.exit(1);
}