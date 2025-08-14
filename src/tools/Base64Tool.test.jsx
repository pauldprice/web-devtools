import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Base64Tool from './Base64Tool'

describe('Base64Tool', () => {
  it('renders Base64 tool', () => {
    render(<Base64Tool />)
    expect(screen.getByText('Base64 Encoder / Decoder')).toBeInTheDocument()
  })

  it('has encode and decode buttons', () => {
    render(<Base64Tool />)
    expect(screen.getByText('Encode →')).toBeInTheDocument()
    expect(screen.getByText('← Decode')).toBeInTheDocument()
  })

  it('has clear button', () => {
    render(<Base64Tool />)
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })
})