export type IFormatterHandler = (error: Error) => string

export type ILoggerHandler = (errStr: string) => void

export type IShutdownHandler = (err: Error) => void
