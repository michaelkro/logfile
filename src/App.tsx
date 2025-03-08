import { useEffect, useState } from 'react'

import LogIcon from '../public/logs.svg'

import { useStreamLogfile } from './hooks/use-stream-logfile'
import { LoadingSpinner } from './components/LoadingSpinner'
import './App.css'
interface LogData {
  [key: string]: string
  _time: string
}

interface LogEntry {
  timestamp?: string
  raw: string
  error?: string
}

function App() {
  const [url, setUrl] = useState<string>('')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const { downloadLog, logLines, error, clearError, loading } =
    useStreamLogfile()

  useEffect(() => {
    if (!url) {
      clearError()
    }
  }, [url, clearError])

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
          src={LogIcon}
          alt="logfile-svg"
        />
        <h1>Log Viewer</h1>
      </header>
      <main>
        <form
          className="logfile-url-form"
          onSubmit={(e) => {
            e.preventDefault()
            downloadLog(url)
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
        {logs.length > 0 && (
          <div className="logfile-viewer">
            <div className="logfile-viewer__header">
              <div className="logfile-viewer__header__time">Time</div>
              <div className="logfile-viewer__header__event">Event</div>
            </div>
            <div className="logfile-viewer__list">
              {logs.map((log, index) => {
                return (
                  <div className="logfile-viewer__list__row" key={index}>
                    <div className="logfile-viewer__list__row__time">
                      {log.timestamp}
                    </div>
                    <div className="logfile-viewer__list__row__event">
                      "{log.raw}"
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

export default App
