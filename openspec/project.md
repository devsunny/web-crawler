# Web Crawler Project

## Overview

The Web Crawler is a TypeScript-based command-line tool designed to crawl websites and extract content. It supports multiple content types including HTML pages, binary files (images, PDFs), and text documents.

## Architecture

### Core Components

1. **Crawler** - Main crawling engine that orchestrates the crawling process
2. **URL Handler** - Manages URL validation, queuing, and deduplication  
3. **HTTP Client** - Handles HTTP requests using axios
4. **HTML Handler** - Parses HTML content using cheerio
5. **Content Type Detector** - Identifies content types from MIME headers or file extensions
6. **CLI Interface** - Command-line interface for user interaction

### Key Features

- **URL Management**: Validates URLs, maintains queues, prevents duplicate crawling
- **Content Parsing**: Extracts titles, text content, and links from HTML documents  
- **Binary Handling**: Downloads and saves binary files appropriately
- **Concurrent Requests**: Efficiently manages multiple simultaneous HTTP requests
- **Robots.txt Compliance**: Respects website crawling policies (planned)
- **Command-line Interface**: Configurable depth, output directory, and robots.txt options

## Implementation Status

### Completed Tasks

1. Project structure setup with src/, test/ directories
2. TypeScript configuration with proper compiler options  
3. Package.json dependencies including axios and cheerio
4. URL validation and queue management system
5. HTTP client with axios for making requests
6. HTML parser using cheerio library
7. Text content extraction from HTML documents
8. Basic directory structure generation
9. Command-line interface implementation

### Pending Tasks

1. Robots.txt compliance checking (planned)
2. Advanced concurrent request handling 
3. Comprehensive output management and file naming conventions
4. Complete test suite with unit tests
5. Documentation for command-line interface

## Getting Started

To start using the web crawler:

```bash
# Install dependencies
npm install

# Run the crawler  
npx ts-node src/index.ts https://www.shicimingju.com/
```

### Command Line Options

The crawler supports several command line options:

- `--depth` or `-d`: Set crawl depth (default: 1)
- `--no-robot-rule`: Don't obey robots.txt rules
- `--output` or `-o`: Specify output directory (default: ./output)
- `--help` or `-h`: Show help message

### Examples

```bash
# Basic crawl
npx ts-node src/index.ts https://www.shicimingju.com/

# Crawl with depth 6, no robots.txt checking, custom output directory
npx ts-node src/index.ts --depth 6 --no-robot-rule --output my_crawl https://www.shicimingju.com/

# Short form options
npx ts-node src/index.ts -d 3 -o ./results https://example.com/
```