import { type LogEntry } from '../../types'

import './ExpandableRow.css'

interface ExpandableRowProps {
  log: LogEntry
  top: number
  height: number
  expanded: boolean
  toggleExpand: (id: number) => void
  setHeightFromRef: (id: number, element: HTMLDivElement | null) => void
}

export const ExpandableRow: React.FC<ExpandableRowProps> = ({
  log,
  top,
  height,
  expanded,
  toggleExpand,
  setHeightFromRef
}) => {
  return (
    <div
      role="row"
      className={
        expanded ? 'logfile-table__row expanded' : 'logfile-table__row'
      }
      style={{ transform: `translateY(${top}px)`, height }}
      key={log.id}
      onClick={() => toggleExpand(log.id)}
    >
      {expanded ? (
        <div ref={(el) => setHeightFromRef(log.id, el)}>
          <div className="logfile-table__row__time-cell expanded">
            {log.timestamp}
          </div>
          <pre className="logfile-table__row__formatted-json">
            {JSON.stringify(JSON.parse(log.raw), null, 2)}
          </pre>
        </div>
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
