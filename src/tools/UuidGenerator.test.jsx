import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import UuidGenerator from './UuidGenerator'

describe('UuidGenerator', () => {
  it('renders UUID generator interface', () => {
    render(<UuidGenerator />)
    expect(screen.getByText('UUID v4 Generator')).toBeInTheDocument()
  })

  it('generates new UUID on button click', () => {
    render(<UuidGenerator />)
    const generateBtn = screen.getByText('Generate New')
    
    fireEvent.click(generateBtn)
    
    // Check that a UUID-like value appears in the output
    const output = screen.getByRole('textbox')
    expect(output.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
  })

  it('has copy button', () => {
    render(<UuidGenerator />)
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })
})