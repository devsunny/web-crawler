import * as cheerio from 'cheerio';
import { URL } from 'url';

export class HtmlHandler {
  /**
   * Parses HTML content and extracts meaningful information
   */
  static parse(htmlContent: string, baseUrl?: string): any {
    const $ = cheerio.load(htmlContent);
    
    // Extract title
    const title = $('title').first().text();
    
    // Extract text content (stripped of markup)
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();
    
    // Extract all links
    const links: string[] = [];
    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        // Convert relative URLs to absolute if base URL is provided
        if (baseUrl && this.isRelativeUrl(href)) {
          try {
            const absoluteUrl = new URL(href, baseUrl).toString();
            links.push(absoluteUrl);
          } catch (err) {
            // If we can't make it absolute, just add the relative URL
            links.push(href);
          }
        } else {
          links.push(href);
        }
      }
    });
    
    return {
      title,
      textContent,
      links,
      wordCount: textContent.split(/\s+/).filter(Boolean).length,
    };
  }
  
  /**
   * Checks if a URL is relative
   */
  private static isRelativeUrl(url: string): boolean {
    return !url.startsWith('http://') && !url.startsWith('https://');
  }
}