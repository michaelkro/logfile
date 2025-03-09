import { FC } from 'react'

import { LogEntry } from '../../types'

import { ExpandableRow } from '../ExpandableRow/ExpandableRow'

import './VirtualizedTable.css'

interface VirtualizedTableProps {
  logs: LogEntry[]
}

export const VirtualizedTable: FC<VirtualizedTableProps> = ({ logs }) => {
  return (
    logs.length > 0 && (
      <div className="logfile-table">
        <div className="logfile-table__header">
          <div className="logfile-table__header__time-cell">Time</div>
          <div className="logfile-table__header__event-cell">Event</div>
        </div>
        <div className="logfile-table__body">
          {logs.map((log, index) => {
            return <ExpandableRow log={log} index={index} />
          })}
        </div>
      </div>
    )
  )
}
