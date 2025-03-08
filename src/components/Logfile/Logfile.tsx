import React, { useState, useEffect } from 'react'

import { useStreamLogFile } from '../../hooks/use-stream-log-file.tsx'

import LogfileIcon from '../../../public/logfile.svg'

import './Logfile.css'

interface LogData {
  [key: string]: string
  _time: string
}

interface LogEntry {
  timestamp?: string
  raw: string
  error?: string
}

export function Logfile() {
  const [url, setUrl] = useState<string>('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const { streamLogfile, logLines, error } = useStreamLogFile()

  useEffect(() => {
    if (logLines && logLines.length > 0) {
      const parsedLogs: LogEntry[] = logLines.map((logLine) => {
        try {
          const json: LogData = JSON.parse(logLine)
          return { timestamp: new Date(json._time).toISOString(), raw: logLine }
        } catch {
          return { raw: logLine, error: 'Invalid JSON' }
        }
      })

      setLogs(parsedLogs)
    }
  }, [logLines])

  return (
    <>
      <header className="logfile-header">
        <img
          className="logfile-header__brand"
          src={LogfileIcon}
          alt="logfile-svg"
        />
        <h1>logfile</h1>
      </header>
      <main>
        <form
          className="logfile-url-form"
          onSubmit={(e) => {
            e.preventDefault()
            streamLogfile(url)
          }}
        >
          <div className="logfile-url-form__input">
            <input
              placeholder="Enter download URL for your log file"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button type="submit">Submit</button>
          </div>
          {error && (
            <span className="logfile-url-form__input__error">{error}</span>
          )}
        </form>
        {logs.length > 0 && (
          <div className="logfile-table">
            <div className="logfile-table__header">
              <div className="logfile-table__header__time-cell">Time</div>
              <div className="logfile-table__header__event-cell">Event</div>
            </div>
            <div className="logfile-table__body">
              {logs.map((log, index) => {
                return (
                  <div className="logfile-table__row" key={index}>
                    <div className="logfile-table__row__time-cell">
                      {log.timestamp}
                    </div>
                    <div className="logfile-table__row__event-cell">
                      {log.raw}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
