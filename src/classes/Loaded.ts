import { readFileSync } from "fs"
import type { IParseable } from "../interfaces.js"

function DecodedLoaded(
	encoding: BufferEncoding
): new (filename: string) => IParseable<string> {
	return class implements IParseable<string> {
		["constructor"]: new (filename?: string) => this

		private source: string

		get size() {
			return this.source.length
		}

		read(i: number) {
			return this.source[i]
		}

		copy() {
			return new this.constructor().init(this.source)
		}

		private init(source: string) {
			this.source = source
			return this
		}

		constructor(filename?: string) {
			if (filename) this.source = readFileSync(filename, encoding)
		}
	}
}

// * imporant pre-doc: utf8
export const LoadedU8 = DecodedLoaded("utf8")

// * important pre-doc utf16
export const LoadedU16 = DecodedLoaded("utf-16le")

// * important pre-doc latin1
export const Loaded8 = DecodedLoaded("latin1")

// * important pre-doc ucs2
export const Loaded16 = DecodedLoaded("ucs2")
