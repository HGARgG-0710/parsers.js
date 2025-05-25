import type { IInitializable } from "../interfaces.js"

export type ISourceDescriptor = number

export type ISize = number

export interface IDecoder extends IInitializable<[ISourceDescriptor, ISize]> {
	furtherAwayAt(i: number): string
	hasChars(): boolean
	rewind(): void
	readonly pos: number
}
