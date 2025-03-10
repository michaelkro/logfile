import { render, screen } from '@testing-library/react'

import { VirtualizedTable } from './VirtualizedTable'
import { OVERSCAN_HEIGHT, COLLAPSED_ROW_HEIGHT } from './constants'

const manyLogs = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  timestamp: i.toString(),
  raw: `{"level":"info","message":"Test log message ${i}"}`
}))

test('only renders rows within the visible table body + overscan', () => {
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    value: 200
  })

  render(<VirtualizedTable logs={manyLogs} loading={false} />)

  // Height of view port + top and bottom buffer / collapsed row height
  const expectedVisibleRows = Math.ceil(
    (200 + OVERSCAN_HEIGHT * 2) / COLLAPSED_ROW_HEIGHT
  )
  const actualRows = screen.queryAllByRole('row').length

  expect(actualRows).toBeLessThanOrEqual(expectedVisibleRows)
})

test.todo('renders table correctly with logs')
test.todo('getRowHeight gets the correct height')
test.todo('getTotalHeight correctly calculates total height of all rows')
test.todo('renders the correct rows when scrolling')
test.todo('clears state if new log file is loaded')
