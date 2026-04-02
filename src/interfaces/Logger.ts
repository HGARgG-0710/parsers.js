export interface ILogger {
	log(item: string): void
	close(): void
}

export interface ILinePrintable {
	printLines(tabbed?: boolean): string[]
}
