import { URL } from 'url';

export class URLUtils {
  /**
   * Validates if a given string is a valid URL
   */
  static isValidURL(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Normalizes a URL by removing trailing slashes and ensuring proper format
   */
  static normalizeURL(url: string): string {
    if (!url) return url;
    
    // Remove trailing slashes
    url = url.replace(/\/+$/, '');
    
    // Ensure it has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    
    return url;
  }

  /**
   * Extracts the domain from a URL
   */
  static getDomain(url: string): string {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (err) {
      return '';
    }
  }

  /**
   * Checks if two URLs have the same domain
   */
  static isSameDomain(url1: string, url2: string): boolean {
    try {
      const domain1 = this.getDomain(url1);
      const domain2 = this.getDomain(url2);
      return domain1 === domain2;
    } catch (err) {
      return false;
    }
  }

  /**
   * Checks if a URL is relative
   */
  static isRelativeURL(url: string): boolean {
    return !url.startsWith('http://') && !url.startsWith('https://');
  }
}