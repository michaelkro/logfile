import { render, screen } from '@testing-library/react'

import { LogEntry } from '../../types'

import { ExpandableRow } from './ExpandableRow'

const toggleExpand = jest.fn()
const setHeightFromRef = jest.fn()

test('renders collapsed row correctly', () => {
  const timestamp = 'foo'
  const raw = 'rawr'
  const log: LogEntry = {
    id: 1,
    timestamp,
    raw
  }
  const top = 100
  const height = 50

  render(
    <ExpandableRow
      log={log}
      top={top}
      height={height}
      expanded={false}
      toggleExpand={toggleExpand}
      setHeightFromRef={setHeightFromRef}
    />
  )

  expect(screen.getByText(timestamp)).toBeInTheDocument()
  expect(screen.getByText(raw)).toBeInTheDocument()

  const row = screen.getByRole('row')

  expect(row).toHaveStyle({
    transform: `translateY(${top}px)`,
    height: `${height}px`
  })

  expect(row).not.toHaveClass('expanded')
})

test.todo('renders expanded row correctly')
test.todo('calls setHeightFromRef when expanded')
test.todo('calls toggleExpand with correct arguments on click')
