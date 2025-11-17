import { Crawler } from '../crawlers/crawler';
import { URLHandler } from '../handlers/url-handler';

describe('Integration Tests', () => {
  test('should initialize crawler without errors', () => {
    const crawler = new Crawler(1);
    expect(crawler).toBeDefined();
  });

  test('should initialize URL handler without errors', () => {
    const urlHandler = new URLHandler();
    expect(urlHandler).toBeDefined();
  });

  test('URL handler should process valid URLs', () => {
    const urlHandler = new URLHandler();
    
    // Test adding a few URLs
    const result1 = urlHandler.addUrl('https://httpbin.org/html');
    const result2 = urlHandler.addUrl('https://httpbin.org/json');
    
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(urlHandler.getVisitedCount()).toBe(2);
  });
});