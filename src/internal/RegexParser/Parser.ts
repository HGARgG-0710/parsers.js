import type {
	IInputStream,
	INode,
	IOwnedStream,
	IParseable,
	IRawStreamArray
} from "../../interfaces.js"
import {
	CachingLocator,
	PosCarryingLocator
} from "../../modules/Stream/objects/Locator.js"
import {
	DynamicParser,
	ErrorData,
	ParseableInput,
	PlainErrorPrinter
} from "../../objects.js"
import { BasicHash, PeekHash } from "../../objects/HashMap.js"
import {
	CompositeStream,
	InputStream,
	PeekStream,
	PosStream
} from "../../objects/Stream.js"
import { SingletonWrapperStream } from "../../samples/Stream.js"
import { consume } from "../../utils/Stream.js"
import { ProduceDisjunction } from "./Disjunction.js"
import { RootNode } from "./Nodes.js"
import { QuantifierProcessor } from "./Quantifiers.js"
import { RegexTokenizer } from "./Tokenizer.js"

export class RegexParser {
	static readonly instance = new RegexParser()

	private readonly errPrinter = PlainErrorPrinter.instance

	private parseSource(source: string) {
		return consume(parseRegex(new ParseableInput(source))).get()[0] as INode
	}

	parse(source: string) {
		// * Vital note: there is NO CLEANUP HERE
		// because the user may (accidentally) be
		// re-parsing the same expressions over-and-over again.
		return this.errPrinter.execute(() => this.parseSource(source))
	}

	private constructor() {}
}

export const BasicPeekHash = PeekHash(BasicHash)

const RootNodeStream = SingletonWrapperStream(RootNode)

export function ParseRegexRecursively(
	input?: IOwnedStream<string>
): IRawStreamArray {
	return [
		ProduceDisjunction,
		QuantifierProcessor,
		PeekStream(),
		RegexTokenizer
	]
}

const regexWorkStreamMaker = () =>
	CompositeStream(
		RootNodeStream(),
		...ParseRegexRecursively(),
		PosStream.pool.create()
	)()

const regexInputStreamMaker = () => new InputStream()

const regexErrorDataMaker = (inputStream: IInputStream<any, IParseable>) =>
	new ErrorData.StreamListErrorData(
		inputStream,
		(inputStream) =>
			new ErrorData.ErrorPosition.PosCarrying(
				inputStream,
				new CachingLocator(PosCarryingLocator.downwards)
			)
	)

const parseRegex = DynamicParser(
	new DynamicParser.Config(
		regexWorkStreamMaker,
		regexInputStreamMaker,
		regexErrorDataMaker
	)
)
