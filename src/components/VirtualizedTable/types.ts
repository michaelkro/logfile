import { type LogEntry } from '../../types'

export interface VirtualizedLogTableRow {
  log: LogEntry
  top: number
  height: number
}

export interface RowHeightsMap {
  [key: number]: number
}

export interface ExpandedRowsMap {
  [key: number]: boolean
}
