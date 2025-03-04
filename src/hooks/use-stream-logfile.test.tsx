import { renderHook, act } from '@testing-library/react'

import { useStreamLogfile } from './use-stream-logfile'

test('should set error when URL is empty', async () => {
  const fetchSpy = jest.spyOn(window, 'fetch')

  const { result } = renderHook(() => useStreamLogfile())
  await act(async () => {
    result.current.downloadLog('')
  })

  expect(fetchSpy).not.toHaveBeenCalled()
  expect(result.current.error).toBe('Must provide URL')
})

test('should handle fetch failure', async () => {
  ;(window.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    status: 404,
    statusText: 'Not found'
  })

  const { result } = renderHook(() => useStreamLogfile())

  await act(async () => {
    await result.current.downloadLog('http://example.com/log.txt')
  })

  expect(result.current.error).toBe(
    'Error downloading log: Failed to fetch log file: 404 Not found'
  )
  expect(result.current.loading).toBe(false)
})

test('should handle null response body', async () => {
  ;(window.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    body: null
  })

  const { result } = renderHook(() => useStreamLogfile())

  await act(async () => {
    await result.current.downloadLog('http://log.com')
  })

  expect(result.current.error).toBe(
    'Error downloading log: Response body is null'
  )
})
