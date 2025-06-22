import { array, boolean, number, object, type } from "@hgargg-0710/one"
import assert from "node:assert"
import { readSync } from "node:fs"
import type {
	IDecoder,
	ISize,
	ISourceDescriptor
} from "../interfaces/Decoder.js"
import { Initializable } from "./Initializer.js"

const { numbers } = array
const { extendPrototype } = object
const { ConstDescriptor } = object.descriptor
const { isEven } = number
const { T } = boolean
const { isUndefined } = type

function readBytes(
	source: number,
	target: Buffer,
	pos: number,
	length: number = 1,
	offset: number = 0
) {
	readSync(source, target, offset, length, pos)
}

function getBasicDecodingMethodFor(encoding: BufferEncoding) {
	return function (this: PreDecoder) {
		return this.temp.toString(encoding)
	}
}

const preDecoderInitializer = {
	init(target: PreDecoder, source?: number, size?: number) {
		if (!isUndefined(source)) target.setDescriptor(source)
		if (!isUndefined(size)) target.setSize(size)
	}
}

abstract class PreDecoder
	extends Initializable<[number, number]>
	implements IDecoder
{
	private ["constructor"]: new (source?: number, size?: number) => this

	private _pos: number = 0
	private _descriptor: ISourceDescriptor
	private _size: ISize

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

	protected get initializer() {
		return preDecoderInitializer
	}

	get pos() {
		return this._pos
	}

	private copyLastOf(n: number) {
		while (n-- && this.hasChars()) this.copySingleChar()
	}

	private furtherAwayAt(n: number) {
		this.copyLastOf(n)
		return this.decodeLastCopied()
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

	setDescriptor(source: number) {
		this.descriptor = source
	}

	setSize(size: number) {
		this.size = size
	}

	hasChars() {
		return this.size > this.pos
	}

	nextChar(n = 1) {
		return this.hasChars() && this.furtherAwayAt(n)
	}

	copy() {
		return new this.constructor(this.descriptor, this.size)
	}

	rewind() {
		this.pos = 0
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
		decode: ConstDescriptor(getBasicDecodingMethodFor(encoding))
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
		decode: ConstDescriptor(getBasicDecodingMethodFor(encoding)),
		defaultSize: ConstDescriptor(defaultSize)
	})

	return multiByteDecoder
}

/**
 * A class implementing the `IDecoder` interface that works with
 * the Latin-1 encoding.
 */
export const Decoder8 = Decoder(1, "latin1")

/**
 * A class implementing the `IDecoder` interface that works with
 * the UCS2 encoding.
 */
export const Decoder16 = Decoder(2, "ucs2")

/**
 * A class implementing the `IDecoder` interface that works with
 * the UTF-8 encoding.
 */
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

/**
 * A class implementing the `IDecoder` interface that works with
 * the little-endian UTF-16 encoding.
 */
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
