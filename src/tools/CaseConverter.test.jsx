import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CaseConverter from './CaseConverter'

describe('CaseConverter', () => {
  it('renders input and output areas', () => {
    render(<CaseConverter />)
    expect(screen.getByLabelText('Input Text')).toBeInTheDocument()
    expect(screen.getByText('camelCase')).toBeInTheDocument()
    expect(screen.getByText('snake_case')).toBeInTheDocument()
    expect(screen.getByText('kebab-case')).toBeInTheDocument()
    expect(screen.getByText('Title Case')).toBeInTheDocument()
  })

  it('converts to all cases on button click', async () => {
    render(<CaseConverter />)
    const input = screen.getByLabelText('Input Text')
    const convertBtn = screen.getByText('Convert All')
    
    fireEvent.change(input, { target: { value: 'hello world test' } })
    fireEvent.click(convertBtn)
    
    await waitFor(() => {
      const outputs = screen.getAllByRole('textbox')
      // First is input, then camelCase, snake_case, kebab-case, Title Case
      expect(outputs[1].value).toBe('helloWorldTest')
      expect(outputs[2].value).toBe('hello_world_test')
      expect(outputs[3].value).toBe('hello-world-test')
      expect(outputs[4].value).toBe('Hello World Test')
    })
  })

  it('handles camelCase input', async () => {
    render(<CaseConverter />)
    const input = screen.getByLabelText('Input Text')
    const convertBtn = screen.getByText('Convert All')
    
    fireEvent.change(input, { target: { value: 'helloWorldTest' } })
    fireEvent.click(convertBtn)
    
    await waitFor(() => {
      const outputs = screen.getAllByRole('textbox')
      expect(outputs[2].value).toBe('hello_world_test')
    })
  })

  it('handles snake_case input', async () => {
    render(<CaseConverter />)
    const input = screen.getByLabelText('Input Text')
    const convertBtn = screen.getByText('Convert All')
    
    fireEvent.change(input, { target: { value: 'hello_world_test' } })
    fireEvent.click(convertBtn)
    
    await waitFor(() => {
      const outputs = screen.getAllByRole('textbox')
      expect(outputs[1].value).toBe('helloWorldTest')
    })
  })

  it('handles empty input', () => {
    render(<CaseConverter />)
    const input = screen.getByLabelText('Input Text')
    const convertBtn = screen.getByText('Convert All')
    
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.click(convertBtn)
    
    const outputs = screen.getAllByRole('textbox')
    expect(outputs[1].value).toBe('')
  })

  it('clears all fields', () => {
    render(<CaseConverter />)
    const input = screen.getByLabelText('Input Text')
    const clearBtn = screen.getByText('Clear')
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(clearBtn)
    
    expect(input.value).toBe('')
  })
})