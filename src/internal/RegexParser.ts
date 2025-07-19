import { functional, type array } from "@hgargg-0710/one"
import { DynamicParser, IndexMap, TableHandler } from "../classes.js"
import { BasicHash } from "../classes/HashMap.js"
import { CompositeStream, InputStream, PeekStream } from "../classes/Stream.js"
import type {
	IIndexMap,
	INodeType,
	IParserFunction,
	ITypeCheckable
} from "../interfaces.js"
import {
	LiquidMap,
	TableCarrier
} from "../modules/IndexMap/classes/LiquidMap.js"
import { Pairs } from "../samples.js"
import { BasicMap } from "../samples/TerminalMap.js"
import { currMap } from "../utils/HashMap.js"
import { nodeMap } from "../utils/IndexMap.js"
import { maybeCharClass } from "./RegexParser/CharClass.js"
import { maybeDot } from "./RegexParser/Dot.js"
import { maybeEscaped } from "./RegexParser/Escaped.js"
import { maybeGroup } from "./RegexParser/Group.js"
import { maybeNegation } from "./RegexParser/Negation.js"
import { maybePlus } from "./RegexParser/Quantifiers/Plus.js"
import { maybePreQuantifier } from "./RegexParser/Quantifiers/Pre.js"
import { maybeQMark } from "./RegexParser/Quantifiers/QMark.js"
import { maybeRange } from "./RegexParser/Quantifiers/Range.js"
import { maybeStar } from "./RegexParser/Quantifiers/Star.js"
import { HandleSingleChar } from "./RegexParser/SingleChar.js"
import { maybeTypeMatch } from "./RegexParser/TypeMatch.js"

const { id } = functional

export const BasicCurrMap = currMap(BasicHash)

export function LookaheadMap(
	map: array.Pairs<INodeType<string>, IParserFunction>,
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

export class RegexParser {
	parse(source: string) {}
}

// * Overall structure of the parser:
// ! 1. topmost layer [the ROOT NODE]
// % [sketch - here, starting] 2. disjunction [a | b | ...]
// * [done - sketch] 3. quantifiers [*, +, etc]
// * [done - sketch] 4. tokenization [INCLUDING the '|' characters - THOSE MUST BE TURNED TO PROPER OBJECTS FIRST!]
// * [done - sketch] 5. input

const RegexTokenizer = TableHandler(
	new BasicCurrMap(
		BasicMap(
			[
				...maybeEscaped,
				...maybeNegation,
				...maybeTypeMatch,
				...maybeGroup,
				...maybeCharClass,
				...maybeDot,
				...maybePreQuantifier
			],
			HandleSingleChar
		)
	)
)

const QuantifierProcessor = TableHandler(
	LookaheadMap([...maybePlus, ...maybeQMark, ...maybeStar, ...maybeRange], id)
)

// ! THIS is the error-throwing code - put it at the spot where we KNOW there are NO MORE valid string-cases left...
// function (input) {
// TODO: add error-throwing code!
// ! The `ParseError` is ILL-FIT for this.
// * 	Specifically, one requires an `ShortStringParseError` error, which is designed for:
// 		1. inputs that ONLY HAVE A SINGLE LINE [i.e. `BackupIndex` is clearly an overkill here, though usually - it isn't...]
// 		2. inputs that fit very well inside the RAM [i.e. - DELIBERATELY SHORT strings; as this is supposed to be hand-written, the `Regex` strings are, indeed, very short]
// }
const regexParser = DynamicParser(
	CompositeStream(QuantifierProcessor, PeekStream(2)(), RegexTokenizer)(),
	new InputStream()
)
