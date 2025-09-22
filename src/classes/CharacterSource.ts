import type { IByteSource, ICharacterSource } from "../interfaces.js"
import type { IDecoder } from "../interfaces/Decoder.js"
import { ResourceManager } from "./ResourceManager.js"

/**
 * This is a class implementing `ISource`.
 * It utilizes a user-provided `IDecoder` using
 * dependency-injection, and provides one with a
 * read access to a given `filename: string`.
 */
export class ReadingSource implements ICharacterSource {
	["constructor"]: new (byteSource: IByteSource) => this

	private readonly decoder: IDecoder

	get isOpen() {
		return this.byteSource.isOpen
	}

	get decoded() {
		return this.decoder.currChar
	}

	nextChar(): void {
		this.decoder.nextChar()
	}

	hasChars() {
		return this.decoder.hasChars()
	}

	cleanup() {
		this.byteSource.cleanup()
	}

	copy() {
		return new this.constructor(this.byteSource)
	}

	constructor(
		private readonly byteSource: IByteSource,
		decoderFactory: (byteSource: IByteSource) => IDecoder
	) {
		this.decoder = decoderFactory(byteSource)
	}
}

export namespace ReadingSource {
	/**
	 * The `ResourceManager` for the `ReadingSource` class.
	 */
	export const manager = new ResourceManager(ReadingSource)
}
