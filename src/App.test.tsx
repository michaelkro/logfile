import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import App from './App'
import { useStreamLogfile } from './hooks/use-stream-logfile'

const LOGS = [
  '{"_time": "2023-04-01T12:00:00Z", "level": "info", "message": "Log message 1"}',
  '{"_time": "2023-04-01T12:01:00Z", "level": "error", "message": "Log message 2"}'
]

jest.mock('../public/logs.svg', () => 'logfile-svg')
jest.mock('./hooks/use-stream-logfile', () => ({
  useStreamLogfile: jest.fn()
}))

test.todo('does not render table when there are no logs')
test('renders logs when they are downloaded successfully', async () => {
  const url = 'http://log.com'
  const downloadLog = jest.fn()

  ;(useStreamLogfile as jest.Mock).mockReturnValue({
    downloadLog,
    logLines: LOGS,
    error: null,
    loading: false
  })

  render(<App />)

  const urlInput = screen.getByRole('textbox')
  const submitButton = screen.getByRole('button', { name: /submit/i })

  expect(submitButton).toBeDisabled()

  fireEvent.change(urlInput, { target: { value: url } })
  expect(submitButton).toBeEnabled()

  fireEvent.click(submitButton)
  expect(downloadLog).toHaveBeenCalledWith(url)

  await waitFor(() => {
    expect(screen.getByText(/Log message 1/)).toBeInTheDocument()
    expect(screen.getByText(/Log message 2/)).toBeInTheDocument()

    expect(screen.getByText('2023-04-01T12:00:00.000Z')).toBeInTheDocument()
    expect(screen.getByText('2023-04-01T12:01:00.000Z')).toBeInTheDocument()
  })
})

test.todo('providing an invalid web address results with error')
test.todo('clearing the input clears any error messages')
test.todo('submit button is disabled and shows spinner when logs are loading')
