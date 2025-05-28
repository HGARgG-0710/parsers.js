import { closeSync, openSync, writeSync } from "fs"
import type { IEncoder, IInitializable } from "../interfaces.js"
import type { IDestination } from "../interfaces/Destination.js"
import { ResourceManager } from "./ResourceManager.js"

const pickTruncationWriteFlag = (truncate: boolean) => (truncate ? "w" : "a")

export class WritingDestination
	implements IDestination, IInitializable<[IEncoder]>
{
	["constructor"]: new (filename: string, truncate?: boolean) => this

	private encoder: IEncoder
	private _isOpen: boolean
	private readonly destination: number

	private get encodedSize() {
		return this.encoder.encodedSize
	}

	private get buffer() {
		return this.encoder.buffer
	}

	private set isOpen(newIsOpen: boolean) {
		this._isOpen = newIsOpen
	}

	get isOpen() {
		return this._isOpen
	}

	init(encoder: IEncoder) {
		this.encoder = encoder
		return this
	}

	write(input: string) {
		this.encoder.toBuffer(input)
		writeSync(this.destination, this.buffer, 0, this.encodedSize)
	}

	cleanup() {
		if (this.isOpen) {
			closeSync(this.destination)
			this.isOpen = false
		}
	}

	copy() {
		return new this.constructor(this.filename, this.truncate)
	}

	constructor(
		private readonly filename: string,
		private readonly truncate: boolean = false
	) {
		this.destination = openSync(filename, pickTruncationWriteFlag(truncate))
		this.isOpen = true
	}
}

export namespace WritingDestination {
	export const manager = new ResourceManager(WritingDestination)
}
