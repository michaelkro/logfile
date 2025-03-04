import React, { useState, useRef } from 'react'

import { useStreamLogfile } from './hooks/use-stream-logfile'

const LogViewer: React.FC = () => {
  const [logFileUrl, setLogFileUrl] = useState<string>('')
  const logContainerRef = useRef<HTMLDivElement | null>(null)
  const { logLines, loading, error } = useStreamLogfile({ url: logFileUrl })

  return (
    <div className="log-viewer">
      <div className="controls">
        <button
          onClick={() =>
            setLogFileUrl(
              'https://s3.amazonaws.com/io.cribl.c021.takehome/cribl.log'
            )
          }
          disabled={loading}
        >
          Download Log
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div
        className="log-container"
        ref={logContainerRef}
        style={{
          height: '500px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '8px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
          // backgroundColor: '#f5f5f5'
        }}
      >
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
      <h1>Log File Viewer</h1>
      <LogViewer />
    </div>
  )
}

export default App
