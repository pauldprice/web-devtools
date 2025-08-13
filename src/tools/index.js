// Tool registry - defines all available tools

export const tools = [
  {
    id: 'js-string',
    name: 'Text → JS String',
    description: 'Convert text to JavaScript string literal',
    tags: ['escape', 'quotes'],
    component: () => import('./JsStringTool')
  },
  {
    id: 'json-pretty',
    name: 'JSON Prettifier',
    description: 'Format and beautify JSON data',
    tags: ['format', 'validate'],
    component: () => import('./JsonPrettifier')
  },
  {
    id: 'uri-encode',
    name: 'URI Encoder',
    description: 'Encode URL parameters safely',
    tags: ['url', 'query'],
    component: () => import('./UriEncoder')
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Generate UUID v4 identifiers',
    tags: ['random', 'guid'],
    component: () => import('./UuidGenerator')
  },
  {
    id: 'base64',
    name: 'Base64 Encode/Decode',
    description: 'Convert between text and Base64',
    tags: ['encode', 'decode'],
    component: () => import('./Base64Tool')
  },
  {
    id: 'sha256',
    name: 'SHA-256 Hash',
    description: 'Generate cryptographic hashes',
    tags: ['crypto', 'hash'],
    component: () => import('./Sha256Tool')
  },
  {
    id: 'case',
    name: 'Case Converters',
    description: 'Convert between naming conventions',
    tags: ['camel', 'snake', 'kebab'],
    component: () => import('./CaseConverter')
  },
  {
    id: 'timestamp',
    name: 'Timestamp ⇄ ISO',
    description: 'Convert Unix timestamps to dates',
    tags: ['date', 'unix', 'iso'],
    component: () => import('./TimestampConverter')
  },
  {
    id: 'jwt',
    name: 'JWT Decoder',
    description: 'Decode and inspect JWT tokens',
    tags: ['token', 'auth'],
    component: () => import('./JwtDecoder')
  },
  {
    id: 'sql',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries',
    tags: ['database', 'query', 'format'],
    component: () => import('./SqlFormatter')
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions',
    tags: ['pattern', 'match', 'test'],
    component: () => import('./RegexTester')
  },
  {
    id: 'password',
    name: 'Password Generator',
    description: 'Generate secure random passwords',
    tags: ['security', 'random', 'crypto'],
    component: () => import('./PasswordGenerator')
  },
  {
    id: 'diff',
    name: 'Text Diff',
    description: 'Compare and visualize text differences',
    tags: ['compare', 'merge', 'changes'],
    component: () => import('./TextDiff')
  }
];