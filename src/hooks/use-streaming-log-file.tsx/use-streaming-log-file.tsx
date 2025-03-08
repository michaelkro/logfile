import { useCallback, useRef, useState } from 'react'

import { NEWLINE_REGEX, URL_REGEX } from './constants'

export const useStreamingLogfile = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [logLines, setLoglines] = useState<string[]>([])
  const lineBufferRef = useRef('')

  const streamLogfile = useCallback(async (url: string) => {
    try {
      if (!url || !URL_REGEX.test(url)) {
        throw new Error('Must provide a valid web URL')
      }

      setLoading(true)
      setError('')
      setLoglines([])
      lineBufferRef.current = ''

      const response = await fetch(url, {
        headers: { Accept: 'application/json' }
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

      while (true) {
        const { done, value: chunk } = await reader.read()

        if (done) {
          if (lineBufferRef.current) {
            // Handle any remaining text in the buffer
            setLoglines((logLines) => [...logLines, lineBufferRef.current])
            break
          }
        }

        // Add back leftover text from previous chunk
        const text = lineBufferRef.current + chunk
        const lines = text.split(NEWLINE_REGEX)

        // Could be an incomplete line
        lineBufferRef.current = lines.pop() || ''

        if (lines.length > 0) {
          setLoglines((prevState) => [...prevState, ...lines])
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
  }, [])

  return {
    error,
    loading,
    logLines,
    streamLogfile
  } as const
}
