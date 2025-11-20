export interface IErrorLogger {
	log(err: string): void
	close(): void
}
