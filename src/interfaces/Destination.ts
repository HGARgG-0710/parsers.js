import type { ICopiable, IIsOpen, IResource } from "../interfaces.js"

/**
 * This is an interface intended to represent a
 * holdable linearly-writable resource, which is unique, 
 * but can be copied [a separate `.cleanup()` 
 * call will be required]. 
 * 
 * The writing is performed to the end of the file. 
 */
export interface IDestination extends ICopiable, IResource, IIsOpen {
	write(input: string): void
}
