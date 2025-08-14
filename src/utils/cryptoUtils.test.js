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
      expect(base64Decode(encoded)).toBe(special)
    })
  })

  describe('base64Decode', () => {
    it('decodes base64 to string', () => {
      expect(base64Decode('SGVsbG8gV29ybGQ=')).toBe('Hello World')
    })

    it('handles UTF-8 encoded base64', () => {
      expect(base64Decode('SGVsbG8g5LiW55WM')).toBe('Hello 世界')
    })

    it('handles empty string', () => {
      expect(base64Decode('')).toBe('')
    })

    it('throws on invalid base64', () => {
      expect(() => base64Decode('not-valid-base64!')).toThrow()
    })
  })

  describe('sha256Hash', () => {
    it('generates consistent hash for same input', async () => {
      const hash1 = await sha256Hash('test')
      const hash2 = await sha256Hash('test')
      expect(hash1).toBe(hash2)
    })

    it('generates different hashes for different inputs', async () => {
      const hash1 = await sha256Hash('test1')
      const hash2 = await sha256Hash('test2')
      expect(hash1).not.toBe(hash2)
    })

    it('generates 64-character hex string', async () => {
      const hash = await sha256Hash('test')
      expect(hash).toMatch(/^[0-9a-f]{64}$/i)
    })

    it('handles empty string', async () => {
      const hash = await sha256Hash('')
      expect(hash).toMatch(/^[0-9a-f]{64}$/i)
    })

    it('handles UTF-8 characters', async () => {
      const hash = await sha256Hash('Hello 世界')
      expect(hash).toMatch(/^[0-9a-f]{64}$/i)
    })
  })

  describe('decodeJwt', () => {
    const validJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    it('decodes valid JWT', () => {
      const result = decodeJwt(validJwt)
      expect(result.header.alg).toBe('HS256')
      expect(result.header.typ).toBe('JWT')
      expect(result.payload.name).toBe('John Doe')
      expect(result.payload.sub).toBe('1234567890')
      expect(result.signature).toBeTruthy()
    })

    it('handles JWT without signature', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'
      const result = decodeJwt(jwt)
      expect(result.header).toBeTruthy()
      expect(result.payload).toBeTruthy()
      expect(result.signature).toBe('')
    })

    it('throws on invalid JWT format', () => {
      expect(() => decodeJwt('not.a.jwt')).toThrow()
      expect(() => decodeJwt('only.two')).toThrow()
    })

    it('throws on invalid base64', () => {
      expect(() => decodeJwt('invalid!.base64!.parts!')).toThrow()
    })

    it('handles empty string', () => {
      expect(() => decodeJwt('')).toThrow()
    })
  })
})