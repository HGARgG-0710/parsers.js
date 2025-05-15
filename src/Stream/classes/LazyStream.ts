import { type } from "@hgargg-0710/one"
import type { ISource } from "../../interfaces.js"
import type {
	IInputStream,
	INavigable,
	IPosed,
	IPosition
} from "../../interfaces/Stream.js"
import { uniNavigate } from "../../utils/Stream.js"
import { SourceStream } from "./BasicStream.js"

const { isNumber } = type

export class LazyStream
	extends SourceStream<string, ISource>
	implements
		INavigable<string>,
		IPosed<number>,
		IInputStream<string, ISource>
{
	protected ["constructor"]: new (source?: ISource) => this

	get pos() {
		return this.source!.pos
	}

	private nextDecoded(n?: number) {
		this.source!.nextChar(n)
	}

	protected currGetter() {
		return this.source!.decoded
	}

	protected baseNextIter(n?: number) {
		this.nextDecoded(n)
	}

	protected postEnd(): void {
		this.source!.cleanup()
	}

	isCurrEnd() {
		return !this.source!.hasChars()
	}

	navigate(pos: IPosition) {
		if (isNumber(pos)) this.source!.nextChar(pos)
		else uniNavigate(this, pos)
		this.update()
		return this.curr
	}

	init(source: ISource) {
		this.source!.cleanup()
		super.init(source)
		return this
	}

	copy(): this {
		return new this.constructor(this.source)
	}

	constructor(source?: ISource) {
		super(source)
	}
}

export * as Source from "../../classes/Source.js"
