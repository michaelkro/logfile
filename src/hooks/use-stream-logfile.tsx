import { useEffect, useState, useRef } from 'react'

interface UseStreamLogFileProps {
  url: string
}

const MAX_SIZE = 20000000

export const useStreamLogfile = ({ url }: UseStreamLogFileProps) => {
  const [logLines, setLogLines] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const lineBufferRef = useRef<string>('')
  const totalSizeRef = useRef<number>(0)

  useEffect(() => {
    const downloadLog = async () => {
      if (!url) {
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

        const reader = response
          .body!.pipeThrough(new TextDecoderStream())
          .getReader()

        // Process the stream
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            // Handle any remaining text in the buffer
            if (lineBufferRef.current) {
              setLogLines((lines) => [...lines, lineBufferRef.current])
              lineBufferRef.current = ''
            }
            break
          }

          totalSizeRef.current = totalSizeRef.current + value.length
          if (totalSizeRef.current > MAX_SIZE) {
            setError('LogFile exceeds 20MB')
            setLoading(false)
            break
          }

          // Combine with any text left from previous chunk
          const text = lineBufferRef.current + value

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

    downloadLog()
  }, [url])

  return {
    logLines,
    loading,
    error
  }
}
