import { FC, useState, useRef, useEffect, useCallback } from 'react'

import { LogEntry } from '../../types'

import { ExpandableRow } from '../ExpandableRow/ExpandableRow'

import { ExpandedRowsMap, RowHeightsMap, VirtualizedLogTableRow } from './types'

import './VirtualizedTable.css'
import {
  COLLAPSED_ROW_HEIGHT,
  OVERSCAN_HEIGHT,
  TABLE_MAX_WIDTH
} from './constants'

export interface VirtualizedTableProps {
  logs: LogEntry[]
}

export const VirtualizedTable: FC<VirtualizedTableProps> = ({ logs }) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [tableBodyHeight, setTableBodyHeight] = useState(0)
  const [expandedRows, setExpandedRows] = useState<ExpandedRowsMap>({})
  const [rowHeights, setRowHeights] = useState<RowHeightsMap>({})
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

  const toggleExpand = useCallback((id: number) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = {
        ...prevExpandedRows,
        [id]: !prevExpandedRows[id]
      }

      // If collapsing, remove the height
      if (!newExpandedRows[id]) {
        setRowHeights((prevHeights) => {
          const newHeights = { ...prevHeights }
          delete newHeights[id]
          return newHeights
        })
      }

      return newExpandedRows
    })
  }, [])

  const updateRowHeight = useCallback((id: number, height: number) => {
    setRowHeights((prev) => {
      if (prev[id] !== height) {
        return { ...prev, [id]: height }
      }
      return prev
    })
  }, [])

  const setHeightFromRef = useCallback(
    (id: number, element: HTMLDivElement | null) => {
      if (element && expandedRows[id]) {
        updateRowHeight(id, element.scrollHeight)
      }
    },
    [expandedRows, updateRowHeight]
  )

  const getRowHeight = useCallback(
    (id: number): number => {
      return expandedRows[id]
        ? // Fall back to an arbitrary constant when
          // the row height isn't ready
          rowHeights[id] || COLLAPSED_ROW_HEIGHT * 2
        : COLLAPSED_ROW_HEIGHT
    },
    [expandedRows, rowHeights]
  )

  const getTotalHeight = useCallback((): number => {
    return logs.reduce((height, log) => {
      return height + getRowHeight(log.id)
    }, 0)
  }, [logs, getRowHeight])

  const getVirtualizedTableRows = useCallback((): VirtualizedLogTableRow[] => {
    const virtualizedTableRows: VirtualizedLogTableRow[] = []
    let currentTop = 0

    logs.forEach((log) => {
      const rowHeight = getRowHeight(log.id)
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
          <div
            style={{
              height: getTotalHeight(),
              position: 'relative',
              width: `${TABLE_MAX_WIDTH}px`
            }}
          >
            {getVirtualizedTableRows().map(({ log, top, height }) => {
              return (
                <ExpandableRow
                  log={log}
                  top={top}
                  height={height}
                  expanded={expandedRows[log.id]}
                  toggleExpand={toggleExpand}
                  setHeightFromRef={setHeightFromRef}
                  key={log.id}
                />
              )
            })}
          </div>
        </div>
      </div>
    )
  )
}
