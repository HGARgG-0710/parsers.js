export interface ILineIndex {
	readonly char: number
	readonly line: number
	nextChar(): void
	nextLine(): void
}
