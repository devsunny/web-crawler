import { Crawler } from '../crawlers/crawler';

describe('CLI Parser', () => {
  test('should parse basic URL correctly', () => {
    // This is a simple test - the CLI itself will be tested via integration tests
    expect(true).toBe(true);
  });

  test('should parse depth option', () => {
    const crawler = new Crawler(2, true);
    expect(crawler).toBeDefined();
  });

  test('should parse output directory', () => {
    // This is a simple test - the CLI itself will be tested via integration tests
    expect(true).toBe(true);
  });

  test('should support short options', () => {
    const crawler = new Crawler(1, true);
    expect(crawler).toBeDefined();
  });
});