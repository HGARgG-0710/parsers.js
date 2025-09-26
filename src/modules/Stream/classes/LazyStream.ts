import type { ICharacterSource } from "../../../interfaces.js"
import type {
	IInputStream,
	ISourcedStream
} from "../../../interfaces/Stream.js"
import { SourceStream } from "./SourceStream.js"

/**
 * This is a class extending `SourceStream<string, ISource>`, and
 * implementing `INavigable<string>`, `IPosed<number>`,
 * `IInputStream<string, ISource>`, `ISourcedStream<string, ISource>`.
 *
 * It represents an `IStream`, capable of being used as an input from
 * a file/socket/etc, which would, at the same time, not force a need for loading
 * the resource in its entirety. That is, this is primarily a *lazy* interface for
 * `string`-input, based off an `ISource` [not necessarily one made from a file].
 *
 * Immensely useful when needing to process a large amount of data.
 */
export class LazyStream
	extends SourceStream<string, ICharacterSource>
	implements
		IInputStream<string, ICharacterSource>,
		ISourcedStream<string, ICharacterSource>
{
	readonly source?: ICharacterSource

	private nextDecoded() {
		this.source!.nextChar()
	}

	protected currGetter() {
		return this.source!.decoded
	}

	protected baseNextIter() {
		this.nextDecoded()
		return this.currGetter()
	}

	isCurrEnd() {
		return !this.source!.hasChars()
	}
}
