import { DynamicParser, TableHandler } from "../classes.js"
import { BasicHash } from "../classes/HashMap.js"
import { CompositeStream, InputStream, PeekStream } from "../classes/Stream.js"
import { BasicMap } from "../samples/TerminalMap.js"
import { currMap } from "../utils/HashMap.js"
import { maybeCharClass } from "./RegexParser/CharClass.js"
import { maybeDot } from "./RegexParser/Dot.js"
import { maybeEscaped } from "./RegexParser/Escaped.js"
import { maybeGroup } from "./RegexParser/Group.js"
import { maybeNegation } from "./RegexParser/Negation.js"
import { HandleSingleChar } from "./RegexParser/SingleChar.js"
import { maybeTypeMatch } from "./RegexParser/TypeMatch.js"

export const BasicCurrMap = currMap(BasicHash)

export class RegexParser {
	parse(source: string) {}
}

// * Overall structure of the parser:
// ! 1. topmost layer [the ROOT NODE]
// ! 2. disjunction [a | b | ...]
// % [here now - starting] 3. quantifiers [*, +, etc]
// * [sketch] 4. tokenization [INCLUDING the '|' characters - THOSE MUST BE TURNED TO PROPER OBJECTS FIRST!]
// * [sketch] 5. input

const RegexTokenizer = TableHandler(
	new BasicCurrMap(
		BasicMap(
			[
				...maybeEscaped,
				...maybeNegation,
				...maybeTypeMatch,
				...maybeGroup,
				...maybeCharClass,
				...maybeDot
			],
			HandleSingleChar
		)
	)
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
	CompositeStream(RegexTokenizer, PeekStream(2)())(),
	new InputStream()
)
