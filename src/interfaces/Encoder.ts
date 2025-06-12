import type { ICopiable } from "../interfaces.js"

/**
 * This is an interface for representing an 
 * encoder for an unspecified format, that 
 * reads the string from teh `.toBuffer(input: string)`, 
 * and writes the encoded bytes into the `.buffer: Buffer`. 
 * 
 * The `.encodedSize: number` is purposed to specify the 
 * maximum possible size of a character encoded using 
 * the format employed by the `IEncoder`. 
*/
export interface IEncoder extends ICopiable {
	readonly buffer: Buffer
	readonly encodedSize: number
	toBuffer(input: string): void
}
