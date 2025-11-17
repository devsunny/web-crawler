#!/usr/bin/env node

import { Crawler } from './crawlers/crawler';

// Parse command line arguments
const args = process.argv.slice(2);
let url: string | undefined = undefined;
let maxDepth = 1;
let headless = false; // Default to visible mode
let outputDir = './output';
let linksFile: string | undefined = undefined;
let parsedLinksFile: string | undefined = undefined;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--depth' || arg === '-d') {
    const depth = parseInt(args[i + 1]);
    if (!isNaN(depth) && depth > 0) {
      maxDepth = depth;
      i++; // Skip next argument
    }
  } else if (arg === '--headless' || arg === '-h') {
    headless = true;
  } else if (arg === '--visible' || arg === '-v') {
    headless = false;
  } else if (arg === '--output' || arg === '-o') {
    outputDir = args[i + 1];
    i++; // Skip next argument
  } else if (arg === '--links-file' || arg === '-l') {
    linksFile = args[i + 1];
    i++; // Skip next argument
  } else if (arg === '--parsed-links-file' || arg === '-p') {
    parsedLinksFile = args[i + 1];
    i++; // Skip next argument
  } else if (!url && arg.startsWith('http')) {
    url = arg;
  }
}

// Validate input - URL is optional when file inputs are provided
let hasFileInputs = !!linksFile || !!parsedLinksFile;
if (!hasFileInputs && !url) {
  console.error('Error: No URL provided');
  process.exit(1);
}

console.log(`Starting crawl with depth ${maxDepth}, headless mode: ${headless}, output directory: ${outputDir}`);

// Create and run crawler
const crawler = new Crawler(maxDepth, headless, outputDir, linksFile, parsedLinksFile);

if (url) {
  console.log(`Starting crawl from URL: ${url}`);
  crawler.crawl(url)
    .then(() => {
      console.log('Crawling completed successfully!');
    })
    .catch((error) => {
      console.error('Crawling failed:', error);
      process.exit(1);
    });
} else {
  // When no URL is provided, we still need to call crawl but with an empty string
  // The crawler will use the existing URLs from files only  
  console.log("Starting crawl using file inputs only (no initial URL)");
  crawler.crawl('')
    .then(() => {
      console.log('Crawling completed successfully!');
    })
    .catch((error) => {
      console.error('Crawling failed:', error);
      process.exit(1);
    });
}