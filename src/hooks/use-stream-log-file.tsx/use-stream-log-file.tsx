import { useCallback, useRef, useState } from 'react'

import { Logger } from '../../services/logger'

import { NEWLINE_REGEX, URL_REGEX, MAX_FILE_SIZE } from './constants'

interface UseStreamLogFileOptions {
  maxFileSize?: number
}

export const useStreamLogFile = (options?: UseStreamLogFileOptions) => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [logLines, setLoglines] = useState<string[]>([])
  const lineBufferRef = useRef('')
  const totalSizeRef = useRef<number>(0)
  const maxFileSize = options?.maxFileSize || MAX_FILE_SIZE

  const clearError = useCallback(() => {
    setError('')
  }, [])

  const streamLogfile = useCallback(
    async (url: string) => {
      try {
        if (!url || !URL_REGEX.test(url)) {
          throw new Error('Must provide a valid web URL')
        }

        setLoading(true)
        setError('')
        setLoglines([])
        lineBufferRef.current = ''
        totalSizeRef.current = 0

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
              lineBufferRef.current = ''
            }
            break
          }

          // If file is too big, stop processing and capture an event
          totalSizeRef.current = totalSizeRef.current + chunk.length
          if (totalSizeRef.current > maxFileSize) {
            Logger.info('Max file size exceeded', {
              maxFileSize: maxFileSize.toString(),
              fileSize: totalSizeRef.current.toString()
            })
            setError(
              `The file size is greater than the allowed maximum of ${maxFileSize}. The full log file cannot be displayed.`
            )
            setLoading(false)
            break
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
    },
    [maxFileSize]
  )

  return {
    clearError,
    error,
    loading,
    logLines,
    streamLogfile
  } as const
}
