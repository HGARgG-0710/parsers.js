import { closeSync, fstatSync, openSync } from "fs"
import type { ISource } from "../interfaces.js"
import type { IDecoder } from "../interfaces/Decoder.js"

export class ReadingSource implements ISource {
	["constructor"]: new (filename: string) => this

	private readonly descriptor: number
	private readonly size: number

	private _decoded: string
	private decoder: IDecoder

	private fetchDecoded(i: number) {
		this.decoded = this.decoder.furtherAwayAt(i)
	}

	private set decoded(newDecoded: string) {
		this._decoded = newDecoded
	}

	get decoded() {
		return this._decoded
	}

	get pos() {
		return this.decoder.pos
	}

	nextChar(i: number = 1): void {
		if (this.hasChars()) this.fetchDecoded(i)
	}

	hasChars() {
		return this.decoder.hasChars()
	}

	cleanup() {
		closeSync(this.descriptor)
	}

	init(decoder?: IDecoder) {
		if (decoder) this.decoder = decoder.init(this.descriptor, this.size)
		return this
	}

	copy() {
		return new this.constructor(this.filename)
	}

	constructor(private readonly filename: string) {
		this.descriptor = openSync(filename, "r")
		this.size = fstatSync(this.descriptor).size
	}
}
