import React, { useState } from 'react'

import { useStreamLogFile } from '../../hooks/use-stream-log-file.tsx'

import './Logfile.css'

export function Logfile() {
  const [url, setUrl] = useState<string>('')
  const { streamLogfile, logLines, error } = useStreamLogFile()

  return (
    <>
      <header>Log Viewer</header>
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            streamLogfile(url)
          }}
        >
          <input value={url} onChange={(e) => setUrl(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
        {error}
        <ul className="log-viewer-list">
          {logLines.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </main>
    </>
  )
}
