import { URLUtils } from '../utils/url-utils';

describe('URLUtils', () => {
  test('should validate valid URLs', () => {
    expect(URLUtils.isValidURL('https://example.com')).toBe(true);
    expect(URLUtils.isValidURL('http://test.org/page')).toBe(true);
    expect(URLUtils.isValidURL('ftp://files.example.com')).toBe(true);
  });

  test('should reject invalid URLs', () => {
    expect(URLUtils.isValidURL('not-a-url')).toBe(false);
    expect(URLUtils.isValidURL('')).toBe(false);
    expect(URLUtils.isValidURL('http://')).toBe(false);
  });

  test('should normalize URLs', () => {
    expect(URLUtils.normalizeURL('https://example.com/')).toBe('https://example.com');
    expect(URLUtils.normalizeURL('http://test.org/page/')).toBe('http://test.org/page');
    expect(URLUtils.normalizeURL('example.com')).toBe('http://example.com');
  });

  test('should extract domains correctly', () => {
    expect(URLUtils.getDomain('https://example.com/path')).toBe('example.com');
    expect(URLUtils.getDomain('http://subdomain.test.org/page')).toBe('subdomain.test.org');
    expect(URLUtils.getDomain('https://www.google.com/search?q=test')).toBe('www.google.com');
  });

  test('should check same domain correctly', () => {
    expect(URLUtils.isSameDomain('https://example.com/page1', 'https://example.com/page2')).toBe(true);
    expect(URLUtils.isSameDomain('https://example.com/page1', 'https://test.org/page2')).toBe(false);
    expect(URLUtils.isSameDomain('http://sub.example.com/page1', 'https://example.com/page2')).toBe(false);
  });

  test('should detect relative URLs correctly', () => {
    expect(URLUtils.isRelativeURL('/page')).toBe(true);
    expect(URLUtils.isRelativeURL('../page')).toBe(true);
    expect(URLUtils.isRelativeURL('page')).toBe(true);
    expect(URLUtils.isRelativeURL('https://example.com/page')).toBe(false);
  });
});