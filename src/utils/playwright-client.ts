import { BrowserManager } from './browser-manager';
import { Page } from 'playwright';

export class PlaywrightClient {
  /**
   * Fetches content from a URL using Playwright browser automation
   */
  static async get(url: string): Promise<{ data: string; contentType: string }> {
    const page = await BrowserManager.newPage();
    
    try {
      // Navigate to the URL
      const response = await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      if (!response) {
        throw new Error(`Failed to get response for URL: ${url}`);
      }
      
      // Get the rendered HTML content
      const htmlContent = await page.content();
      
      // Get content type from response headers
      const contentType = response.headers()['content-type'] || 'unknown';
      
      return {
        data: htmlContent,
        contentType: contentType
      };
    } catch (error) {
      console.error(`Error fetching URL ${url} with Playwright:`, error);
      throw error;
    } finally {
      // Close the page to free resources
      await page.close();
    }
  }

  /**
   * Gets the content type of a URL using Playwright browser automation
   */
  static async getContentType(url: string): Promise<string> {
    const page = await BrowserManager.newPage();
    
    try {
      // Navigate to the URL with minimal wait
      const response = await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      
      if (!response) {
        return 'unknown';
      }
      
      // Get content type from response headers
      return response.headers()['content-type'] || 'unknown';
    } catch (error) {
      console.warn(`Could not determine content type for ${url} with Playwright:`, error);
      return 'unknown';
    } finally {
      // Close the page to free resources
      await page.close();
    }
  }

  /**
   * Fetches and returns raw bytes from a URL using Playwright (for binary files)
   */
  static async getBinary(url: string): Promise<Buffer> {
    const page = await BrowserManager.newPage();
    
    try {
      // Navigate to the URL
      const response = await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      if (!response) {
        throw new Error(`Failed to get response for binary URL: ${url}`);
      }
      
      // For binary content, we need to get the raw bytes
      const buffer = await response.body();
      
      return buffer;
    } catch (error) {
      console.error(`Error fetching binary URL ${url} with Playwright:`, error);
      throw error;
    } finally {
      // Close the page to free resources
      await page.close();
    }
  }

  /**
   * Sets browser configuration options
   */
  static async setBrowserOptions(options: { headless?: boolean; timeout?: number }): Promise<void> {
    if (options.headless !== undefined) {
      BrowserManager.setHeadless(options.headless);
    }
    
    // For timeout, we would need to reinitialize the browser with new settings
    console.log('Setting browser options:', options);
  }
}