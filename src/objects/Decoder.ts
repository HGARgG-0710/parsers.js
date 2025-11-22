import type { IByteSource, IDecoder } from "../interfaces.js"

export abstract class BaseDecoder implements IDecoder {
	protected abstract getEncoding(): string
	protected abstract encodingSize(): number
	protected abstract shouldStop(i: number): boolean

	private readonly decoder: TextDecoder
	private readonly toDecode: Uint8Array[] = []
	protected readonly tempBytes: Uint8Array

	private currSize: number
	private _decoded: string

	private get currBuffer() {
		return this.toDecode[this.currSize]
	}

	private set currChar(newDecoded: string) {
		this._decoded = newDecoded
	}

	get currChar() {
		return this._decoded
	}

	private fromTemp() {
		for (let i = 0; i < this.currBuffer.length; ++i)
			this.currBuffer[i] = this.tempBytes[i]
	}

	private pickSize() {
		for (let i = 0; i < this.encodingSize(); ++i) {
			if (this.shouldStop(i)) {
				this.currSize = i
				break
			}
			this.tempBytes[i] = this.byteSource.currByte
			if (this.byteSource.hasBytes()) this.byteSource.nextByte()
		}
	}

	private decodeCurr() {
		this.currChar = this.decoder.decode(this.currBuffer)
	}

	nextChar() {
		this.pickSize()
		this.fromTemp()
		this.decodeCurr()
	}

	hasChars(): boolean {
		return this.byteSource.hasBytes()
	}

	constructor(private readonly byteSource: IByteSource) {
		this.decoder = new TextDecoder(this.getEncoding())
		this.tempBytes = new Uint8Array(this.encodingSize())
		for (let i = 0; i < this.encodingSize(); ++i)
			this.toDecode.push(new Uint8Array(i))
	}
}

/**
 * A class implementing the `IDecoder` interface that works with
 * the Latin-1 encoding.
 */
export class Decoder8 extends BaseDecoder {
	protected getEncoding(): string {
		return "latin1"
	}

	protected encodingSize(): number {
		return 1
	}

	protected shouldStop(i: number): boolean {
		return false
	}
}

/**
 * A class implementing the `IDecoder` interface that works with
 * the UTF-8 encoding.
 */
export class DecoderU8 extends BaseDecoder {
	protected getEncoding(): string {
		return "utf8"
	}

	protected encodingSize(): number {
		return 4
	}

	protected shouldStop(i: number): boolean {
		const firstByte = this.tempBytes[0]
		switch (i) {
			case 0:
				// * U+0000-U+007F
				return firstByte >> 7 === 0
			case 1:
				// * U+0080-U+07FF
				return (firstByte & 0b11000000) !== 0
			case 2:
				// * U+0800-U+FFFF
				return (firstByte & 0b11100000) !== 0
			case 3:
				// * U+010000-U+10FFFF
				return (firstByte & 0b11110000) !== 0
		}
		throw new RangeError("Invalid UTF-8 codepoint given")
	}
}
