import { useState, useRef, useCallback } from 'react'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const urlRegex =
  /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
interface UseStreamLogfileOptions {
  maxFileSize?: number
}

export const useStreamLogfile = (options?: UseStreamLogfileOptions) => {
  const [logLines, setLogLines] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const lineBufferRef = useRef<string>('')
  const totalSizeRef = useRef<number>(0)
  const maxFileSize = options?.maxFileSize || MAX_FILE_SIZE

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const downloadLog = useCallback(
    async (url: string) => {
      try {
        if (!url) {
          throw new Error('Must provide URL')
        }

        if (!urlRegex.test(url)) {
          throw new Error('Must provide valid web URL')
        }

        setLoading(true)
        setError(null)
        setLogLines([])
        totalSizeRef.current = 0
        lineBufferRef.current = ''

        const response = await fetch(url, {
          headers: {
            Accept: 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`)
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
          if (totalSizeRef.current > maxFileSize) {
            setError(`Download is greater than ${maxFileSize}`)
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
          setError(`Failed to fetch log file: ${err.message}`)
        } else {
          throw err
        }
      } finally {
        setLoading(false)
      }
    },
    [maxFileSize]
  )

  return {
    logLines,
    loading,
    error,
    clearError,
    downloadLog
  } as const
}
