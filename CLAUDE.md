# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Developer utilities web application - a single-page application providing 9 text/data transformation tools. All functionality runs client-side with no external dependencies or data transmission.

## Architecture

**Single-file application**: All HTML, CSS, and JavaScript are contained in `devtools.html`. This is intentional for simplicity and portability.

## Development Commands

This is a static HTML application with no build process:
- **Run locally**: Open `devtools.html` directly in a browser
- **Serve locally**: Use any static file server (e.g., `python -m http.server` or `npx serve`)
- **No build/test/lint commands** - the application is ready to use as-is

## Key Implementation Details

### Available Tools
1. Text → JavaScript String Literal converter
2. JSON Prettifier
3. URI Parameter Encoder  
4. UUID v4 Generator (uses Web Crypto API)
5. Base64 Encoder/Decoder (UTF-8 safe)
6. SHA-256 Hash Generator
7. Case Converters (camelCase, snake_case, kebab-case, Title Case)
8. Unix Timestamp ↔ ISO 8601 converter
9. JWT Decoder (no signature verification)

### Technical Patterns
- **Crypto operations**: Use Web Crypto API with fallback to Math.random() for UUID generation
- **Text encoding**: Always use TextEncoder/TextDecoder for UTF-8 handling
- **Error handling**: Display user-friendly error messages in output areas
- **Clipboard**: Implement copy buttons using navigator.clipboard.writeText()
- **UI feedback**: Show brief success messages that fade after 2 seconds

### Code Style
- Pure vanilla JavaScript (ES6+)
- No external libraries or frameworks
- CSS custom properties for theming
- Inline styles and scripts within the single HTML file

### Important Constraints
- **Privacy-first**: No data should ever leave the user's machine
- **No dependencies**: Keep everything self-contained in one file
- **Browser compatibility**: Target modern browsers with ES6+ support
- **Responsive design**: Maintain mobile-friendly grid layout