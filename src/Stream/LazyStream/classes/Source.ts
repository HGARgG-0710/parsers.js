import type { ISource } from "../interfaces.js"
import { openSync, readSync, closeSync, fstatSync } from "node:fs"

import { type } from "@hgargg-0710/one"
const { isString } = type

const basicDecoders: Record<string, (x: Buffer) => string> = {
	latin1: (x: Buffer) => x.toString("latin1"),
	ucs2: (x: Buffer) => x.toString("ucs2")
}

function Source(
	charSize: number,
	encoding: BufferEncoding | ((x: Buffer) => string)
) {
	return class implements ISource {
		decoded: string;

		["constructor"]: new (url: string) => typeof this

		protected pos: number = 0

		protected readonly decoder: (x: Buffer) => string
		protected readonly source: number
		protected readonly size: number
		protected readonly char: Buffer = Buffer.alloc(charSize)

		hasChars() {
			return this.size > this.pos
		}

		nextChar() {
			if (this.hasChars()) {
				readSync(this.source, this.char, 0, 1, this.pos++ * charSize)
				this.decoded = this.decoder(this.char)
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
			this.decoder = isString(encoding)
				? basicDecoders[encoding]
				: encoding
		}
	}
}

// * important pre-doc: Latin-1 and ASCII
export const Source8 = Source(8, "latin1")

// * important pre-doc: UCS2
export const Source16 = Source(16, "ucs2")

function u32_u16(u32code: string): number {
	// TODO: finish the UTF32-UTF16 converter;
}

function utf32(char: Buffer) {
	return String.fromCharCode(u32_u16(char.toString("hex")))
}

// * important pre-doc: UTF32
export const Source32 = Source(32, utf32)
