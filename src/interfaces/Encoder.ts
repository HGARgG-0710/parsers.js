import type { ICopiable } from "../interfaces.js"

export interface IEncoder extends ICopiable {
	readonly buffer: Buffer
	readonly encodedSize: number
	toBuffer(input: string): void
}
