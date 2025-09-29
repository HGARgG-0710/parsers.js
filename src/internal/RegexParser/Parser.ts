import type { array } from "@hgargg-0710/one"
import { Pools } from "../../../main.js"
import {
	DynamicParser,
	IndexMap,
	ParseableInput,
	TableHandler
} from "../../classes.js"
import { CurrentHash } from "../../classes/HashMap.js"
import { SingleChildNode } from "../../classes/Node.js"
import {
	CompositeStream,
	IdentityStream,
	InputStream,
	PeekStream,
	SingletonStream
} from "../../classes/Stream.js"
import type {
	IIndexMap,
	INode,
	IOwnedStream,
	IParserFunction,
	IRawStreamArray,
	ITypeCheckable
} from "../../interfaces.js"
import {
	LiquidMap,
	TableCarrier
} from "../../modules/IndexMap/classes/LiquidMap.js"
import { Pairs } from "../../samples.js"
import { BasicMap } from "../../samples/TerminalMap.js"
import { nodeMap } from "../../utils/IndexMap.js"
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
): IIndexMap<ITypeCheckable, IParserFunction, IParserFunction> {
	const [keys, values] = Pairs.from(map)
	return (
		nodeMap(new IndexMap.PredicateMap(new LiquidMap([], [])))
			.extend((input) => input.peek(1))
			.finalize() as IIndexMap<
			ITypeCheckable,
			IParserFunction,
			IParserFunction
		>
	).fromCarrier(new TableCarrier(keys, values, _default))
}

export const PreserveLowerStream = () => new IdentityStream()

export class RegexParser {
	private parseSource(source: string) {
		return consume(
			parseRegex(new ParseableInput(source))
		).get()[0] as INode<string>
	}

	private poolCleanup() {
		Pools.Internal.clear()
		Pools.Stream.clear()
	}

	parse(source: string) {
		const result = this.parseSource(source)
		this.poolCleanup()
		return result
	}
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

// TODO: URGENT BUG!
// * The `Disjunction` is (not quite) complete - still requires "packaging" of UNDERLYING pieces
// * together. CONCLUSION:
// ^ 1. Need a layer that would:
// * 	1. Bunch WHOLE PIECES PRIOR to `|`-Pipes as ONE OBJECT [name it 'DisjunctCollector'];
// ^ 2. THEN - one would use the `ProduceDisjunction` to collect it all into a single object.

// ! THIS is the error-throwing code - put it at the spot where we KNOW there are NO MORE valid string-cases left...
// function (input) {
// TODO: add error-throwing code!
// ! The `ParseError` is ILL-FIT for this.
// * 	Specifically, one requires an `ShortStringParseError` error, which is designed for:
// 		1. inputs that ONLY HAVE A SINGLE LINE [i.e. using an `ILineIndex` is clearly an overkill here, though usually - it isn't...]
// 		2. inputs that fit very well inside the RAM [i.e. - KNOWINGLY SHORT strings; as this is supposed to be hand-written, the `Regex` strings are, indeed, very short]
// }

const RootNode = SingleChildNode("regex-root")

const RootNodeStream = SingletonStream(
	(input: IOwnedStream<INode<string>>) => new RootNode(input.curr)
)

export function ParseRegexRecursively(): IRawStreamArray {
	return [
		RootNodeStream(),
		ProduceDisjunction,
		QuantifierProcessor,
		PeekStream(),
		RegexTokenizer
	]
}

const parseRegex = DynamicParser(
	() => CompositeStream(...ParseRegexRecursively())(),
	() => new InputStream()
)
