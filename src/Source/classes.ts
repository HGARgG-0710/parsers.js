import { array, boolean, number, object } from "@hgargg-0710/one"
import assert from "node:assert"
import { closeSync, fstatSync, openSync, readSync } from "node:fs"
import type { ISource } from "./interfaces.js"

const { numbers } = array
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { isEven } = number
const { T } = boolean

const FROM_TEMP = -1

function readBytes(
	source: number,
	target: Buffer,
	pos: number,
	length: number = 1,
	offset: number = 0
) {
	readSync(source, target, offset, length, pos)
}

function getBasicDecoderFor(encoding: BufferEncoding) {
	return function (this: PreSource) {
		return this.temp.toString(encoding)
	}
}

abstract class PreSource implements ISource {
	["constructor"]: new (url: string) => this

	decoded: string

	protected advance(n: number) {
		this.pos += n
	}

	protected readBytes(length: number = 1, offset: number = 0) {
		readBytes(this.source, this.temp, this.pos, length, offset)
		this.advance(length)
	}

	pos: number = 0
	protected readonly temp: Buffer

	protected abstract reader(): number
	protected abstract decoder(buffer?: Buffer): string

	protected readonly source: number
	protected readonly size: number

	hasChars() {
		return this.size > this.pos
	}

	nextChar(n = 1) {
		if (n > 0) this.advance(n - 1)
		if (this.hasChars()) {
			this.reader()
			this.decoded = this.decoder(this.temp)
		}
	}

	cleanup() {
		closeSync(this.source)
	}

	copy() {
		return new this.constructor(this.url)
	}

	constructor(protected readonly url: string) {
		this.source = openSync(url, "r")
		this.size = fstatSync(this.source).size
	}
}

abstract class PreMultSource extends PreSource {
	protected fillFirstDefault(length: number = 1) {
		readBytes(this.source, this.temp, this.pos, length, 0)
		this.advance(length)
		this.tempRead = length
	}

	protected static transferTemp(instance: PreMultSource) {
		instance.temp.copy(instance.currBuffer)
	}

	protected readBytes(length: number = 1) {
		readBytes(
			this.source,
			this.currBuffer,
			this.pos,
			length,
			this.temp.length
		)

		this.advance(length)
	}

	protected abstract decoder(buffer: Buffer): string

	protected pickBuffer(size: number) {
		const isTemp = size === FROM_TEMP
		const currSize = isTemp ? this.temp.length : size

		this.currBuffer = this.charSizes[currSize]!
		if (!isTemp) PreMultSource.transferTemp(this)

		this.readBytes(currSize - this.tempRead)
		return this.currBuffer
	}

	protected readonly charSizes: (Buffer | null)[]

	protected tempRead: number
	protected currBuffer: Buffer

	nextChar(n = 1) {
		if (n > 0) this.advance(n - 1)
		if (this.hasChars())
			this.decoded = this.decoder(this.pickBuffer(this.reader()))
	}
}

abstract class _PreMultSource extends PreMultSource {
	protected decoder: (buffer: Buffer) => string
}

function Source(
	maxSize: number,
	encoding: BufferEncoding
): new (url: string) => ISource {
	class source extends PreSource {
		protected readonly temp = Buffer.alloc(maxSize)
		protected reader: () => number
		protected decoder: () => string
	}

	extendPrototype(source, {
		reader: ConstDescriptor(function (this: PreSource) {
			this.readBytes(maxSize)
			return maxSize
		}),
		decoder: ConstDescriptor(getBasicDecoderFor(encoding))
	})

	return source
}

function MultSource(
	maxSize: number,
	encoding: BufferEncoding,
	defaultSize: number,
	toPick: (size: number) => boolean = T
): abstract new (url: string) => _PreMultSource {
	assert(0 < defaultSize)
	assert(defaultSize <= maxSize)

	abstract class multSource extends _PreMultSource {
		protected readonly charSizes = numbers(maxSize).map((size) =>
			toPick(size + 1) ? Buffer.alloc(size + 1) : null
		)

		protected readonly temp = this.charSizes[defaultSize - 1]!

		protected declare decoder: () => string
	}

	extendPrototype(multSource, {
		decoder: ConstDescriptor(getBasicDecoderFor(encoding)),
		defaultSize: ConstDescriptor(defaultSize)
	})

	return multSource
}

// * important pre-doc: Latin-1 and ASCII
export const Source8 = Source(1, "latin1")

// * important pre-doc: UCS2
export const Source16 = Source(2, "ucs2")

// * important pre-doc: UTF8
export class SourceU8 extends MultSource(4, "utf8", 1) {
	protected reader(): number {
		this.fillFirstDefault(1)

		const firstByte = this.temp[0]

		// * U+0000-U+007F
		if (firstByte >> 7 === 0) return FROM_TEMP

		// * U+0080-U+07FF
		if (firstByte & 0b11000000) return 1

		// * U+0800-U+FFFF
		if (firstByte & 0b11100000) return 2

		// * U+010000-U+10FFFF
		if (firstByte & 0b11110000) return 3

		// invalid codepoint
		throw new RangeError("Invalid UTF8-encoded codepoint given")
	}
}

// * important pre-doc: UTF16
export class SourceU16 extends MultSource(4, "utf16le", 2, isEven) {
	protected reader(): number {
		this.fillFirstDefault(2)

		const firstByte = this.temp[0]

		// * U+0000-U+D7FF, U+E000-U+FFFF
		if (firstByte <= 0xd7 || firstByte >= 0xe0) return FROM_TEMP

		// * surrogate pairs
		return 4
	}
}
