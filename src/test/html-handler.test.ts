import { HtmlHandler } from '../handlers/html-handler';

describe('HtmlHandler', () => {
  test('should parse HTML content correctly', () => {
    const html = `
      <html>
        <head><title>Test Title</title></head>
        <body>
          <h1>Main Heading</h1>
          <p>This is a paragraph with some text.</p>
          <a href="https://example.com">External Link</a>
          <a href="/relative-link">Relative Link</a>
          <a href="../parent-link">Parent Link</a>
        </body>
      </html>
    `;
    
    const result = HtmlHandler.parse(html, 'https://example.com/page');
    
    expect(result.title).toBe('Test Title');
    expect(result.wordCount).toBeGreaterThan(0);
    expect(result.links.length).toBeGreaterThan(0);
  });

  test('should extract links from HTML', () => {
    const html = `
      <html>
        <body>
          <a href="https://example.com">External Link</a>
          <a href="/relative-link">Relative Link</a>
          <a href="../parent-link">Parent Link</a>
          <a href="mailto:test@example.com">Email Link</a>
        </body>
      </html>
    `;
    
    const result = HtmlHandler.parse(html, 'https://example.com/page');
    
    // Should have found at least the external link
    expect(result.links).toContain('https://example.com');
    // The links are being normalized to full URLs during processing, so we check for the expected results
    expect(result.links).toContain('https://example.com/relative-link');
    expect(result.links).toContain('https://example.com/parent-link');
  });

  test('should handle empty HTML gracefully', () => {
    const result = HtmlHandler.parse('', 'https://example.com/page');
    
    expect(result.title).toBe('');
    expect(result.wordCount).toBe(0);
    expect(result.links.length).toBe(0);
  });
});