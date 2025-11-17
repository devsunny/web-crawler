import { URLHandler } from '../handlers/url-handler';
import { PlaywrightClient } from '../utils/playwright-client';
import { HtmlHandler } from '../handlers/html-handler';
import { URLUtils } from '../utils/url-utils';
import { BrowserManager } from '../utils/browser-manager';
import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

export class Crawler {
  private urlHandler: URLHandler;
  private maxDepth: number = 1;
  private headless: boolean = false; // Default to visible mode
  private outputDir: string = './output';
  private linksFile: string = ''; // Path to links.txt file
  private parsedLinksFile: string = ''; // Path to parsed_links.txt file
  private existingUrls: Set<string> = new Set(); // URLs that already exist
  private existingParsedUrls: Set<string> = new Set();


  constructor(maxDepth: number = 1, headless: boolean = false, outputDir: string = './output', linksFile?: string, parsedLinksFile?: string) {
    this.urlHandler = new URLHandler();
    this.maxDepth = maxDepth;
    this.headless = headless;
    this.outputDir = outputDir;

    // Initialize browser manager with the specified mode
    BrowserManager.setHeadless(headless);

    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }

    // Set up file paths - use provided files or default to links.txt and parsed_links.txt in output directory
    this.linksFile = linksFile ? linksFile : path.join(this.outputDir, 'links.txt');
    this.parsedLinksFile = parsedLinksFile ? parsedLinksFile : path.join(this.outputDir, 'parsed_links.txt');

