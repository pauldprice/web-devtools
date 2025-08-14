import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import UuidGenerator from './UuidGenerator'

describe('UuidGenerator', () => {
  it('renders UUID generator interface', () => {
    render(<UuidGenerator />)
    expect(screen.getByText('UUID v4 Generator')).toBeInTheDocument()
    expect(screen.getByLabelText('Generated UUID')).toBeInTheDocument()
  })

  it('generates UUID on mount', () => {
    render(<UuidGenerator />)
    const output = screen.getByLabelText('Generated UUID')
    expect(output.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('generates new UUID on button click', () => {
    render(<UuidGenerator />)
    const output = screen.getByLabelText('Generated UUID')
    const initialUuid = output.value
    
    const generateBtn = screen.getByText('Generate New UUID')
    fireEvent.click(generateBtn)
    
    expect(output.value).not.toBe(initialUuid)
    expect(output.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('generates multiple UUIDs in bulk', () => {
    render(<UuidGenerator />)
    const countInput = screen.getByLabelText('Generate multiple')
    const generateBtn = screen.getByText('Generate 5 UUIDs')
    
    fireEvent.change(countInput, { target: { value: '5' } })
    fireEvent.click(generateBtn)
    
    const bulkOutput = screen.getByPlaceholderText(/Multiple UUIDs/)
    const uuids = bulkOutput.value.split('\n').filter(line => line.trim())
    expect(uuids).toHaveLength(5)
    uuids.forEach(uuid => {
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
  })

  it('generates uppercase UUIDs when option is selected', () => {
    render(<UuidGenerator />)
    const uppercaseCheckbox = screen.getByLabelText('Uppercase')
    const generateBtn = screen.getByText('Generate New UUID')
    
    fireEvent.click(uppercaseCheckbox)
    fireEvent.click(generateBtn)
    
    const output = screen.getByLabelText('Generated UUID')
    expect(output.value).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/)
  })

  it('generates UUIDs without hyphens when option is selected', () => {
    render(<UuidGenerator />)
    const noHyphensCheckbox = screen.getByLabelText('No hyphens')
    const generateBtn = screen.getByText('Generate New UUID')
    
    fireEvent.click(noHyphensCheckbox)
    fireEvent.click(generateBtn)
    
    const output = screen.getByLabelText('Generated UUID')
    expect(output.value).not.toContain('-')
    expect(output.value).toHaveLength(32)
  })

  it('generates UUIDs with braces when option is selected', () => {
    render(<UuidGenerator />)
    const bracesCheckbox = screen.getByLabelText('With braces')
    const generateBtn = screen.getByText('Generate New UUID')
    
    fireEvent.click(bracesCheckbox)
    fireEvent.click(generateBtn)
    
    const output = screen.getByLabelText('Generated UUID')
    expect(output.value).toMatch(/^\{[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\}$/i)
  })
})