import { describe, it, expect } from 'vitest'
import { formatSql, minifySql } from './sqlFormatter'

describe('sqlFormatter', () => {
  describe('formatSql', () => {
    it('formats basic SELECT statement', () => {
      const result = formatSql('select id, name from users where status = 1')
      expect(result.success).toBe(true)
      expect(result.result).toContain('SELECT')
      expect(result.result).toContain('FROM')
      expect(result.result).toContain('WHERE')
    })

    it('handles JOIN statements', () => {
      const result = formatSql('select u.id from users u left join orders o on u.id = o.user_id')
      expect(result.success).toBe(true)
      expect(result.result).toContain('LEFT JOIN')
    })

    it('handles empty input', () => {
      const result = formatSql('')
      expect(result.success).toBe(true)
      expect(result.result).toBe('')
    })

    it('handles whitespace-only input', () => {
      const result = formatSql('   \n  ')
      expect(result.success).toBe(true)
      expect(result.result).toBe('')
    })

    it('uppercases SQL keywords', () => {
      const result = formatSql('select * from table where id = 1 order by name')
      expect(result.success).toBe(true)
      expect(result.result).toContain('SELECT')
      expect(result.result).toContain('FROM')
      expect(result.result).toContain('WHERE')
      expect(result.result).toContain('ORDER BY')
    })

    it('handles subqueries', () => {
      const result = formatSql('select * from (select id from users) as u')
      expect(result.success).toBe(true)
      expect(result.result).toContain('(\n')
    })

    it('preserves table and column names', () => {
      const result = formatSql('select user_name from my_table')
      expect(result.success).toBe(true)
      expect(result.result).toContain('user_name')
      expect(result.result).toContain('my_table')
    })
  })

  describe('minifySql', () => {
    it('removes extra whitespace', () => {
      const result = minifySql('SELECT   *   FROM    users')
      expect(result.success).toBe(true)
      expect(result.result).toBe('SELECT * FROM users')
    })

    it('removes line comments', () => {
      const result = minifySql('SELECT * FROM users -- this is a comment\nWHERE id = 1')
      expect(result.success).toBe(true)
      expect(result.result).not.toContain('comment')
    })

    it('removes block comments', () => {
      const result = minifySql('SELECT /* comment */ * FROM users')
      expect(result.success).toBe(true)
      expect(result.result).toBe('SELECT * FROM users')
    })

    it('handles empty input', () => {
      const result = minifySql('')
      expect(result.success).toBe(true)
      expect(result.result).toBe('')
    })

    it('trims leading and trailing whitespace', () => {
      const result = minifySql('  SELECT * FROM users  ')
      expect(result.success).toBe(true)
      expect(result.result).toBe('SELECT * FROM users')
    })
  })
})