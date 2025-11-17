#!/usr/bin/env node

// This is the main entry point for the package - just execute CLI directly
import('./cli').catch((error) => {
  console.error('Failed to load CLI:', error);
  process.exit(1);
});