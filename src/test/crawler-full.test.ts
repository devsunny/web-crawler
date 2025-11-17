import { Crawler } from '../crawlers/crawler';
import { BrowserManager } from '../utils/browser-manager';

describe('Crawler Full Integration', () => {
  beforeAll(async () => {
    await BrowserManager.initialize();
  }, 30000);

  afterAll(async () => {
    await BrowserManager.close();
  });

  test('should create crawler with headless mode', async () => {
    const crawler = new Crawler(1, true);
    expect(crawler).toBeDefined();
  });

  test('should create crawler with visible mode', async () => {
    const crawler = new Crawler(1, false);
    expect(crawler).toBeDefined();
  });

  test('should handle headless vs visible mode setting', async () => {
    const crawler = new Crawler(1, true);
    
    // Test changing to visible mode
    crawler.setHeadless(false);
    expect(true).toBe(true); // Just verifying it doesn't crash
    
    // Test changing back to headless
    crawler.setHeadless(true);
    expect(true).toBe(true); // Just verifying it doesn't crash
  });
});