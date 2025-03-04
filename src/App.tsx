import React, { useState, useRef } from 'react'

import { useStreamLogfile } from './hooks/use-stream-logfile'

const LogViewer: React.FC = () => {
  const [logFileUrl, setLogFileUrl] = useState<string>('')
  const logContainerRef = useRef<HTMLDivElement | null>(null)
  const { logLines, loading, error } = useStreamLogfile({ url: logFileUrl })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLogFileUrl('https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log')
  }

  return (
    <div className="log-viewer">
      <form className="log-viewer-form" onSubmit={handleSubmit}>
        <input placeholder="https://s3.amazonaws.com/path/to/your/logfile" />{' '}
        <button type="submit" disabled={loading}>
          Submit
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="log-container" ref={logContainerRef}>
        {logLines.map((line, index) => (
          <div key={index} className="log-line">
            {line}
          </div>
        ))}
        {loading && <div className="loading">Loading...</div>}
      </div>
    </div>
  )
}

// Example usage
const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        <h1>Log Reader</h1>
      </header>
      <main>
        <LogViewer />
      </main>
    </div>
  )
}

export default App
