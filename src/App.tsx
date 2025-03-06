import './App.css'
import { useStreamLogfile } from './hooks/use-stream-logfile'
import { useState } from 'react'

function App() {
  const [url, setUrl] = useState<string>('')
  const { downloadLog, logLines, error } = useStreamLogfile()

  const parseLogLine = (line: string) => {
    try {
      const parsedLine = JSON.parse(line)
      const timestamp = new Date(parsedLine._time).toISOString()
      return { timestamp, json: JSON.stringify(parsedLine) }
    } catch (e) {
      return { timestamp: 'Invalid timestamp', json: line }
    }
  }

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
        <div className="log-table-container">
          <table className="log-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {logLines.map((line, index) => {
                const { timestamp, json } = parseLogLine(line)
                return (
                  <tr key={index}>
                    <td className="timestamp-cell">{timestamp}</td>
                    <td className="json-cell">{json}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}

export default App