    // Load existing URLs from files if they exist
    this.loadExistingUrls();
  }

  /**
   * Loads existing URLs from links.txt file into memory
   */
  private loadExistingUrls(): void {
    try {
      if (fs.existsSync(this.linksFile)) {
        const content = fs.readFileSync(this.linksFile, 'utf8');
        const urls = content.split('\n').filter(line => line.trim() !== '');

        // Normalize and add URLs to set for efficient lookup
        urls.forEach(url => {
          const normalizedUrl = URLUtils.normalizeURL(url);
          this.existingUrls.add(normalizedUrl);
        });

        console.log(`Loaded ${this.existingUrls.size} existing URLs from ${this.linksFile}`);
      } else {
        console.log(`No existing file found at ${this.linksFile}, starting fresh`);
      }
      if (fs.existsSync(this.parsedLinksFile)) {
        const content = fs.readFileSync(this.parsedLinksFile, 'utf8');
        const urls = content.split('\n').filter(line => line.trim() !== '');

        // Normalize and add URLs to set for efficient lookup
        urls.forEach(url => {
          const normalizedUrl = URLUtils.normalizeURL(url);
          this.existingParsedUrls.add(normalizedUrl);
          if (!this.existingUrls.has(normalizedUrl)) {
            this.urlHandler.addUrl(normalizedUrl);
          }
        });
        console.log(`Loaded ${this.existingUrls.size} existing URLs from ${this.parsedLinksFile}`);
      } else {
        console.log(`No existing file found at ${this.parsedLinksFile}, starting fresh`);
      }


    } catch (error) {
      console.warn('Error loading existing URLs:', error);
      // Continue with empty set if there's an error
    }
  }

  /**
   * Starts crawling from a given URL - downloads all discovered links
   */
  async crawl(startUrl: string): Promise<void> {
    console.log(`Starting crawl from: ${startUrl}`);

    // Handle invalid or empty start URLs gracefully
    if (!startUrl || startUrl.trim() === '') {
      console.log('Empty or invalid start URL provided, skipping initial URL processing');
      // Continue with file-based crawling only if files exist
      // If no valid URLs to process from files either, the crawler will simply exit
    } else {
      console.log(`Processing start URL: ${startUrl}`);
    }

    let processedCount = 0;
    const visitedUrls = new Set<string>(); // Track all visited URLs in current run

    try {
      // Add the starting URL to our processing queue (if not already processed)
      if (startUrl && startUrl.trim() !== '') {
        const normalizedStartUrl = URLUtils.normalizeURL(startUrl);

        // Only add start URL if it hasn't been processed before
        if (!this.existingUrls.has(normalizedStartUrl)) {
          this.urlHandler.addUrl(startUrl);
        } else {
          console.log(`Starting URL ${startUrl} already exists, skipping`);
        }
      }

      // Process all URLs in the queue until it's empty
      while (this.urlHandler.hasMoreUrls()) {
        const url = this.urlHandler.getNextUrl();
        if (!url) break;

        // Check if already visited to prevent duplication within current run
        const normalizedUrl = URLUtils.normalizeURL(url);
        if (visitedUrls.has(normalizedUrl)) {
          console.log(`Skipping already visited URL: ${url}`);
          continue;
        }

        // Skip if this URL was already processed in a previous run
        if (this.existingUrls.has(normalizedUrl)) {
          console.log(`Skipping already processed URL: ${url}`);
          continue;
        }

        visitedUrls.add(normalizedUrl);

        try {
          console.log(`Processing URL ${++processedCount}: ${url}`);

          await this.processUrl(url);

          // Write the URL to links.txt immediately after processing
          this.appendUrlToFile(url);

          // Add to existing URLs set for future duplicate checking
          this.existingUrls.add(normalizedUrl);
          // Add 3-second delay after visiting each URL
          await this.delay(3000);
        } catch (error) {
          console.error(`Failed to process URL ${url}:`, error);
        }
      }

    } finally {
      // Always close the browser when done, even if there were errors
      try {
        await BrowserManager.close();
        console.log('Browser closed successfully after all downloads completed');
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }

    console.log(`Crawling completed. Processed ${processedCount} URLs.`);
  }

  /**
   * Processes a single URL - downloads page and extracts links
   */
  private async processUrl(url: string): Promise<void> {
    try {
      // Always ignore robots.txt rules (as requested)
      console.log('Ignoring robots.txt rules...');

      // Get the content type using Playwright
      const contentType = await PlaywrightClient.getContentType(url);
      console.log(`Content-Type: ${contentType}`);

      // Fetch the content using Playwright
      const response = await PlaywrightClient.get(url);

      if (contentType.includes('text/html')) {
        // Handle HTML content - extract links and save with fixed paths
        await this.handleHtmlContent(url, response.data);
      } else {
        // Handle binary or other content types by saving directly
        console.log(`Non-HTML content type: ${contentType}`);
        await this.saveOtherContent(url, response.data, contentType);
      }
    } catch (error) {
      console.error(`Error processing URL ${url}:`, error);
    }
  }

  /**
   * Handles HTML content - extracts links and saves with fixed paths
   */
  private async handleHtmlContent(originalUrl: string, htmlContent: string): Promise<void> {
    // Parse the HTML using Cheerio to extract all links
    const $ = cheerio.load(htmlContent);
    
    // Extract all links from the page
    const parsedData = HtmlHandler.parse(htmlContent, originalUrl);

    console.log(`Title: ${parsedData.title}`);
    console.log(`Word count: ${parsedData.wordCount}`);
    console.log(`Found ${parsedData.links.length} links in this page`);

    // Fix all href attributes to be relative paths
    const fixedHtml = this.fixHtmlLinks($, originalUrl);

    // Save the HTML content with fixed links
    await this.saveHtmlWithFixedLinks(originalUrl, fixedHtml);

    // Add all discovered links to processing queue (if not already processed)
    for (const link of parsedData.links) {
      if (URLUtils.isValidURL(link)) {
        // Only add links from same domain or relative URLs
        const isSameDomain = URLUtils.isSameDomain(originalUrl, link);
        const isRelative = URLUtils.isRelativeURL(link);

        if (isSameDomain || isRelative) {
          const normalizedLink = URLUtils.normalizeURL(link);

          // Skip if already processed in this run or previous runs
          if (!this.existingUrls.has(normalizedLink)) {
            this.urlHandler.addUrl(link);
            this.appendUrlToParsedURLFile(link);
          } else {
            console.log(`Skipping link (already exists): ${link}`);
          }
        } else {
          console.log(`Skipping external link: ${link}`);
        }
      }
    }
  }

  /**
   * Fixes HTML links to be relative paths based on the download directory
   */
  private fixHtmlLinks($: cheerio.CheerioAPI, originalUrl: string): string {
    const baseUrl = new URL(originalUrl);
    const self = this; // Capture 'this' context

    // Fix all href attributes in anchor tags and link tags
    $('a[href]').each(function(_index, element) {
      const href = $(element).attr('href');
      if (href && href.startsWith('/')) {
        // Convert absolute paths to relative paths
        const relativePath = self.convertToRelativePath(href, baseUrl.pathname);
        $(element).attr('href', relativePath);
        console.log(`Fixed href: ${href} -> ${relativePath}`);
      }
    });

    $('link[href]').each(function(_index, element) {
      const href = $(element).attr('href');
      if (href && href.startsWith('/')) {
        // Convert absolute paths to relative paths
        const relativePath = self.convertToRelativePath(href, baseUrl.pathname);
        $(element).attr('href', relativePath);
        console.log(`Fixed link href: ${href} -> ${relativePath}`);
      }
    });

    $('script[src]').each(function(_index, element) {
      const src = $(element).attr('src');
      if (src && src.startsWith('/')) {
        // Convert absolute paths to relative paths
        const relativePath = self.convertToRelativePath(src, baseUrl.pathname);
        $(element).attr('src', relativePath);
        console.log(`Fixed script src: ${src} -> ${relativePath}`);
      }
    });

    $('img[src]').each(function(_index, element) {
      const src = $(element).attr('src');
      if (src && src.startsWith('/')) {
        // Convert absolute paths to relative paths
        const relativePath = self.convertToRelativePath(src, baseUrl.pathname);
        $(element).attr('src', relativePath);
        console.log(`Fixed img src: ${src} -> ${relativePath}`);
      }
    });

    return $.html();
  }

  /**
   * Converts absolute path to relative path based on base URL
   */
  private convertToRelativePath(absPath: string, basePath: string): string {
    // Remove leading slash and normalize the path
    const normalizedAbsPath = absPath.startsWith('/') ? absPath.substring(1) : absPath;

    // If it's a root-level file (e.g., /index.html), just return the filename
    if (!basePath || basePath === '/' || basePath === '/index.html') {
      return normalizedAbsPath;
    }

    // For paths like /cipai/1.html, convert to cipai/1.html  
    return normalizedAbsPath;
  }

  /**
   * Saves HTML content with fixed links to the output directory
   */
  private async saveHtmlWithFixedLinks(originalUrl: string, htmlContent: string): Promise<void> {
    // Create the file path for this URL in the output directory
    const filePath = this.getOutputFilePath(originalUrl, 'html');

    try {
      // Ensure parent directories exist
      const dirName = path.dirname(filePath);

      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }

      // Save the HTML content with fixed links
      await fs.promises.writeFile(filePath, htmlContent, 'utf8');
      console.log(`Saved HTML to: ${filePath}`);
    } catch (error) {
      console.error('Error saving HTML file:', error);
    }
  }

  /**
   * Saves non-HTML content directly with proper extension
   */
  private async saveOtherContent(url: string, content: any, contentType: string): Promise<void> {
    const filePath = this.getOutputFilePath(url, this.getFileExtensionFromMimeType(contentType));

    try {
      // Ensure parent directories exist
      const dirName = path.dirname(filePath);

      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }

      await fs.promises.writeFile(filePath, content);
      console.log(`Saved ${contentType} content to: ${filePath}`);
    } catch (error) {
      console.error('Error saving content file:', error);
    }
  }

  /**
   * Gets the output file path for a URL with proper extension
   */
  private getOutputFilePath(url: string, extension?: string): string {
    const urlObj = new URL(url);

    // Create path based on the full URL structure
    let relativePath = '';

    // Handle different cases for pathname
    if (urlObj.pathname && urlObj.pathname !== '/') {
      // Remove leading slash and use as directory structure
      relativePath = urlObj.pathname.substring(1);
    } else {
      // If no path, default to index.html
      relativePath = 'index.html';
    }

    // Normalize multiple slashes in the path
    relativePath = relativePath.replace(/\/+/g, '/');  // Normalize slashes

    // For root-level files like /index.html or /about.html, just return the filename
    if (relativePath === 'index.html' || relativePath.startsWith('index.html')) {
      // Keep as is for root level files
    }

    // Add extension if provided and not already present
    if (extension && !path.extname(relativePath)) {
      relativePath = `${relativePath}.${extension}`;
    }

    // Create full file path in output directory
    return path.join(this.outputDir, relativePath);
  }

  /**
   * Gets proper file extension from MIME type
   */
  private getFileExtensionFromMimeType(mimeType: string): string {
    const mimeMap: { [key: string]: string } = {
      'text/html': 'html',
      'text/css': 'css',
      'application/javascript': 'js',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/svg+xml': 'svg',
      'application/json': 'json',
      'text/xml': 'xml',
      'application/pdf': 'pdf'
    };

    return mimeMap[mimeType] || 'txt';
  }

  /**
   * Appends a URL to the links.txt file immediately after processing
   */
  private appendUrlToFile(url: string): void {
    try {
      fs.appendFileSync(this.linksFile, `${url}\n`);
      console.log(`Added URL to ${this.linksFile}: ${url}`);
    } catch (error) {
      console.error('Error writing URL to file:', error);
    }
  }


  /**
   * Appends a URL to the parsed_links.txt file immediately after processing
   */
  private appendUrlToParsedURLFile(url: string): void {
    if (!this.existingParsedUrls.has(url)) {
      this.existingParsedUrls.add(url);
      try {
        fs.appendFileSync(this.parsedLinksFile, `${url}\n`);
        console.log(`Added URL to ${this.parsedLinksFile}: ${url}`);
      } catch (error) {
        console.error('Error writing URL to file:', error);
      }
    }

  }


  /**
   * Adds a delay for specified milliseconds
   */
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Sets the maximum crawl depth (though this is now ignored in favor of processing all links)
   */
  setMaxDepth(depth: number): void {
    this.maxDepth = depth;
  }

  /**
   * Sets browser visibility mode
   */
  setHeadless(headless: boolean): void {
    this.headless = headless;
    BrowserManager.setHeadless(headless);
  }
}