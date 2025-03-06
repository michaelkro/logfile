import './App.css'
import { useStreamLogfile } from './hooks/use-stream-logfile'
import { useState } from 'react'

const itemHeight = 25
const windowHeight = 1500
const overscan = 20

function App() {
  const [url, setUrl] = useState<string>('')
  const [scrollTop, setScrollTop] = useState(0)
  const { downloadLog, logLines, error } = useStreamLogfile()

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  let renderedNodesCount = Math.floor(windowHeight / itemHeight) + 2 * overscan
  renderedNodesCount = Math.min(
    logLines.length - startIndex,
    renderedNodesCount
  )

  const parseLogLine = (line: string) => {
    try {
      const parsedLine = JSON.parse(line)
      const timestamp = new Date(parsedLine._time).toISOString()
      return { timestamp, json: JSON.stringify(parsedLine) }
    } catch (e) {
      console.error(e)
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
        <div
          className="log-table-container"
          onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        >
          {/* No need for height on the parent anymore, it comes from the table rows */}
          <div className="scrollable-content">
            <table className="log-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event</th>
                </tr>
              </thead>
              <tbody>
                {/* Add empty rows before for proper spacing */}
                {startIndex > 0 && (
                  <tr style={{ height: `${startIndex * itemHeight}px` }}>
                    <td colSpan={2}></td>
                  </tr>
                )}

                {/* Render visible rows */}
                {logLines
                  .slice(startIndex, startIndex + renderedNodesCount)
                  .map((line, index) => {
                    const { timestamp, json } = parseLogLine(line)
                    return (
                      <tr
                        key={startIndex + index}
                        style={{ height: `${itemHeight}px` }}
                      >
                        <td className="timestamp-cell">{timestamp}</td>
                        <td className="json-cell">{json}</td>
                      </tr>
                    )
                  })}

                {/* Add empty rows after for proper spacing */}
                {startIndex + renderedNodesCount < logLines.length && (
                  <tr
                    style={{
                      height: `${
                        (logLines.length - startIndex - renderedNodesCount) *
                        itemHeight
                      }px`
                    }}
                  >
                    <td colSpan={2}></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
