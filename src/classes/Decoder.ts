import { array, boolean, number, object } from "@hgargg-0710/one"
import assert from "node:assert"
import { readSync } from "node:fs"
import type { IDecoder } from "../interfaces/Decoder.js"

const { numbers } = array
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { isEven } = number
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
	return function (this: PreDecoder) {
		return this.temp.toString(encoding)
	}
}

abstract class PreDecoder implements IDecoder {
	private ["constructor"]: new () => this

	private _pos: number = 0
	private _descriptor: number
	private _size: number

	protected readonly temp: Buffer

	protected abstract read(): number
	protected abstract decode(buffer?: Buffer): string

	private set descriptor(newDescriptor: number) {
		this._descriptor = newDescriptor
	}

	protected get descriptor() {
		return this._descriptor
	}

	private set size(newSize: number) {
		this._size = newSize
	}

	protected get size() {
		return this._size
	}

	private set pos(newPos: number) {
		this._pos = newPos
	}

	get pos() {
		return this._pos
	}

	private copyLastOf(n: number) {
		while (n-- && this.hasChars()) this.copySingleChar()
	}

	protected advance(n: number) {
		this.pos += n
	}

	protected readBytes(length: number = 1, offset: number = 0) {
		readBytes(this.descriptor, this.temp, this.pos, length, offset)
		this.advance(length)
	}

	protected copySingleChar() {
		this.read()
	}

	protected decodeLastCopied() {
		return this.decode(this.temp)
	}

	furtherAwayAt(n: number) {
		this.copyLastOf(n)
		return this.decodeLastCopied()
	}

	hasChars() {
		return this.size > this.pos
	}

	nextChar(n = 1) {
		if (this.hasChars()) this.furtherAwayAt(n)
	}

	copy() {
		return new this.constructor()
	}

	init(source?: number, size?: number) {
		if (source) this.descriptor = source
		if (size) this.size = size
		return this
	}
}

abstract class PreMultiByteDecoder extends PreDecoder {
	private currBuffer: Buffer
	private tempRead: number
	private isTemp: boolean

	protected readonly charSizes: (Buffer | null)[]
	protected abstract decode(buffer: Buffer): string

	private static transferFromTemp(instance: PreMultiByteDecoder) {
		instance.temp.copy(instance.currBuffer)
	}

	private maybeTransferFromTemp() {
		if (!this.isTemp) PreMultiByteDecoder.transferFromTemp(this)
	}

	private assignCurrBuffer(currSize: number) {
		this.currBuffer = this.charSizes[currSize]!
	}

	private readLeftovers(currSize: number) {
		this.readBytes(currSize - this.tempRead)
	}

	private fillCurrBuffer(currSize: number) {
		this.maybeTransferFromTemp()
		this.readLeftovers(currSize)
	}

	private reassignCurrBuffer(currSize: number) {
		this.assignCurrBuffer(currSize)
		this.fillCurrBuffer(currSize)
	}

	private pickCurrSize(size: number) {
		return this.isTemp ? this.temp.length : size
	}

	private setupNewCurrBuffer(size: number) {
		this.reassignCurrBuffer(this.pickCurrSize(size))
	}

	private pickBuffer(size: number) {
		this.setupNewCurrBuffer(size)
		return this.currBuffer
	}

	protected fromTemp() {
		this.isTemp = true
		return this.temp.length
	}

	protected fillFirstDefault(length: number = 1) {
		readBytes(this.descriptor, this.temp, this.pos, length, 0)
		this.advance(length)
		this.tempRead = length
	}

	protected readBytes(length: number = 1) {
		readBytes(
			this.descriptor,
			this.currBuffer,
			this.pos,
			length,
			this.temp.length
		)

		this.advance(length)
	}

	protected copySingleChar() {
		this.pickBuffer(this.read())
	}

	protected decodeLastCopied() {
		return this.decode(this.currBuffer)
	}
}

abstract class _PreMultiByteDecoder extends PreMultiByteDecoder {
	protected decode: (buffer: Buffer) => string
}

function Decoder(
	maxSize: number,
	encoding: BufferEncoding
): new () => IDecoder {
	class decoder extends PreDecoder {
		protected readonly temp = Buffer.alloc(maxSize)
		protected read: () => number
		protected decode: () => string
	}

	extendPrototype(decoder, {
		read: ConstDescriptor(function (this: PreDecoder) {
			this.readBytes(maxSize)
			return maxSize
		}),
		decode: ConstDescriptor(getBasicDecoderFor(encoding))
	})

	return decoder
}

function MultiByteDecoder(
	maxSize: number,
	encoding: BufferEncoding,
	defaultSize: number,
	toPick: (size: number) => boolean = T
): abstract new () => _PreMultiByteDecoder {
	assert(0 < defaultSize)
	assert(defaultSize <= maxSize)

	abstract class multiByteDecoder extends _PreMultiByteDecoder {
		protected readonly charSizes = numbers(maxSize).map((size) =>
			toPick(size + 1) ? Buffer.alloc(size + 1) : null
		)

		protected readonly temp = this.charSizes[defaultSize - 1]!

		protected decode: () => string
	}

	extendPrototype(multiByteDecoder, {
		decode: ConstDescriptor(getBasicDecoderFor(encoding)),
		defaultSize: ConstDescriptor(defaultSize)
	})

	return multiByteDecoder
}

// * important pre-doc: Latin-1 and ASCII
export const Decoder8 = Decoder(1, "latin1")

// * important pre-doc: UCS2
export const Decoder16 = Decoder(2, "ucs2")

// * important pre-doc: UTF8
export class DecoderU8 extends MultiByteDecoder(4, "utf8", 1) {
	protected read(): number {
		this.fillFirstDefault(1)

		const firstByte = this.temp[0]

		// * U+0000-U+007F
		if (firstByte >> 7 === 0) return this.fromTemp()

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

// * important pre-doc: UTF16 - little endian
export class DecoderU16LE extends MultiByteDecoder(4, "utf16le", 2, isEven) {
	protected read(): number {
		this.fillFirstDefault(2)

		const firstByte = this.temp[0]

		// * U+0000-U+D7FF, U+E000-U+FFFF
		if (firstByte <= 0xd7 || firstByte >= 0xe0) return this.fromTemp()

		// * surrogate pairs
		return 4
	}
}
