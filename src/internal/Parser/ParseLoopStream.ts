import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IParseStream,
	IParseStreamMaker,
	IRootStream
} from "../../interfaces.js"
import { PreCommonStream } from "../../modules/Stream/objects/templates.js"
import { LoopStream } from "../../objects/Stream.js"
import {
	CommonStreamStateExtractor
} from "./CommonStreamStateExtractor.js"
import { type IStreamProvider } from "./StreamProvider.js"

export class ParseLoopStream<T = any, Init = any>
	extends PreCommonStream<T>
	implements IRootStream<T>, IStreamProvider<T>
{
	private readonly commonStateExtractor: CommonStreamStateExtractor<T>
	private readonly streamGetter: LoopStream<IParseStream<T>>

	private _lastStream: IParseStream<T>

	private getNewDelegate() {
		this._lastStream = this.delegate
		this.streamGetter.next()
	}

	private get delegate() {
		return this.streamGetter.curr
	}

	private currDelegateOver() {
		return this.delegate.isEnd
	}

	lastStream(): IParseStream<T> {
		return this._lastStream
	}

	currStream(): IParseStream<T> {
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

	get isEnd() {
		for (let i = 0; i < this.conseqEmptyStreamsAllowed; ++i) {
			if (!this.currDelegateOver()) return false
			this.getNewDelegate()
		}
		return this.currDelegateOver()
	}

	get state() {
		return this.delegate.state
	}

	// ! pre-doc: 'isCurrEnd' ALWAYS 'false' ON 'Parser.Loop(...)' results!
	isCurrEnd(): boolean {
		return false
	}

	private lastCommonStateExtract() {
		return this.commonStateExtractor.fromLast()
	}

	constructor(
		input: Init,
		streamMakerGetter: (i: number) => IParseStreamMaker<Init, T>,
		private readonly conseqEmptyStreamsAllowed: number = 0,
		getState: () => Summat = object.empty
	) {
		super()
		this.commonStateExtractor = new CommonStreamStateExtractor(
			getState,
			this
		)
		this.streamGetter = new LoopStream((i: number) =>
			streamMakerGetter(i)(() => this.lastCommonStateExtract())(input)
		)
	}
}
