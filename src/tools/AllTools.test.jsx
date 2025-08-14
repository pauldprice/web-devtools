import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import JsStringTool from './JsStringTool'
import UriEncoder from './UriEncoder'
import Sha256Tool from './Sha256Tool'
import TimestampConverter from './TimestampConverter'
import JwtDecoder from './JwtDecoder'
import SqlFormatter from './SqlFormatter'
import RegexTester from './RegexTester'
import PasswordGenerator from './PasswordGenerator'
import TextDiff from './TextDiff'

describe('Tool Smoke Tests', () => {
  it('JsStringTool renders', () => {
    render(<JsStringTool />)
    expect(screen.getByText('Text to JavaScript String')).toBeInTheDocument()
  })

  it('UriEncoder renders', () => {
    render(<UriEncoder />)
    expect(screen.getByText('URI Parameter Encoder')).toBeInTheDocument()
  })

  it('Sha256Tool renders', () => {
    render(<Sha256Tool />)
    expect(screen.getByText('SHA-256 Hash Generator')).toBeInTheDocument()
  })

  it('TimestampConverter renders', () => {
    render(<TimestampConverter />)
    expect(screen.getByText(/Timestamp/)).toBeInTheDocument()
  })

  it('JwtDecoder renders', () => {
    render(<JwtDecoder />)
    expect(screen.getByText('JWT Decoder')).toBeInTheDocument()
  })

  it('SqlFormatter renders', () => {
    render(<SqlFormatter />)
    expect(screen.getByText('SQL Formatter')).toBeInTheDocument()
  })

  it('RegexTester renders', () => {
    render(<RegexTester />)
    expect(screen.getByText('Regex Tester & Debugger')).toBeInTheDocument()
  })

  it('PasswordGenerator renders', () => {
    render(<PasswordGenerator />)
    expect(screen.getByText('Password Generator')).toBeInTheDocument()
  })

  it('TextDiff renders', () => {
    render(<TextDiff />)
    expect(screen.getByText('Text Diff Viewer')).toBeInTheDocument()
  })
})