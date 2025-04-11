import assert from "node:assert"

import type { ISource } from "../interfaces.js"

import { openSync, readSync, closeSync, fstatSync } from "node:fs"

import { array, object, boolean } from "@hgargg-0710/one"
const { numbers } = array
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { T } = boolean

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
	decoded: string;

	["constructor"]: new (url: string) => typeof this

	protected static fillFirstByte(instance: PreSource) {
		return PreSource.readBytes(instance, 1, 0)
	}

	static readBytes(
		instance: PreSource,
		length: number = 1,
		offset: number = 0
	) {
		readBytes(instance.source, instance.temp, instance.pos, length, offset)
		instance.pos += length
	}

	protected pos: number = 0

	protected readonly temp: Buffer

	protected abstract reader(): number
	protected abstract decoder(buffer?: Buffer): string

	protected readonly source: number
	protected readonly size: number

	hasChars() {
		return this.size > this.pos
	}

	nextChar() {
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
	protected readonly charSizes: (Buffer | null)[]

	protected static transferTemp(instance: PreMultSource) {
		instance.temp.copy(instance.currBuffer)
	}

	static readBytes(instance: PreMultSource, length: number = 1) {
		readBytes(
			instance.source,
			instance.currBuffer,
			instance.pos,
			length,
			instance.temp.length
		)

		instance.pos += length
	}

	protected abstract decoder(buffer: Buffer): string

	protected pickBuffer(size: number) {
		this.currBuffer = this.charSizes[size]!
		PreMultSource.transferTemp(this)
		PreMultSource.readBytes(this, size - this.temp.length)
		return this.currBuffer
	}

	protected lastSize: number
	protected currBuffer: Buffer

	nextChar() {
		if (this.hasChars())
			this.decoded = this.decoder(this.pickBuffer(this.reader()))
	}
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
			PreSource.readBytes(this, maxSize)
			return maxSize
		}),
		decoder: ConstDescriptor(getBasicDecoderFor(encoding))
	})

	return source
}

function MultSource(
	tempSize: number,
	maxSize: number,
	encoding: BufferEncoding,
	toPick: (size: number) => boolean = T
) {
	assert(tempSize <= maxSize)

	abstract class multSource extends PreMultSource {
		protected readonly temp = Buffer.alloc(tempSize)
		protected readonly charSizes = numbers(maxSize).map((size) =>
			toPick(size + 1) ? Buffer.alloc(size + 1) : null
		)

		protected decoder: () => string
	}

	extendPrototype(multSource, {
		decoder: ConstDescriptor(getBasicDecoderFor(encoding))
	})

	return multSource
}

// * important pre-doc: Latin-1 and ASCII
export const Source8 = Source(1, "latin1")

// * important pre-doc: UCS2
export const Source16 = Source(2, "ucs2")

// * important pre-doc: UTF8
export class SourceU8 extends MultSource(1, 4, "utf8") {
	protected reader(): number {
		PreSource.fillFirstByte(this)

		const firstByte = this.temp[0]

		// * U+0000-U+007F
		if (firstByte >> 7 === 0) return 0

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
export class SourceU16 extends MultSource(2, 4, "utf16le", (x) => x % 2 == 0) {}
