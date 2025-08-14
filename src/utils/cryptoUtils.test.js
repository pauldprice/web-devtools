import { describe, it, expect, vi } from 'vitest'
import { 
  generateUuid, 
  base64Encode, 
  base64Decode, 
  sha256Hash, 
  decodeJwt 
} from './cryptoUtils'

describe('cryptoUtils', () => {
  describe('generateUuid', () => {
    it('generates valid UUID v4', () => {
      const uuid = generateUuid()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })

    it('generates unique UUIDs', () => {
      const uuid1 = generateUuid()
      const uuid2 = generateUuid()
      expect(uuid1).not.toBe(uuid2)
    })

    it('falls back when crypto.randomUUID is not available', () => {
      const originalRandomUUID = crypto.randomUUID
      crypto.randomUUID = undefined
      
      const uuid = generateUuid()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      
      crypto.randomUUID = originalRandomUUID
    })
  })

  describe('base64Encode', () => {
    it('encodes string to base64', () => {
      expect(base64Encode('Hello World')).toBe('SGVsbG8gV29ybGQ=')
    })

    it('handles UTF-8 characters', () => {
      expect(base64Encode('Hello 世界')).toBe('SGVsbG8g5LiW55WM')
    })

    it('handles empty string', () => {
      expect(base64Encode('')).toBe('')
    })

    it('handles special characters', () => {
      const special = '!@#$%^&*()'
      const encoded = base64Encode(special)
      const decoded = base64Decode(encoded)
      expect(decoded.success).toBe(true)
      expect(decoded.result).toBe(special)
    })
  })

  describe('base64Decode', () => {
    it('decodes base64 to string', () => {
      const result = base64Decode('SGVsbG8gV29ybGQ=')
      expect(result.success).toBe(true)
      expect(result.result).toBe('Hello World')
    })

    it('handles UTF-8 encoded base64', () => {
      const result = base64Decode('SGVsbG8g5LiW55WM')
      expect(result.success).toBe(true)
      expect(result.result).toBe('Hello 世界')
    })

    it('handles empty string', () => {
      const result = base64Decode('')
      expect(result.success).toBe(true)
      expect(result.result).toBe('')
    })

    it('throws on invalid base64', () => {
      const result = base64Decode('not-valid-base64!')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid')
    })
  })

  describe('sha256Hash', () => {
    it('generates consistent hash for same input', async () => {
      const result1 = await sha256Hash('test')
      const result2 = await sha256Hash('test')
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result1.result).toBe(result2.result)
    })

    it('generates different hashes for different inputs', async () => {
      const result1 = await sha256Hash('test1')
      const result2 = await sha256Hash('test2')
      expect(result1.success).toBe(true)
      expect(result2.success).toBe(true)
      expect(result1.result).not.toBe(result2.result)
    })

    it('generates 64-character hex string', async () => {
      const result = await sha256Hash('test')
      expect(result.success).toBe(true)
      expect(result.result).toMatch(/^[0-9a-f]{64}$/i)
    })

    it('handles empty string', async () => {
      const result = await sha256Hash('')
      expect(result.success).toBe(true)
      expect(result.result).toMatch(/^[0-9a-f]{64}$/i)
    })

    it('handles UTF-8 characters', async () => {
      const result = await sha256Hash('Hello 世界')
      expect(result.success).toBe(true)
      expect(result.result).toMatch(/^[0-9a-f]{64}$/i)
    })
  })

  describe('decodeJwt', () => {
    const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    it('decodes valid JWT', () => {
      const result = decodeJwt(validJwt)
      expect(result.success).toBe(true)
      expect(result.header).toContain('HS256')
      expect(result.payload).toContain('John Doe')
    })

    it('handles JWT without signature', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
      const result = decodeJwt(jwt)
      expect(result.success).toBe(true)
      expect(result.header).toBeTruthy()
      expect(result.payload).toBeTruthy()
    })

    it('throws on invalid JWT format', () => {
      const result = decodeJwt('not.a.jwt')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid')
    })

    it('throws on invalid base64', () => {
      const result = decodeJwt('invalid!.base64!.parts!')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid')
    })

    it('handles empty string', () => {
      const result = decodeJwt('')
      expect(result.success).toBe(true)
      expect(result.header).toBe('{}')
      expect(result.payload).toBe('{}')
    })
  })
})