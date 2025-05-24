import type { ICopiable, IIsOpen, IResource } from "../interfaces.js"

export interface IDestination extends ICopiable, IResource, IIsOpen {
	write(input: string): void
}
