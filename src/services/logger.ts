export const Logger = {
  info: (message: string, metadata: Record<string, string>) => {
    return { message, metadata }
  },
  warn: (message: string, metadata: Record<string, string>) => {
    return { message, metadata }
  },
  error: (message: string, metadata: Record<string, string>) => {
    return { message, metadata }
  }
}
