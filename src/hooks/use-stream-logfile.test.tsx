import { renderHook } from '@testing-library/react'

import { useStreamLogfile } from './use-stream-logfile'

test('it does not query if there is no url', () => {
  const fetchSpy = jest.spyOn(window, 'fetch')

  renderHook(() => useStreamLogfile({ url: '' }))
  expect(fetchSpy).not.toHaveBeenCalled()
})
