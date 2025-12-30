export interface ILogger {
	log(item: string): void
	close(): void
}
