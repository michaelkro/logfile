import { render, screen, fireEvent } from '@testing-library/react'

import { useStreamLogFile } from '../../hooks/use-stream-log-file.tsx'

import { Logfile } from './Logfile'

const LOGS = [
  '{"_time": "2023-04-01T12:00:00Z", "level": "info", "message": "Log message 1"}',
  '{"_time": "2023-04-01T12:01:00Z", "level": "error", "message": "Log message 2"}'
]

jest.mock('../../hooks/use-stream-log-file.tsx', () => ({
  useStreamLogFile: jest.fn()
}))

test('renders logs that are returned', () => {
  ;(useStreamLogFile as jest.Mock).mockReturnValue({
    logLines: LOGS,
    clearError: jest.fn()
  })

  render(<Logfile />)

  const table = screen.getByRole('table')

  expect(table).toMatchSnapshot()
})

test('clicking a row shows expanded view with formatted JSON', () => {
  const LOG = LOGS[0]
  ;(useStreamLogFile as jest.Mock).mockReturnValue({
    logLines: [LOG],
    clearError: jest.fn()
  })

  render(<Logfile />)

  const row = screen.getByRole('row')
  fireEvent.click(row)

  expect(row).toMatchSnapshot()
})

test('submit button is disabled when input is empty', () => {
  ;(useStreamLogFile as jest.Mock).mockReturnValue({
    clearError: jest.fn()
  })
  render(<Logfile />)
  const submitButton = screen.getByRole('button', { name: /submit/i })

  expect(submitButton).toBeDisabled()
})

test('shows an error message if an error is returned ', () => {
  const errorMessage = 'Whoops'
  ;(useStreamLogFile as jest.Mock).mockReturnValue({
    clearError: jest.fn(),
    error: errorMessage
  })

  render(<Logfile />)

  expect(screen.getByText(errorMessage)).toBeInTheDocument()
})

test('button shows spinner when logs are loading', () => {
  ;(useStreamLogFile as jest.Mock).mockReturnValue({
    loading: true,
    clearError: jest.fn()
  })

  render(<Logfile />)

  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
})
