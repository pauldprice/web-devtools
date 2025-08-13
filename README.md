# Developer Utilities

A collection of browser-based developer tools for text and data transformations. All processing happens locally in your browser - no data ever leaves your machine.

🔗 **[Try it live](https://pauldprice.github.io/web-devtools/)**

## Features

- 🔄 **Text → JavaScript String** - Convert text to escaped JS string literals
- 📋 **JSON Prettifier** - Format and validate JSON with proper indentation  
- 🔗 **URI Encoder** - Safely encode URL parameters
- 🆔 **UUID Generator** - Generate cryptographically secure UUID v4
- 🔐 **Base64 Encode/Decode** - UTF-8 safe Base64 conversions
- #️⃣ **SHA-256 Hash** - Generate cryptographic hashes
- 📝 **Case Converters** - Convert between camelCase, snake_case, kebab-case, Title Case
- ⏰ **Timestamp ⇄ ISO** - Convert between Unix timestamps and ISO 8601 dates
- 🔓 **JWT Decoder** - Decode and inspect JWT tokens (no signature verification)

## Usage

### Online
Visit [https://pauldprice.github.io/web-devtools/](https://pauldprice.github.io/web-devtools/)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/pauldprice/web-devtools.git
   cd devtools
   ```

2. Open `index.html` in your browser or serve it locally:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve
   
   # Or simply open the file
   open index.html
   ```

## Keyboard Shortcuts

- `⌘K` / `Ctrl+K` - Focus search
- `↑↓` - Navigate tools  
- `Enter` - Select tool / Run action
- `Esc` - Clear search

## Privacy & Security

- ✅ All processing happens in your browser
- ✅ No data is sent to any server
- ✅ No cookies or tracking
- ✅ No external dependencies
- ✅ Works offline once loaded

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Ideas for Contributions
- New utility tools
- UI/UX improvements
- Bug fixes
- Documentation improvements
- Translations

### Development Guidelines
- Keep everything in a single HTML file for simplicity
- No external dependencies
- Maintain privacy-first approach (no external requests)
- Follow existing code style

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

Paul Price(https://github.com/pauldprice)
Claude Code

## Acknowledgments

Built with vanilla HTML, CSS, and JavaScript. No frameworks required!
