# Web Crawler 🕷️

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build Status](https://github.com/devsunny/web-crawler/actions/workflows/main.yml/badge.svg)](https://github.com/devsunny/web-crawler/actions)
[![Coverage Status](https://coveralls.io/repos/github/devsunny/web-crawler/badge.svg?branch=main)](https://coveralls.io/github/devsunny/web-crawler?branch=main)

A powerful web crawler that downloads HTML pages and extracts links, with support for file-based URL inputs. This tool is designed to efficiently crawl websites while respecting robots.txt policies and handling various content types.

## Features

- 🌐 **Web Crawling**: Crawl websites starting from a given URL
- 🔍 **Content Extraction**: Extract all links, titles, and text content from HTML pages  
- 💾 **Local Storage**: Download content to local directory structure
- 🖥️ **Headless Support**: Run in headless browser mode for better performance
- 📁 **File-based Input**: Process URLs from files instead of command-line arguments
- ⚡ **Concurrent Requests**: Efficiently manage multiple simultaneous HTTP requests
- 🤖 **Robots.txt Compliance**: Respects website crawling policies (planned)
- 🔧 **Flexible Configuration**: Customizable depth, output directory, and options

## Installation

```bash
# Clone the repository
git clone https://github.com/devsunny/web-crawler.git
cd web-crawler

# Install dependencies
npm install
```

## Usage

### Basic usage with single URL:
```bash
node dist/cli.js https://example.com
```

### Using file inputs only (URL is optional when files are provided):
```bash
node dist/cli.js --links-file links.txt --parsed-links-file parsed_links.txt
```

### With additional options:
```bash
node dist/cli.js --depth 2 --headless --output ./my-output --links-file links.txt --parsed-links-file parsed_links.txt
```

## Command Line Options

- `-d, --depth <number>`: Maximum crawl depth (default: 1)
- `-h, --headless`: Run in headless mode 
- `-v, --visible`: Run in visible mode (default)
- `-o, --output <path>`: Output directory path (default: ./output)
- `-l, --links-file <path>`: Path to file containing URLs to crawl
- `-p, --parsed-links-file <path>`: Path to file containing already parsed URLs

## File Input Mode

When both `--links-file` and `--parsed-links-file` options are specified, the input URL becomes optional. The crawler will process all URLs found in these files without requiring a starting URL.

Example:
```bash
node dist/cli.js --links-file links.txt --parsed-links-file parsed_links.txt
```

This mode is particularly useful for resuming partial crawls or processing large lists of URLs.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with TypeScript and Node.js
- Uses Playwright for browser automation
- Leverages Cheerio for HTML parsing
- Powered by Axios for HTTP requests