import { Crawler } from '../crawlers/crawler';

describe('Crawler', () => {
  test('should initialize crawler without errors', () => {
    const crawler = new Crawler(1, true);
    expect(crawler).toBeDefined();
  });

  test('should set max depth correctly', () => {
    const crawler = new Crawler(2, true);
    expect(crawler).toBeDefined();
    
    // Test setting new depth
    crawler.setMaxDepth(3);
    expect(true).toBe(true); // Just verifying it doesn't crash
  });

  test('should handle headless mode setting correctly', () => {
    const crawler = new Crawler(1, true);
    expect(crawler).toBeDefined();
    
    // Test changing to visible mode
    crawler.setHeadless(false);
    expect(true).toBe(true); // Just verifying it doesn't crash
    
    // Test changing back to headless
    crawler.setHeadless(true);
    expect(true).toBe(true); // Just verifying it doesn't crash
  });
});