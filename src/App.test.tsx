import { render, screen } from '@testing-library/react'
import App from './App'

test('renders Vite and React text', () => {
  render(<App />)
  const linkElement = screen.getByText(/Vite \+ React/i)
  expect(linkElement).toBeInTheDocument()
})
