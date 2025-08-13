# Developer Utilities

[![Tests](https://github.com/pauldprice/web-devtools/actions/workflows/static.yml/badge.svg)](https://github.com/pauldprice/web-devtools/actions/workflows/static.yml)

A collection of browser-based developer tools for text and data transformations. All processing happens locally in your browser - no data ever leaves your machine.

🔗 **[Try it live](https://pauldprice.github.io/web-devtools/)**

## Features

### Core Tools
- 🔄 **Text → JavaScript String** - Convert text to escaped JS string literals
- 📋 **JSON Prettifier** - Format and validate JSON with proper indentation  
- 🔗 **URI Encoder** - Safely encode URL parameters
- 🆔 **UUID Generator** - Generate cryptographically secure UUID v4
- 🔐 **Base64 Encode/Decode** - UTF-8 safe Base64 conversions
- #️⃣ **SHA-256 Hash** - Generate cryptographic hashes
- 📝 **Case Converters** - Convert between camelCase, snake_case, kebab-case, Title Case
- ⏰ **Timestamp ⇄ ISO** - Convert between Unix timestamps and ISO 8601 dates
- 🔓 **JWT Decoder** - Decode and inspect JWT tokens (no signature verification)

### Privacy-Focused Tools (New!)
- 🗄️ **SQL Formatter** - Format SQL queries without exposing schemas
- 🔍 **Regex Tester** - Test patterns with real-time highlighting  
- 🔑 **Password Generator** - Cryptographically secure passwords
- 📊 **Text Diff** - Compare texts with visual highlighting

## Usage

### Online
Visit [https://pauldprice.github.io/web-devtools/](https://pauldprice.github.io/web-devtools/)

### Direct Tool Links
Each tool has a unique URL for bookmarking and sharing:
- JSON Prettifier: `#json-pretty`
- SQL Formatter: `#sql`
- Regex Tester: `#regex`
- Password Generator: `#password`
- Text Diff: `#diff`
- [Full list of tool IDs in source](src/tools/index.js)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/pauldprice/web-devtools.git
   cd devtools
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Or build and preview the production version:
   ```bash
   npm run build
   npm run preview
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
- Build outputs to a single HTML file for easy deployment
- No runtime dependencies or external API calls
- Maintain privacy-first approach (all processing client-side)
- Follow existing React component patterns
- Use modular architecture in src/ directory

## License

MIT License - see [LICENSE](LICENSE) file for details

## Authors

👤 **Paul Price** (https://github.com/pauldprice)  
🤖 **Claude Code**

## Acknowledgments

Built with React and Vite, compiled to a single HTML file for easy deployment. No runtime dependencies or external API calls!
