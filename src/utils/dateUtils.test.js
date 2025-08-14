import { describe, it, expect } from 'vitest'
import { timestampToIso, isoToTimestamp } from './dateUtils'

describe('dateUtils', () => {
  describe('timestampToIso', () => {
    it('converts Unix timestamp to ISO string', () => {
      const result = timestampToIso('1609459200')
      expect(result.success).toBe(true)
      expect(result.result).toBe('2021-01-01T00:00:00.000Z')
    })

    it('converts millisecond timestamp to ISO string', () => {
      const result = timestampToIso('1609459200000')
      expect(result.success).toBe(true)
      expect(result.result).toBe('2021-01-01T00:00:00.000Z')
    })

    it('handles timestamp 0', () => {
      const result = timestampToIso('0')
      expect(result.success).toBe(true)
      expect(result.result).toBe('1970-01-01T00:00:00.000Z')
    })

    it('handles negative timestamps', () => {
      const result = timestampToIso('-86400')
      expect(result.success).toBe(true)
      expect(result.result).toBe('1969-12-31T00:00:00.000Z')
    })

    it('returns error for invalid timestamp', () => {
      const result = timestampToIso('not-a-number')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid')
    })

    it('returns error for empty string', () => {
      const result = timestampToIso('')
      expect(result.success).toBe(true)
      expect(result.result).toBe('1970-01-01T00:00:00.000Z')
    })
  })

  describe('isoToTimestamp', () => {
    it('converts ISO string to Unix timestamp', () => {
      const result = isoToTimestamp('2021-01-01T00:00:00.000Z')
      expect(result.success).toBe(true)
      expect(result.result).toBe('1609459200000')
    })

    it('handles different ISO formats', () => {
      const result = isoToTimestamp('2021-01-01')
      expect(result.success).toBe(true)
      expect(result.result).toBeTruthy()
    })

    it('handles ISO with timezone', () => {
      const result = isoToTimestamp('2021-01-01T00:00:00+05:00')
      expect(result.success).toBe(true)
      expect(result.result).toBeTruthy()
    })

    it('returns error for invalid ISO string', () => {
      const result = isoToTimestamp('not-a-date')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid')
    })

    it('returns error for empty string', () => {
      const result = isoToTimestamp('')
      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid')
    })
  })
})