import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IResultStateStream,
	IResultStateStreamMaker,
	IRootStream
} from "../../interfaces.js"
import type { IEndingProvider } from "../../interfaces/EndingProvider.js"
import { PreCommonStream } from "../../modules/Stream/objects/templates.js"
import { LoopStream } from "../../objects/Stream.js"
import { CommonStreamStateExtractor } from "./CommonStreamStateExtractor.js"
import { type IStreamProvider } from "./StreamProvider.js"

export class ParseLoopStream<T = any, Init = any>
	extends PreCommonStream<T>
	implements IRootStream<T>, IStreamProvider<T>, IResultStateStream<T>
{
	private readonly commonStateExtractor: CommonStreamStateExtractor<T>
	private readonly streamGetter: LoopStream<IResultStateStream<T>>

	private _lastStream: IResultStateStream<T>

	private getNewDelegate() {
		this._lastStream = this.delegate
		this.streamGetter.next()
	}

	private get delegate() {
		return this.streamGetter.curr
	}

	lastStream(): IResultStateStream<T> {
		return this._lastStream
	}

	currStream(): IResultStateStream<T> {
		return this.delegate
	}

	get curr() {
		return this.delegate.curr
	}

	next(): void {
		const isLastItem = this.delegate.isCurrEnd()
		this.delegate.next()
		if (isLastItem) this.getNewDelegate()
	}

	get state() {
		return this.delegate.state
	}

	// ! pre-doc: THIS has a NUMBER OF (almost-always-true) ASSUMPTIONS in order to be correct.
	// * 	The user is, unfortunately, is left to maintain them.
	// * 	THINK THOSE THROUGH, and list as part of this method's Wiki docs...
	get isEnd() {
		return this.delegate.isEnd && this.endProvider.isEnd()
	}

	// ! pre-doc: THIS has a NUMBER OF (almost-always-true) ASSUMPTIONS in order to be correct.
	// * 	The user is, unfortunately, is left to maintain them.
	// * 	THINK THOSE THROUGH, and list as part of this method's Wiki docs...
	// % Specifically, here 'endProvider.isCurrEnd' is the "saviour hook" that enables the user to 
	// * 	achieve the "correct" behaviour (although the precise implementation will vary on a 
	// * 	case-by-case basis...)
	isCurrEnd(): boolean {
		return (
			this.delegate.isCurrEnd() &&
			(this.endProvider.isEnd() ||
				(!!this.endProvider.isCurrEnd && this.endProvider.isCurrEnd()))
		)
	}

	private lastCommonStateExtract() {
		return this.commonStateExtractor.fromLast()
	}

	constructor(
		private readonly endProvider: IEndingProvider<Init>,
		streamMakerGetter: (i: number) => IResultStateStreamMaker<Init, T>,
		getState: () => Summat = object.empty
	) {
		super()
		const input = endProvider.forItem
		this.commonStateExtractor = new CommonStreamStateExtractor(
			getState,
			this
		)
		this.streamGetter = new LoopStream((i: number) =>
			streamMakerGetter(i)(() => this.lastCommonStateExtract())(input)
		)
	}
}
