import { render, screen } from '@testing-library/react'
import { Button } from './Button'
import { describe, it, expect } from 'vitest'

describe('Button', () => {
  it('renders with primary variant by default', () => {
    render(<Button>Click</Button>)
    expect(screen.getByText('Click')).toBeInTheDocument()
  })
})
