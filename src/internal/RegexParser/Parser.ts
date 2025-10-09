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
import { PosCarryingLocator } from "../../modules/Stream/objects/Locator.js"
import {
	DynamicParser,
	ErrorData,
	IndexMap,
	ParseableInput,
	TableHandler
} from "../../objects.js"
import { CurrentHash } from "../../objects/HashMap.js"
import { SingleChildNode } from "../../objects/Node.js"
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
import { maybePipe } from "./Pipe.js"
import { maybePlus } from "./Quantifiers/Plus.js"
import { maybePreQuantifier } from "./Quantifiers/Pre.js"
import { maybeQMark } from "./Quantifiers/QMark.js"
import { maybeRange } from "./Quantifiers/Range.js"
import { maybeStar } from "./Quantifiers/Star.js"
import { HandleSingleChar } from "./SingleChar.js"
import { maybeTypeMatch } from "./TypeMatch.js"

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

export class RegexParser {
	static readonly instance = new RegexParser()

	private parseSource(source: string) {
		return consume(
			parseRegex(new ParseableInput(source))
		).get()[0] as INode<string>
	}

	parse(source: string) {
		// * Vital note: there is NO CLEANUP HERE
		// because the user may (accidentally) be
		// re-parsing the same expressions over-and-over again.
		return this.parseSource(source)
	}

	private constructor() {}
}

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

// TODO: add error-throwing code!
// * 1. introduce appropriate error-throwing function inside of EACH ONE of the streams...
// * 2. re-structure parser pieces SPECIFICALLY to ensure the correct ordering of tokens!
// * 3. create thematical errors (some of them - PUBLIC EXPORTS FROM THE LIBRARY!!!)
// * 4. make `expect` and other such error-throwing functions PUBLICLY ACCESSIBLE!!!

const RootNode = SingleChildNode("regex-root")

const RootNodeStream = SingletonWrapperStream(RootNode)

export function ParseRegexRecursively(): IRawStreamArray {
	return [
		ProduceDisjunction,
		QuantifierProcessor,
		PeekStream(),
		RegexTokenizer
	]
}

const parseRegex = DynamicParser(
	() =>
		CompositeStream(
			RootNodeStream(),
			...ParseRegexRecursively(),
			PosStream.pool.create()
		)(),
	() => new InputStream(),
	(inputStream) =>
		new ErrorData.StreamListErrorData(
			inputStream,
			(inputStream) =>
				new ErrorData.ErrorPosition.PosCarrying(
					inputStream,
					PosCarryingLocator.downwards
				)
		)
)
