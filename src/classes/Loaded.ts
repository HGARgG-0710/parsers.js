import { readFileSync } from "fs"

// TODO: refactor - MULTIPLE FILES, this thing needs its own module...

// TODO: into a new interfaces.ts files...
export interface IReadable<Type = any> {
	read(i: number): Type
}

function DecodedLoaded(
	encoding: BufferEncoding
): new (filename: string) => IReadable<string> {
	return class implements IReadable<string> {
		private readonly source: string

		read(i: number) {
			return this.source[i]
		}

		constructor(filename: string) {
			this.source = readFileSync(filename, encoding)
		}
	}
}

export const LoadedU8 = DecodedLoaded("utf8")

export const LoadedU16 = DecodedLoaded("utf-16le")

export const Loaded8 = DecodedLoaded("latin1")

export const Loaded16 = DecodedLoaded("ucs2")
