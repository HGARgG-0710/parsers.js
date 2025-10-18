import type { array } from "@hgargg-0710/one"
import type {
	IIndexMap,
	INode,
	IOwnedStream,
	IParserFunction,
	IPeekableStream,
	IRawStreamArray,
	ITypeCheckable
} from "../../interfaces.js"
import {
	LiquidMap,
	TableCarrier
} from "../../modules/IndexMap/objects/LiquidMap.js"
import {
	CachingLocator,
	PosCarryingLocator
} from "../../modules/Stream/objects/Locator.js"
import {
	DynamicParser,
	ErrorData,
	IndexMap,
	ParseableInput,
	PlainErrorPrinter,
	TableHandler
} from "../../objects.js"
import { BasicHash, CurrentHash, PeekHash } from "../../objects/HashMap.js"
import {
	CompositeStream,
	IdentityStream,
	InputStream,
	PeekStream,
	PosStream
} from "../../objects/Stream.js"
import { Pairs } from "../../samples.js"
import { SingletonWrapperStream } from "../../samples/Stream.js"
import { BasicMap } from "../../samples/TerminalMap.js"
import { NodeMap, PeekMap } from "../../utils/IndexMap.js"
import { consume } from "../../utils/Stream.js"
import { maybeCharClass } from "./CharClass.js"
import { ProduceDisjunction } from "./Disjunction.js"
import { maybeDot } from "./Dot.js"
import { maybeEscaped } from "./Escaped.js"
import { maybeGroup } from "./Group.js"
import { maybeNegation } from "./Negation.js"
import { RootNode } from "./Nodes.js"
import { maybePipe } from "./Pipe.js"
import { maybePlus } from "./Quantifiers/Plus.js"
import { maybePreQuantifier } from "./Quantifiers/Pre.js"
import { maybeQMark } from "./Quantifiers/QMark.js"
import { maybeRange } from "./Quantifiers/Range.js"
import { maybeStar } from "./Quantifiers/Star.js"
import { HandleSingleChar } from "./SingleChar.js"
import { maybeTypeMatch } from "./TypeMatch.js"

export class RegexParser {
	static readonly instance = new RegexParser()

	private readonly errPrinter = new PlainErrorPrinter()

	private parseSource(source: string) {
		return consume(
			parseRegex(new ParseableInput(source))
		).get()[0] as INode<string>
	}

	parse(source: string) {
		// * Vital note: there is NO CLEANUP HERE
		// because the user may (accidentally) be
		// re-parsing the same expressions over-and-over again.
		return this.errPrinter.execute(() => this.parseSource(source))
	}

	private constructor() {}
}

export function LookaheadMap(
	map: array.Pairs<ITypeCheckable, IParserFunction>,
	_default: IParserFunction
): IIndexMap<
	ITypeCheckable,
	IParserFunction,
	IParserFunction,
	IPeekableStream
> {
	const [keys, values] = Pairs.from(map)
	return (
		PeekMap(
			NodeMap(new IndexMap.PredicateMap(new LiquidMap([], [])))
		).finalize() as IIndexMap<
			ITypeCheckable,
			IParserFunction,
			IParserFunction,
			IPeekableStream
		>
	).fromCarrier(new TableCarrier(keys, values, _default))
}

export const PreserveLowerStream = () => new IdentityStream()

export const BasicPeekHash = PeekHash(BasicHash)

const RegexTokenizer = TableHandler<IOwnedStream<string>, IRawStreamArray>(
	new CurrentHash(
		BasicMap(
			[
				...maybeEscaped,
				...maybeNegation,
				...maybeTypeMatch,
				...maybeGroup,
				...maybeCharClass,
				...maybeDot,
				...maybePreQuantifier,
				...maybePipe
			],
			HandleSingleChar
		)
	)
)

const QuantifierProcessor = TableHandler(
	LookaheadMap(
		[...maybePlus, ...maybeQMark, ...maybeStar, ...maybeRange],
		PreserveLowerStream
	)
)

const RootNodeStream = SingletonWrapperStream(RootNode)

export function ParseRegexRecursively(): IRawStreamArray {
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

const regexErrorDataMaker = (inputStream) =>
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
