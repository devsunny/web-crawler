import { BrowserManager } from '../utils/browser-manager';
import { PlaywrightClient } from '../utils/playwright-client';

describe('Playwright Integration', () => {
  beforeAll(async () => {
    await BrowserManager.initialize();
  }, 30000);

  afterAll(async () => {
    await BrowserManager.close();
  });

  test('should initialize browser manager', async () => {
    expect(BrowserManager.getBrowser()).not.toBeNull();
  });

  test('should fetch content from a simple URL', async () => {
    // Using a simple test page
    const result = await PlaywrightClient.get('https://httpbin.org/html');
    
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('contentType');
    expect(result.contentType).toContain('text/html');
  }, 30000);

  test('should get content type correctly', async () => {
    const contentType = await PlaywrightClient.getContentType('https://httpbin.org/html');
    
    expect(contentType).toContain('text/html');
  }, 30000);
});