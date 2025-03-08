import { useCallback, useState } from 'react'

import { URL_REGEX } from './constants'

export const useStreamingLogfile = () => {
  const [error, setError] = useState('')

  const streamLogfile = useCallback(async (url: string) => {
    try {
      if (!url || !URL_REGEX.test(url)) {
        throw new Error('Must provide a valid web URL')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to fetch log file: ${err.message}`)
      } else {
        throw err
      }
    }
  }, [])

  return {
    error,
    streamLogfile
  } as const
}
