# Project Context

## Purpose
The Web Crawler is a modern, TypeScript-based command-line tool designed to crawl websites and extract content. It supports multiple content types including HTML pages, binary files (images, PDFs), and text documents. The crawler automatically detects content types, respects robots.txt rules, handles concurrent requests efficiently, and saves crawled data in structured formats for further processing.

## Tech Stack
- TypeScript 5.x - Primary programming language with strong typing
- Node.js - Runtime environment 
- Cheerio - HTML parsing library for efficient DOM manipulation
- Axios - HTTP client for making web requests
- npm - Package management and dependency handling
- Jest - Testing framework (implied from project structure)
- Git - Version control system

## Project Conventions

### Code Style
- TypeScript with strict typing enforcement
- PascalCase for class names and interfaces
- camelCase for variables and functions  
- Descriptive naming conventions that clearly indicate purpose
- Modular architecture following single responsibility principle
- Comprehensive JSDoc comments for all public APIs
- Consistent indentation (2 spaces) and code formatting

### Architecture Patterns
- Clean architecture with separation of concerns:
  - HTTP layer for network operations
  - URL management layer for queue handling  
  - Content parsing layers for different file types
  - Storage layer for output management
- Dependency injection pattern for testability
- Factory patterns for content type handlers
- Promise-based asynchronous programming model
- Error-first callback approach with proper error handling

### Testing Strategy
- Unit tests for individual components (handlers, parsers)
- Integration tests for end-to-end crawling scenarios  
- Mocking of external dependencies (HTTP requests, file system)
- Test coverage targeting 80%+ code coverage
- Continuous integration pipeline with automated testing
- Snapshot testing for output format validation

### Git Workflow
- Feature branching strategy using git flow
- Semantic versioning following MAJOR.MINOR.PATCH format
- Commit messages in conventional commit format (feat, fix, docs, style)
- Pull requests required for all code changes
- Pre-commit hooks for linting and formatting checks
- Regular rebasing to keep branches up-to-date

## Domain Context
The web crawler operates within the domain of web scraping and content extraction. It's designed to:
- Respect website robots.txt policies and crawl delays
- Handle various HTTP status codes gracefully  
- Extract meaningful information from HTML documents (title, content, links)
- Download binary files with proper MIME type handling
- Maintain structured output for downstream processing
- Support configuration through both CLI arguments and config files

## Important Constraints
- Must respect robots.txt rules to avoid legal issues
- Should handle rate limiting gracefully without overwhelming target servers  
- Must be memory efficient when crawling large sites
- All HTTP requests must include appropriate User-Agent headers
- Output directory structure should be predictable and organized
- Error handling must be robust for network failures, timeouts, and malformed content

## External Dependencies
- Axios - For making HTTP requests with timeout and retry capabilities
- Cheerio - For efficient HTML parsing without browser environment
- Node.js standard library - For file system operations, URL parsing, etc.
- npm registry - For package management and dependency resolution