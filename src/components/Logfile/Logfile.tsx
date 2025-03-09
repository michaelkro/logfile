import { useState, useEffect } from 'react'

import { useStreamLogFile } from '../../hooks/use-stream-log-file.tsx'
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner.tsx'
import { VirtualizedTable } from '../VirtualizedTable/VirtualizedTable.tsx'

import { type LogEntry } from '../../types.ts'

import LogfileIcon from '../../assets/logfile.svg'

import './Logfile.css'

interface LogData {
  [key: string]: string
  _time: string
}

export function Logfile() {
  const [url, setUrl] = useState<string>('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const { streamLogfile, logLines, error, loading, clearError } =
    useStreamLogFile()

  useEffect(() => {
    if (!url) {
      clearError()
    }
  }, [url, clearError])

  useEffect(() => {
    if (logLines && logLines.length > 0) {
      const parsedLogs: LogEntry[] = logLines.map((logLine, index) => {
        try {
          const json: LogData = JSON.parse(logLine)
          return {
            id: index,
            timestamp: new Date(json._time).toISOString(),
            raw: logLine
          }
        } catch {
          return { id: index, raw: logLine, error: 'Invalid JSON' }
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
            <button disabled={!url || loading} type="submit">
              {loading ? <LoadingSpinner /> : 'Submit'}
            </button>
          </div>
          {error && (
            <span className="logfile-url-form__input__error">{error}</span>
          )}
        </form>
        <VirtualizedTable logs={logs} loading={loading} />
      </main>
    </>
  )
}
