import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import JsonPrettifier from './JsonPrettifier'

describe('JsonPrettifier', () => {
  it('renders input and output areas', () => {
    render(<JsonPrettifier />)
    expect(screen.getByLabelText('Input JSON')).toBeInTheDocument()
    expect(screen.getByText('Formatted Output')).toBeInTheDocument()
  })

  it('prettifies valid JSON', async () => {
    render(<JsonPrettifier />)
    const input = screen.getByLabelText('Input JSON')
    const output = screen.getAllByRole('textbox')[1]
    
    fireEvent.change(input, { target: { value: '{"name":"test","value":123}' } })
    fireEvent.click(screen.getByText('Prettify'))
    
    await waitFor(() => {
      expect(output.value).toBe('{\n  "name": "test",\n  "value": 123\n}')
    })
  })

  it('shows error for invalid JSON', async () => {
    render(<JsonPrettifier />)
    const input = screen.getByLabelText('Input JSON')
    
    fireEvent.change(input, { target: { value: '{invalid json}' } })
    fireEvent.click(screen.getByText('Prettify'))
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid JSON/)).toBeInTheDocument()
    })
  })

  it('handles empty input', async () => {
    render(<JsonPrettifier />)
    const input = screen.getByLabelText('Input JSON')
    const output = screen.getAllByRole('textbox')[1]
    
    fireEvent.change(input, { target: { value: '' } })
    
    await waitFor(() => {
      expect(output.value).toBe('')
    })
  })

  it('copies formatted JSON to clipboard', async () => {
    const writeTextMock = vi.fn(() => Promise.resolve())
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock
      }
    })
    
    render(<JsonPrettifier />)
    const input = screen.getByLabelText('Input JSON')
    
    fireEvent.change(input, { target: { value: '{"test":true}' } })
    fireEvent.click(screen.getByText('Prettify'))
    
    await waitFor(() => {
      expect(screen.getAllByRole('textbox')[1].value).not.toBe('')
    })
    
    const copyButton = screen.getByText('Copy Output')
    fireEvent.click(copyButton)
    
    expect(writeTextMock).toHaveBeenCalledWith('{\n  "test": true\n}')
  })

  it('handles arrays correctly', async () => {
    render(<JsonPrettifier />)
    const input = screen.getByLabelText('Input JSON')
    const output = screen.getAllByRole('textbox')[1]
    
    fireEvent.change(input, { target: { value: '[1,2,3]' } })
    fireEvent.click(screen.getByText('Prettify'))
    
    await waitFor(() => {
      expect(output.value).toBe('[\n  1,\n  2,\n  3\n]')
    })
  })
})