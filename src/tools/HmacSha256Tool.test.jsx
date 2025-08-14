import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HmacSha256Tool from './HmacSha256Tool'

// Mock clipboard
const mockWriteText = vi.fn()
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText
  }
})

describe('HmacSha256Tool', () => {
  beforeEach(() => {
    mockWriteText.mockClear()
  })

  it('renders HMAC-SHA256 tool interface', () => {
    render(<HmacSha256Tool />)
    expect(screen.getByText('HMAC-SHA256 Generator & Verifier')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
    expect(screen.getByLabelText('Secret Key')).toBeInTheDocument()
  })

  it('has default secret key of BBB', () => {
    render(<HmacSha256Tool />)
    const keyInput = screen.getByLabelText('Secret Key')
    expect(keyInput.value).toBe('BBB')
  })

  it('generates HMAC signature', async () => {
    render(<HmacSha256Tool />)
    const messageInput = screen.getByLabelText('Message')
    const keyInput = screen.getByLabelText('Secret Key')
    const generateBtn = screen.getByText('Generate HMAC')
    
    fireEvent.change(messageInput, { target: { value: 'Hello World' } })
    fireEvent.change(keyInput, { target: { value: 'mySecret' } })
    fireEvent.click(generateBtn)
    
    await waitFor(() => {
      const output = screen.getByPlaceholderText('Signature will appear here...')
      expect(output.value).toMatch(/^[a-f0-9]{64}$/) // HMAC-SHA256 is 64 hex chars
    })
  })

  it('generates consistent HMAC for same input', async () => {
    render(<HmacSha256Tool />)
    const messageInput = screen.getByLabelText('Message')
    const keyInput = screen.getByLabelText('Secret Key')
    const generateBtn = screen.getByText('Generate HMAC')
    
    fireEvent.change(messageInput, { target: { value: 'Test Message' } })
    fireEvent.change(keyInput, { target: { value: 'TestKey' } })
    
    // Generate first HMAC
    fireEvent.click(generateBtn)
    
    let firstHmac
    await waitFor(() => {
      const output = screen.getByPlaceholderText('Signature will appear here...')
      firstHmac = output.value
      expect(firstHmac).toMatch(/^[a-f0-9]{64}$/)
    })
    
    // Generate again with same inputs
    fireEvent.click(generateBtn)
    
    await waitFor(() => {
      const output = screen.getByPlaceholderText('Signature will appear here...')
      expect(output.value).toBe(firstHmac)
    })
  })

  it('generates different HMAC for different keys', async () => {
    render(<HmacSha256Tool />)
    const messageInput = screen.getByLabelText('Message')
    const keyInput = screen.getByLabelText('Secret Key')
    const generateBtn = screen.getByText('Generate HMAC')
    
    fireEvent.change(messageInput, { target: { value: 'Same Message' } })
    fireEvent.change(keyInput, { target: { value: 'Key1' } })
    fireEvent.click(generateBtn)
    
    let firstHmac
    await waitFor(() => {
      const output = screen.getByPlaceholderText('Signature will appear here...')
      firstHmac = output.value
      expect(firstHmac).toMatch(/^[a-f0-9]{64}$/)
    })
    
    // Change key
    fireEvent.change(keyInput, { target: { value: 'Key2' } })
    fireEvent.click(generateBtn)
    
    await waitFor(() => {
      const output = screen.getByPlaceholderText('Signature will appear here...')
      expect(output.value).not.toBe(firstHmac)
    })
  })

  it('switches between sign and verify modes', () => {
    render(<HmacSha256Tool />)
    const verifyBtn = screen.getAllByText('Verify Signature')[0] // Mode button
    
    fireEvent.click(verifyBtn)
    
    expect(screen.getByLabelText('Signature to Verify')).toBeInTheDocument()
    
    const signBtn = screen.getByText('Generate Signature')
    fireEvent.click(signBtn)
    
    expect(screen.getByText('Generate HMAC')).toBeInTheDocument()
  })

  it('verifies valid signature', async () => {
    render(<HmacSha256Tool />)
    const messageInput = screen.getByLabelText('Message')
    const keyInput = screen.getByLabelText('Secret Key')
    const generateBtn = screen.getByText('Generate HMAC')
    
    // Generate signature first
    fireEvent.change(messageInput, { target: { value: 'Verify Me' } })
    fireEvent.change(keyInput, { target: { value: 'VerifyKey' } })
    fireEvent.click(generateBtn)
    
    let signature
    await waitFor(() => {
      const output = screen.getByPlaceholderText('Signature will appear here...')
      signature = output.value
      expect(signature).toMatch(/^[a-f0-9]{64}$/)
    })
    
    // Switch to verify mode
    const verifyModeBtn = screen.getAllByText('Verify Signature')[0] // Mode button
    fireEvent.click(verifyModeBtn)
    
    const verifyInput = screen.getByLabelText('Signature to Verify')
    const verifyBtn = screen.getAllByText('Verify Signature')[1] // Action button
    
    fireEvent.change(verifyInput, { target: { value: signature } })
    fireEvent.click(verifyBtn)
    
    await waitFor(() => {
      expect(screen.getByText(/✅ Valid signature/)).toBeInTheDocument()
    })
  })

  it('detects invalid signature', async () => {
    render(<HmacSha256Tool />)
    const messageInput = screen.getByLabelText('Message')
    const keyInput = screen.getByLabelText('Secret Key')
    
    // Switch to verify mode
    const verifyModeBtn = screen.getAllByText('Verify Signature')[0] // Mode button
    fireEvent.click(verifyModeBtn)
    
    fireEvent.change(messageInput, { target: { value: 'Test Message' } })
    fireEvent.change(keyInput, { target: { value: 'TestKey' } })
    
    const verifyInput = screen.getByLabelText('Signature to Verify')
    const verifyBtn = screen.getAllByText('Verify Signature')[1] // Action button
    
    // Use an obviously wrong signature
    fireEvent.change(verifyInput, { target: { value: '0000000000000000000000000000000000000000000000000000000000000000' } })
    fireEvent.click(verifyBtn)
    
    await waitFor(() => {
      expect(screen.getByText(/❌ Invalid signature/)).toBeInTheDocument()
    })
  })

  it('shows error when message is empty', async () => {
    render(<HmacSha256Tool />)
    const generateBtn = screen.getByText('Generate HMAC')
    
    fireEvent.click(generateBtn)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a message')).toBeInTheDocument()
    })
  })

  it('shows error when secret key is empty', async () => {
    render(<HmacSha256Tool />)
    const messageInput = screen.getByLabelText('Message')
    const keyInput = screen.getByLabelText('Secret Key')
    const generateBtn = screen.getByText('Generate HMAC')
    
    fireEvent.change(messageInput, { target: { value: 'Test' } })
    fireEvent.change(keyInput, { target: { value: '' } })
    fireEvent.click(generateBtn)
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a secret key')).toBeInTheDocument()
    })
  })

  it('copies signature to clipboard', async () => {
    render(<HmacSha256Tool />)
    const messageInput = screen.getByLabelText('Message')
    const generateBtn = screen.getByText('Generate HMAC')
    
    fireEvent.change(messageInput, { target: { value: 'Copy Test' } })
    fireEvent.click(generateBtn)
    
    let signature
    await waitFor(() => {
      const output = screen.getByPlaceholderText('Signature will appear here...')
      signature = output.value
      expect(signature).toMatch(/^[a-f0-9]{64}$/)
    })
    
    const copyBtn = screen.getByText('Copy Signature')
    fireEvent.click(copyBtn)
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(signature)
    })
    
    expect(screen.getByText('Copied!')).toBeInTheDocument()
  })

  it('clears all inputs', () => {
    render(<HmacSha256Tool />)
    const messageInput = screen.getByLabelText('Message')
    const keyInput = screen.getByLabelText('Secret Key')
    const clearBtn = screen.getByText('Clear')
    
    fireEvent.change(messageInput, { target: { value: 'Clear me' } })
    fireEvent.change(keyInput, { target: { value: 'CustomKey' } })
    
    fireEvent.click(clearBtn)
    
    expect(messageInput.value).toBe('')
    expect(keyInput.value).toBe('BBB') // Resets to default
  })
})