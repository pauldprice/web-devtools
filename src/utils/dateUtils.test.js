import { describe, it, expect } from 'vitest'
import { timestampToIso, isoToTimestamp, getCurrentTimestamp } from './dateUtils'

describe('dateUtils', () => {
  describe('timestampToIso', () => {
    it('converts Unix timestamp to ISO string', () => {
      const result = timestampToIso('1609459200')
      expect(result).toBe('2021-01-01T00:00:00.000Z')
    })

    it('converts millisecond timestamp to ISO string', () => {
      const result = timestampToIso('1609459200000')
      expect(result).toBe('2021-01-01T00:00:00.000Z')
    })

    it('handles timestamp 0', () => {
      const result = timestampToIso('0')
      expect(result).toBe('1970-01-01T00:00:00.000Z')
    })

    it('handles negative timestamps', () => {
      const result = timestampToIso('-86400')
      expect(result).toBe('1969-12-31T00:00:00.000Z')
    })

    it('returns error for invalid timestamp', () => {
      const result = timestampToIso('not-a-number')
      expect(result).toContain('Invalid')
    })

    it('returns error for empty string', () => {
      const result = timestampToIso('')
      expect(result).toContain('Invalid')
    })
  })

  describe('isoToTimestamp', () => {
    it('converts ISO string to Unix timestamp', () => {
      const result = isoToTimestamp('2021-01-01T00:00:00.000Z')
      expect(result.unix).toBe(1609459200)
      expect(result.ms).toBe(1609459200000)
    })

    it('handles different ISO formats', () => {
      const result = isoToTimestamp('2021-01-01')
      expect(result.unix).toBeTruthy()
      expect(result.ms).toBeTruthy()
    })

    it('handles ISO with timezone', () => {
      const result = isoToTimestamp('2021-01-01T00:00:00+05:00')
      expect(result.unix).toBeTruthy()
      expect(result.ms).toBeTruthy()
    })

    it('returns error for invalid ISO string', () => {
      const result = isoToTimestamp('not-a-date')
      expect(result.error).toContain('Invalid')
    })

    it('returns error for empty string', () => {
      const result = isoToTimestamp('')
      expect(result.error).toContain('Invalid')
    })
  })

  describe('getCurrentTimestamp', () => {
    it('returns current timestamp', () => {
      const before = Date.now()
      const result = getCurrentTimestamp()
      const after = Date.now()
      
      expect(result.unix).toBeGreaterThanOrEqual(Math.floor(before / 1000))
      expect(result.unix).toBeLessThanOrEqual(Math.floor(after / 1000))
      expect(result.ms).toBeGreaterThanOrEqual(before)
      expect(result.ms).toBeLessThanOrEqual(after)
    })

    it('returns ISO string', () => {
      const result = getCurrentTimestamp()
      expect(result.iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })
  })
})