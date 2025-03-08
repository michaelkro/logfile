import { useState } from 'react'

import { type LogEntry } from '../../types'

import './ExpandableRow.css'

interface ExpandableRowProps {
  index: number
  log: LogEntry
}

export const ExpandableRow: React.FC<ExpandableRowProps> = ({ index, log }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={
        expanded ? 'logfile-table__row expanded' : 'logfile-table__row'
      }
      key={index}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? (
        <>
          <div className="logfile-table__row__time-cell expanded">
            {log.timestamp}
          </div>
          <pre className="logfile-table__row__formatted-json">
            {JSON.stringify(JSON.parse(log.raw), null, 2)}
          </pre>
        </>
      ) : (
        <>
          {' '}
          <div className="logfile-table__row__time-cell">{log.timestamp}</div>
          <div className="logfile-table__row__event-cell">{log.raw}</div>
        </>
      )}
    </div>
  )
}
