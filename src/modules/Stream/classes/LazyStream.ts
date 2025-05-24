import { type } from "@hgargg-0710/one"
import type { ISource } from "../../../interfaces.js"
import type {
	IInputStream,
	INavigable,
	IPosed,
	IPosition
} from "../../../interfaces/Stream.js"
import { uniNavigate } from "../../../utils/Stream.js"
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

	readonly source?: ISource

	get pos() {
		return this.source!.pos
	}

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

	isCurrEnd() {
		return !this.source!.hasChars()
	}

	navigate(pos: IPosition) {
		if (isNumber(pos)) this.nextDecoded(pos)
		else uniNavigate(this, pos)
		this.updateCurr()
		return this.curr
	}

	init(source: ISource) {
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
