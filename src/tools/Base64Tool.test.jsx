import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Base64Tool from './Base64Tool'

describe('Base64Tool', () => {
  it('renders input and output areas', () => {
    render(<Base64Tool />)
    expect(screen.getByLabelText('Plain Text')).toBeInTheDocument()
    expect(screen.getByLabelText('Base64')).toBeInTheDocument()
  })

  it('encodes text to base64', async () => {
    render(<Base64Tool />)
    const input = screen.getByLabelText('Plain Text')
    const output = screen.getByLabelText('Base64')
    const encodeBtn = screen.getByText('Encode →')
    
    fireEvent.change(input, { target: { value: 'Hello World' } })
    fireEvent.click(encodeBtn)
    
    await waitFor(() => {
      expect(output.value).toBe('SGVsbG8gV29ybGQ=')
    })
  })

  it('decodes base64 to text', async () => {
    render(<Base64Tool />)
    const input = screen.getByLabelText('Plain Text')
    const output = screen.getByLabelText('Base64')
    const decodeBtn = screen.getByText('← Decode')
    
    fireEvent.change(output, { target: { value: 'SGVsbG8gV29ybGQ=' } })
    fireEvent.click(decodeBtn)
    
    await waitFor(() => {
      expect(input.value).toBe('Hello World')
    })
  })

  it('handles UTF-8 characters', async () => {
    render(<Base64Tool />)
    const input = screen.getByLabelText('Plain Text')
    const output = screen.getByLabelText('Base64')
    const encodeBtn = screen.getByText('Encode →')
    
    fireEvent.change(input, { target: { value: 'Hello 世界' } })
    fireEvent.click(encodeBtn)
    
    await waitFor(() => {
      expect(output.value).toBe('SGVsbG8g5LiW55WM')
    })
  })

  it('shows error for invalid base64', async () => {
    render(<Base64Tool />)
    const output = screen.getByLabelText('Base64')
    const decodeBtn = screen.getByText('← Decode')
    
    fireEvent.change(output, { target: { value: 'not-valid-base64!' } })
    fireEvent.click(decodeBtn)
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid/)).toBeInTheDocument()
    })
  })

  it('clears input and output', () => {
    render(<Base64Tool />)
    const input = screen.getByLabelText('Plain Text')
    const clearBtn = screen.getByText('Clear')
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(clearBtn)
    
    expect(input.value).toBe('')
  })
})