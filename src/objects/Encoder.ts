import { number } from "@hgargg-0710/one"
import type { IEncoder } from "../interfaces/Encoder.js"

const { max } = number

export abstract class BaseEncoder implements IEncoder {
	["constructor"]: new (charCount: number) => this

	private _buffer: Uint8Array
	private _size: number
	private length: number

	protected abstract readonly maxCharBytes: number
	protected abstract encode(input: string, buffer: Uint8Array): number

	private set buffer(newBuffer: Uint8Array) {
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
		this.buffer = new Uint8Array(byteSize)
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
		this.encodedSize = this.encode(input, this.buffer)
	}

	private initialAlloc(size: number) {
		this.buffer = new Uint8Array(this.worstByteSizeEstimate(size))
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

/**
 * A class implementing the `IEncoder` interface, working
 * with the Latin1 encoding
 */
export class Encoder8 extends BaseEncoder {
	protected get maxCharBytes() {
		return 1
	}

	protected encode(input: string, buffer: Uint8Array): number {
		let written = 0
		for (const char of input) {
			buffer[written] = Math.min(char.codePointAt(0)!, 255)
			++written
		}
		return written
	}
}

/**
 * A class implementing the `IEncoder` interface, working
 * with the UTF-8 encoding
 */
export class EncoderU8 extends BaseEncoder {
	private readonly encoder = new TextEncoder()

	protected get maxCharBytes() {
		return 4
	}

	protected encode(input: string, buffer: Uint8Array): number {
		return this.encoder.encodeInto(input, buffer).written
	}
}
