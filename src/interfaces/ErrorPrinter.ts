export interface IErrorLogger {
	log(err: string): void
	close(): void
}

export type IShutdownHandler = (err: Error) => void
