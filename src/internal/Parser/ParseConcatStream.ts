import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	IParseStream,
	IParseStreamMaker,
	IRootStream
} from "../../interfaces.js"
import { ConcatStream } from "../../objects/Stream.js"
import { CommonStreamStateExtractor } from "./CommonStreamStateExtractor.js"
import { type IStreamProvider } from "./StreamProvider.js"

export class ParseConcatStream<T = any, Init = any>
	extends ConcatStream<T, IParseStream<T>>
	implements IStreamProvider<T>, IRootStream<T>
{
	private readonly commonStateExtractor: CommonStreamStateExtractor<T>

	private lastCommonStateExtract(): Summat {
		return this.commonStateExtractor.fromLast()
	}

	override currStream(): IParseStream<T> {
		return super.currStream()
	}

	lastStream(): IParseStream<T> {
		return this.rawStreamAt(-1)
	}

	get state() {
		return this.commonStateExtractor.fromCurr()
	}

	constructor(
		input: Init,
		streamMakers: IParseStreamMaker<Init, T>[],
		getState: () => Summat = object.empty
	) {
		super(
			...streamMakers.map(
				(maker) => () =>
					maker(() => this.lastCommonStateExtract())(input)
			)
		)
		this.commonStateExtractor = new CommonStreamStateExtractor(
			getState,
			this
		)
	}
}
