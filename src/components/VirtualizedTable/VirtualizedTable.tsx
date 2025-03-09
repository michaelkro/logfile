import { FC, useState, useRef, useEffect, useCallback } from 'react'

import { LogEntry } from '../../types'

import { ExpandableRow } from '../ExpandableRow/ExpandableRow'

import './VirtualizedTable.css'
import { COLLAPSED_ROW_HEIGHT, OVERSCAN_HEIGHT } from './constants'

interface VirtualizedLogTableRow {
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
  const tableBodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tableBodyRefValue = tableBodyRef.current

    if (tableBodyRefValue && logs.length > 0) {
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
  }, [logs])

  const getRowHeight = useCallback((): number => {
    return COLLAPSED_ROW_HEIGHT
  }, [])

  const getTotalHeight = useCallback((): number => {
    return COLLAPSED_ROW_HEIGHT * logs.length
  })

  const getVirtualizedTableRows = useCallback((): VirtualizedLogTableRow[] => {
    const virtualizedTableRows: VirtualizedLogTableRow[] = []
    let currentTop = 0

    logs.forEach((log) => {
      const rowHeight = getRowHeight()
      const rowBottom = currentTop + rowHeight

      if (
        rowBottom >= scrollTop - OVERSCAN_HEIGHT &&
        currentTop <= scrollTop + tableBodyHeight + OVERSCAN_HEIGHT
      ) {
        virtualizedTableRows.push({
          log,
          top: currentTop,
          height: rowHeight
        })
      }

      currentTop += rowHeight
    })

    return virtualizedTableRows
  }, [logs, scrollTop, tableBodyHeight, getRowHeight])

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
          <div style={{ height: getTotalHeight(), position: 'relative' }}>
            {getVirtualizedTableRows().map(({ log, top, height }) => {
              return <ExpandableRow log={log} top={top} height={height} />
            })}
          </div>
        </div>
      </div>
    )
  )
}
