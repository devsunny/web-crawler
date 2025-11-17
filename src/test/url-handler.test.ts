import { URLHandler } from '../handlers/url-handler';
import { URLUtils } from '../utils/url-utils';

describe('URLHandler', () => {
  let urlHandler: URLHandler;

  beforeEach(() => {
    urlHandler = new URLHandler();
  });

  test('should add valid URLs to queue', () => {
    const result1 = urlHandler.addUrl('https://example.com');
    const result2 = urlHandler.addUrl('http://test.org/page');
    
    expect(result1).toBe(true);
    expect(result2).toBe(true);
    expect(urlHandler.getVisitedCount()).toBe(2);
  });

  test('should not add duplicate URLs', () => {
    const result1 = urlHandler.addUrl('https://example.com');
    const result2 = urlHandler.addUrl('https://example.com');
    
    expect(result1).toBe(true);
    expect(result2).toBe(false); // Should return false for duplicates
    expect(urlHandler.getVisitedCount()).toBe(1);
  });

  test('should handle invalid URLs gracefully', () => {
    const result = urlHandler.addUrl('not-a-url');
    
    expect(result).toBe(false);
    expect(urlHandler.getVisitedCount()).toBe(0);
  });

  test('should get next URL from queue', () => {
    urlHandler.addUrl('https://example.com');
    urlHandler.addUrl('http://test.org');
    
    const nextUrl = urlHandler.getNextUrl();
    expect(nextUrl).toBe('https://example.com');
    
    // Should have one less URL in the queue
    expect(urlHandler.getVisitedCount()).toBe(2);
  });

  test('should return null when no URLs left', () => {
    const result = urlHandler.getNextUrl();
    expect(result).toBeNull();
  });
});