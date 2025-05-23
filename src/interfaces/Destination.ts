import type { ICopiable, IResource } from "../interfaces.js"

export interface IDestination extends ICopiable, IResource {
	write(input: string): void
}
