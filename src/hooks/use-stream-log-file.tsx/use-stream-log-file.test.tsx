import { renderHook, act } from '@testing-library/react'

import { useStreamLogFile } from './use-stream-log-file'

describe('streamLogFile', () => {
  test.each([
    { url: '', displayName: 'empty string' },
    { url: 'foo', displayName: 'foo' }
  ])(`sets error for invalid URL: $displayName`, async ({ url }) => {
    const { result } = renderHook(() => useStreamLogFile())

    await act(async () => {
      result.current.streamLogfile(url)
    })
    expect(result.current.error).toBe(
      'Failed to fetch log file: Must provide a valid web URL'
    )
  })

  test.todo('sets error if response is not ok')
  test.todo('sets error if body is null')
  test.todo('sets error if fetch fails')
  test.todo('handles chunks with incomplete lines')
  test.todo('stops processing if max size is reached')
})
