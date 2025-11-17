import { chromium, Browser, Page } from 'playwright';

export class BrowserManager {
  private static browser: Browser | null = null;
  private static isInitialized: boolean = false;
  private static headless: boolean = true;

  /**
   * Initializes the browser instance if not already initialized
   */
  static async initialize(headless: boolean = true): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      this.headless = headless;
      this.browser = await chromium.launch({
        headless: headless, // Use the provided mode
        timeout: 30000,
      });
      this.isInitialized = true;
      console.log(`Browser initialized successfully in ${headless ? 'headless' : 'visible'} mode`);
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  /**
   * Gets a new page from the browser
   */
  static async newPage(): Promise<Page> {
    if (!this.browser) {
      await this.initialize(this.headless);
    }
    
    // TypeScript doesn't know that initialize() sets browser, so we need to assert it's not null
    return await this.browser!.newPage();
  }

  /**
   * Closes all browser instances and cleans up resources
   */
  static async close(): Promise<void> {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = null;
        this.isInitialized = false;
        console.log('Browser closed successfully');
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }

  /**
   * Gets the current browser instance
   */
  static getBrowser(): Browser | null {
    return this.browser;
  }
  
  /**
   * Sets whether to use headless mode
   */
  static setHeadless(headless: boolean): void {
    this.headless = headless;
  }
}