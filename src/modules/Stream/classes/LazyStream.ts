import { type } from "@hgargg-0710/one"
import type { IPosed, ISource } from "../../../interfaces.js"
import type {
	IInputStream,
	INavigable,
	ISourcedStream
} from "../../../interfaces/Stream.js"
import { uniNavigate } from "../../../utils/Stream.js"
import type { IStreamPosition } from "../interfaces/StreamPosition.js"
import { SourceStream } from "./SourceStream.js"

const { isNumber } = type

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
	extends SourceStream.generic!<string, ISource>()
	implements
		INavigable<string>,
		IPosed<number>,
		IInputStream<string, ISource>,
		ISourcedStream<string, ISource>
{
	readonly source?: ISource

	private nextDecoded(n?: number) {
		this.source!.nextChar(n)
	}

	protected currGetter() {
		return this.source!.decoded
	}

	protected baseNextIter() {
		this.nextDecoded()
		return this.currGetter()
	}

	get pos() {
		return this.source!.pos
	}

	isCurrEnd() {
		return !this.source!.hasChars()
	}

	navigate(pos: IStreamPosition) {
		if (isNumber(pos)) this.nextDecoded(pos)
		else uniNavigate(this, pos)
		this.updateCurr()
		return this.curr
	}

	setResource(source: ISource): void {
		source.rewind()
		super.setResource(source)
	}

	copy(): this {
		return new this.constructor(this.source)
	}

	constructor(source?: ISource) {
		super(source)
	}
}
