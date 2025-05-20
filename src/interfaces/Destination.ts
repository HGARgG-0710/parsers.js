import type { ICopiable } from "../interfaces.js"

export interface IDestination extends ICopiable {
	write(input: string): void
	cleanup(): void
}
