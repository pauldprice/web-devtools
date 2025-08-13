import { describe, it, expect } from 'vitest'
import { 
  toCamelCase, 
  toSnakeCase, 
  toKebabCase, 
  toTitleCase,
  toJsString,
  prettifyJson
} from './textUtils'

describe('textUtils', () => {
  describe('toCamelCase', () => {
    it('converts snake_case to camelCase', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld')
    })
    
    it('converts kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld')
    })
    
    it('handles Title Case', () => {
      expect(toCamelCase('Hello World')).toBe('helloWorld')
    })
    
    it('handles single word', () => {
      expect(toCamelCase('hello')).toBe('hello')
    })
  })

  describe('toSnakeCase', () => {
    it('converts camelCase to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world')
    })
    
    it('converts kebab-case to snake_case', () => {
      expect(toSnakeCase('hello-world')).toBe('hello_world')
    })
    
    it('handles Title Case', () => {
      expect(toSnakeCase('Hello World')).toBe('hello_world')
    })
    
    it('handles consecutive capitals', () => {
      expect(toSnakeCase('XMLHttpRequest')).toBe('xml_http_request')
    })
  })

  describe('toKebabCase', () => {
    it('converts camelCase to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world')
    })
    
    it('converts snake_case to kebab-case', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world')
    })
    
    it('handles Title Case', () => {
      expect(toKebabCase('Hello World')).toBe('hello-world')
    })
  })

  describe('toTitleCase', () => {
    it('converts camelCase to Title Case', () => {
      expect(toTitleCase('helloWorld')).toBe('Hello World')
    })
    
    it('converts snake_case to Title Case', () => {
      expect(toTitleCase('hello_world')).toBe('Hello World')
    })
    
    it('converts kebab-case to Title Case', () => {
      expect(toTitleCase('hello-world')).toBe('Hello World')
    })
    
    it('handles single word', () => {
      expect(toTitleCase('hello')).toBe('Hello')
    })
  })

  describe('toJsString', () => {
    it('escapes quotes', () => {
      expect(toJsString('Hello "World"')).toBe('"Hello \\"World\\""')
    })
    
    it('escapes backslashes', () => {
      expect(toJsString('C:\\Users\\test')).toBe('"C:\\\\Users\\\\test"')
    })
    
    it('escapes newlines', () => {
      expect(toJsString('Line 1\nLine 2')).toBe('"Line 1\\nLine 2"')
    })
    
    it('escapes tabs', () => {
      expect(toJsString('Col1\tCol2')).toBe('"Col1\\tCol2"')
    })
    
    it('handles multiple escape sequences', () => {
      expect(toJsString('Test:\n\t"value"')).toBe('"Test:\\n\\t\\"value\\""')
    })
  })

  describe('prettifyJson', () => {
    it('formats valid JSON object', () => {
      const result = prettifyJson('{"name":"test","value":123}')
      expect(result.success).toBe(true)
      expect(result.result).toBe('{\n  "name": "test",\n  "value": 123\n}')
    })
    
    it('formats valid JSON array', () => {
      const result = prettifyJson('[1,2,3]')
      expect(result.success).toBe(true)
      expect(result.result).toBe('[\n  1,\n  2,\n  3\n]')
    })
    
    it('returns error for invalid JSON', () => {
      const result = prettifyJson('{invalid}')
      expect(result.success).toBe(false)
      expect(result.error).toContain('JSON')
    })
    
    it('handles empty string', () => {
      const result = prettifyJson('')
      expect(result.success).toBe(false)
    })
    
    it('handles nested objects', () => {
      const result = prettifyJson('{"user":{"name":"test","age":25}}')
      expect(result.success).toBe(true)
      expect(result.result).toBe('{\n  "user": {\n    "name": "test",\n    "age": 25\n  }\n}')
    })
  })
})