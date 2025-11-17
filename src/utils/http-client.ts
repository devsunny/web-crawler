import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class HttpClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'WebCrawler/1.0',
      },
    });
    
    // Add a response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('HTTP request failed:', error.message);
        return Promise.reject(error);
      }
    );
  }
  
  /**
   * Fetches content from a URL
   */
  async get(url: string): Promise<AxiosResponse> {
    try {
      const response = await this.client.get(url, {
        timeout: 10000,
      });
      
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`HTTP Error ${error.response?.status}: ${error.message}`);
      }
      throw error;
    }
  }
  
  /**
   * Gets the content type of a URL
   */
  async getContentType(url: string): Promise<string> {
    try {
      const response = await this.client.head(url, {
        timeout: 5000,
      });
      
      return response.headers['content-type'] || 'unknown';
    } catch (error) {
      // If HEAD request fails, fallback to GET
      try {
        const response = await this.get(url);
        return response.headers['content-type'] || 'unknown';
      } catch (fallbackError: any) {
        console.warn(`Could not determine content type for ${url}:`, fallbackError.message);
        return 'unknown';
      }
    }
  }
}