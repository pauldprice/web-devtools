import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders the app with title', () => {
    render(<App />)
    expect(screen.getByText('Developer Utilities')).toBeInTheDocument()
  })

  it('shows search input', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Search tools... (⌘K)')).toBeInTheDocument()
  })

  it('displays all tools initially', () => {
    render(<App />)
    expect(screen.getByText('Text → JS String')).toBeInTheDocument()
    expect(screen.getByText('JSON Prettifier')).toBeInTheDocument()
    expect(screen.getByText('URI Encoder')).toBeInTheDocument()
    expect(screen.getByText('UUID Generator')).toBeInTheDocument()
    expect(screen.getByText('Base64 Encode/Decode')).toBeInTheDocument()
    expect(screen.getByText('SHA-256 Hash')).toBeInTheDocument()
    expect(screen.getByText('Case Converters')).toBeInTheDocument()
    expect(screen.getByText('Timestamp ⇄ ISO')).toBeInTheDocument()
    expect(screen.getByText('JWT Decoder')).toBeInTheDocument()
  })

  it('filters tools based on search', () => {
    render(<App />)
    const searchInput = screen.getByPlaceholderText('Search tools... (⌘K)')
    
    fireEvent.change(searchInput, { target: { value: 'json' } })
    
    expect(screen.getByText('JSON Prettifier')).toBeInTheDocument()
    expect(screen.queryByText('UUID Generator')).not.toBeInTheDocument()
  })

  it('opens tool when clicked', async () => {
    render(<App />)
    const jsonTool = screen.getByText('JSON Prettifier')
    
    fireEvent.click(jsonTool)
    
    // Wait for lazy-loaded component to render
    await waitFor(() => {
      expect(screen.getByText('Format and beautify JSON data with proper indentation for better readability.')).toBeInTheDocument()
    })
  })

  it('switches between tools', async () => {
    render(<App />)
    const jsonTool = screen.getByText('JSON Prettifier')
    
    fireEvent.click(jsonTool)
    
    // Wait for JSON tool to load
    await waitFor(() => {
      expect(screen.getByText('Format and beautify JSON data with proper indentation for better readability.')).toBeInTheDocument()
    })
    
    // Click on a different tool
    const uuidTool = screen.getByText('UUID Generator')
    fireEvent.click(uuidTool)
    
    // Wait for UUID tool to load
    await waitFor(() => {
      expect(screen.queryByText('Format and beautify JSON data with proper indentation for better readability.')).not.toBeInTheDocument()
      expect(screen.getByText('Generate cryptographically secure UUID v4 identifiers.')).toBeInTheDocument()
    })
  })
})