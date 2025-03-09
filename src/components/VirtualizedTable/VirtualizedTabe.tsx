import { useState, FC, useRef, useEffect, useCallback } from 'react'

import { LogEntry } from '../../types'

import { ExpandableRow } from '../ExpandableRow/ExpandableRow'
import { COLLAPSED_ROW_HEIGHT, OVERSCAN_HEIGHT } from './constants'

interface VisibleRow {
  index: number
  log: LogEntry
  top: number
  height: number
}

interface VirtualizedTableProps {
  logs: LogEntry[]
}

export const VirtualizedTable: FC<VirtualizedTableProps> = ({ logs }) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [tableBodyHeight, setTableBodyHeight] = useState(0)
  const tableBodyRef = useRef<HTMLDivElement | null>(null)

  // Update container height on mount and resize
  useEffect(() => {
    const tableBodyRefValue = tableBodyRef.current

    if (tableBodyRefValue) {
      setTableBodyHeight(tableBodyRefValue.clientHeight)

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setTableBodyHeight(entry.contentRect.height)
        }
      })

      resizeObserver.observe(tableBodyRefValue)

      return () => {
        if (tableBodyRefValue) {
          resizeObserver.unobserve(tableBodyRefValue)
        }
      }
    }
  }, [])

  const getVisibleRows = useCallback((): VisibleRow[] => {
    const visibleRows: VisibleRow[] = []
    let currentTop = 0

    logs.forEach((log, index) => {
      const rowHeight = COLLAPSED_ROW_HEIGHT
      const rowBottom = currentTop + rowHeight

      if (
        rowBottom >= scrollTop - OVERSCAN_HEIGHT &&
        currentTop <= scrollTop + tableBodyHeight + OVERSCAN_HEIGHT
      ) {
        visibleRows.push({
          index,
          log,
          top: currentTop,
          height: rowHeight
        })
      }

      currentTop += rowHeight
    })

    return visibleRows
  }, [logs, scrollTop, tableBodyHeight])

  return (
    logs.length > 0 && (
      <div className="logfile-table">
        <div className="logfile-table__header">
          <div className="logfile-table__header__time-cell">Time</div>
          <div className="logfile-table__header__event-cell">Event</div>
        </div>
        <div
          className="logfile-table__body"
          onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
          ref={tableBodyRef}
        >
          {getVisibleRows().map(({ index, log, top, height }) => {
            return (
              <ExpandableRow
                index={index}
                log={log}
                top={top}
                height={height}
              />
            )
          })}

          {/* {logs.map((log, index) => {
            return <ExpandableRow log={log} index={index} />
          })} */}
        </div>
      </div>
    )
  )
}
