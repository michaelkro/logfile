import './App.css'
import { useStreamLogfile } from './hooks/use-stream-logfile'
import { useState } from 'react'

function App() {
  const [url, setUrl] = useState<string>('')
  const { downloadLog, logLines, error } = useStreamLogfile()

  return (
    <>
      <header>Log Viewer</header>
      <main>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            downloadLog(url)
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

export default App
