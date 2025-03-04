import { useState, useRef } from 'react'

const MAX_SIZE = 20000000

export const useStreamLogfile = () => {
  const [logLines, setLogLines] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const lineBufferRef = useRef<string>('')
  const totalSizeRef = useRef<number>(0)

  const downloadLog = async (url: string) => {
    if (!url) {
      setError('Must provide URL')
      return
    }

    setLoading(true)
    setError(null)
    setLogLines([])

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(
          `Failed to fetch log file: ${response.status} ${response.statusText}`
        )
      }

      if (!response.body) {
        throw new Error('Response body is null')
      }

      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader()

      // Process the stream
      while (true) {
        const { done, value: chunk } = await reader.read()

        if (done) {
          // Handle any remaining text in the buffer
          if (lineBufferRef.current) {
            setLogLines((lines) => [...lines, lineBufferRef.current])
            lineBufferRef.current = ''
          }
          break
        }

        totalSizeRef.current = totalSizeRef.current + chunk.length
        if (totalSizeRef.current > MAX_SIZE) {
          setError('LogFile exceeds 20MB')
          setLoading(false)
          break
        }

        // Combine with any text left from previous chunk
        const text = lineBufferRef.current + chunk

        // Split by newlines
        const lines = text.split(/\r?\n/)

        // The last element might be incomplete (no newline at the end)
        lineBufferRef.current = lines.pop() || ''

        // Add complete lines to state
        if (lines.length > 0) {
          setLogLines((prevLines) => {
            // Use a function to avoid potential closure issues with large datasets
            return [...prevLines, ...lines]
          })
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error downloading log: ${err.message}`)
      } else {
        throw err
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    logLines,
    loading,
    error,
    downloadLog
  }
}
