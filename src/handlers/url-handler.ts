import { URLUtils } from '../utils/url-utils';
import { URL } from 'url';

export class URLHandler {
  private visitedUrls: Set<string> = new Set();
  private urlQueue: string[] = [];
  
  /**
   * Adds a URL to the queue if it's valid and not already visited
   */
  addUrl(url: string): boolean {
    // Validate URL
    if (!URLUtils.isValidURL(url)) {
      console.warn(`Invalid URL skipped: ${url}`);
      return false;
    }
    
    // Normalize URL
    const normalizedUrl = URLUtils.normalizeURL(url);
    
    // Check if already visited
    if (this.visitedUrls.has(normalizedUrl)) {
      return false; // Already processed
    }
    
    // Add to queue and mark as visited
    this.urlQueue.push(normalizedUrl);
    this.visitedUrls.add(normalizedUrl);
    
    return true;
  }
  
  /**
   * Gets the next URL from the queue
   */
  getNextUrl(): string | null {
    if (this.urlQueue.length === 0) {
      return null;
    }
    
    const url = this.urlQueue.shift();
    return url || null;
  }
  
  /**
   * Checks if there are more URLs to process
   */
  hasMoreUrls(): boolean {
    return this.urlQueue.length > 0;
  }
  
  /**
   * Gets the count of visited URLs
   */
  getVisitedCount(): number {
    return this.visitedUrls.size;
  }
  
  /**
   * Clears all stored URLs
   */
  clear(): void {
    this.visitedUrls.clear();
    this.urlQueue = [];
  }
}