import { number } from "@hgargg-0710/one"
import type { IEncoder } from "../interfaces/Encoder.js"

const { max } = number

abstract class PreEncoder implements IEncoder {
	["constructor"]: new (charCount: number) => this

	private _buffer: Buffer
	private _size: number
	private length: number

	protected abstract readonly maxCharBytes: number
	protected abstract readonly encoding: BufferEncoding

	private set buffer(newBuffer: Buffer) {
		this._buffer = newBuffer
	}

	private set encodedSize(newLength: number) {
		this._size = newLength
	}

	private get bytes() {
		return this.buffer.byteLength
	}

	private worstByteSizeEstimate(charsCount: number) {
		return charsCount * this.maxCharBytes
	}

	private doubleSpace() {
		return this.bytes * 2
	}

	private needRealloc(charCount: number) {
		return this.bytes < this.worstByteSizeEstimate(charCount)
	}

	private pickReallocSize(charCount: number) {
		return max(this.worstByteSizeEstimate(charCount), this.doubleSpace())
	}

	private realloc(byteSize: number) {
		this.buffer = Buffer.alloc(byteSize)
	}

	private maybeRealloc(charCount: number) {
		if (this.needRealloc(charCount))
			this.realloc(this.pickReallocSize(charCount))
	}

	private ensureLength(newLength: number) {
		this.maybeRealloc(newLength)
		this.length = newLength
	}

	private writeEncoded(input: string) {
		this.encodedSize = this.buffer.write(input, this.encoding)
	}

	private initialAlloc(size: number) {
		this.buffer = Buffer.alloc(this.worstByteSizeEstimate(size))
	}

	get encodedSize() {
		return this._size
	}

	get buffer() {
		return this._buffer
	}

	toBuffer(input: string) {
		this.ensureLength(input.length)
		this.writeEncoded(input)
	}

	copy() {
		return new this.constructor(this.length)
	}

	constructor(charCount: number) {
		this.initialAlloc(charCount)
	}
}

function Encoder(
	maxChars: number,
	encoding: BufferEncoding
): new (charCount: number) => IEncoder {
	return class extends PreEncoder {
		protected get maxCharBytes() {
			return maxChars
		}

		protected get encoding() {
			return encoding
		}
	}
}

// * pre-doc note: Latin-1
export const Encoder8 = Encoder(1, "latin1")

// * pre-doc note: UCS2
export const Encoder16 = Encoder(2, "ucs2")

// * pre-doc note: UTF-8
export const EncoderU8 = Encoder(4, "utf-8")

// * pre-doc note: UTF-16 little-endian
export const EncoderU16LE = Encoder(4, "utf-16le")
