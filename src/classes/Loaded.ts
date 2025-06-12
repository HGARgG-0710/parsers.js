import { readFileSync } from "fs"
import type { IParseable } from "../interfaces.js"

function DecodedLoaded(
	encoding: BufferEncoding
): new (filename: string) => IParseable<string> {
	return class implements IParseable<string> {
		private ["constructor"]: new (filename?: string) => this

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

/**
 * A class implementing the `IParseable<string>`. 
 * Provided with a `filename: string`, it reads its 
 * contents as a UTF-8 file, and then provides the 
 * `IParseable<string>` methods for interacting 
 * with the resulting `string`
*/
export const LoadedU8 = DecodedLoaded("utf8")

/**
 * A class implementing the `IParseable<string>`. 
 * Provided with a `filename: string`, it reads its 
 * contents as a little-endian UTF-16 file, and then provides the 
 * `IParseable<string>` methods for interacting 
 * with the resulting `string`
*/
export const LoadedU16LE = DecodedLoaded("utf-16le")

/**
 * A class implementing the `IParseable<string>`. 
 * Provided with a `filename: string`, it reads its 
 * contents as a Latin1 file, and then provides the 
 * `IParseable<string>` methods for interacting 
 * with the resulting `string`
*/
export const Loaded8 = DecodedLoaded("latin1")

/**
 * A class implementing the `IParseable<string>`. 
 * Provided with a `filename: string`, it reads its 
 * contents as a UCS2 file, and then provides the 
 * `IParseable<string>` methods for interacting 
 * with the resulting `string`
*/
export const Loaded16 = DecodedLoaded("ucs2")
