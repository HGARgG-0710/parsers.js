import { DynamicParser } from "../classes.js"
import { CompositeStream, InputStream, PeekStream } from "../classes/Stream.js"
import { maybeDot } from "./RegexParser/Dot.js"
import { maybeEscaped } from "./RegexParser/Escaped.js"
import { maybeGroup } from "./RegexParser/Group.js"
import { maybeNegation } from "./RegexParser/Negation.js"
import { StartStream } from "./RegexParser/Start.js"
import { maybeTypeMatch } from "./RegexParser/TypeMatch.js"

export class RegexParser {
	parse(source: string) {}
}

// * Overall structure of the parser:
// ! 1. topmost layer [the ROOT NODE]
// ! 2. disjunction [a | b | ...]
// ! 3. quantifiers [*, +, etc]
// % [here now - sketch] 4. tokenization [INCLUDING the '|' characters - THOSE MUST BE TURNED TO PROPER OBJECTS FIRST!]
// * [sketch] 5. input

// ! THIS is the error-throwing code - put it at the spot where we KNOW there are NO MORE valid string-cases left...
// function (input) {
// TODO: add error-throwing code!
// ! The `ParseError` is ILL-FIT for this.
// * 	Specifically, one requires an `ShortStringParseError` error, which is designed for:
// 		1. inputs that ONLY HAVE A SINGLE LINE [i.e. `BackupIndex` is clearly an overkill here, though usually - it isn't...]
// 		2. inputs that fit very well inside the RAM [i.e. - DELIBERATELY SHORT strings; as this is supposed to be hand-written, the `Regex` strings are, indeed, very short]
// }
const regexParser = DynamicParser(
	CompositeStream(PeekStream(1)(), StartStream())(),
	new InputStream()
)

// TODO: turn this into the NEXT-LEVEL
// ! LET the 'default' here be an ORDINARY 'SingleCharStream'!!!
const parseablePossibilities = [
	...maybeEscaped,
	...maybeNegation,
	...maybeTypeMatch,
	...maybeGroup,
	...maybeDot
]
